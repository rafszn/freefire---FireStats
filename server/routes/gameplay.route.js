const { Router } = require("express");
const multer = require("multer");
const {
  createGamePlay,
  getGamePlayCount,
  getTournamentResults
} = require("../controllers/gameplay.controller");

const router = Router();
const upload = multer({ dest: "/tmp/" });

router.post(
  "/tournaments/:tournamentId/gameplay",
  upload.array("screenshots", 12),
  createGamePlay,
);

router.get("/tournaments/:tournamentId/gameplaycount", getGamePlayCount);
router.get("/tournaments/:tournamentId/results", getTournamentResults)

module.exports = router;
