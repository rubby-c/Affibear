import axios from 'axios';
import { isNode } from "browser-or-node";
import * as https from "https";

export const TurnstileKey = '0x4AAAAAAANIL0qMZ2zcfQsA';
export const Production = false;

// This is like this because of local vs browser requests on production.
const Api = axios.create({
    baseURL: isNode ? 'https://127.0.0.1:1338' : 'https://api.affibear.com',
    httpsAgent: new https.Agent({

        rejectUnauthorized: false // CHANGE
    })
});

Api.interceptors.request.use(
    config => {
        config.validateStatus = false;
        config.withCredentials = true;

        return config;
    },
    error => Promise.reject(error)
);

export default Api;