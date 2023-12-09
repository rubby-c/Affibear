import React from 'react';
let setup = false;

const GoogleTranslate = () => {
    React.useEffect(() => {
        if (setup) {
            return;
        }

        const addScript = document.createElement('script');
        addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=translateInit');
        document.body.appendChild(addScript);

        window.translateInit = () => {
            new window.google.translate.TranslateElement({
                    pageLanguage: 'en',
                    autoDisplay: false
                },
                'google_translate_element'
            );
        };

        setup = true;
    }, []);

    return (
        <div id='google_translate_element' />
    );
};

export default GoogleTranslate;