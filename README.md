# Bridges Gallery Static Exporter

Generate static HTML files for every artwork in a Bridges Gallery

## Prerequisites

- node
- admin and server access to http://gallery.bridgesmathart.org/
- bridges files uploaded to s3

## Development

- Install node packages: `npm install`
- On http://gallery.bridgesmathart.org/, export catalog XML files for art, film and fashion. Art is the only category big enough to require multiple exports (1000 at a time) which should be merged manually. Put the catalog-export-fashion.xml, catalog-export-film.xml, and catalog-export.xml (art) into the root directory of this checked out repo.

## Build

`npm run build`

When complete, the `build` directory will include the generated HTML and CSS files, with image urls pointing to s3. This will include index files for the individual exhibitions. You can browse the generated files by running `python -m http.server` in the build directory.
