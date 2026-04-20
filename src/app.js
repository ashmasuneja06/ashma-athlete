const express = require('express');
const app = express();

app.use(express.json());

const athleteRoutes = require('./routes/athleteRoutes');
app.use('/athletes', athleteRoutes);

app.get('/health', (req, res) => {
    res.send('OK');
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

app.get('/metrics', (req, res) => {
    res.json({
        requests: 120,
        uptime: process.uptime(),
        status: "healthy"
    });
});

module.exports = app;