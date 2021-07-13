# Bridges Gallery Static Exporter

Generate static HTML files for every artwork in a Bridges Gallery

## Prerequisites

- node
- admin and server access to http://gallery.bridgesmathart.org/

## Development

- Install node packages: `npm install`
- On http://gallery.bridgesmathart.org/, configure the XML export view for the current exhibition, and download the `catalog-export.xml` file from http://gallery.bridgesmathart.org/catalog-export.xml into the root directory of this checked out repo.
- Download the appropriate image files from the webserver (e.g. `files/bridges2021/*`) and copy the subdirectory (e.g. `bridges2021`) into the build/files directory.

## Build

`npm run build`

When complete, the `build` directory will include the generated HTML and CSS files, with root-relative image urls pointing to the files you manually copied into `build/files`.
