#!/bin/bash
cd $(dirname $0)

printf "Adding libraries.."
cat lib/* > js/libraries.js
printf "done\n"

printf "Adding client code..."
cat js/music.js >> js/libraries.js
printf "done\n"

printf "Uglifying lib...\n"
uglifyjs js/libraries.js --compress --stats -o js/libraries.min.js
printf "done\n"

printf "Deleting uncompressed lib..."
rm js/libraries.js
printf "done\n"
