const fs = require("fs");
const { exportArtCatalogXml } = require("./art");
const { exportFilmCatalogXml } = require("./film");
const { exportFashionCatalogXml } = require("./fashion");

fs.mkdirSync("export/art", { recursive: true });
fs.mkdirSync("export/film", { recursive: true });
fs.mkdirSync("export/fashion", { recursive: true });

const artSubmissionsMap = exportArtCatalogXml(
  fs.readFileSync("./catalog-export.xml", {
    encoding: "utf8",
    flag: "r",
  }),
);
const artFilename = "export/art/all-art-submissions.json";
const artSubmissions = Array.from(artSubmissionsMap.values());
fs.writeFileSync(artFilename, JSON.stringify(artSubmissions));
console.log(`${artFilename} created`);

const filmSubmissionsMap = exportFilmCatalogXml(
  fs.readFileSync("./catalog-export-film.xml", {
    encoding: "utf8",
    flag: "r",
  }),
);
const filmFilename = "export/film/all-film-submissions.json";
const filmSubmissions = Array.from(filmSubmissionsMap.values());
fs.writeFileSync(filmFilename, JSON.stringify(filmSubmissions));
console.log(`${filmFilename} created`);

const fashionSubmissionsMap = exportFashionCatalogXml(
  fs.readFileSync("./catalog-export-fashion.xml", {
    encoding: "utf8",
    flag: "r",
  }),
);
const fashionFilename = "export/fashion/all-fashion-submissions.json";
const fashionSubmissions = Array.from(fashionSubmissionsMap.values());
fashionSubmissions.forEach((submission) => {
  submission.fashion_items = Array.from(submission.fashionItemsMap.values());
  submission.fashion_images = Array.from(submission.fashionImagesMap.values());
  delete submission.fashionItemsMap;
  delete submission.fashionImagesMap;
});
fs.writeFileSync(fashionFilename, JSON.stringify(fashionSubmissions));
console.log(`${fashionFilename} created`);

const artSubmissionsByExhibition = new Map();
artSubmissions.forEach((submission) => {
  const existingSubmissions =
    artSubmissionsByExhibition.get(submission.exhibition) || [];
  artSubmissionsByExhibition.set(submission.exhibition, [
    ...existingSubmissions,
    submission,
  ]);
});
artSubmissionsByExhibition.forEach((submissions, exhibition) => {
  const filename = `export/art/${exhibition}.json`;
  fs.writeFileSync(filename, JSON.stringify(submissions, null, 2));
  console.log(`${filename} created`);
});

const filmSubmissionsByExhibition = new Map();
filmSubmissions.forEach((submission) => {
  const existingSubmissions =
    filmSubmissionsByExhibition.get(submission.exhibition) || [];
  filmSubmissionsByExhibition.set(submission.exhibition, [
    ...existingSubmissions,
    submission,
  ]);
});
filmSubmissionsByExhibition.forEach((submissions, exhibition) => {
  const filename = `export/film/${exhibition}.json`;
  fs.writeFileSync(filename, JSON.stringify(submissions, null, 2));
  console.log(`${filename} created`);
});

const fashionSubmissionsByExhibition = new Map();
fashionSubmissions.forEach((submission) => {
  const existingSubmissions =
    fashionSubmissionsByExhibition.get(submission.exhibition) || [];
  fashionSubmissionsByExhibition.set(submission.exhibition, [
    ...existingSubmissions,
    submission,
  ]);
});
fashionSubmissionsByExhibition.forEach((submissions, exhibition) => {
  const filename = `export/fashion/${exhibition}.json`;
  fs.writeFileSync(filename, JSON.stringify(submissions, null, 2));
  console.log(`${filename} created`);
});
