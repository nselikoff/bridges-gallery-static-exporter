const parseString = require("xml2js").parseString;
const {
  cleanText,
  extractImageSrc,
  extractSubmission,
  generateHtmlForSubmission,
  generateHtmlForIndexes,
  trimText,
} = require("./utils");

const extractFilm = (node) => {
  const image = extractImageSrc(node.Image);
  const title = trimText(node.Title);
  const length = trimText(node.Length);
  const creditInfo = trimText(node.CreditInfo);
  const year = trimText(node.Year);
  const description = trimText(cleanText(node.Description));
  const publicLink = trimText(node.PublicLink);

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

const buildFilmCatalogXml = (xml) => {
  parseString(xml, { explicitArray: false }, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(
        `Parsed catalog export XML; there are ${result.nodes.node.length} films`,
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

const exportFilmCatalogXml = (xml) => {
  const submissionsMap = new Map();
  parseString(xml, { explicitArray: false }, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(
        `Parsed catalog export XML; there are ${result.nodes.node.length} films`,
      );
      result.nodes.node.forEach((node) => {
        const nid = node.Nid;
        const film = extractFilm(node);
        if (!submissionsMap.has(nid)) {
          submissionsMap.set(nid, {
            ...extractSubmission(node),
            films: film.title ? [film] : [],
          });
        } else {
          // Some extra entries exist without data; title has always been required so should be ok to filter by
          if (film.title) {
            submissionsMap.set(nid, {
              ...submissionsMap.get(nid),
              films: [...submissionsMap.get(nid).films, film],
            });
          }
        }
      });
    }
  });
  return submissionsMap;
};

module.exports = {
  buildFilmCatalogXml,
  exportFilmCatalogXml,
};
