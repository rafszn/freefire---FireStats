const { Router } = require("express");
const {
  createTournament,
  getTournaments,
  getTournamentById,
} = require("../controllers/tournament.controller");

const router = Router();

router.post("/tournaments", createTournament);
router.get("/tournaments", getTournaments);
router.get("/tournaments/:tournamentId", getTournamentById)

module.exports = router;
