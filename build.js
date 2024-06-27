const fs = require("fs");
const { buildArtCatalogXml } = require("./art");
const { buildFilmCatalogXml } = require("./film");
const { buildFashionCatalogXml } = require("./fashion");

buildArtCatalogXml(
  fs.readFileSync("./catalog-export.xml", {
    encoding: "utf8",
    flag: "r",
  }),
);

buildFilmCatalogXml(
  fs.readFileSync("./catalog-export-film.xml", {
    encoding: "utf8",
    flag: "r",
  }),
);

buildFashionCatalogXml(
  fs.readFileSync("./catalog-export-fashion.xml", {
    encoding: "utf8",
    flag: "r",
  }),
);
