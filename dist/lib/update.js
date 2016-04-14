'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = update;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reacterminator = require('reacterminator');

var _reacterminator2 = _interopRequireDefault(_reacterminator);

var _exec = require('./helpers/exec');

var _exec2 = _interopRequireDefault(_exec);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _zipfile = require('zipfile');

var _zipfile2 = _interopRequireDefault(_zipfile);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// extract zip file
function unzipDesign() {
  // check if .design.zip exists
  try {
    var hasZipFile = _fs2.default.statSync('.design.zip').isFile();
    if (!hasZipFile) {
      return;
    }
  } catch (e) {
    return;
  }

  // create necessary folder
  (0, _exec2.default)('mkdir -p .design/');
  (0, _exec2.default)('mkdir -p .design/css');
  (0, _exec2.default)('mkdir -p .design/images');

  // unzip the .design.zip file
  console.log(_chalk2.default.bold('RUNNING: ') + _chalk2.default.green('unzip .design.zip'));
  var zip = new _zipfile2.default.ZipFile('.design.zip');
  zip.names.forEach(function (filePath) {
    // do not copy whole path path
    if (/\/$/.test(filePath)) {
      return;
    }
    zip.copyFileSync(filePath, '.design/' + filePath);
  });
} /* eslint-disable  no-console */

function update() {
  unzipDesign();

  // images
  (0, _exec2.default)('mkdir -p public/images');
  (0, _exec2.default)('cp .design/images/* public/images');

  // css
  (0, _exec2.default)('mkdir -p client/css');
  (0, _exec2.default)('mkdir -p client/css/lib');
  var cssFiles = _glob2.default.sync('.design/css/*.css');
  cssFiles.forEach(function (name) {
    var libCssFiles = ['.design/css/normalize.css', '.design/css/webflow.css'];

    if (_lodash2.default.includes(libCssFiles, name)) {
      (0, _exec2.default)('cp ' + name + ' client/css/lib');
    } else {
      (0, _exec2.default)('cp ' + name + ' client/css/');
    }
  });

  // javascript

  // reacterminator
  console.log(_chalk2.default.bold('RUNNING: ') + _chalk2.default.green('REACTERMINATOR'));
  (0, _reacterminator2.default)({ type: 'path', content: '.design/' }, {
    outputPath: 'client/imports/components',
    changeLinksForParamStore: true,
    generateFiles: true,
    recursive: true,
    overrideFiles: true,
    fileToComponent: true
  });
}