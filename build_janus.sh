#!/bin/bash 
mkdir js
git submodule init 
git submodule update 
cd janus-gateway/npm 
npm install 
npm run rollup -- --o ./janus.js --f es
cd ..
cp -r npm/* ../js/
git clean -fxd
