'use client'

import React from 'react';
import Api from "../../../lib/api";
import {
    Button, Checkbox,
    HStack, Input,
    InputGroup, InputLeftAddon, InputRightAddon,
    Select, SimpleGrid,
    Text, useToast,
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
import { FaCog, FaTrash, FaWrench } from "react-icons/fa";

import { useRouter } from "next/navigation";
import Statistics from "@/components/elements/Statistics";
import TextStatistics from "@/components/elements/TextStatistics";

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

    const [defaults, setDefaults] = React.useState(_data);
    const [data, setData] = React.useState(_data);

    const [state, setState] = React.useState({
        loading: false
    });

    async function ChangePrefix() {
        const res = await Api.patch(`/website/prefix?prefix=${data.prefix}`);

        if (res.status === 200) {
            toast({
                title: 'Success',
                status: 'success',
                description: 'You have changed your website prefix.'
            });
        } else {
            toast({
                title: 'Error',
                status: 'error',
                description: res.data.status ?? res.data
            });
        }
    }

    async function Save() {
        setDefaults(data);

        const res = await Api.post('/website/modify', data);

        if (res.status === 200) {
            toast({
                title: 'Success',
                status: 'success',
                description: 'Your changes have been saved.'
            });

            localStorage.setItem('affibear-currency', data.settings.currency);
        } else {
            toast({
                title: 'Error',
                status: 'error',
                description: res.data.status ?? res.data
            });
        }
    }

    async function DeactivateWebsite() {
        const res = await Api.delete(`/website/deactivate?id=${data.id}`);
        if (res.status === 200) {
            toast({
                title: 'Success',
                status: 'success',
                description: `You have ${data.active ? 'disabled' : 'enabled'} this website.`
            });

            router.refresh();
        }
    }

    async function DeleteWebsite() {
        const res = await Api.delete(`/website/delete?id=${data.id}`);
        if (res.status === 200) {
            router.push('/dashboard');
        }
    }

    React.useEffect(() => {
        const id = setTimeout(async () => {
            if (defaults === null || JSON.stringify(defaults) === JSON.stringify(data)) {
                return;
            }

            await Save();
        }, 500);

        return () => clearTimeout(id);
    }, [data]);

    return (
        <SimpleGrid columns={{ base: 1, '2xl': 2 }} spacing={4}>
            <SimpleGrid spacing={4} columns={{ base: 1, md: 3 }}>
                <TextStatistics label='URL' value={data.url} />
                <TextStatistics label='Shop Token' value={data.token} />
                <TextStatistics label='Integration Type' value={INTEGRATIONS[data.sdk]} />
            </SimpleGrid>

            <TitleCard title='General' icon={<FaCog fontSize={20} />}>
                <VStack spacing={6} w='100%' alignItems='stretch'>
                    <TitleOption title='Website Prefix' category='Routing'>
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

                                <InputRightAddon>.affibear.com</InputRightAddon>
                            </InputGroup>

                            <Button onClick={ChangePrefix} px={8} leftIcon={<FaWrench />}>Change</Button>
                        </HStack>
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
                            <Button size='sm' colorScheme='red' leftIcon={<FaTrash />}>Permanently Delete</Button>
                        </HStack>
                    </TitleOption>
                </VStack>
            </TitleCard>
        </SimpleGrid>
    );
};

export default Website;