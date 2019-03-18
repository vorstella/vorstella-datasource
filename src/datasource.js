import _ from "lodash";


const defaultSettings = {
  name: "vorstella-datasource",
  apiUrl: "https://metrics.prod.noc.vorstella.com"
};


export class GenericDatasource {
  constructor(instanceSettings, $q, backendSrv, templateSrv) {
    const config = {
      name: instanceSettings.name,
      apiUrl: instanceSettings.jsonData.apiUrl,
      apiToken: instanceSettings.jsonData.apiToken
    };
    _.defaults(config, defaultSettings);

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

  query(options) {
    const targets = this.extractTargets(options);

    if (targets.length == 0) {
      return [];
    }

    const data = {
      startAt: options.range.from.toISOString(),
      stopAt: options.range.to.toISOString(),
      intervalMs: options.intervalMs,
      limit: options.maxDataPoints,
      targets: targets
    };

    return [];
  }

  extractTargets(options) {
    //remove placeholder targets from query
    options.targets = _.filter(options.targets, target => {
      return target.target && target.target !== 'select metric';
    });

    return _.map(options.targets, target => {
      return {
        sampleId: target.target,
        type: target.type || 'timeserie'
      };
    });
  }

  testDatasource() {
    return this.backendSrv.datasourceRequest({
      url: this.url + "/api/v1/clusters",
      method: "GET",
      headers: this.headers
    }).then(result => {
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

  annotationQuery(options) {
    const data = {
      startAt: options.range.from.toISOString(),
      stopAt: options.range.to.toISOString(),
      limit: options.annotation.limit,
      enable: options.annotation.enable,
      hide: options.annotation.hide,
      type: options.annotation.type,
      tags: options.annotation.tags,
      query: options.annotation.query
    }

    const annotations = this.backendSrv.datasourceRequest({
      url: this.url + '/api/v1/grafana/annotations',
      method: 'POST',
      headers: this.headers,
      data: data
    }).then(result => {
      return _.map(result.data.data, (issue, index) => {
        const firstSeen = Date.parse(issue.firstSeen);
        var lastSeen = null;
        if (issue.lastSeen) {
          lastSeen = Date.parse(issue.lastSeen);
        }
        const isRegion = lastSeen != null;

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
        }
      })
    });

    return annotations;
  }

  metricFindQuery(query) {
    const params = null;

    if (query) {
      params = {
        target: query
      };
    }

    // TODO: When we already made a query, hang on to the results for some time
    //       5 minutes or so sounds like a good amount for a cache.

    return this.backendSrv.datasourceRequest({
      url: this.url + '/api/v1/grafana/search',
      params: params,
      method: 'GET',
      headers: this.headers
    }).then(result => {
      return _.map(result.data.data, (serviceSampleType, _index) => {
        const text = serviceSampleType.simpleName.toLowerCase() + " " + serviceSampleType.serviceType;
        const value = serviceSampleType.id;
        return {
          text: text,
          value: value
        }
      });
    });
  }

  getTagKeys(options) {
    return new Promise((resolve, reject) => {
      this.doRequest({
        url: this.url + '/tag-keys',
        method: 'POST',
        data: options
      }).then(result => {
        return resolve(result.data);
      });
    });
  }

  getTagValues(options) {
    return new Promise((resolve, reject) => {
      this.doRequest({
        url: this.url + '/tag-values',
        method: 'POST',
        data: options
      }).then(result => {
        return resolve(result.data);
      });
    });
  }
}
