const parseString = require("xml2js").parseString;
const {
  extractImageSrc,
  extractSubmission,
  generateHtmlForSubmission,
  generateHtmlForIndexes,
} = require("./utils");

const extractFilm = (node) => {
  const image = extractImageSrc(node.Image);
  const title = node.Title;
  const length = node.Length;
  const creditInfo = node.CreditInfo;
  const year = node.Year;
  const description = node.Description;
  const publicLink = node.PublicLink;

  return {
    image,
    title,
    length,
    creditInfo,
    year,
    description,
    publicLink,
  };
};

const parseFilmCatalogXml = (xml) => {
  parseString(xml, { explicitArray: false }, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(
        `Parsed catalog export XML; there are ${result.nodes.node.length} films`
      );
      const submissionsMap = new Map();
      result.nodes.node.forEach((node) => {
        const nid = node.Nid;
        if (!submissionsMap.has(nid)) {
          submissionsMap.set(nid, {
            ...extractSubmission(node),
            films: [extractFilm(node)],
          });
        } else {
          const film = extractFilm(node);
          // Some extra entries exist without data; title has always been required so should be ok to filter by
          if (film.title) {
            submissionsMap.set(nid, {
              ...submissionsMap.get(nid),
              films: [...submissionsMap.get(nid).films, film],
            });
          }
        }
      });
      submissionsMap.forEach((submission, id) => {
        generateHtmlForSubmission("./public/film-template.hbs", submission, id);
      });
      generateHtmlForIndexes(Array.from(submissionsMap.values()));
    }
  });
};

module.exports = {
  parseFilmCatalogXml,
};
