#!/bin/bash 
git submodule init 
git submodule update 
cd janus-gateway/npm 
npm install 
npm run rollup -- --o ./janus.js --f es