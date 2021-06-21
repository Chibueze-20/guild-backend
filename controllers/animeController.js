const axios = require('axios');
const Cloudinary = require('../Services/Cloudinary');
const AnimePicture = require('../models/AnimePicture');
const fs = require('fs')
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

module.exports.upload = async (req, res) => {
    const { type, season } = req.body;
    try {
        let pic_check = await AnimePicture.findOne({ type: type, season: season });
        if (pic_check) {
            const cloudinary_response = await Cloudinary.upload(req.files.anime_pic);
            fs.unlinkSync(req.files.anime_pic.tempFilePath);
            pic_check.image_url = cloudinary_response.url;
            await pic_check.save()
            pic_check = pic_check.toJSON();
            delete pic_check.__v;
            return res.status(200).send({
                message: { success: 'Anime picture uploaded successfully' },
                data: pic_check
            })
        } else {
            const cloudinary_response = await Cloudinary.upload(req.files.anime_pic);
            fs.unlinkSync(req.files.anime_pic.tempFilePath);
            let anime_pic = await AnimePicture.create({ type: type, season: season, image_url: cloudinary_response.url });
            anime_pic = anime_pic.toJSON();
            delete anime_pic.__v;
            return res.status(201).send({
                message: { success: 'Anime picture uploaded successfully' },
                data: anime_pic
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: 'There was a problem, please try again later.'
        });
    }
}