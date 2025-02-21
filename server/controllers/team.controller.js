const connectDB = require("../lib/ConnectDB");
const TeamModel = require("../models/team.model");

async function createTeams(req, res) {
  const { tournamentId } = req.params;
  const { teams } = req.body;
  const isEmpty = teams.some((item) => !item.name);
  if (!Array.isArray(teams) || teams.length === 0 || isEmpty) {
    return res.status(400).json({ error: "Please provide an array of teams" });
  }
  try {
    await connectDB();
    const existingTeams = await TeamModel.find({ tournament: tournamentId });
    if (teams.length + existingTeams.length > 12) {
      return res
        .status(400)
        .json({ error: "Cannot add more teams. Maximum limit of 12 reached." });
    }

    const savedTeams = [];
    for (const team of teams) {
      const newTeam = await TeamModel.create({
        name: team.name,
        tournament: tournamentId,
      });
      await newTeam.save();
      savedTeams.push(newTeam);
    }
    res.status(201).json({
      message: "Teams added successfully",
      teams: savedTeams.map((team) => ({ id: team._id, name: team.name })),
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to add teams" });
  }
}

async function getTeams(req, res) {
  const { tournamentId } = req.params;
  try {
    await connectDB();
    const teams = await TeamModel.find({ tournament: tournamentId });
    if (!teams) {
      return res.status(404).json({ message: "Tournament not found" });
    }
    res
      .status(200)
      .json(teams.map((team) => ({ id: team._id, name: team.name })));
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
}

module.exports = {
  createTeams,
  getTeams,
};
