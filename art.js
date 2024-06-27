const parseString = require("xml2js").parseString;
const {
  cleanText,
  extractImageSrc,
  extractSubmission,
  generateHtmlForSubmission,
  generateHtmlForIndexes,
  trimText,
} = require("./utils");

const extractArtwork = (node) => {
  const image = extractImageSrc(node.Image);
  const title = trimText(node.Title);
  const computedDimensions = trimText(node.ComputedDimensions);
  const medium = trimText(node.Medium);
  const year = trimText(node.Year);
  const description = trimText(cleanText(node.Description));
  const moreInfo = trimText(node.MoreInfo);

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

const buildArtCatalogXml = (xml) => {
  parseString(xml, { explicitArray: false }, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(
        `Parsed catalog export XML; there are ${result.nodes.node.length} artworks`,
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
          id,
        );
      });
      generateHtmlForIndexes(Array.from(submissionsMap.values()));
    }
  });
};

const exportArtCatalogXml = (xml) => {
  const submissionsMap = new Map();
  parseString(xml, { explicitArray: false }, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(
        `Parsed catalog export XML; there are ${result.nodes.node.length} artworks`,
      );
      result.nodes.node.forEach((node) => {
        const nid = node.Nid;
        const artwork = extractArtwork(node);
        if (!submissionsMap.has(nid)) {
          submissionsMap.set(nid, {
            ...extractSubmission(node),
            artworks: artwork.title ? [artwork] : [],
          });
        } else {
          // Some extra entries exist without data; title has always been required so should be ok to filter by
          if (artwork.title) {
            submissionsMap.set(nid, {
              ...submissionsMap.get(nid),
              artworks: [...submissionsMap.get(nid).artworks, artwork],
            });
          }
        }
      });
    }
  });
  return submissionsMap;
};

module.exports = {
  buildArtCatalogXml,
  exportArtCatalogXml,
};
