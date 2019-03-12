import _ from "lodash";


const defaultSettings = {
  name: "vorstella-datasource",
  apiUrl: "https://metrics.dev.noc.vorstella.com"
};


export class GenericDatasource {
  constructor(instanceSettings, $q, backendSrv, templateSrv) {
    const config = {
      name: instanceSettings.name,
      apiUrl: instanceSettings.jsonData.apiUrl,
      apiToken: instanceSettings.jsonData.apiToken
    };
    console.log(instanceSettings);
    _.defaults(config, defaultSettings);

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

  query(options) {
    return this.backendSrv.datasourceRequest({
      url: this.url + '/api/v1/clusters',
      method: 'GET'
    }).then(result => { return result.data })
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

  metricFindQuery(query) {
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
