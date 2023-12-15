import axios from 'axios';
import { isNode } from "browser-or-node";
import * as https from "https";

export const TurnstileKey = '0x4AAAAAAANIL0qMZ2zcfQsA';
export const Production = false;

// This is like this because of local vs browser requests on production.
const Api = axios.create({
    baseURL: isNode ? 'https://127.0.0.1:1338' : 'https://api.affibear.test',
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

export async function SendRequest(toast, method, url, data, onSuccess = null, onError = null, msgs = null, after = null) {
    const promise = new Promise(async (resolve, reject) => {
        const res = await Api[method](url, data);

        if (res.status === 200) {
            if (onSuccess !== null)
                onSuccess(res);

            resolve();
        } else {
            if (onError !== null)
                onError(res);

            reject(res.data.status ?? res.data);
        }

        if (after !== null)
            after(res);
    });

    if (msgs !== null) {
        toast.promise(promise, msgs);
    }
}

export default Api;