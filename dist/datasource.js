"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericDatasource = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var defaultSettings = {
  name: "vorstella-datasource",
  apiUrl: "https://metrics.dev.noc.vorstella.com"
};

var GenericDatasource =
/*#__PURE__*/
function () {
  function GenericDatasource(instanceSettings, $q, backendSrv, templateSrv) {
    _classCallCheck(this, GenericDatasource);

    var config = {
      name: instanceSettings.name,
      apiUrl: instanceSettings.jsonData.apiUrl,
      apiToken: instanceSettings.jsonData.apiToken
    };
    console.log(instanceSettings);

    _lodash.default.defaults(config, defaultSettings);

    this.url = config.apiUrl;
    this.name = config.name;
    this.token = config.apiToken;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.headers = {
      "Content-Type": "application/json",
      "Authorization": "Token " + this.token
    };
  }

  _createClass(GenericDatasource, [{
    key: "query",
    value: function query(options) {
      return this.backendSrv.datasourceRequest({
        url: this.url + '/metrics/api/v1/clusters',
        method: 'GET'
      }).then(function (result) {
        return result.data;
      });
    }
  }, {
    key: "testDatasource",
    value: function testDatasource() {
      return this.backendSrv.datasourceRequest({
        url: this.url + "/api/v1/clusters",
        method: "GET",
        headers: this.headers
      }).then(function (result) {
        if (result.status == 200) {
          return {
            status: "success",
            message: "Data source is working.",
            title: "Success"
          };
        } else {
          return {
            status: "failed",
            message: "Please check your credentials",
            title: "Failed"
          };
        }
      });
    }
  }, {
    key: "annotationQuery",
    value: function annotationQuery(options) {
      // var query = this.templateSrv.replace(options.annotation.query, {}, 'glob');
      // var annotationQuery = {
      //   range: options.range,
      //   annotation: {
      //     name: options.annotation.name,
      //     datasource: options.annotation.datasource,
      //     enable: options.annotation.enable,
      //     iconColor: options.annotation.iconColor,
      //     query: query
      //   },
      //   rangeRaw: options.rangeRaw
      // };
      //
      // return this.doRequest({
      //   url: this.url + '/annotations',
      //   method: 'get',
      //   data: annotationQuery
      // }).then(result => {
      //   return result.data;
      // });
      return {};
    }
  }, {
    key: "metricFindQuery",
    value: function metricFindQuery(query) {
      // var interpolated = {
      //     target: this.templateSrv.replace(query, null, 'regex')
      // };
      //
      // return this.doRequest({
      //   url: this.url + '/search',
      //   data: interpolated,
      //   method: 'POST',
      // }).then(this.mapToTextValue);
      return {};
    }
  }, {
    key: "getTagKeys",
    value: function getTagKeys(options) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.doRequest({
          url: _this.url + '/tag-keys',
          method: 'POST',
          data: options
        }).then(function (result) {
          return resolve(result.data);
        });
      });
    }
  }, {
    key: "getTagValues",
    value: function getTagValues(options) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.doRequest({
          url: _this2.url + '/tag-values',
          method: 'POST',
          data: options
        }).then(function (result) {
          return resolve(result.data);
        });
      });
    }
  }]);

  return GenericDatasource;
}();

exports.GenericDatasource = GenericDatasource;
//# sourceMappingURL=datasource.js.map
