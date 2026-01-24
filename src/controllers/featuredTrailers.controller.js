// import fs from "fs";
// import path from "path";

// export const getFeaturedTrailers = (req, res) => {
//   try {
//     const filePath = path.resolve("data/featured-trailers.json");
//     const raw = fs.readFileSync(filePath, "utf-8");
//     const trailers = JSON.parse(raw);

//     res.json(trailers);
//   } catch (err) {
//     res.status(500).json([]);
//   }
// };
