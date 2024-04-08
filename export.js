const fs = require("fs");
const { exportArtCatalogXml } = require("./art");
const { exportFilmCatalogXml } = require("./film");
const { exportFashionCatalogXml } = require("./fashion");

fs.mkdirSync("export");

const artSubmissionsMap = exportArtCatalogXml(
  fs.readFileSync("./catalog-export.xml", {
    encoding: "utf8",
    flag: "r",
  }),
);
const artFilename = "export/catalog-export-art.json";
fs.writeFileSync(
  artFilename,
  JSON.stringify(Array.from(artSubmissionsMap.values())),
);
console.log(`${artFilename} created`);

const filmSubmissionsMap = exportFilmCatalogXml(
  fs.readFileSync("./catalog-export-film.xml", {
    encoding: "utf8",
    flag: "r",
  }),
);
const filmFilename = "export/catalog-export-film.json";
fs.writeFileSync(
  filmFilename,
  JSON.stringify(Array.from(filmSubmissionsMap.values())),
);
console.log(`${filmFilename} created`);

const fashionSubmissionsMap = exportFashionCatalogXml(
  fs.readFileSync("./catalog-export-fashion.xml", {
    encoding: "utf8",
    flag: "r",
  }),
);
const fashionFilename = "export/catalog-export-fashion.json";
const fashionSubmissions = Array.from(fashionSubmissionsMap.values());
fashionSubmissions.forEach((submission) => {
  submission.fashion_items = Array.from(submission.fashionItemsMap.values());
  submission.fashion_images = Array.from(submission.fashionImagesMap.values());
  delete submission.fashionItemsMap;
  delete submission.fashionImagesMap;
});
fs.writeFileSync(fashionFilename, JSON.stringify(fashionSubmissions));
console.log(`${fashionFilename} created`);
