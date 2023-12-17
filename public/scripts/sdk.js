let token = getScriptParam('token');

async function initialize() {
    const params = new URLSearchParams(window.location.search);

    if (!params.has('ref') || token === null) {
        console.log('No ref or empty shop param.')
        return;
    }

    if (getCookie('ref') == null) {
        const ref = params.get('ref');

        setCookie('ref', ref, 90);
        await fetch(`https://api.afficone.com/track/${token}/${ref}`);
    }
}

initialize();

async function conversion(order) {
    const ref = getCookie('ref');
    if (ref == null) {
        return;
    }

    const res = await fetch('http://ip-api.com/json');
    const json = await res.json();

    const obj = {
        ...order,
        ip: json
    };

    await fetch(`https://api.afficone.com/track/${token}/${ref}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    });
}

window.affiConversion = conversion;

function getCookie(name) {
    let end;
    const dc = document.cookie;
    const prefix = name + "=";
    let begin = dc.indexOf("; " + prefix);

    if (begin === -1) {
        begin = dc.indexOf(prefix);
        if (begin !== 0) return null;
    }
    else {
        begin += 2;
        end = document.cookie.indexOf(";", begin);
        if (end === -1) {
            end = dc.length;
        }
    }

    return decodeURI(dc.substring(begin + prefix.length, end));
}

function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; Expires=' + date.toUTCString();
    }

    document.cookie = name + '=' + (value || null) + expires + '; Path=/';
}

function getScriptParam(name) {
    const tag = document.querySelector('script[src^="https://afficone.test/scripts/sdk.js"]');

    if (tag) {
        const urlParams = new URLSearchParams(new URL(tag.getAttribute('src')).search);
        return urlParams.get(name);
    } else {
        return null;
    }
}