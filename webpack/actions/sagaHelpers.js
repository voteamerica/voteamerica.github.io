const createAPIurl = (params, remoteUrl, apiRoute) => {
  var url = '';

  var keys = Object.keys(params);

  keys.forEach(function(key, idx) {
    if (idx > 0) {
      url += '&';
    }
    url += key + '=' + params[key].toString();
  });

  url = remoteUrl + apiRoute + '?' + url;

  return url;
};

const fetchInfo = async fetchURL => {
  const resp = await fetch(fetchURL);

  console.log('resp', resp);

  const json = resp.json();

  return json;
};

export { createAPIurl, fetchInfo };
