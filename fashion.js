const parseString = require("xml2js").parseString;
const {
  cleanText,
  extractImageSrc,
  extractSubmission,
  generateHtmlForSubmission,
  generateHtmlForIndexes,
  trimText,
} = require("./utils");

const extractFashionItem = (node) => {
  const id = node.ItemId;
  const title = trimText(node.ItemTitle);
  const year = trimText(node.ItemYear);
  const medium = trimText(node.ItemMedium);
  const description = trimText(cleanText(node.ItemDescription));
  const image = extractImageSrc(node.ItemImage);
  const credits = trimText(node.ItemCredits);

  return {
    id,
    title,
    year,
    medium,
    description,
    image,
    credits,
  };
};

const extractFashionImage = (node) => {
  const id = node.ImageId;
  const caption = trimText(node.ImageCaption);
  const image = extractImageSrc(node.ImageImage);
  const credits = trimText(node.ImageCredits);

  return {
    id,
    caption,
    image,
    credits,
  };
};

const buildFashionCatalogXml = (xml) => {
  parseString(xml, { explicitArray: false }, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(
        `Parsed catalog export XML; there are ${result.nodes.node.length} nodes`,
      );
      const submissionsMap = new Map();
      result.nodes.node.forEach((node) => {
        const nid = node.Nid;
        const fashionItem = extractFashionItem(node);
        const fashionImage = extractFashionImage(node);

        if (!submissionsMap.has(nid)) {
          const submission = extractSubmission(node);
          submission.designer = trimText(node.Designer);
          submission.brand = trimText(node.Brand);
          const fashionItemsMap = new Map();
          const fashionImagesMap = new Map();
          console.log(`Adding submission ${nid}`);
          if (fashionItem.id) {
            fashionItemsMap.set(fashionItem.id, fashionItem);
            console.log(
              `Added fashion item ${fashionItem.id} to submission ${nid}`,
            );
          }
          if (fashionImage.id) {
            fashionImagesMap.set(fashionImage.id, fashionImage);
            console.log(
              `Added fashion image ${fashionImage.id} to submission ${nid}`,
            );
          }
          submissionsMap.set(nid, {
            ...submission,
            fashionItemsMap,
            fashionImagesMap,
          });
        } else {
          const submission = submissionsMap.get(nid);
          if (
            fashionItem.id &&
            !submission.fashionItemsMap.has(fashionItem.id)
          ) {
            submission.fashionItemsMap.set(fashionItem.id, fashionItem);
            console.log(
              `Added fashion item ${fashionItem.id} to submission ${nid}`,
            );
          }
          if (
            fashionImage.id &&
            !submission.fashionImagesMap.has(fashionImage.id)
          ) {
            submission.fashionImagesMap.set(fashionImage.id, fashionImage);
            console.log(
              `Added fashion image ${fashionImage.id} to submission ${nid}`,
            );
          }
        }
      });
      submissionsMap.forEach((submission, id) => {
        generateHtmlForSubmission(
          "./public/fashion-template.hbs",
          {
            ...submission,
            fashionItems: Array.from(submission.fashionItemsMap.values()),
            fashionImages: Array.from(submission.fashionImagesMap.values()),
          },
          id,
        );
      });
      generateHtmlForIndexes(Array.from(submissionsMap.values()));
    }
  });
};

const exportFashionCatalogXml = (xml) => {
  const submissionsMap = new Map();
  parseString(xml, { explicitArray: false }, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(
        `Parsed catalog export XML; there are ${result.nodes.node.length} nodes`,
      );
      result.nodes.node.forEach((node) => {
        const nid = node.Nid;
        const fashionItem = extractFashionItem(node);
        const fashionImage = extractFashionImage(node);

        if (!submissionsMap.has(nid)) {
          const submission = extractSubmission(node);
          submission.designer = trimText(node.Designer);
          submission.brand = trimText(node.Brand);
          const fashionItemsMap = new Map();
          const fashionImagesMap = new Map();
          console.log(`Adding submission ${nid}`);
          if (fashionItem.id) {
            fashionItemsMap.set(fashionItem.id, fashionItem);
            console.log(
              `Added fashion item ${fashionItem.id} to submission ${nid}`,
            );
          }
          if (fashionImage.id) {
            fashionImagesMap.set(fashionImage.id, fashionImage);
            console.log(
              `Added fashion image ${fashionImage.id} to submission ${nid}`,
            );
          }
          submissionsMap.set(nid, {
            ...submission,
            fashionItemsMap,
            fashionImagesMap,
          });
        } else {
          const submission = submissionsMap.get(nid);
          if (
            fashionItem.id &&
            !submission.fashionItemsMap.has(fashionItem.id)
          ) {
            submission.fashionItemsMap.set(fashionItem.id, fashionItem);
            console.log(
              `Added fashion item ${fashionItem.id} to submission ${nid}`,
            );
          }
          if (
            fashionImage.id &&
            !submission.fashionImagesMap.has(fashionImage.id)
          ) {
            submission.fashionImagesMap.set(fashionImage.id, fashionImage);
            console.log(
              `Added fashion image ${fashionImage.id} to submission ${nid}`,
            );
          }
        }
      });
    }
  });
  return submissionsMap;
};

module.exports = {
  buildFashionCatalogXml,
  exportFashionCatalogXml,
};
