const fs = require("fs");
const Handlebars = require("handlebars");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const buildHTML = (templateSrc, data) => {
  const source = fs.readFileSync(templateSrc, "utf8").toString();
  const template = Handlebars.compile(source);
  const output = template(data);

  return output;
};

const extractImageSrc = (htmlString) => {
  const frag = JSDOM.fragment(htmlString);
  const src = frag.firstChild?.src;
  return src
    ? src.replace(
        "http://gallery.bridgesmathart.org/sites/live.gallery.host.sunstormlab.com",
        "https://s3.amazonaws.com/files.gallery.bridgesmathart.org"
      )
    : "https://placehold.it/600x600";
};

const getExhibitionDisplayName = (exhibition) =>
  exhibition
    .split("-")
    .map((string) =>
      string
        ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
        : ""
    )
    .join(" ");

const extractSubmission = (node) => {
  // Get the exhibition slug and submission slug from the URL
  // e.g. http://gallery.bridgesmathart.org/exhibitions/2021-bridges-conference/jofre-adzarias
  const url = node.URL;
  const regex =
    /http:\/\/gallery.bridgesmathart.org\/exhibitions\/([0-9a-z\-]*)\/(.*)/;
  const [, exhibition, slug] = url.match(regex);

  const exhibitionDisplayName = getExhibitionDisplayName(exhibition);
  const thumbnail = extractImageSrc(node.Thumbnail);
  const title = node.Name;
  const position = node.Position;
  const affiliation = node.Affiliation;
  const location = node.Location;
  const emails = node.Email.split(",").map((d) => d.trim());
  const websites = node.Website.split(",").map((d) => d.trim());
  const statement = node.Statement;

  return {
    exhibition,
    exhibitionDisplayName,
    slug,
    thumbnail,
    title,
    position,
    affiliation,
    location,
    emails,
    websites,
    statement,
  };
};

const generateHtmlForSubmission = (template, submission, id) => {
  console.log(
    `Generating html for submission ${id} (${submission.exhibition} / ${submission.slug})`
  );
  const html = buildHTML(template, submission);
  const path = `./build/exhibitions/${submission.exhibition}/${submission.slug}`;
  const filename = `${path}/index.html`;
  fs.mkdirSync(path, { recursive: true });
  fs.writeFileSync(filename, html);
  console.log(`${filename} created`);
};

const generateHtmlForIndexes = (submissions) => {
  const groupedSubmissions = submissions.reduce(
    (r, v, i, a, k = v.exhibition) => ((r[k] || (r[k] = [])).push(v), r),
    {}
  );
  Object.entries(groupedSubmissions).forEach(([exhibition, submissions]) => {
    console.log(`Generating html for {{exhibition}} index`);
    const exhibitionDisplayName = getExhibitionDisplayName(exhibition);
    const html = buildHTML("./public/index-template.hbs", {
      submissions,
      exhibition,
      exhibitionDisplayName,
    });
    const path = `./build/exhibitions/${exhibition}`;
    const filename = `${path}/index.html`;
    fs.mkdirSync(path, { recursive: true });
    fs.writeFileSync(filename, html);
    console.log(`${filename} created`);
  });
};

module.exports = {
  buildHTML,
  extractImageSrc,
  extractSubmission,
  getExhibitionDisplayName,
  generateHtmlForSubmission,
  generateHtmlForIndexes,
};
