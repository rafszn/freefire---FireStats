const mongoose = require("mongoose");

const gameplaySchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: true,
  }, // Linked tournament
  createdAt: { type: Date, default: Date.now }, // Gameplay date
  results: [
    {
      team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
      }, // Linked team
      kills: { type: Number, required: true }, // Kills in this gameplay
      points: { type: Number, required: true }, // Points in this gameplay
    },
  ],
});

module.exports = mongoose.model("Gameplay", gameplaySchema);
