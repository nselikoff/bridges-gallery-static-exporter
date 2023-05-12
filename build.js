const fs = require("fs");
const { parseArtCatalogXml } = require("./art");
const { parseFilmCatalogXml } = require("./film");
const { parseFashionCatalogXml } = require("./fashion");

parseArtCatalogXml(
  fs.readFileSync("./catalog-export.xml", {
    encoding: "utf8",
    flag: "r",
  })
);

parseFilmCatalogXml(
  fs.readFileSync("./catalog-export-film.xml", {
    encoding: "utf8",
    flag: "r",
  })
);

parseFashionCatalogXml(
  fs.readFileSync("./catalog-export-fashion.xml", {
    encoding: "utf8",
    flag: "r",
  })
);
