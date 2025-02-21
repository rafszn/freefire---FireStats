const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" }, // Optional: Description of the tournament
  createdAt: { type: Date, default: Date.now }, // Auto-set creation date
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }], // Reference to teams
  gameplayCount: { type: Number, default: 0 }, // Reference to gameplays
});

const TournamentModel = mongoose.model("Tournament", tournamentSchema);
module.exports = TournamentModel;
