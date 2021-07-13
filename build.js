const fs = require("fs");
const parseString = require("xml2js").parseString;
const Handlebars = require("handlebars");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const buildHTML = (templateSrc, data) => {
  const source = fs.readFileSync(templateSrc, "utf8").toString();
  const template = Handlebars.compile(source);
  const output = template(data);

  return output;
};

const generateHtmlForNode = (node, index) => {
  console.log(`Generating html for node ${index} (${node.slug})`);
  const html = buildHTML("./public/artwork-template.hbs", node);
  const filename = `./build/${node.slug}.html`;
  fs.writeFile(filename, html, (err) => {
    if (err) return console.log(err);
    console.log(`${filename} created`);
  });
};

const extractImageSrc = (htmlString) => {
  const frag = JSDOM.fragment(htmlString);
  const src = frag.firstChild?.src;
  return src
    ? src
        .split(
          "http://gallery.bridgesmathart.org/sites/live.gallery.host.sunstormlab.com/"
        )
        .pop()
    : "https://placehold.it/600x600";
};

const transformNode = (node) => {
  // Get the slug from the URL
  node.slug = node.URL?.[0]?.split("/")?.pop();

  // Artworks are denormalized; put them back in an array for ease of access in the template
  // Also strip image URL for local (root-relative) loading
  const artworks = [];
  for (let i = 1; i < 4; i++) {
    const title = node[`Title${i}`];
    if (!title?.[0]) {
      continue;
    }
    artworks.push({
      Image: extractImageSrc(node[`Image${i}`].shift()),
      Title: title.shift(),
      ComputedDimensions: node[`ComputedDimensions${i}`].shift(),
      Medium: node[`Medium${i}`].shift(),
      Year: node[`Year${i}`].shift(),
      Description: node[`Description${i}`].shift(),
      MoreInfo: node[`MoreInfo${i}`].shift(),
    });
  }
  node.Artwork = artworks;
};

const parseCatalogExportXml = (xml) => {
  parseString(xml, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(
        `Parsed catalog export XML; there are ${result.nodes.node.length} artworks`
      );
      // TODO: index
      // TODO: all pages
      const node = result.nodes.node[0];
      transformNode(node);
      generateHtmlForNode(node, 0);
      // result.nodes.node.forEach((node, index) => {
      //   generateHtmlForNode(node, index);
      // });
    }
  });
};

const xml = fs.readFileSync("./catalog-export.xml", {
  encoding: "utf8",
  flag: "r",
});

parseCatalogExportXml(xml);
