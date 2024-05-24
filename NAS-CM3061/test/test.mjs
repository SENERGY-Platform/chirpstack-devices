const testFolder = './NAS-CM3061/test/';
import { decodeUplink } from '../codec.mjs';

import * as fs from 'fs';

const uplinkTestFolder = testFolder + 'uplink/';
fs.readdir(uplinkTestFolder, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  files.forEach(file => {
    fs.readFile(uplinkTestFolder+file, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        const testMsg = JSON.parse(data);
        console.log("---")
        console.log("TEST", file);
        console.log("INPUT", JSON.stringify(testMsg));
        console.log("OUTPUT", JSON.stringify(decodeUplink(testMsg)));
      });
  });
});