const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Team name
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true }, // Linked tournament
  teamLogo: { type: String }, // Path/URL to the team logo
  killCount: { type: Number, default: 0 }, 
  placementPoints: {type: Number, default: 0 },
  booyahCount: {type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 }, // Total points across all gameplays
});

const TeamModel = mongoose.model('Team', teamSchema); 

module.exports = TeamModel
