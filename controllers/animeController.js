const axios = require("axios");
const Cloudinary = require("../Services/Cloudinary");
const AnimePicture = require("../models/AnimePicture");
const fs = require("fs");
const AnimeVote = require("../models/AnimeVote");
require("dotenv").config();

module.exports.season_anime = async (req, res) => {
  const { season, year } = req;
  try {
    const season_anime = await axios.get(
      `${process.env.JINKAN_URL}${year}/${season}`
    );
    const season_anime_data = season_anime.data.anime;
    let anime_data = [];
    for (const anime of season_anime_data) {
      if (anime.type != "Movie" && anime.type != "Special" && anime.type != "OVA" && anime.r18 == false && anime.kids == false && anime.continuing == false) {
        const anime_item = {
          title: anime.title,
          image_url: anime.image_url,
          synopsis: anime.synopsis,
        };
        anime_data.push(anime_item);
      }
    }
    return res.status(200).send({
      message: `The  previous season for year ${year} is ${season}`,
      data: anime_data,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports.upload = async (req, res) => {
  const { type, season } = req.body;
  try {
    let pic_check = await AnimePicture.findOne({ type: type, season: season });
    if (pic_check) {
      await Cloudinary.destroy(pic_check.public_id);
      const cloudinary_response = await Cloudinary.upload(req.files.anime_pic);
      fs.unlinkSync(req.files.anime_pic.tempFilePath);
      pic_check.image_url = cloudinary_response.url;
      pic_check.public_id = cloudinary_response.public_id;
      await pic_check.save();
      pic_check = pic_check.toJSON();
      delete pic_check.__v;
      delete pic_check.public_id;
      return res.status(200).send({
        message: { success: "Anime picture uploaded successfully" },
        data: pic_check,
      });
    } else {
      const cloudinary_response = await Cloudinary.upload(req.files.anime_pic);
      fs.unlinkSync(req.files.anime_pic.tempFilePath);
      let anime_pic = await AnimePicture.create({
        type: type,
        season: season,
        image_url: cloudinary_response.url,
        public_id: cloudinary_response.public_id,
      });
      anime_pic = anime_pic.toJSON();
      delete anime_pic.__v;
      delete anime_pic.public_id;
      return res.status(201).send({
        message: { success: "Anime picture uploaded successfully" },
        data: anime_pic,
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports.fetch_picture = async (req, res) => {
  const { type, season } = req.params;
  try {
    let anime_pic = await AnimePicture.findOne({ type: type, season: season });
    if (!anime_pic) {
      return res.status(404).send({
        status: "error",
        message: `Anime picture of type ${type} for ${season} season not found.`,
      });
    } else {
      anime_pic = anime_pic.toJSON();
      delete anime_pic.__v;
      return res.status(200).send({
        message: { success: "Anime picture retrieved successfully" },
        data: anime_pic,
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

module.exports.vote = async (req, res) => {
  const { season, year } = req;
  const voteData = {
    user: req.jwt.id,
    votes: req.body.votes,
    season: season,
    year: year,
  };
  try {
    const anime_vote = await AnimeVote.create(voteData);
    return res.status(201).send({
      message: { success: `User has voted successfully for ${season} ${year}` },
      data: anime_vote,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// function to get votes. Logic for processing of votes to be added
module.exports.get_votes = async (req, res) => {
  try {
    const votes = await AnimeVote.find({ is_deleted: false }).populate("user", [
      "_id",
      "username",
      "email",
    ]);
    return res.status(200).send({
      message: { success: `Anime votes retrieved successfully` },
      data: votes,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
