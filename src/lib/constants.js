export const SDK = "const shop=\"[shop_id]\";async function initialize(){console.log(\"Affibear - Initializing..\");let i=new URLSearchParams(window.location.search);if(i.has(\"ref\")&&null==getCookie(\"ref\")){let e=i.get(\"ref\");setCookie(\"ref\",e,90),await fetch(`https://api.affibear.com/track/[shop_id]/${e}`)}}async function conversion(i){let e=getCookie(\"ref\");if(null==e)return;let t=await fetch(\"http://ip-api.com/json\"),n=await t.json(),o={...i,ip:n};await fetch(`https://api.affibear.com/track?aff=${e}`,{method:\"POST\",headers:{Accept:\"application/json\",\"Content-Type\":\"application/json\"},body:JSON.stringify(o)})}function getCookie(i){let e,t=document.cookie,n=i+\"=\",o=t.indexOf(\"; \"+n);if(-1===o){if(0!==(o=t.indexOf(n)))return null}else o+=2,-1===(e=document.cookie.indexOf(\";\",o))&&(e=t.length);return decodeURI(t.substring(o+n.length,e))}function setCookie(i,e,t){let n=\"\";if(t){let o=new Date;o.setTime(o.getTime()+864e5*t),n=\"; Expires=\"+o.toUTCString()}document.cookie=i+\"=\"+(e||null)+n+\"; Path=/\"}initialize(),window.affiConversion=conversion;";

export const TOAST_OPTIONS = {
    position: 'top-right',
    duration: 2000,
    isClosable: true,
    containerStyle: {
        maxWidth: '350px'
    }
};

export const CURRENCIES = [["AED","د.إ.‏"],["AFN","؋ "],["ALL","Lek"],["AMD","դր."],["ARS","$"],["AUD","$"],["AZN","man."],["BAM","KM"],["BDT","৳"],["BGN","лв. "],["BHD","د.ب.‏ "],["BND","$"],["BOB","$b"],["BRL","R$"],["BYR","р."],["BZD","BZ$"],["CAD","$"],["CHF","fr."],["CLP","$"],["CNY","¥"],["COP","$"],["CRC","₡"],["CSD","Din."],["CZK","Kč"],["DKK","kr."],["DOP","RD$"],["DZD","DZD"],["EEK","kr"],["EGP","ج.م.‏ "],["ETB","ETB"],["EUR","€"],["GBP","£"],["GEL","Lari"],["GTQ","Q"],["HKD","HK$"],["HNL","L."],["HRK","kn"],["HUF","Ft"],["IDR","Rp"],["ILS","₪"],["INR","रु"],["IQD","د.ع.‏ "],["IRR","ريال "],["ISK","kr."],["JMD","J$"],["JOD","د.ا.‏ "],["JPY","¥"],["KES","S"],["KGS","сом"],["KHR","៛"],["KRW","₩"],["KWD","د.ك.‏ "],["KZT","Т"],["LAK","₭"],["LBP","ل.ل.‏ "],["LKR","රු."],["LTL","Lt"],["LVL","Ls"],["LYD","د.ل.‏ "],["MAD","د.م.‏ "],["MKD","ден."],["MNT","₮"],["MOP","MOP"],["MVR","ރ."],["MXN","$"],["MYR","RM"],["NIO","N"],["NOK","kr"],["NPR","रु"],["NZD","$"],["OMR","ر.ع.‏ "],["PAB","B/."],["PEN","S/."],["PHP","PhP"],["PKR","Rs"],["PLN","zł"],["PYG","Gs"],["QAR","ر.ق.‏ "],["RON","lei"],["RSD","Din."],["RUB","р."],["RWF","RWF"],["SAR","ر.س.‏ "],["SEK","kr"],["SGD","$"],["SYP","ل.س.‏ "],["THB","฿"],["TJS","т.р."],["TMT","m."],["TND","د.ت.‏ "],["TRY","TL"],["TTD","TT$"],["TWD","NT$"],["UAH","₴"],["USD","$"],["UYU","$U"],["UZS","so'm"],["VEF","Bs. F."],["VND","₫"],["XOF","XOF"],["YER","ر.ي.‏ "],["ZAR","R"],["ZWL","Z$"]];

