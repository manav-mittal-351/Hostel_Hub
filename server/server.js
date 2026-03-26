const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const dns = require('dns');

// 1. Load env variables FIRST
dotenv.config();

// 2. Set custom DNS after env is loaded (Optional: Should ideally be configurable)
if (process.env.DNS_SERVERS) {
    dns.setServers(process.env.DNS_SERVERS.split(','));
} else {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

// 3. Connect to DB once at startup
connectDB();

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Log requests for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/gate-pass', require('./routes/gatePassRoutes'));
app.use('/api/non-disciplinary', require('./routes/nonDisciplinaryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/assistant', require('./routes/assistantRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(500).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const http = require('http');
const { initSocket } = require('./utils/socket');

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
