#!/bin/bash 
mkdir js
cd janus-gateway 
git pull origin master
cd npm 
npm install 
npm run rollup -- --o ./janus.js --f es
cd ..
cp -r npm/* ../js/