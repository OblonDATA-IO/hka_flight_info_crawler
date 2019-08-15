/**
 * Created by Thomas Sham on 20/9/2017.
 */

const path = require('path');
const root = path.parse(process.mainModule.filename).dir;

const simpleGit = require('simple-git')(root);

