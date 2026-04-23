import fs from "fs";
import path from "path";

export default function spaFallbackMiddleware(rootDir) {
  return (req, res, next) => {
    if (req.method !== "GET" || req.url.startsWith("/api") || req.url.includes(".")) {
      return next();
    }
    const indexPath = path.join(rootDir, "index.html");
    fs.readFile(indexPath, (err, data) => {
      if (err) return next();
      res.setHeader("Content-Type", "text/html");
      res.end(data);
    });
  };
}
