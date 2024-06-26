'use client'

import React from 'react';
import Api, {SendRequest} from "../../../lib/api";
import {
    Badge,
    Box,
    Button,
    Checkbox,
    HStack,
    IconButton, Image,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightAddon, Link, ListItem, OrderedList,
    Popover,
    PopoverArrow, PopoverBody,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    Select,
    SimpleGrid,
    Text, useDisclosure,
    useToast,
    VStack
} from "@chakra-ui/react";

import TitleCard from "../../elements/TitleCard";
import TitleOption from "../../elements/TitleOption";

import {
    Roboto,
    Open_Sans,
    Montserrat,
    Lato,
    Poppins,
    Inter,
    Raleway,
    Noto_Sans,
    Oswald,
    Merriweather
} from 'next/font/google'

import {CURRENCIES, INTEGRATIONS, LANGUAGES, TOAST_OPTIONS} from "../../../lib/constants";

import { FaMagnifyingGlass } from "react-icons/fa6";
import {FaBell, FaBullhorn, FaCode, FaCog, FaIdCard, FaLink, FaTrash, FaUser, FaWrench} from "react-icons/fa";

import { useRouter } from "next/navigation";
import Statistics from "@/components/elements/Statistics";
import TextStatistics from "@/components/elements/TextStatistics";
import EasyModal from "@/components/elements/EasyModal";
import EasyModalTitle from "@/components/elements/EasyModalTitle";

const roboto = Roboto({ subsets: ['latin'], weight: '400' })
const open_sans = Open_Sans({ subsets: ['latin'] });
const montserrat = Montserrat({ subsets: ['latin'] });
const lato = Lato({ subsets: ['latin'], weight: '400' });
const poppins = Poppins({ subsets: ['latin'], weight: '400' });
const inter = Inter({ subsets: ['latin'] });
const raleway = Raleway({ subsets: ['latin'] });
const noto_sans = Noto_Sans({ subsets: ['latin'], weight: '400' });
const oswald = Oswald({ subsets: ['latin'] });
const merriweather = Merriweather({ subsets: ['latin'], weight: '400' });

const fonts = [
    {
        name: 'Roboto',
        family: roboto.style.fontFamily
    },
    {
        name: 'Open Sans',
        family: open_sans.style.fontFamily
    },
    {
        name: 'Montserrat',
        family: montserrat.style.fontFamily
    },
    {
        name: 'Lato',
        family: lato.style.fontFamily
    },
    {
        name: 'Poppins',
        family: poppins.style.fontFamily
    },
    {
        name: 'Inter',
        family: inter.style.fontFamily
    },
    {
        name: 'Raleway',
        family: raleway.style.fontFamily
    },
    {
        name: 'Noto Sans',
        family: noto_sans.style.fontFamily
    },
    {
        name: 'Oswald',
        family: oswald.style.fontFamily
    },
    {
        name: 'Merriweather',
        family: merriweather.style.fontFamily
    }
]

