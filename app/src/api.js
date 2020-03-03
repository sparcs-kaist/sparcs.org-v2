import axios from 'axios';

const api = axios.create({
    withCredentials: true,
    baseURL: '/api',
    validateStatus: false
});

const request = async (url, method = 'get', body = null, options = null) => {
    const configuration = {
        url,
        method,
        headers: {},
        ...options
    };

    const token = localStorage.getItem('SparcsAuthorization');
    if(token)
        configuration.headers['Sparcs-Authorization'] = token;

    if(body) {
        configuration.data = body;
    }

    const { data } = await api(configuration);
    return data;
}

export default request;
