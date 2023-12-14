import {theme as orig, extendTheme, withDefaultColorScheme, withDefaultProps} from '@chakra-ui/react'
import e, { mode } from '@chakra-ui/theme-tools';

import { Open_Sans, Rubik } from 'next/font/google';

// noinspection ES6UnusedImports
import CheckboxIcon from '@/components/helpers/CheckboxIcon';
import { MultiSelectTheme } from 'chakra-multiselect';

const font = Rubik({ subsets: ['latin'] });
const bodyFont = Open_Sans({ subsets: ['latin'] });

const theme = {
    config: {
        initialColorMode: 'light',
        cssVarPrefix: 'ck',
        useSystemColorMode: false
    },
    styles: {
        global: (props) => ({
            body: {
                background: mode('white', '#181C27')(props),
                color: mode('#3b3f5c', '#d1d4db')(props)
            }
        })
    },
    fonts: {
        heading: `${font.style.fontFamily}, sans-serif`,
        body: `${bodyFont.style.fontFamily}, sans-serif`
    },
    breakpoints: {
        base: '0em', // 0px
        sm: '30em', // ~480px
        md: '48em', // ~768px
        lg: '62em', // ~992px
        xl: '80em', // ~1280px
        '2xl': '96em', // ~1536px
    },
    colors: {
        brand: {
            50: '#F0FFF4',
            100: '#C6F6D5',
            200: '#9AE6B4',
            300: '#68D391',
            400: '#5ebe83',
            500: '#5ebe83',
            600: '#53a974'
        }
    },
    components: {
        Button: {
            baseStyle: {
                borderRadius: '9999px'
            },
            variants: {
                solid: (props) => {
                    const { colorScheme: c } = props;

                    switch (c) {
                        case 'brand':
                            return {
                                color: 'unset',
                                bg: 'brand.100',
                                _hover: {
                                    bg: 'brand.200',
                                    _disabled: {
                                        bg: 'brand.100'
                                    }
                                },
                                _active: { bg: 'brand.300' }
                            };
                        case 'red':
                            return {
                                color: 'unset',
                                bg: 'red.100',
                                _hover: {
                                    bg: 'red.200',
                                    _disabled: {
                                        bg: 'red.100'
                                    }
                                },
                                _active: { bg: 'red.300' }
                            };

                    }
                }
            },
            sizes: {
                xl: {
                    h: '64px',
                    fontSize: 'xl',
                    px: '32px',
                }
            }
        },
        Link: {
            baseStyle: {
                color: 'Highlight'
            },
            variants: {
                jumpy: {
                    opacity: 0.75,
                    fontWeight: 'medium',
                    _hover: {
                        opacity: 1,
                        transform: 'scale(1.05, 1.05)',
                        textDecoration: 'none'
                    }
                }
            }
        },
        Badge: {
            baseStyle: {
                px: 2,
                py: 1,
                borderRadius: '15px'
            }
        },
        Alert: {
            variants: {
                solid: (props) => {
                    const { colorScheme: c } = props;

                    const container = {
                        bg: '#fff',
                        color: '#3b3f5c'
                    }

                    switch (c) {
                        case 'green':
                            container.bg = 'green.200';
                            break;
                        case 'red':
                            container.bg = 'red.200';
                            break;
                        case 'blue':
                            container.bg = '#fff';
                            break;
                        default:
                            return orig.components.Alert.variants.solid(props)
                    }

                    return {
                        container,
                        icon: {
                            color: '#3b3f5c'
                        },
                        spinner: {
                            color: '#3b3f5c'
                        },
                    }
                }
            }
        },
        MultiSelect: {
            ...MultiSelectTheme,
            baseStyle: (props) => {
                return {
                    list: {
                        bg: mode('#fff', 'gray.700')(props),
                        boxShadow: mode('sm', 'dark-lg')(props),
                        color: 'inherit',
                        w: 'full',
                        py: '2',
                        zIndex: 1,
                        borderRadius: 'md',
                        borderWidth: '1px',
                        maxH: '64',
                        overflowY: 'auto',
                    },
                    selectedList: {
                        display: 'flex', flex: 1, flexWrap: 'wrap', alignItems: 'center', my: '2'
                    },
                    item: {
                        cursor: 'pointer',
                        transition: 'background 50ms ease-out',
                        _focus: { bg: mode('gray.50', 'whiteAlpha.100')(props), boxShadow: 'outline' },
                        _active: { bg: mode('gray.50', 'whiteAlpha.100')(props) },
                        _expanded: { bg: mode('gray.50', 'whiteAlpha.100')(props) },
                        _selected: { bg: mode('gray.100', 'whiteAlpha.300')(props) },
                        _disabled: { opacity: .4, cursor: 'not-allowed' }
                    },
                    selectedItem: {
                        variant: 'subtle', colorScheme: props.colorScheme
                    },
                    button: {
                        variant: 'ghost',
                        colorScheme: props.colorScheme
                    },
                    actionGroup: { display: 'flex', alignItems: 'center' },
                    control: { h: 'auto', minW: 72, pr: 1 },
                    input: { bgColor: 'transparent', appearance: 'none', flex: 1, outline: 0 },
                    divider: { display: 'inline', h: 'full', border: 0, borderColor: 'inherit', my: 1, opacity: .8 },
                    label: { display: 'block', textAlign: 'start' }
                }
            }
        },
        Table: {
            variants: {
                striped: {
                    baseStyle: {
                        maxH: '80vh',
                        overflowY: 'scroll'
                    },
                    tbody: {
                        tr: {
                            _odd: {
                                td: {
                                    background: 'unset'
                                }
                            },
                            _even: {
                                td: {
                                    background: 'gray.50'
                                }
                            }
                        }
                    }
                }
            }
        },
        Tag: {
            baseStyle: {
                colorScheme: 'brand'
            }
        }
    }
};

const Theme = extendTheme(
    withDefaultColorScheme({
        colorScheme: 'brand',
        components: ['Tag']
    }),
    theme
);

export default Theme;