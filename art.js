const parseString = require("xml2js").parseString;
const {
  extractImageSrc,
  extractSubmission,
  generateHtmlForSubmission,
  generateHtmlForIndexes,
} = require("./utils");

const extractArtwork = (node) => {
  const image = extractImageSrc(node.Image);
  const title = node.Title;
  const computedDimensions = node.ComputedDimensions;
  const medium = node.Medium;
  const year = node.Year;
  const description = node.Description;
  const moreInfo = node.MoreInfo;

  return {
    image,
    title,
    computedDimensions,
    medium,
    year,
    description,
    moreInfo,
  };
};

const parseArtCatalogXml = (xml) => {
  parseString(xml, { explicitArray: false }, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(
        `Parsed catalog export XML; there are ${result.nodes.node.length} artworks`
      );
      const submissionsMap = new Map();
      result.nodes.node.forEach((node) => {
        const nid = node.Nid;
        if (!submissionsMap.has(nid)) {
          submissionsMap.set(nid, {
            ...extractSubmission(node),
            artworks: [extractArtwork(node)],
          });
        } else {
          const artwork = extractArtwork(node);
          // Some extra entries exist without data; title has always been required so should be ok to filter by
          if (artwork) {
            submissionsMap.set(nid, {
              ...submissionsMap.get(nid),
              artworks: [...submissionsMap.get(nid).artworks, artwork],
            });
          }
        }
      });
      submissionsMap.forEach((submission, id) => {
        generateHtmlForSubmission(
          "./public/artwork-template.hbs",
          submission,
          id
        );
      });
      generateHtmlForIndexes(Array.from(submissionsMap.values()));
    }
  });
};

module.exports = {
  parseArtCatalogXml,
};
