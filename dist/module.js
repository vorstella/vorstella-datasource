"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Datasource", {
  enumerable: true,
  get: function get() {
    return _datasource.GenericDatasource;
  }
});
Object.defineProperty(exports, "QueryCtrl", {
  enumerable: true,
  get: function get() {
    return _query_ctrl.GenericDatasourceQueryCtrl;
  }
});
exports.AnnotationsQueryCtrl = exports.QueryOptionsCtrl = exports.ConfigCtrl = void 0;

var _datasource = require("./datasource");

var _query_ctrl = require("./query_ctrl");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GenericConfigCtrl = function GenericConfigCtrl() {
  _classCallCheck(this, GenericConfigCtrl);
};

exports.ConfigCtrl = GenericConfigCtrl;
GenericConfigCtrl.templateUrl = 'partials/config.html';

var GenericQueryOptionsCtrl = function GenericQueryOptionsCtrl() {
  _classCallCheck(this, GenericQueryOptionsCtrl);
};

exports.QueryOptionsCtrl = GenericQueryOptionsCtrl;
GenericQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

var GenericAnnotationsQueryCtrl = function GenericAnnotationsQueryCtrl() {
  _classCallCheck(this, GenericAnnotationsQueryCtrl);
};

exports.AnnotationsQueryCtrl = GenericAnnotationsQueryCtrl;
GenericAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';
//# sourceMappingURL=module.js.map
