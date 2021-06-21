const cloudinary = require('cloudinary')
require('dotenv').config();

cloudinary.config({

  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

module.exports = {

  upload: async (file) => {

      try {

        let response = await cloudinary.v2.uploader.upload(file.tempFilePath, { folder: 'Guild', uploadPreset: 'guild_app', resource_type: "auto", overwrite: true, use_filename: true, unique_filename: false  })

        return({ status: true, url: response.secure_url })

      } catch (error) {

        return({ status: false, url: error.message })
      }
  }
}
