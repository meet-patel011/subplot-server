import axios from "axios";

const TMDB = "https://api.themoviedb.org/3";

// IN-MEMORY CACHE 
const cache = new Map();

function getCache(key, ttl) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.time > ttl) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, time: Date.now() });
}

// HELPER 
function getKey() {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error("TMDB_API_KEY is not loaded");
  }
  return key;
}

// TRENDING 
export const trending = async () => {
  const key = "trending";
  const cached = getCache(key, 60 * 60 * 1000);
  if (cached) return cached;

  const { data } = await axios.get(`${TMDB}/trending/all/week`, {
    params: { api_key: getKey() }
  });

  setCache(key, data);
  return data;
};

// NEWLY RELEASE
export const upcoming = async () => {
  const key = "upcoming:filtered";
  const cached = getCache(key, 60 * 60 * 1000);
  if (cached) return cached;

  const today = new Date().toISOString().split("T")[0];
  const past = new Date(Date.now() - 45 * 864e5).toISOString().split("T")[0];

  const { data } = await axios.get(`${TMDB}/discover/movie`, {
    params: {
      api_key: getKey(),
      sort_by: "release_date.desc",
      "release_date.gte": past,
      "release_date.lte": today,
      with_release_type: "3|2",
      "vote_count.gte": 50,
      with_original_language: "en|hi"
    }
  });

  setCache(key, data);
  return data;
};

// PROVIDER (IN then US FALLBACK)
export const byProvider = async (provider) => {
  const key = `provider:${provider}`;
  const cached = getCache(key, 2 * 60 * 60 * 1000);
  if (cached) return cached;

  const results = [];

  const fetchPage = async (region, page) => {
    const { data } = await axios.get(`${TMDB}/discover/movie`, {
      params: {
        api_key: getKey(),
        with_watch_providers: provider,
        watch_region: region,
        with_watch_monetization_types: "flatrate",
        
        without_genres: "99",
        "vote_count.gte": 200,
        "popularity.gte": 15,
        sort_by: "popularity.desc",
        page
      }
    });
    return data.results || [];
  };

  for (let p = 1; p <= 3 && results.length < 15; p++) {
    results.push(...await fetchPage("IN", p));
  }

  if (results.length < 10) {
    for (let p = 1; p <= 2 && results.length < 15; p++) {
      results.push(...await fetchPage("US", p));
    }
  }

  const response = {
    results: results.filter(item => item.poster_path).slice(0, 15)
  };

  setCache(key, response);
  return response;
};

// BOLLYWOOD
export const bollywood = async () => {
  const key = "bollywood";
  const cached = getCache(key, 2 * 60 * 60 * 1000);
  if (cached) return cached;

  const today = new Date().toISOString().split("T")[0];

  const { data } = await axios.get(`${TMDB}/discover/movie`, {
    params: {
      api_key: getKey(),
      with_origin_country: "IN",
      with_original_language: "hi",

      "vote_count.gte": 100,
      "popularity.gte": 12,

      sort_by: "primary_release_date.desc",
      "primary_release_date.lte": today
    }
  });

  setCache(key, data);
  return data;
};

// ANIME
export const anime = async () => {
  const key = "anime";
  const cached = getCache(key, 2 * 60 * 60 * 1000);
  if (cached) return cached;

  const { data } = await axios.get(`${TMDB}/discover/tv`, {
    params: {
      api_key: getKey(),
      with_genres: 16,
      with_original_language: "ja",
      sort_by: "popularity.desc"
    }
  });

  setCache(key, data);
  return data;
};

// DETAILS
export const details = async (type, id) => {
  const key = `details:${type}:${id}`;
  const cached = getCache(key, 24 * 60 * 60 * 1000);
  if (cached) return cached;

  const { data } = await axios.get(`${TMDB}/${type}/${id}`, {
    params: { api_key: getKey() }
  });

  setCache(key, data);
  return data;
};

// CREDITS
export const credits = async (type, id) => {
  const key = `credits:${type}:${id}`;
  const cached = getCache(key, 24 * 60 * 60 * 1000);
  if (cached) return cached;

  const { data } = await axios.get(`${TMDB}/${type}/${id}/credits`, {
    params: { api_key: getKey() }
  });

  setCache(key, data);
  return data;
};

// VIDEOS 
export const videos = async (type, id) => {
  const key = `videos:${type}:${id}`;
  const cached = getCache(key, 24 * 60 * 60 * 1000);
  if (cached) return cached;

  const { data } = await axios.get(`${TMDB}/${type}/${id}/videos`, {
    params: { api_key: getKey() }
  });

  setCache(key, data);
  return data;
};

// RECOMMENDATIONS
export const recommendations = async (type, id) => {
  const key = `reco:${type}:${id}`;
  const cached = getCache(key, 24 * 60 * 60 * 1000);
  if (cached) return cached;

  const { data } = await axios.get(`${TMDB}/${type}/${id}/recommendations`, {
    params: { api_key: getKey() }
  });

  setCache(key, data);
  return data;
};

// SEARCH 
export const search = async (q) => {
  const key = `search:${q.toLowerCase()}`;
  const cached = getCache(key, 30 * 60 * 1000);
  if (cached) return cached;

  const { data } = await axios.get(`${TMDB}/search/multi`, {
    params: {
      api_key: getKey(),
      query: q,
      include_adult: false
    }
  });

  setCache(key, data);
  return data;
};

// GENRES 
export const movieGenres = async () => {
  const key = "genres:movie";
  const cached = getCache(key, 86400000);
  if (cached) return cached;

  const { data } = await axios.get(`${TMDB}/genre/movie/list`, {
    params: { api_key: getKey() }
  });

  setCache(key, data);
  return data;
};

export const tvGenres = async () => {
  const key = "genres:tv";
  const cached = getCache(key, 86400000);
  if (cached) return cached;

  const { data } = await axios.get(`${TMDB}/genre/tv/list`, {
    params: { api_key: getKey() }
  });

  setCache(key, data);
  return data;
};

// BY GENRE 
export const byGenre = async (type, genreId) => {
  const key = `genre:${type}:${genreId}`;
  const cached = getCache(key, 3600000);
  if (cached) return cached;

  const { data } = await axios.get(`${TMDB}/discover/${type}`, {
    params: {
      api_key: getKey(),
      with_genres: genreId,
      sort_by: "popularity.desc"
    }
  });

  setCache(key, data);
  return data;
};

// COLLECTION / FRANCHISE 
export const collection = async (id) => {
  const key = `collection:${id}`;
  const cached = getCache(key, 86400000);
  if (cached) return cached;

  const { data } = await axios.get(`${TMDB}/collection/${id}`, {
    params: { api_key: getKey() }
  });

  setCache(key, data);
  return data;
};

export const discoverMovie = async (query) => {
  const key = `discover:movie:${JSON.stringify(query)}`;
  const cached = getCache(key, 3600000);
  if (cached) return cached;

  const { data } = await axios.get(`${TMDB}/discover/movie`, {
    params: { api_key: getKey(), ...query }
  });

  setCache(key, data);
  return data;
};

export const discoverTV = async (query) => {
  const key = `discover:tv:${JSON.stringify(query)}`;
  const cached = getCache(key, 3600000);
  if (cached) return cached;

  const { data } = await axios.get(`${TMDB}/discover/tv`, {
    params: { api_key: getKey(), ...query }
  });

  setCache(key, data);
  return data;
};
