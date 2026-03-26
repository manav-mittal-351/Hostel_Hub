const axios = require('axios');

// @desc    Get AI response for user query
// @route   POST /api/assistant/ask
// @access  Private
const getAIResponse = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ message: "No query provided" });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "Groq API key not configured" });
        }

        const systemPrompt = `
        You are the Smart Hostel Assistant for "HostelHub", a premium hostel management system.
        Your goal is to help users navigate and understand the application's features.
        
        RULES:
        1. ONLY answer questions related to HostelHub.
        2. If a user asks something unrelated to the project, politely decline and state that you are only here to assist with HostelHub.
        3. Keep answers concise, professional, and helpful.
        4. Refer to these specific sections in the app when relevant:
           - Room Allotment (/room-allotment): For booking, viewing room status, or changing rooms.
           - Payments (/payments): For checking fees, receipts, and payment history.
           - Gatepass (/gate-pass): For generating digital authorizations for entry/exit.
           - Support/Complaints (/complaints): For submitting administrative issues or tech support.
           - Maintenance (/maintenance): For logging facility repair requests (plumbing, electrical, etc.).
           - Profile (/profile): For updating personal details and checking account security (login history, password).
           - Notifications (/notifications): For viewing recent announcements and activity.
           - Students List (/students): For admins to view all student records.
           - Dashboard (/dashboard): For general stats and overview.
        5. Help users with specific "how-to" questions (e.g., "How do I pay fees?" -> "Go to the Payments portal in the sidebar to view and pay your dues.").
        
        CONTEXT: 
        The app is used by Students, Wardens, and Administrators. 
        Admins can manage rooms, register students, and view revenue. 
        Students can view their allotted rooms, pay dues, and raise complaints.
        `;

        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: query }
            ],
            temperature: 0.5,
            max_tokens: 300
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const answer = response.data.choices[0].message.content;
        res.json({ answer });
    } catch (error) {
        console.error("Assistant API Error:", error.response?.data || error.message);
        res.status(500).json({ message: "Failed to communicate with AI Assistant" });
    }
};

module.exports = { getAIResponse };
