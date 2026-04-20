const express = require('express');
const app = express();

app.use(express.json());

const athleteRoutes = require('./routes/athleteRoutes');
app.use('/athletes', athleteRoutes);

app.get('/health', (req, res) => {
    res.send('OK');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

app.get('/metrics', (req, res) => {
    res.json({
        requests: 120,
        uptime: process.uptime(),
        status: "healthy"
    });
});

module.exports = app;