"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GenericDatasource = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var defaultSettings = {
  name: "vorstella-datasource",
  apiUrl: "https://metrics.prod.noc.vorstella.com"
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

    _lodash.default.defaults(config, defaultSettings);

    this.url = config.apiUrl;
    this.name = config.name;
    this.token = config.apiToken;
    this.backendSrv = backendSrv;
    this.templateSrv = templateSrv;
    this.headers = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Token " + this.token
    };
  }

  _createClass(GenericDatasource, [{
    key: "query",
    value: function query(options) {
      var targets = this.extractTargets(options);

      if (targets.length == 0) {
        return [];
      }

      var data = {
        startAt: options.range.from.toISOString(),
        stopAt: options.range.to.toISOString(),
        intervalMs: options.intervalMs,
        limit: options.maxDataPoints,
        targets: targets
      };
      return [];
    }
  }, {
    key: "extractTargets",
    value: function extractTargets(options) {
      //remove placeholder targets from query
      options.targets = _lodash.default.filter(options.targets, function (target) {
        return target.target && target.target !== 'select metric';
      });
      return _lodash.default.map(options.targets, function (target) {
        return {
          sampleId: target.target,
          type: target.type || 'timeserie'
        };
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
      var data = {
        startAt: options.range.from.toISOString(),
        stopAt: options.range.to.toISOString(),
        limit: options.annotation.limit,
        enable: options.annotation.enable,
        hide: options.annotation.hide,
        type: options.annotation.type,
        tags: options.annotation.tags,
        query: options.annotation.query
      };
      var annotations = this.backendSrv.datasourceRequest({
        url: this.url + '/api/v1/grafana/annotations',
        method: 'POST',
        headers: this.headers,
        data: data
      }).then(function (result) {
        return _lodash.default.map(result.data.data, function (issue, index) {
          var firstSeen = Date.parse(issue.firstSeen);
          var lastSeen = null;

          if (issue.lastSeen) {
            lastSeen = Date.parse(issue.lastSeen);
          }

          var isRegion = lastSeen != null;
          return {
            annotation: {
              name: options.annotation.name,
              enabled: options.annotation.enable,
              datasource: options.annotation.datasource
            },
            title: issue.summary,
            time: firstSeen,
            timeEnd: lastSeen,
            isRegion: isRegion,
            tags: [],
            text: issue.description
          };
        });
      });
      return annotations;
    }
  }, {
    key: "metricFindQuery",
    value: function metricFindQuery(query) {
      var params = null;

      if (query) {
        params = (_readOnlyError("params"), {
          target: query
        });
      } // TODO: When we already made a query, hang on to the results for some time
      //       5 minutes or so sounds like a good amount for a cache.


      return this.backendSrv.datasourceRequest({
        url: this.url + '/api/v1/grafana/search',
        params: params,
        method: 'GET',
        headers: this.headers
      }).then(function (result) {
        return _lodash.default.map(result.data.data, function (serviceSampleType, _index) {
          var text = serviceSampleType.simpleName.toLowerCase() + " " + serviceSampleType.serviceType;
          var value = serviceSampleType.id;
          return {
            text: text,
            value: value
          };
        });
      });
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
