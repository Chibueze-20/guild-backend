const cron = require("node-cron");
const seasonYear = require("../middleware/seasonYearMiddleware");
const AnimeVote = require("../models/AnimeVote");
const WeeklyVote = require("../models/WeeklyVote");

const AggregateVote = cron.schedule("0 0 * * 1", async () => {
  console.log("Task started");
  const today = new Date();
  const last_week = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
  );
  let votes = await AnimeVote.find({
    createdAt: { $gte: last_week, $lt: new Date() },
  });
  let total_votes = [];
  let season = votes[0].season;
  let year = votes[0].year;
  for (const vote of votes) {
    vote.votes.forEach((element) => {
      total_votes.push(element);
    });
  }
  let weekly_votes = [];
  total_votes.reduce(function (res, value) {
    if (!res[value.anime]) {
      res[value.anime] = { anime: value.anime, vote: 0 };
      weekly_votes.push(res[value.anime]);
    }
    res[value.anime].vote += value.vote;
    return res;
  }, {});
  const week_check = await WeeklyVote.find({ season: season, year: year });
  const week = week_check ? week_check.length + 1 : 1;
  await WeeklyVote.create({ votes: weekly_votes, week: week, season: season, year: year });
  console.log("Task ended");
});

module.exports = AggregateVote;
