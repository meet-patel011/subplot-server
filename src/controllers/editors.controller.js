import fs from "fs";
import path from "path";
import axios from "axios";

const CACHE_FILE = path.resolve("editors-picks-cache.json");
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

const TMDB = "https://api.themoviedb.org/3";

function getKey() {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error("TMDB_API_KEY missing in editors-picks");
  }
  return key;
}

const EDITORS_PICKS = [
  "Avengers Endgame",
  "F1",
  "Oppenheimer",
  "Godzilla Minus One",
  "Stranger Things",
  "Dark",
  "Barfi",
  "Wednesday",
  "The Social Dilemma",
  "Ford v Ferrari",
  "All Quiet on the Western Front",
  "Inception",
  "Breaking Bad",
  "Agneepath",
  "Bajrangi Bhaijaan",
  "Invincible",
  "Dune Part Two",
  "Gran Turismo",
  "Avengers Infinity War",
  "Dhurandhar",
  "12th Fail",
  "The Prestige",
  "Farzi",
  "Spider-Man: No Way Home",
  "All of Us Are Dead",
  "RRR",
  "Panchayat",
  "The Martian",
  "Interstellar",
  "3 Idiots",
  "The Avengers",
  "Lagaan",
  "Tanhaji",
  "Chhavaa",
  "Air",
  "Captain America: The Winter Soldier",
  "Dangal",
  "Attack on Titan",
  "Death Note",
  "Life of Pi",
  "Speed",
  "Top Gun: Maverick",
  "Dahmer",
  "The Dark Knight",
  "Black Mirror",
  "Fight Club",
  "Westworld",
  "Monarch: Legacy of Monsters",
  "Peaky Blinders",
  "The Boys",
  "Lamborghini"
];

export const getEditorsPicks = async (req, res, next) => {
  try {
 // CACHE READ
    if (fs.existsSync(CACHE_FILE)) {
      const cached = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));

      if (
        cached.timestamp &&
        Date.now() - cached.timestamp < CACHE_TTL &&
        Array.isArray(cached.results) &&
        cached.results.length > 0
      ) {
        return res.json({ results: cached.results });
      }
    }

    // REBUILD CACHE
    const results = [];

    for (const title of EDITORS_PICKS) {
      const { data } = await axios.get(`${TMDB}/search/multi`, {
        params: {
          api_key: getKey(),
          query: title,
          include_adult: false
        }
      });

      if (!data.results) continue;

      const item = data.results.find(
        r =>
          r.poster_path &&
          (r.media_type === "movie" || r.media_type === "tv")
      );

      if (!item) continue;

      results.push({
        id: item.id,
        media_type: item.media_type,
        title: item.title || item.name,
        poster_path: item.poster_path
      });
    }

    // SAVE CACHE ONLY IF VALID
    if (results.length > 0) {
      fs.writeFileSync(
        CACHE_FILE,
        JSON.stringify(
          {
            timestamp: Date.now(),
            results
          },
          null,
          2
        )
      );
    }

    res.json({ results });

  } catch (err) {
    console.error("Editors picks error:", err.message);
    next(err);
  }
};
