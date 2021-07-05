//MIddleware to calculate the year and season and attach it to request

const seasonYear = async (req, res, next) => {
  const now = new Date();
  let month = now.getMonth() + 1;
  let year = now.getFullYear();
  let previous_season;
  if (month >= 1 && month < 4) {
    previous_season = "fall";
    year = year - 1;
  } else if (month >= 4 && month < 7) {
    previous_season = "winter";
  } else if (month >= 7 && month < 10) {
    previous_season = "spring";
  } else if (month >= 10 && month <= 12) {
    previous_season = "summer";
  }
  req.season = previous_season;
  req.year = year;
  next();
};

module.exports = seasonYear;
