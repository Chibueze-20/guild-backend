//MIddleware to calculate the year and season and attach it to request

const seasonYear = async (req, res, next) => {
  const now = new Date();
  let month = now.getMonth() + 1;
  let year = now.getFullYear();
  let season;
  if (month >= 1 && month < 4) {
    season = "winter";
  } else if (month >= 4 && month < 7) {
    season = "spring";
  } else if (month >= 7 && month < 10) {
    season = "summer";
  } else if (month >= 10 && month <= 12) {
    season = "fall";
  }
  req.season = season;
  req.year = year;
  next();
};

module.exports = seasonYear;
