import NoSsr from "@/components/helpers/NoSsr";

export function GetForegroundColor(hex) {
    if (hex.length < 7) {
        hex += hex.substring(1, 3);
    }

    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}

export function BlobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

export const GetPrettyDate = (obj) => {
    const date = new Date(obj);
    const month = date.toLocaleString([], { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();

    let str = `${month} ${day}`;

    if (date.getFullYear() < new Date().getFullYear()) {
        str += ` ${year}`;
    }

    return str;
}

export function GetDurationText(ms) {
    if (ms === undefined)
        return 'N/A';

    let seconds = (ms / 1000).toFixed(0);
    let minutes = (ms / (1000 * 60)).toFixed(0);
    let hours = (ms / (1000 * 60 * 60)).toFixed(0);
    let days = (ms / (1000 * 60 * 60 * 24)).toFixed(0);
    if (seconds < 60) return seconds + ' secs';
    else if (minutes < 60) return minutes + ' mins';
    else if (hours < 24) return hours + ' hours';
    else return days + ' days'
}

const isNode = typeof localStorage === 'undefined';

export function GetCurrency() {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: isNode ? 'USD' : localStorage.getItem('afficone-currency'),
        maximumFractionDigits: 0
    });

    return <NoSsr>{formatter.format(0).replace(/\d/g, '').trim()}</NoSsr>
}

export function GetNumber(num) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: isNode ? 'USD' : localStorage.getItem('afficone-currency') ?? 'USD',
    });

    return (
        formatter.format(num)
    );
}

export async function CopyToClipboard(text) {
    await navigator.clipboard.writeText(text);
}

export function Round(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function GetPlural(text, len) {
    return `${len} ${text}${len !== 0 ? len > 1 ? 's' : '' : 's'}`;
}

export function GetDateFormat(date) {
    const offset = date.getTimezoneOffset();
    date = new Date(date.getTime() - (offset * 60 * 1000));

    return date.toISOString().split('T')[0];
}

export function SetCookie(name, value, days) {
    let expires = '';

    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; Expires=" + date.toUTCString();
    }

    document.cookie = name + '=' + (value || '')  + expires + '; Path=/';
}
export function GetCookie(name) {
    let temp = name + '=';
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];

        while (c.charAt(0) === ' ') c = c.substring(1,c.length);
        if (c.indexOf(temp) === 0) return c.substring(temp.length, c.length);
    }
    return null;
}

export const IsString = value => typeof value === 'string' || value instanceof String;