const mongoose = require("mongoose");

const notEmpty = (votes) => {
  if (votes.length === 0) {
    return false;
  } else {
    return true;
  }
};

const WeeklyVoteSchema = new mongoose.Schema(
  {
    votes: {
      type: [],
      required: true,
      validate: [
        notEmpty,
        "Votes cannot be empty",
      ],
    },
    week: {
      type: String,
      required: [true, "Week field must not be empty"],
    },
    season: {
      type: String,
      required: [true, "Season field must not be empty"],
    },
    year: {
      type: String,
      required: [true, "Year field must not be empty"],
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const WeeklyVote = mongoose.model("weekly_votes", WeeklyVoteSchema);

module.exports = WeeklyVote;
