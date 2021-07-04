const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notEmpty = (votes) => {
  if (votes.length === 0) {
    return false;
  } else {
    return true;
  }
};

const AnimeVoteSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    votes: {
      type: [],
      required: true,
      validate: [
        notEmpty,
        "Member must vote for at least one anime",
      ],
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

const AnimeVote = mongoose.model("anime_vote", AnimeVoteSchema);

module.exports = AnimeVote;