const Website = ({ _data }) => {
    const router = useRouter();
    const toast = useToast(TOAST_OPTIONS);
    const customModal = useDisclosure();

    const [defaults, setDefaults] = React.useState(_data);
    const [data, setData] = React.useState(_data);

    async function ChangePrefix() {
        await SendRequest(
            toast,
            'patch',
            `/website/prefix?prefix=${data.prefix}`,
            null,
            null,
            null,
            {
                success: {
                    title: `Success`,
                    description: 'You have changed your website prefix.'
                },
                error: (err) => ({
                    title: `Error`,
                    description: err.status ?? err
                }),
                loading: {
                    title: 'Changing..'
                }
            }
        );
    }

    const [state, setState] = React.useState({
        customDomain: '',
        customDomainSet: false,
        announceLoading: false,
        loading: false
    });

    async function AnnounceCustomDomain() {
        setState({
            ...state,
            announceLoading: true
        });

        await SendRequest(
            toast,
            'patch',
            `/website/announce-custom-domain?host=${state.customDomain}`,
            null,
            () => setState({
                ...state,
                customDomainSet: true,
                announceLoading: false
            }),
            () => setState({
                ...state,
                announceLoading: false
            }),
            {
                success: {
                    title: `Success`
                },
                error: (err) => ({
                    title: `Error`,
                    description: err.status ?? err
                }),
                loading: {
                    title: 'Changing..'
                }
            }
        );
    }

    async function SetCustomDomain() {
        setState({
            ...state,
            loading: true
        });

        await SendRequest(
            toast,
            'patch',
            `/website/custom-domain?host=${state.customDomain}`,
            null,
            () => {
                if (typeof res.data !== 'string') {
                    location.reload();
                    return;
                }

                setState({
                    ...state,
                    customDomainSet: true,
                    loading: false
                });
            },
            () => setState({
                ...state,
                loading: false
            }),
            {
                success: {
                    title: `Success`,
                    description: ''
                },
                error: (err) => ({
                    title: `Error`,
                    description: err.status ?? err
                }),
                loading: {
                    title: 'Loading..'
                }
            }
        );
    }

    async function Save() {
        setDefaults(data);

        await SendRequest(
            toast,
            'post',
            `/website/modify`,
            data,
            () => localStorage.setItem('afficone-currency', data.settings.currency),
            null,
            {
                success: {
                    title: `Success`,
                    description: 'Your changes have been saved.'
                },
                error: (err) => ({
                    title: `Error`,
                    description: err.status ?? err
                }),
                loading: {
                    title: 'Loading..'
                }
            }
        );
    }

    async function DeactivateWebsite() {
        await SendRequest(
            toast,
            'patch',
            `/website/deactivate?id=${data.id}`,
            null,
            () => location.reload(),
            null,
            {
                success: {
                    title: `Success`,
                    description: data.active ? 'Your website has been deactivated.' : 'Your website has been activated.'
                },
                error: (err) => ({
                    title: `Error`,
                    description: err.status ?? err
                }),
                loading: {
                    title: data.active ? 'Deactivating..' : 'Activating..'
                }
            }
        );
    }

    async function DeleteWebsite() {
        await SendRequest(
            toast,
            'delete',
            `/website/delete`,
            null,
            () => router.push('/dashboard'),
            null,
            {
                success: {
                    title: `Success`,
                    description: 'Your website has been deleted.'
                },
                error: (err) => ({
                    title: `Error`,
                    description: err.status ?? err
                }),
                loading: {
                    title: 'Deleting..'
                }
            }
        );
    }

    React.useEffect(() => {
        const id = setTimeout(async () => {
            if (defaults === null || defaults.prefix !== data.prefix || JSON.stringify(defaults) === JSON.stringify(data)) {
                return;
            }

            await Save();
        }, 1000);

        return () => clearTimeout(id);
    }, [data]);

    return (
        <>
            <SimpleGrid mb={4} spacing={4} columns={{ base: 1, md: 3 }}>
                <TextStatistics icon={<FaLink />} label='URL' value={data.url} />
                <TextStatistics icon={<FaUser />} label='Shop Token' value={data.token} />
                <TextStatistics icon={<FaCode />} label='Integration Type' value={INTEGRATIONS[data.sdk]} />
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, '2xl': 2 }} spacing={4}>
                <TitleCard title='General' icon={<FaCog fontSize={20} />}>
                    <VStack spacing={6} w='100%' alignItems='stretch'>
                        <TitleOption title='Website Prefix' subtitle='Your affiliate registration / dashboard subdomain.' category='Routing'>
                            <HStack>
                                <InputGroup>
                                    <InputLeftAddon>https://</InputLeftAddon>
                                    <Input placeholder='prefix' value={data.prefix}
                                           onChange={(e) => {
                                               const result = e.target.value.replace(/[^a-z0-9]/gi, '');

                                               setData({
                                                   ...data,
                                                   prefix: result
                                               });
                                           }} />

                                    <InputRightAddon>.afficone.com</InputRightAddon>
                                </InputGroup>

                                <Button onClick={ChangePrefix} px={8} leftIcon={<FaWrench />}>Change</Button>
                            </HStack>
                        </TitleOption>

                        <TitleOption title='Custom Domain'>
                            <HStack spacing={3} mb={2}>
                                <Text>{data.customDomain.value ?? 'You don\'t have a custom domain.'}</Text>
                                {data.customDomain.testValue === null ? <Badge colorScheme='brand'>Working</Badge> : <Badge colorScheme='red'>Unfinished</Badge>}
                            </HStack>

                            <Button onClick={customModal.onOpen} size='sm' leftIcon={<FaLink />}>Setup</Button>
                        </TitleOption>

                        <TitleOption category='Registrations'>
                            <VStack alignItems='start' spacing={4}>
                                <Checkbox isChecked={data.settings.allowRegistrations}
                                          onChange={(e) => setData({ ...data, settings: { ...data.settings, allowRegistrations: e.target.checked }})}>
                                    Allow public registrations
                                </Checkbox>

                                <Checkbox isChecked={data.settings.automaticallyApprove}
                                          onChange={(e) => setData({ ...data, settings: { ...data.settings, automaticallyApprove: e.target.checked }})}>
                                    Automatically approve registrations
                                </Checkbox>
                            </VStack>
                        </TitleOption>

                        <TitleOption category='Content' title='Currency' subtitle='The currency your affiliates will be paid with.'>
                            <Select value={data.settings.currency} onChange={(e) => setData({ ...data, settings: { ...data.settings, currency: e.target.value }})}>
                                {CURRENCIES.map(item => <option key={item[0]} value={item[0]}>{item[0]} ({item[1]})</option>)}
                            </Select>
                        </TitleOption>

                        <TitleOption title='Font'>
                            <Select value={data.settings.font} onChange={(e) => setData({ ...data, settings: { ...data.settings, font: e.target.value }})}>
                                <optgroup label='Google Fonts'>
                                    {fonts.map(font => <option key={font.name} value={font.family} style={{ fontFamily: font.family }}>{font.name}</option>)}
                                </optgroup>
                            </Select>

                            <Text mt={2} fontWeight='semibold'>Example: <Text as='span' fontWeight='normal' fontFamily={`${data.settings.font}, sans-serif`}>The quick brown fox jumps over the lazy dog.</Text></Text>
                        </TitleOption>

                        <TitleOption title='Language'>
                            <Select value={data.settings.language} onChange={(e) => setData({ ...data, settings: { ...data.settings, language: e.target.value }})} mb={2}>
                                {LANGUAGES.map((lang, idx) => <option key={idx} value={lang.code}>{lang.name}</option>)}
                            </Select>

                            <Checkbox isChecked={data.settings.useTranslationWidget} onChange={(e) => setData({ ...data, settings: { ...data.settings, useTranslationWidget: e.target.checked }})}>
                                Use translation widget
                            </Checkbox>
                        </TitleOption>
                    </VStack>
                </TitleCard>

                <TitleCard title='Advanced' icon={<FaWrench fontSize={20} />}>
                    <VStack spacing={6} w='100%' alignItems='stretch'>
                        <TitleOption category='Legal Links' title='Terms and Conditions'>
                            <Input value={data.settings.legal.terms ?? ''} onChange={(e) => setData({ ...data, settings: { ...data.settings, legal: { ...data.settings.legal, terms: e.target.value }}})}
                                   placeholder={data.url + '/terms'} />
                        </TitleOption>

                        <TitleOption title='Privacy Policy'>
                            <Input value={data.settings.legal.privacy ?? ''} onChange={(e) => setData({ ...data, settings: { ...data.settings, legal: { ...data.settings.legal, privacy: e.target.value }}})}
                                   placeholder={data.url + '/privacy'} />
                        </TitleOption>

                        <TitleOption title='Contact'>
                            <Input value={data.settings.legal.contact ?? ''} onChange={(e) => setData({ ...data, settings: { ...data.settings, legal: { ...data.settings.legal, contact: e.target.value }}})}
                                   placeholder={data.url + '/contact'} />
                        </TitleOption>

                        <TitleOption category='Search Engine Optimization (advanced)' title='Title' subtitle='<title> tag value.'>
                            <Input value={data.settings.html.title} onChange={(e) => setData({ ...data, settings: { ...data.settings, html: { ...data.settings.html, title: e.target.value }}})}
                                   placeholder={data.name}  />
                        </TitleOption>

                        <TitleOption title='Description' subtitle='<meta name="description"> tag value.'>
                            <Input value={data.settings.html.description} onChange={(e) => setData({ ...data, settings: { ...data.settings, html: { ...data.settings.html, description: e.target.value }}})}
                                   placeholder={`Official ${data.name} affiliate campaign.`} />
                        </TitleOption>

                        <TitleOption title='Indexing' subtitle='Do you want search engines to index your affiliate sign-up page?'>
                            <Checkbox isChecked={data.settings.html.index}
                                      onChange={(e) => setData({ ...data, settings: { ...data.settings, html: { ...data.settings.html, index: e.target.checked }}})}>
                                Enabled
                            </Checkbox>
                        </TitleOption>

                        <TitleOption title='Manage website' subtitle='Deleting your website is permanent and we cannot undo it.'>
                            <HStack>
                                <Button onClick={DeactivateWebsite} size='sm'>{data.active ? 'Disable' : 'Enable'}</Button>

                                <Popover size='sm'>
                                    <PopoverTrigger>
                                        <Button size='sm' colorScheme='red' leftIcon={<FaTrash />}>Delete Website</Button>
                                    </PopoverTrigger>

                                    <PopoverContent w='auto'>
                                        <PopoverArrow />
                                        <PopoverHeader>Are you sure?</PopoverHeader>

                                        <Text p={2}>This action cannot be reversed.</Text>

                                        <PopoverBody>
                                            <Button w='100%' size='sm' leftIcon={<FaTrash/>} onClick={DeleteWebsite} colorScheme='red'>
                                                Delete
                                            </Button>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>
                            </HStack>
                        </TitleOption>
                    </VStack>
                </TitleCard>
            </SimpleGrid>

            <EasyModal icon={FaLink} title='Custom Domain' footer={<Button isLoading={state.loading} loadingText='Checking..' onClick={SetCustomDomain} isDisabled={!state.customDomainSet} leftIcon={<FaMagnifyingGlass />}>Check Validity</Button>}
                       size='4xl' isOpen={customModal.isOpen} onClose={customModal.onClose}>
                <TitleOption title='Remote host' subtitle='We recommend using a subdomain, but we also support full domains.'>
                    <InputGroup>
                        <InputLeftAddon>https://</InputLeftAddon>
                        <Input isDisabled={state.customDomainSet} placeholder={data.customDomain.value ?? 'affiliate.example.com'} value={state.customDomain}
                               onChange={(e) => {
                                   const result = e.target.value.replace(/[^a-z0-9.]/gi, '');

                                   setState({
                                       ...state,
                                       customDomain: result
                                   });
                               }} />
                    </InputGroup>
                </TitleOption>

                <OrderedList my={4} spacing={3}>
                    <ListItem>Login to your domain provider.</ListItem>
                    <ListItem>Add a new <Text as='span' fontWeight='medium'>CNAME</Text> DNS record pointing to <Text as='span' fontWeight='medium'>{data.prefix}.afficone.com</Text>.</ListItem>

                    <Image boxShadow='xs' src='/images/guides/custom_domain.png' />
                    <Text mb={4} fontSize={14} textAlign='center'>Example: Adding a DNS record in the Cloudflare dashboard.</Text>

                    <ListItem>
                        Announce your changes:
                        <Button ms={4} size='sm' leftIcon={<FaBullhorn />} isLoading={state.announceLoading} loadingText='Announcing..' onClick={AnnounceCustomDomain} isDisabled={state.customDomainSet} colorScheme={state.customDomainSet ? 'brand' : 'gray'}>Announce</Button>
                    </ListItem>

                    <ListItem>Wait a few minutes up to a few hours until your DNS records are updated.</ListItem>
                    <ListItem><Text as='span' fontWeight='bold'>Optional</Text>: You might have to disable bot protections and cache for that subdomain until we&apos;ve validated it.</ListItem>
                </OrderedList>
            </EasyModal>
        </>
    );
};

export default Website;