const axios = require('axios');
require('dotenv').config();

module.exports.season_anime = async (req, res) => {
    const now = new Date();
    let month = (now.getMonth() + 1);
    const year = now.getFullYear();
    let previous_season;
    if (month >= 1 && month < 4) {
        previous_season = "fall";
    } else if (month >= 4 && month < 7) {
        previous_season = "winter";
    } else if (month >= 7 && month < 10) {
        previous_season = "spring";
    } else if (month >= 10 && month <= 12) {
        previous_season = "summer";
    }
    try {
        const season_anime = await axios.get(`${process.env.JINKAN_URL}${year}/${previous_season}`);
        const season_anime_data = season_anime.data.anime
        let anime_data = [];
        for (const anime of season_anime_data) {
            const anime_item = {
                title: anime.title,
                image_url: anime.image_url,
                synopsis: anime.synopsis,
            };
            anime_data.push(anime_item);
        }
        return res.status(200).send({
            message: `The  previous season for year ${year} is ${previous_season}`,
            data: anime_data
        });
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: 'There was a problem, please try again later.'
        });
    }
}