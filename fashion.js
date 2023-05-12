const parseString = require("xml2js").parseString;
const {
  extractImageSrc,
  extractSubmission,
  generateHtmlForSubmission,
  generateHtmlForIndexes,
} = require("./utils");

const extractFashionItem = (node) => {
  const id = node.ItemId;
  const title = node.ItemTitle;
  const year = node.ItemYear;
  const medium = node.ItemMedium;
  const description = node.ItemDescription;
  const image = extractImageSrc(node.ItemImage);
  const credits = node.ItemCredits;

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
  const caption = node.ImageCaption;
  const image = extractImageSrc(node.ImageImage);
  const credits = node.ImageCredits;

  return {
    id,
    caption,
    image,
    credits,
  };
};

const parseFashionCatalogXml = (xml) => {
  parseString(xml, { explicitArray: false }, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(
        `Parsed catalog export XML; there are ${result.nodes.node.length} nodes`
      );
      const submissionsMap = new Map();
      result.nodes.node.forEach((node) => {
        const nid = node.Nid;
        const fashionItem = extractFashionItem(node);
        const fashionImage = extractFashionImage(node);

        if (!submissionsMap.has(nid)) {
          const submission = extractSubmission(node);
          submission.designer = node.Designer;
          submission.brand = node.Brand;
          const fashionItemsMap = new Map();
          const fashionImagesMap = new Map();
          console.log(`Adding submission ${nid}`);
          if (fashionItem.id) {
            fashionItemsMap.set(fashionItem.id, fashionItem);
            console.log(
              `Added fashion item ${fashionItem.id} to submission ${nid}`
            );
          }
          if (fashionImage.id) {
            fashionImagesMap.set(fashionImage.id, fashionImage);
            console.log(
              `Added fashion image ${fashionImage.id} to submission ${nid}`
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
              `Added fashion item ${fashionItem.id} to submission ${nid}`
            );
          }
          if (
            fashionImage.id &&
            !submission.fashionImagesMap.has(fashionImage.id)
          ) {
            submission.fashionImagesMap.set(fashionImage.id, fashionImage);
            console.log(
              `Added fashion image ${fashionImage.id} to submission ${nid}`
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
          id
        );
      });
      generateHtmlForIndexes(Array.from(submissionsMap.values()));
    }
  });
};

module.exports = {
  parseFashionCatalogXml,
};