export const LANGUAGES = [
    {
        "code": "ab",
        "name": "Abkhaz"
    },
    {
        "code": "aa",
        "name": "Afar"
    },
    {
        "code": "af",
        "name": "Afrikaans"
    },
    {
        "code": "ak",
        "name": "Akan"
    },
    {
        "code": "sq",
        "name": "Albanian"
    },
    {
        "code": "am",
        "name": "Amharic"
    },
    {
        "code": "ar",
        "name": "Arabic"
    },
    {
        "code": "an",
        "name": "Aragonese"
    },
    {
        "code": "hy",
        "name": "Armenian"
    },
    {
        "code": "as",
        "name": "Assamese"
    },
    {
        "code": "av",
        "name": "Avaric"
    },
    {
        "code": "ae",
        "name": "Avestan"
    },
    {
        "code": "ay",
        "name": "Aymara"
    },
    {
        "code": "az",
        "name": "Azerbaijani"
    },
    {
        "code": "bm",
        "name": "Bambara"
    },
    {
        "code": "ba",
        "name": "Bashkir"
    },
    {
        "code": "eu",
        "name": "Basque"
    },
    {
        "code": "be",
        "name": "Belarusian"
    },
    {
        "code": "bn",
        "name": "Bengali; Bangla"
    },
    {
        "code": "bh",
        "name": "Bihari"
    },
    {
        "code": "bi",
        "name": "Bislama"
    },
    {
        "code": "bs",
        "name": "Bosnian"
    },
    {
        "code": "br",
        "name": "Breton"
    },
    {
        "code": "bg",
        "name": "Bulgarian"
    },
    {
        "code": "my",
        "name": "Burmese"
    },
    {
        "code": "ca",
        "name": "Catalan; Valencian"
    },
    {
        "code": "ch",
        "name": "Chamorro"
    },
    {
        "code": "ce",
        "name": "Chechen"
    },
    {
        "code": "ny",
        "name": "Chichewa; Chewa; Nyanja"
    },
    {
        "code": "zh",
        "name": "Chinese"
    },
    {
        "code": "cv",
        "name": "Chuvash"
    },
    {
        "code": "kw",
        "name": "Cornish"
    },
    {
        "code": "co",
        "name": "Corsican"
    },
    {
        "code": "cr",
        "name": "Cree"
    },
    {
        "code": "hr",
        "name": "Croatian"
    },
    {
        "code": "cs",
        "name": "Czech"
    },
    {
        "code": "da",
        "name": "Danish"
    },
    {
        "code": "dv",
        "name": "Divehi; Dhivehi; Maldivian;"
    },
    {
        "code": "nl",
        "name": "Dutch"
    },
    {
        "code": "dz",
        "name": "Dzongkha"
    },
    {
        "code": "en",
        "name": "English"
    },
    {
        "code": "eo",
        "name": "Esperanto"
    },
    {
        "code": "et",
        "name": "Estonian"
    },
    {
        "code": "ee",
        "name": "Ewe"
    },
    {
        "code": "fo",
        "name": "Faroese"
    },
    {
        "code": "fj",
        "name": "Fijian"
    },
    {
        "code": "fi",
        "name": "Finnish"
    },
    {
        "code": "fr",
        "name": "French"
    },
    {
        "code": "ff",
        "name": "Fula; Fulah; Pulaar; Pular"
    },
    {
        "code": "gl",
        "name": "Galician"
    },
    {
        "code": "ka",
        "name": "Georgian"
    },
    {
        "code": "de",
        "name": "German"
    },
    {
        "code": "el",
        "name": "Greek, Modern"
    },
    {
        "code": "gn",
        "name": "GuaranÃ­"
    },
    {
        "code": "gu",
        "name": "Gujarati"
    },
    {
        "code": "ht",
        "name": "Haitian; Haitian Creole"
    },
    {
        "code": "ha",
        "name": "Hausa"
    },
    {
        "code": "he",
        "name": "Hebrew (modern)"
    },
    {
        "code": "hz",
        "name": "Herero"
    },
    {
        "code": "hi",
        "name": "Hindi"
    },
    {
        "code": "ho",
        "name": "Hiri Motu"
    },
    {
        "code": "hu",
        "name": "Hungarian"
    },
    {
        "code": "ia",
        "name": "Interlingua"
    },
    {
        "code": "id",
        "name": "Indonesian"
    },
    {
        "code": "ie",
        "name": "Interlingue"
    },
    {
        "code": "ga",
        "name": "Irish"
    },
    {
        "code": "ig",
        "name": "Igbo"
    },
    {
        "code": "ik",
        "name": "Inupiaq"
    },
    {
        "code": "io",
        "name": "Ido"
    },
    {
        "code": "is",
        "name": "Icelandic"
    },
    {
        "code": "it",
        "name": "Italian"
    },
    {
        "code": "iu",
        "name": "Inuktitut"
    },
    {
        "code": "ja",
        "name": "Japanese"
    },
    {
        "code": "jv",
        "name": "Javanese"
    },
    {
        "code": "kl",
        "name": "Kalaallisut, Greenlandic"
    },
    {
        "code": "kn",
        "name": "Kannada"
    },
    {
        "code": "kr",
        "name": "Kanuri"
    },
    {
        "code": "ks",
        "name": "Kashmiri"
    },
    {
        "code": "kk",
        "name": "Kazakh"
    },
    {
        "code": "km",
        "name": "Khmer"
    },
    {
        "code": "ki",
        "name": "Kikuyu, Gikuyu"
    },
    {
        "code": "rw",
        "name": "Kinyarwanda"
    },
    {
        "code": "ky",
        "name": "Kyrgyz"
    },
    {
        "code": "kv",
        "name": "Komi"
    },
    {
        "code": "kg",
        "name": "Kongo"
    },
    {
        "code": "ko",
        "name": "Korean"
    },
    {
        "code": "ku",
        "name": "Kurdish"
    },
    {
        "code": "kj",
        "name": "Kwanyama, Kuanyama"
    },
    {
        "code": "la",
        "name": "Latin"
    },
    {
        "code": "lb",
        "name": "Luxembourgish, Letzeburgesch"
    },
    {
        "code": "lg",
        "name": "Ganda"
    },
    {
        "code": "li",
        "name": "Limburgish, Limburgan, Limburger"
    },
    {
        "code": "ln",
        "name": "Lingala"
    },
    {
        "code": "lo",
        "name": "Lao"
    },
    {
        "code": "lt",
        "name": "Lithuanian"
    },
    {
        "code": "lu",
        "name": "Luba-Katanga"
    },
    {
        "code": "lv",
        "name": "Latvian"
    },
    {
        "code": "gv",
        "name": "Manx"
    },
    {
        "code": "mk",
        "name": "Macedonian"
    },
    {
        "code": "mg",
        "name": "Malagasy"
    },
    {
        "code": "ms",
        "name": "Malay"
    },
    {
        "code": "ml",
        "name": "Malayalam"
    },
    {
        "code": "mt",
        "name": "Maltese"
    },
    {
        "code": "mi",
        "name": "MÄori"
    },
    {
        "code": "mr",
        "name": "Marathi (MarÄá¹­hÄ«)"
    },
    {
        "code": "mh",
        "name": "Marshallese"
    },
    {
        "code": "mn",
        "name": "Mongolian"
    },
    {
        "code": "na",
        "name": "Nauru"
    },
    {
        "code": "nv",
        "name": "Navajo, Navaho"
    },
    {
        "code": "nb",
        "name": "Norwegian BokmÃ¥l"
    },
    {
        "code": "nd",
        "name": "North Ndebele"
    },
    {
        "code": "ne",
        "name": "Nepali"
    },
    {
        "code": "ng",
        "name": "Ndonga"
    },
    {
        "code": "nn",
        "name": "Norwegian Nynorsk"
    },
    {
        "code": "no",
        "name": "Norwegian"
    },
    {
        "code": "ii",
        "name": "Nuosu"
    },
    {
        "code": "nr",
        "name": "South Ndebele"
    },
    {
        "code": "oc",
        "name": "Occitan"
    },
    {
        "code": "oj",
        "name": "Ojibwe, Ojibwa"
    },
    {
        "code": "cu",
        "name": "Old Church Slavonic, Church Slavic, Church Slavonic, Old Bulgarian, Old Slavonic"
    },
    {
        "code": "om",
        "name": "Oromo"
    },
    {
        "code": "or",
        "name": "Oriya"
    },
    {
        "code": "os",
        "name": "Ossetian, Ossetic"
    },
    {
        "code": "pa",
        "name": "Panjabi, Punjabi"
    },
    {
        "code": "pi",
        "name": "PÄli"
    },
    {
        "code": "fa",
        "name": "Persian (Farsi)"
    },
    {
        "code": "pl",
        "name": "Polish"
    },
    {
        "code": "ps",
        "name": "Pashto, Pushto"
    },
    {
        "code": "pt",
        "name": "Portuguese"
    },
    {
        "code": "qu",
        "name": "Quechua"
    },
    {
        "code": "rm",
        "name": "Romansh"
    },
    {
        "code": "rn",
        "name": "Kirundi"
    },
    {
        "code": "ro",
        "name": "Romanian, [])"
    },
    {
        "code": "ru",
        "name": "Russian"
    },
    {
        "code": "sa",
        "name": "Sanskrit (Saá¹ská¹›ta)"
    },
    {
        "code": "sc",
        "name": "Sardinian"
    },
    {
        "code": "sd",
        "name": "Sindhi"
    },
    {
        "code": "se",
        "name": "Northern Sami"
    },
    {
        "code": "sm",
        "name": "Samoan"
    },
    {
        "code": "sg",
        "name": "Sango"
    },
    {
        "code": "sr",
        "name": "Serbian"
    },
    {
        "code": "gd",
        "name": "Scottish Gaelic; Gaelic"
    },
    {
        "code": "sn",
        "name": "Shona"
    },
    {
        "code": "si",
        "name": "Sinhala, Sinhalese"
    },
    {
        "code": "sk",
        "name": "Slovak"
    },
    {
        "code": "sl",
        "name": "Slovene"
    },
    {
        "code": "so",
        "name": "Somali"
    },
    {
        "code": "st",
        "name": "Southern Sotho"
    },
    {
        "code": "es",
        "name": "Spanish; Castilian"
    },
    {
        "code": "su",
        "name": "Sundanese"
    },
    {
        "code": "sw",
        "name": "Swahili"
    },
    {
        "code": "ss",
        "name": "Swati"
    },
    {
        "code": "sv",
        "name": "Swedish"
    },
    {
        "code": "ta",
        "name": "Tamil"
    },
    {
        "code": "te",
        "name": "Telugu"
    },
    {
        "code": "tg",
        "name": "Tajik"
    },
    {
        "code": "th",
        "name": "Thai"
    },
    {
        "code": "ti",
        "name": "Tigrinya"
    },
    {
        "code": "bo",
        "name": "Tibetan Standard, Tibetan, Central"
    },
    {
        "code": "tk",
        "name": "Turkmen"
    },
    {
        "code": "tl",
        "name": "Tagalog"
    },
    {
        "code": "tn",
        "name": "Tswana"
    },
    {
        "code": "to",
        "name": "Tonga (Tonga Islands)"
    },
    {
        "code": "tr",
        "name": "Turkish"
    },
    {
        "code": "ts",
        "name": "Tsonga"
    },
    {
        "code": "tt",
        "name": "Tatar"
    },
    {
        "code": "tw",
        "name": "Twi"
    },
    {
        "code": "ty",
        "name": "Tahitian"
    },
    {
        "code": "ug",
        "name": "Uyghur, Uighur"
    },
    {
        "code": "uk",
        "name": "Ukrainian"
    },
    {
        "code": "ur",
        "name": "Urdu"
    },
    {
        "code": "uz",
        "name": "Uzbek"
    },
    {
        "code": "ve",
        "name": "Venda"
    },
    {
        "code": "vi",
        "name": "Vietnamese"
    },
    {
        "code": "vo",
        "name": "VolapÃ¼k"
    },
    {
        "code": "wa",
        "name": "Walloon"
    },
    {
        "code": "cy",
        "name": "Welsh"
    },
    {
        "code": "wo",
        "name": "Wolof"
    },
    {
        "code": "fy",
        "name": "Western Frisian"
    },
    {
        "code": "xh",
        "name": "Xhosa"
    },
    {
        "code": "yi",
        "name": "Yiddish"
    },
    {
        "code": "yo",
        "name": "Yoruba"
    },
    {
        "code": "za",
        "name": "Zhuang, Chuang"
    },
    {
        "code": "zu",
        "name": "Zulu"
    }
]

