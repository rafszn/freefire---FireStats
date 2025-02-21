const connectDB = require("../lib/ConnectDB");
const getPositionNumber = require("../lib/getPositionNumber");
const imageToBase64 = require("../lib/imageToBase64");
const placementPoints = require("../lib/placementPoints");
const TeamModel = require("../models/team.model");
const TournamentModel = require("../models/tournament.model");
const openai = require("../openai/config");

async function getGamePlayCount(req, res) {
  const { tournamentId } = req.params;
  try {
    await connectDB();
    const tournament = await TournamentModel.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }
    res.status(200).json({ gamePlayCount: tournament.gameplayCount });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to fetch game play count" });
  }
}

async function createGamePlay(req, res) {
  const { tournamentId } = req.params;
  const teamNames = req.body.teamNames;
  const screenshots = req.files;
  try {
    await connectDB();
    if (screenshots.length <= 0) {
      return res.status(400).json({ message: "No screenshots provided" });
    }
    const tournament = await TournamentModel.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }
    if (tournament.gameplayCount >= 5) {
      return res
        .status(400)
        .json({ message: "Maximum gameplay count reached" });
    }
    if (teamNames.length !== screenshots.length) {
      return res
        .status(400)
        .send("Team names and screenshots count do not match.");
    }
    const TEAMS = screenshots.map((image, index) => {
      const base64 = imageToBase64(image.path, image.mimetype);
      return {
        teamName: teamNames[index],
        teamImageName: image.originalname,
        teamScreenshot: base64,
      };
    });
    const results = [];
    for (const team of TEAMS) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `I have an image from a Free Fire match results screen. Extract the following information:
The position of the team, which is displayed as a hashtag followed by a number (e.g., #2/8).
The total number of kills across all players in the screenshot, which is represented under the column labeled K. Make sure to sum only the values under the K column to calculate total_kills.
Srictly return the Position and the Sum of all kills as a JSON object in the format:
{
  "position": "<team_position>",
  "kill_count": <sum_of_kills>
}
 Do not include new lines.
`,
              },
              {
                type: "image_url",
                image_url: {
                  url: team.teamScreenshot,
                },
              },
            ],
          },
        ],
        temperature: 0,
      });
      const string = response.choices[0].message.content;
      const cleanedResponse = string
        .replace("```json\n", "")
        .replace("\n```", "");

      const jsonResponse = JSON.parse(cleanedResponse);
      const { kill_count } = jsonResponse;
      const position = getPositionNumber(jsonResponse.position);
      const points = placementPoints[position];
      const totalpoints = points + kill_count;

      const resTeam = await TeamModel.findOne({
        name: team.teamName,
        tournament: tournamentId,
      });
      if (!resTeam) {
        console.log("Team not found");
        continue;
      }
      resTeam.killCount += kill_count;
      resTeam.placementPoints += points;
      resTeam.totalPoints += totalpoints;
      if (position === "1") {
        resTeam.booyahCount += 1;
      }
      await resTeam.save();

      results.push({
        ...resTeam._doc,
      });
    }
    tournament.gameplayCount++;
    await tournament.save();
    const data = results.sort((a, b) => b.totalPoints - a.totalPoints);

    res.status(201).json({ data });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to create game play" });
  }
}

const getTournamentResults = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    await connectDB();

    const teams = await TeamModel.find({ tournament: tournamentId }).sort({
      totalPoints: -1,
    });
    if (!teams) {
      return res.status(404).json({ message: "Tournament not found" });
    }
    const tournament = await TournamentModel.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    const results = teams.map((team) => ({
      teamName: team.name,
      killcount: team.killCount,
      totalPoints: team.totalPoints,
      booyahCount: team.booyahCount,
      placementPoints: team.placementPoints
    }));

    res.status(200).json({
      tournamentId,
      results,
      currentGameplay: tournament.gameplayCount,
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch tournament results" });
  }
};

module.exports = {
  getGamePlayCount,
  createGamePlay,
  getTournamentResults,
};
