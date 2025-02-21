//packages
const express = require("express");
const cors = require("cors");
require("dotenv").config();

//routes
const TournamentRoutes = require("./routes/tournament.route");
const TeamRoutes = require("./routes/team.route");
const GameplayRoutes = require("./routes/gameplay.route");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Freefire Api on!");
});

//routes
app.use("/api", TournamentRoutes);
app.use("/api", TeamRoutes);
app.use("/api", GameplayRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
