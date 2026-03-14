const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/gate-pass', require('./routes/gatePassRoutes'));
app.use('/api/non-disciplinary', require('./routes/nonDisciplinaryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
