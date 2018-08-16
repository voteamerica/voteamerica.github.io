const apiInfo = (state = {}) => {

    if (!state.apiUrl) {
        const apiUrl = remoteUrl || '';

        return { ...state, apiUrl };
    }

    return state;
}

export default apiInfo;
