const mongoose = require('mongoose');

const AnimePictureSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, "Please enter type of image"],
    },
    season: {
        type: String,
        enum : ['winter','spring', 'summer', 'fall'],
        required: [true, "Please enter the anime season"],
    },
    image_url: {
        type: String,
    },
    public_id: {
        type: String,
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    });

const AnimePicture = mongoose.model('anime_picture', AnimePictureSchema);

module.exports = AnimePicture;