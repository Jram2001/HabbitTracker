import api from './api-service';

export const get = (url: string, params = {}, config = {}) =>
    api.get(url, { params, ...config });

export const post = (url: string, data = {}, config = {}) =>
    api.post(url, data, config);

export const put = (url: string, data = {}, config = {}) =>
    api.put(url, data, config);

export const patch = (url: string, data = {}, config = {}) =>
    api.patch(url, data, config);

export const del = (url: string, params = {}, config = {}) =>
    api.delete(url, { ...config, params });
