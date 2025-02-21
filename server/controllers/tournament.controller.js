const connectDB = require("../lib/ConnectDB");
const TournamentModel = require("../models/tournament.model");
require("dotenv").config();

async function createTournament(req, res) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Please provide a tournament name" });
  }
  try {
    await connectDB();
    const tournament = await TournamentModel.create({ name });
    res.status(201).json({ tournamentId: tournament._id });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to create tournament" });
  }
}

async function getTournaments(req, res) {
  try {
    await connectDB();
    const tournaments = await TournamentModel.find({});
    res.status(200).json(
      tournaments.map((tournament) => ({
        id: tournament._id,
        name: tournament.name,
        gameplayCount: tournament.gameplayCount,
      })),
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to fetch tournaments" });
  }
}

async function getTournamentById(req, res) {
  const { tournamentId } = req.params;
  try {
    await connectDB();
    const tournament = await TournamentModel.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }
    res.status(200).json({
      id: tournament._id,
      name: tournament.name,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to fetch tournament" });
  }
}

module.exports = {
  createTournament,
  getTournaments,
  getTournamentById
};
