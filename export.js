const fs = require("fs");
const { exportArtCatalogXml } = require("./art");
// const { exportFilmCatalogXml } = require("./film");
// const { exportFashionCatalogXml } = require("./fashion");

fs.mkdirSync("export");

const artSubmissionsMap = exportArtCatalogXml(
  fs.readFileSync("./catalog-export.xml", {
    encoding: "utf8",
    flag: "r",
  }),
);
const filename = "export/catalog-export-art.json";
fs.writeFileSync(
  filename,
  JSON.stringify(Array.from(artSubmissionsMap.values())),
);
console.log(`${filename} created`);

// exportFilmCatalogXml(
//   fs.readFileSync("./catalog-export-film.xml", {
//     encoding: "utf8",
//     flag: "r",
//   }),
// );

// exportFashionCatalogXml(
//   fs.readFileSync("./catalog-export-fashion.xml", {
//     encoding: "utf8",
//     flag: "r",
//   }),
// );
