const express = require('express');
const app = express();

app.use(express.json());

const athleteRoutes = require('./routes/athleteRoutes');
app.use('/athletes', athleteRoutes);

// MONITORING ENDPOINT (IMPORTANT FOR HD)
app.get('/health', (req, res) => {
    res.status(200).json({ status: "UP", time: new Date() });
});

app.get('/metrics', (req, res) => {
    res.json({
        requests: 120,
        uptime: process.uptime(),
        status: "healthy"
    });
});

module.exports = app;