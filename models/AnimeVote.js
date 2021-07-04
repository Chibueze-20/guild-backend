const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnimeVoteSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    votes: {
        type: [],
        required: [true, "Member must vote"],
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
        default: false
    }
},
    {
        timestamps: true
    });

const AnimeVote = mongoose.model('anime_vote', AnimeVoteSchema);

module.exports = AnimeVote;