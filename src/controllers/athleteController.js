let athletes = require('../models/athleteModel');

exports.getAll = (req, res) => {
    res.json(athletes);
};

exports.addAthlete = (req, res) => {
    const athlete = req.body;
    athletes.push(athlete);
    res.json({ message: "Athlete added", athlete });
};

exports.updateAthlete = (req, res) => {
    const name = req.params.name;
    const updated = req.body;

    athletes = athletes.map(a => a.name === name ? updated : a);

    res.json({ message: "Athlete updated" });
};

exports.deleteAthlete = (req, res) => {
    const name = req.params.name;

    athletes = athletes.filter(a => a.name !== name);

    res.json({ message: "Athlete deleted" });
};