export const COUNTRIES = [
    {name: 'Afghanistan', code: 'AF'},
    {name: 'Åland Islands', code: 'AX'},
    {name: 'Albania', code: 'AL'},
    {name: 'Algeria', code: 'DZ'},
    {name: 'American Samoa', code: 'AS'},
    {name: 'AndorrA', code: 'AD'},
    {name: 'Angola', code: 'AO'},
    {name: 'Anguilla', code: 'AI'},
    {name: 'Antarctica', code: 'AQ'},
    {name: 'Antigua and Barbuda', code: 'AG'},
    {name: 'Argentina', code: 'AR'},
    {name: 'Armenia', code: 'AM'},
    {name: 'Aruba', code: 'AW'},
    {name: 'Australia', code: 'AU'},
    {name: 'Austria', code: 'AT'},
    {name: 'Azerbaijan', code: 'AZ'},
    {name: 'Bahamas', code: 'BS'},
    {name: 'Bahrain', code: 'BH'},
    {name: 'Bangladesh', code: 'BD'},
    {name: 'Barbados', code: 'BB'},
    {name: 'Belarus', code: 'BY'},
    {name: 'Belgium', code: 'BE'},
    {name: 'Belize', code: 'BZ'},
    {name: 'Benin', code: 'BJ'},
    {name: 'Bermuda', code: 'BM'},
    {name: 'Bhutan', code: 'BT'},
    {name: 'Bolivia', code: 'BO'},
    {name: 'Bosnia and Herzegovina', code: 'BA'},
    {name: 'Botswana', code: 'BW'},
    {name: 'Bouvet Island', code: 'BV'},
    {name: 'Brazil', code: 'BR'},
    {name: 'British Indian Ocean Territory', code: 'IO'},
    {name: 'Brunei Darussalam', code: 'BN'},
    {name: 'Bulgaria', code: 'BG'},
    {name: 'Burkina Faso', code: 'BF'},
    {name: 'Burundi', code: 'BI'},
    {name: 'Cambodia', code: 'KH'},
    {name: 'Cameroon', code: 'CM'},
    {name: 'Canada', code: 'CA'},
    {name: 'Cape Verde', code: 'CV'},
    {name: 'Cayman Islands', code: 'KY'},
    {name: 'Central African Republic', code: 'CF'},
    {name: 'Chad', code: 'TD'},
    {name: 'Chile', code: 'CL'},
    {name: 'China', code: 'CN'},
    {name: 'Christmas Island', code: 'CX'},
    {name: 'Cocos (Keeling) Islands', code: 'CC'},
    {name: 'Colombia', code: 'CO'},
    {name: 'Comoros', code: 'KM'},
    {name: 'Congo', code: 'CG'},
    {name: 'Congo, The Democratic Republic of the', code: 'CD'},
    {name: 'Cook Islands', code: 'CK'},
    {name: 'Costa Rica', code: 'CR'},
    {name: 'Cote D\'Ivoire', code: 'CI'},
    {name: 'Croatia', code: 'HR'},
    {name: 'Cuba', code: 'CU'},
    {name: 'Cyprus', code: 'CY'},
    {name: 'Czech Republic', code: 'CZ'},
    {name: 'Denmark', code: 'DK'},
    {name: 'Djibouti', code: 'DJ'},
    {name: 'Dominica', code: 'DM'},
    {name: 'Dominican Republic', code: 'DO'},
    {name: 'Ecuador', code: 'EC'},
    {name: 'Egypt', code: 'EG'},
    {name: 'El Salvador', code: 'SV'},
    {name: 'Equatorial Guinea', code: 'GQ'},
    {name: 'Eritrea', code: 'ER'},
    {name: 'Estonia', code: 'EE'},
    {name: 'Ethiopia', code: 'ET'},
    {name: 'Falkland Islands (Malvinas)', code: 'FK'},
    {name: 'Faroe Islands', code: 'FO'},
    {name: 'Fiji', code: 'FJ'},
    {name: 'Finland', code: 'FI'},
    {name: 'France', code: 'FR'},
    {name: 'French Guiana', code: 'GF'},
    {name: 'French Polynesia', code: 'PF'},
    {name: 'French Southern Territories', code: 'TF'},
    {name: 'Gabon', code: 'GA'},
    {name: 'Gambia', code: 'GM'},
    {name: 'Georgia', code: 'GE'},
    {name: 'Germany', code: 'DE'},
    {name: 'Ghana', code: 'GH'},
    {name: 'Gibraltar', code: 'GI'},
    {name: 'Greece', code: 'GR'},
    {name: 'Greenland', code: 'GL'},
    {name: 'Grenada', code: 'GD'},
    {name: 'Guadeloupe', code: 'GP'},
    {name: 'Guam', code: 'GU'},
    {name: 'Guatemala', code: 'GT'},
    {name: 'Guernsey', code: 'GG'},
    {name: 'Guinea', code: 'GN'},
    {name: 'Guinea-Bissau', code: 'GW'},
    {name: 'Guyana', code: 'GY'},
    {name: 'Haiti', code: 'HT'},
    {name: 'Heard Island and Mcdonald Islands', code: 'HM'},
    {name: 'Holy See (Vatican City State)', code: 'VA'},
    {name: 'Honduras', code: 'HN'},
    {name: 'Hong Kong', code: 'HK'},
    {name: 'Hungary', code: 'HU'},
    {name: 'Iceland', code: 'IS'},
    {name: 'India', code: 'IN'},
    {name: 'Indonesia', code: 'ID'},
    {name: 'Iran, Islamic Republic Of', code: 'IR'},
    {name: 'Iraq', code: 'IQ'},
    {name: 'Ireland', code: 'IE'},
    {name: 'Isle of Man', code: 'IM'},
    {name: 'Israel', code: 'IL'},
    {name: 'Italy', code: 'IT'},
    {name: 'Jamaica', code: 'JM'},
    {name: 'Japan', code: 'JP'},
    {name: 'Jersey', code: 'JE'},
    {name: 'Jordan', code: 'JO'},
    {name: 'Kazakhstan', code: 'KZ'},
    {name: 'Kenya', code: 'KE'},
    {name: 'Kiribati', code: 'KI'},
    {name: 'Korea, Democratic People\'S Republic of', code: 'KP'},
    {name: 'Korea, Republic of', code: 'KR'},
    {name: 'Kuwait', code: 'KW'},
    {name: 'Kyrgyzstan', code: 'KG'},
    {name: 'Lao People\'S Democratic Republic', code: 'LA'},
    {name: 'Latvia', code: 'LV'},
    {name: 'Lebanon', code: 'LB'},
    {name: 'Lesotho', code: 'LS'},
    {name: 'Liberia', code: 'LR'},
    {name: 'Libyan Arab Jamahiriya', code: 'LY'},
    {name: 'Liechtenstein', code: 'LI'},
    {name: 'Lithuania', code: 'LT'},
    {name: 'Luxembourg', code: 'LU'},
    {name: 'Macao', code: 'MO'},
    {name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK'},
    {name: 'Madagascar', code: 'MG'},
    {name: 'Malawi', code: 'MW'},
    {name: 'Malaysia', code: 'MY'},
    {name: 'Maldives', code: 'MV'},
    {name: 'Mali', code: 'ML'},
    {name: 'Malta', code: 'MT'},
    {name: 'Marshall Islands', code: 'MH'},
    {name: 'Martinique', code: 'MQ'},
    {name: 'Mauritania', code: 'MR'},
    {name: 'Mauritius', code: 'MU'},
    {name: 'Mayotte', code: 'YT'},
    {name: 'Mexico', code: 'MX'},
    {name: 'Micronesia, Federated States of', code: 'FM'},
    {name: 'Moldova, Republic of', code: 'MD'},
    {name: 'Monaco', code: 'MC'},
    {name: 'Mongolia', code: 'MN'},
    {name: 'Montserrat', code: 'MS'},
    {name: 'Morocco', code: 'MA'},
    {name: 'Mozambique', code: 'MZ'},
    {name: 'Myanmar', code: 'MM'},
    {name: 'Namibia', code: 'NA'},
    {name: 'Nauru', code: 'NR'},
    {name: 'Nepal', code: 'NP'},
    {name: 'Netherlands', code: 'NL'},
    {name: 'Netherlands Antilles', code: 'AN'},
    {name: 'New Caledonia', code: 'NC'},
    {name: 'New Zealand', code: 'NZ'},
    {name: 'Nicaragua', code: 'NI'},
    {name: 'Niger', code: 'NE'},
    {name: 'Nigeria', code: 'NG'},
    {name: 'Niue', code: 'NU'},
    {name: 'Norfolk Island', code: 'NF'},
    {name: 'Northern Mariana Islands', code: 'MP'},
    {name: 'Norway', code: 'NO'},
    {name: 'Oman', code: 'OM'},
    {name: 'Pakistan', code: 'PK'},
    {name: 'Palau', code: 'PW'},
    {name: 'Palestinian Territory, Occupied', code: 'PS'},
    {name: 'Panama', code: 'PA'},
    {name: 'Papua New Guinea', code: 'PG'},
    {name: 'Paraguay', code: 'PY'},
    {name: 'Peru', code: 'PE'},
    {name: 'Philippines', code: 'PH'},
    {name: 'Pitcairn', code: 'PN'},
    {name: 'Poland', code: 'PL'},
    {name: 'Portugal', code: 'PT'},
    {name: 'Puerto Rico', code: 'PR'},
    {name: 'Qatar', code: 'QA'},
    {name: 'Reunion', code: 'RE'},
    {name: 'Romania', code: 'RO'},
    {name: 'Russian Federation', code: 'RU'},
    {name: 'RWANDA', code: 'RW'},
    {name: 'Saint Helena', code: 'SH'},
    {name: 'Saint Kitts and Nevis', code: 'KN'},
    {name: 'Saint Lucia', code: 'LC'},
    {name: 'Saint Pierre and Miquelon', code: 'PM'},
    {name: 'Saint Vincent and the Grenadines', code: 'VC'},
    {name: 'Samoa', code: 'WS'},
    {name: 'San Marino', code: 'SM'},
    {name: 'Sao Tome and Principe', code: 'ST'},
    {name: 'Saudi Arabia', code: 'SA'},
    {name: 'Senegal', code: 'SN'},
    {name: 'Serbia and Montenegro', code: 'CS'},
    {name: 'Seychelles', code: 'SC'},
    {name: 'Sierra Leone', code: 'SL'},
    {name: 'Singapore', code: 'SG'},
    {name: 'Slovakia', code: 'SK'},
    {name: 'Slovenia', code: 'SI'},
    {name: 'Solomon Islands', code: 'SB'},
    {name: 'Somalia', code: 'SO'},
    {name: 'South Africa', code: 'ZA'},
    {name: 'South Georgia and the South Sandwich Islands', code: 'GS'},
    {name: 'Spain', code: 'ES'},
    {name: 'Sri Lanka', code: 'LK'},
    {name: 'Sudan', code: 'SD'},
    {name: 'Suriname', code: 'SR'},
    {name: 'Svalbard and Jan Mayen', code: 'SJ'},
    {name: 'Swaziland', code: 'SZ'},
    {name: 'Sweden', code: 'SE'},
    {name: 'Switzerland', code: 'CH'},
    {name: 'Syrian Arab Republic', code: 'SY'},
    {name: 'Taiwan, Province of China', code: 'TW'},
    {name: 'Tajikistan', code: 'TJ'},
    {name: 'Tanzania, United Republic of', code: 'TZ'},
    {name: 'Thailand', code: 'TH'},
    {name: 'Timor-Leste', code: 'TL'},
    {name: 'Togo', code: 'TG'},
    {name: 'Tokelau', code: 'TK'},
    {name: 'Tonga', code: 'TO'},
    {name: 'Trinidad and Tobago', code: 'TT'},
    {name: 'Tunisia', code: 'TN'},
    {name: 'Turkey', code: 'TR'},
    {name: 'Turkmenistan', code: 'TM'},
    {name: 'Turks and Caicos Islands', code: 'TC'},
    {name: 'Tuvalu', code: 'TV'},
    {name: 'Uganda', code: 'UG'},
    {name: 'Ukraine', code: 'UA'},
    {name: 'United Arab Emirates', code: 'AE'},
    {name: 'United Kingdom', code: 'GB'},
    {name: 'United States', code: 'US'},
    {name: 'United States Minor Outlying Islands', code: 'UM'},
    {name: 'Uruguay', code: 'UY'},
    {name: 'Uzbekistan', code: 'UZ'},
    {name: 'Vanuatu', code: 'VU'},
    {name: 'Venezuela', code: 'VE'},
    {name: 'Viet Nam', code: 'VN'},
    {name: 'Virgin Islands, British', code: 'VG'},
    {name: 'Virgin Islands, U.S.', code: 'VI'},
    {name: 'Wallis and Futuna', code: 'WF'},
    {name: 'Western Sahara', code: 'EH'},
    {name: 'Yemen', code: 'YE'},
    {name: 'Zambia', code: 'ZM'},
    {name: 'Zimbabwe', code: 'ZW'}
]

export const INTEGRATIONS = {
    woo: 'WooCommerce',
    custom: 'Custom'
};

export const FLAG_CODE_TABLE = {
    AF: "Afghanistan",
    AL: "Albania",
    DZ: "Algeria",
    AS: "American Samoa",
    AD: "Andorra",
    AO: "Angola",
    AI: "Anguilla",
    AQ: "Antarctica",
    AG: "Antigua and Barbuda",
    AR: "Argentina",
    AM: "Armenia",
    AW: "Aruba",
    AU: "Australia",
    AT: "Austria",
    AZ: "Azerbaijan",
    BS: "Bahamas",
    BH: "Bahrain",
    BD: "Bangladesh",
    BB: "Barbados",
    BY: "Belarus",
    BE: "Belgium",
    BZ: "Belize",
    BJ: "Benin",
    BM: "Bermuda",
    BT: "Bhutan",
    BO: "Bolivia",
    BA: "Bosnia and Herzegovina",
    BW: "Botswana",
    BV: "Bouvet Island",
    BR: "Brazil",
    IO: "British Indian Ocean Territory",
    BN: "Brunei",
    BG: "Bulgaria",
    BF: "Burkina Faso",
    BI: "Burundi",
    KH: "Cambodia",
    CM: "Cameroon",
    CA: "Canada",
    CV: "Cape Verde",
    KY: "Cayman Islands",
    CF: "Central African Republic",
    TD: "Chad",
    CL: "Chile",
    CN: "China",
    CX: "Christmas Island",
    CC: "Cocos (Keeling) Islands",
    CO: "Colombia",
    KM: "Comoros",
    CG: "Congo",
    CK: "Cook Islands",
    CR: "Costa Rica",
    HR: "Croatia",
    CU: "Cuba",
    CY: "Cyprus",
    CZ: "Czech Republic",
    DK: "Denmark",
    DJ: "Djibouti",
    DM: "Dominica",
    DO: "Dominican Republic",
    TP: "East Timor",
    EC: "Ecuador",
    EG: "Egypt",
    SV: "El Salvador",
    GQ: "Equatorial Guinea",
    ER: "Eritrea",
    EE: "Estonia",
    ET: "Ethiopia",
    FK: "Falkland Islands",
    FO: "Faroe Islands",
    FJ: "Fiji Islands",
    FI: "Finland",
    FR: "France",
    GF: "French Guiana",
    PF: "French Polynesia",
    TF: "French Southern territories",
    GA: "Gabon",
    GM: "Gambia",
    GE: "Georgia",
    DE: "Germany",
    GH: "Ghana",
    GI: "Gibraltar",
    GR: "Greece",
    GL: "Greenland",
    GD: "Grenada",
    GP: "Guadeloupe",
    GU: "Guam",
    GT: "Guatemala",
    GG: "Guernsey",
    GN: "Guinea",
    GW: "Guinea-Bissau",
    GY: "Guyana",
    HT: "Haiti",
    HM: "Heard Island and McDonald Islands",
    VA: "Holy See (Vatican City State)",
    HN: "Honduras",
    HK: "Hong Kong",
    HU: "Hungary",
    IS: "Iceland",
    IN: "India",
    ID: "Indonesia",
    IR: "Iran",
    IQ: "Iraq",
    IE: "Ireland",
    IM: "Isle of Man",
    IL: "Israel",
    IT: "Italy",
    CI: "Ivory Coast",
    JM: "Jamaica",
    JP: "Japan",
    JE: "Jersey",
    JO: "Jordan",
    KZ: "Kazakhstan",
    KE: "Kenya",
    KI: "Kiribati",
    KW: "Kuwait",
    KG: "Kyrgyzstan",
    LA: "Laos",
    LV: "Latvia",
    LB: "Lebanon",
    LS: "Lesotho",
    LR: "Liberia",
    LY: "Libyan Arab Jamahiriya",
    LI: "Liechtenstein",
    LT: "Lithuania",
    LU: "Luxembourg",
    MO: "Macao",
    MK: "North Macedonia",
    MG: "Madagascar",
    MW: "Malawi",
    MY: "Malaysia",
    MV: "Maldives",
    ML: "Mali",
    MT: "Malta",
    MH: "Marshall Islands",
    MQ: "Martinique",
    MR: "Mauritania",
    MU: "Mauritius",
    YT: "Mayotte",
    MX: "Mexico",
    FM: "Micronesia, Federated States of",
    MD: "Moldova",
    MC: "Monaco",
    MN: "Mongolia",
    ME: "Montenegro",
    MS: "Montserrat",
    MA: "Morocco",
    MZ: "Mozambique",
    MM: "Myanmar",
    NA: "Namibia",
    NR: "Nauru",
    NP: "Nepal",
    NL: "Netherlands",
    NC: "New Caledonia",
    NZ: "New Zealand",
    NI: "Nicaragua",
    NE: "Niger",
    NG: "Nigeria",
    NU: "Niue",
    NF: "Norfolk Island",
    KP: "North Korea",
    GB: "United Kingdom of Great Britain and Northern Ireland",
    MP: "Northern Mariana Islands",
    NO: "Norway",
    OM: "Oman",
    PK: "Pakistan",
    PW: "Palau",
    PS: "Palestine",
    PA: "Panama",
    PG: "Papua New Guinea",
    PY: "Paraguay",
    PE: "Peru",
    PH: "Philippines",
    PN: "Pitcairn",
    PL: "Poland",
    PT: "Portugal",
    PR: "Puerto Rico",
    QA: "Qatar",
    RE: "Reunion",
    RO: "Romania",
    RU: "Russian Federation",
    RW: "Rwanda",
    SH: "Saint Helena",
    KN: "Saint Kitts and Nevis",
    LC: "Saint Lucia",
    PM: "Saint Pierre and Miquelon",
    VC: "Saint Vincent and the Grenadines",
    WS: "Samoa",
    SM: "San Marino",
    ST: "Sao Tome and Principe",
    SA: "Saudi Arabia",
    SN: "Senegal",
    RS: "Serbia",
    SC: "Seychelles",
    SL: "Sierra Leone",
    SG: "Singapore",
    SK: "Slovakia",
    SI: "Slovenia",
    SB: "Solomon Islands",
    SO: "Somalia",
    ZA: "South Africa",
    GS: "South Georgia and the South Sandwich Islands",
    KR: "South Korea",
    SS: "South Sudan",
    ES: "Spain",
    LK: "Sri Lanka",
    SD: "Sudan",
    SR: "Suriname",
    SJ: "Svalbard and Jan Mayen",
    SZ: "Swaziland",
    SE: "Sweden",
    CH: "Switzerland",
    SY: "Syria",
    TJ: "Tajikistan",
    TZ: "Tanzania",
    TH: "Thailand",
    CD: "The Democratic Republic of Congo",
    TL: "Timor-Leste",
    TG: "Togo",
    TK: "Tokelau",
    TO: "Tonga",
    TT: "Trinidad and Tobago",
    TN: "Tunisia",
    TR: "Turkey",
    TM: "Turkmenistan",
    TC: "Turks and Caicos Islands",
    TV: "Tuvalu",
    UG: "Uganda",
    UA: "Ukraine",
    AE: "United Arab Emirates",
    US: "United States",
    UM: "United States Minor Outlying Islands",
    UY: "Uruguay",
    UZ: "Uzbekistan",
    VU: "Vanuatu",
    VE: "Venezuela",
    VN: "Vietnam",
    VG: "Virgin Islands, British",
    VI: "Virgin Islands, U.S.",
    WF: "Wallis and Futuna",
    EH: "Western Sahara",
    YE: "Yemen",
    ZM: "Zambia",
    ZW: "Zimbabwe",
};

const CUSTOM_SDK_CODE = '<script async src="https://affibear.com/scripts/sdk.js?shop=[site_id]"></script>';

const CUSTOM_SDK_CODE2 = "<script>\n" +
    "    affiConversion({\n" +
    "        orderId: 0, // Recommended - We'll generate one for you if you don't specify it.\n" +
    "        total: 0, // Required - Total price of the purchase (incl. taxes/discounts).\n" +
    "        subTotal: 0, // Optional - The price of the product.\n" +
    "        email: 'example@email.com', // Optional: The customer's email.\n" +
    "        // Optional: Extra metadata - you can save internal IDs here.\n" +
    "        metadata: {\n" +
    "            name: 'Samuel'\n" +
    "        }\n" +
    "    });\n" +
    "</script>";

export { CUSTOM_SDK_CODE, CUSTOM_SDK_CODE2 };