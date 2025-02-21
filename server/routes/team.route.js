const { Router } = require("express");
const { createTeams, getTeams } = require("../controllers/team.controller");

const router = Router();

router.post("/tournaments/:tournamentId/teams", createTeams);
router.get("/tournaments/:tournamentId/teams", getTeams);

module.exports = router;
