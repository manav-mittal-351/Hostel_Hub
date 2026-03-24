const User = require('../models/User');
const Room = require('../models/Room');

// @desc    Global Search for students or rooms
// @route   GET /api/search
// @access  Registered Users
const searchAll = async (req, res) => {
    const { query, category = 'all', filter = '' } = req.query;
    if (!query && !filter) return res.json({ students: [], rooms: [] });

    try {
        let regex = new RegExp(query, 'i');
        let students = [];
        let rooms = [];

        // 1. Search Students
        if (category === 'all' || category === 'student' || category === 'id') {
            const studentQuery = { role: { $in: ['student', 'warden', 'admin'] } };
            
            if (category === 'id') {
                studentQuery.studentId = regex;
            } else if (category === 'student') {
                studentQuery.name = regex;
            } else {
                studentQuery.$or = [
                    { name: regex },
                    { email: regex },
                    { studentId: regex }
                ];
            }

            students = await User.find(studentQuery)
                .select('name studentId email role roomNumber department')
                .limit(10);
        }

        // 2. Search Rooms
        if (category === 'all' || category === 'room' || category === 'block' || category === 'status') {
            const roomQuery = {};
            
            if (category === 'room') {
                roomQuery.roomNumber = regex;
            } else if (category === 'block') {
                roomQuery.block = regex;
            } else if (category === 'status' || filter) {
                const statusVal = filter || query;
                if (statusVal.toLowerCase() === 'vacant') {
                    roomQuery.status = 'available';
                    roomQuery.$where = "this.occupants.length < this.capacity";
                } else if (statusVal.toLowerCase() === 'allotted' || statusVal.toLowerCase() === 'occupied') {
                    roomQuery.$where = "this.occupants.length >= this.capacity";
                } else if (statusVal.toLowerCase() === 'maintenance') {
                    roomQuery.status = 'maintenance';
                }
            } else {
                roomQuery.$or = [
                    { roomNumber: regex },
                    { block: regex }
                ];
            }

            rooms = await Room.find(roomQuery)
                .select('roomNumber floor block type capacity occupants status')
                .limit(10);
        }

        res.json({ students, rooms });
    } catch (error) {
        console.error("Advanced search error:", error);
        res.status(500).json({ message: "Search failed" });
    }
};

module.exports = { searchAll };
