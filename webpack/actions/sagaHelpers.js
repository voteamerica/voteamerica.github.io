const createAPIurl = (params, remoteUrl, apiRoute) => {
  let urlParams = '';

  const keys = Object.keys(params);

  keys.forEach(function(key, idx) {
    if (idx > 0) {
      urlParams += '&';
    }

    urlParams += key + '=' + params[key].toString();
  });

  const baseUrl = remoteUrl + apiRoute;

  const url = urlParams.length > 0 ? baseUrl + '?' + urlParams : baseUrl;

  return url;
};

const fetchInfo = async fetchDetails => {
  const options = {};

  if (fetchDetails.token && fetchDetails.token.length > 0) {
    options.headers = { Authorization: `Bearer ${fetchDetails.token}` };
  }

  const resp = await fetch(fetchDetails.fetchURL, options);

  console.log('resp', resp);

  const json = resp.json();

  return json;
};

export { createAPIurl, fetchInfo };
