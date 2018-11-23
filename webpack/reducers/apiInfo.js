const apiInfo = (state = {}) => {
  if (!state.apiUrl) {
    const apiUrl = remoteUrl || '';
    const siteUrl = cpSiteUrl || '';

    return { ...state, apiUrl, siteUrl };
  }

  return state;
};

export default apiInfo;
