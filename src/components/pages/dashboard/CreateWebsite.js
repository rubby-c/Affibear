'use client';

import React from 'react';
import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel,
    Box,
    Button,
    HStack, Icon,
    IconButton,
    Image,
    Input, InputGroup, InputLeftAddon, InputRightAddon,
    Link, OrderedList,
    SimpleGrid,
    Text,
    useToast,
    VStack
} from "@chakra-ui/react";

import { FaArrowRight, FaChevronLeft, FaWrench } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";

import { CUSTOM_SDK_CODE, CUSTOM_SDK_CODE2, TOAST_OPTIONS } from "@/lib/constants";

import { SendRequest } from "@/lib/api";
import hljs from "highlight.js";

import 'highlight.js/styles/atom-one-dark.css';

import EasyModalTitle from "@/components/elements/EasyModalTitle";
import TitleOption from "@/components/elements/TitleOption";
import TitleCard from "@/components/elements/TitleCard";
import { redirect } from "next/navigation";

const regex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,8}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g);

const CreateWebsite = ({ _data }) => {
    const toast = useToast(TOAST_OPTIONS);

    function SelectSDK(event) {
        const type = event.target.getAttribute('data-sdk');

        setState({
            ...state,
            prev: state.step,
            step: `${type}-sdk`
        });

        setSetup({
            ...setup,
            sdk: type
        });
    }

    // region Code Boxes

    const codesRef = React.useRef([]);

    React.useEffect(() => {
        for (let i = 0; i < codesRef.current.length; i++) {
            if (codesRef.current[i] === null) {
                continue;
            }

            if (codesRef.current[i].getAttribute('data-highlighted') === 'yes') {
                continue;
            }

            hljs.highlightElement(codesRef.current[i]);
        }
    });

    // endregion

    function GoTo(page) {
        setState({
            ...state,
            step: page
        });
    }

    const [state, setState] = React.useState({
        prev: 'start',
        step: 'start',
        loading: false,
        valid_url: false,
        url_success: false
    });

    const [setup, setSetup] = React.useState({
        name: 'Afficone',
        url: 'https://afficone.com',
        prefix: 'hello',
        token: null,
        sdk: null
    });

    async function CheckPrefix() {
        setState({
            ...state,
            loading: true
        });

        await SendRequest(
            toast,
            'get',
            `/integrations/check-prefix?prefix=${setup.prefix}&sdk=${setup.sdk}`,
            state,
            (res) => {
                setState({
                    ...state,
                    loading: false,
                    prev: state.step,
                    step: `select-sdk`
                });

                setSetup({
                    ...setup,
                    token: res.data.toString()
                })
            },
            () => setState({
                ...state,
                loading: false
            }),
            {
                success: {
                    title: `Success`,
                    description: 'This prefix is available!'
                },
                error: (err) => ({
                    title: `Error`,
                    description: err.status ?? err
                }),
                loading: {
                    title: 'Checking prefix..'
                }
            }
        );
    }

    async function FinishSetup() {
        setState({
            ...state,
            loading: true
        });

        await SendRequest(
            toast,
            'post',
            `/website/finish-setup`,
            setup,
            () => window.location.reload(),
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

    return (
        <>
            {(() => {
                switch(state.step) {
                    case 'start':
                        return (
                            <TitleCard icon={<FaWrench />} title='Create a new website' item={
                                <Button isDisabled={!setup.url.match(regex) || setup.name === '' && setup.prefix === ''}
                                        rightIcon={<FaArrowRight/>} onClick={CheckPrefix}>Continue</Button>
                            }>
                                <Text mb={4}>We&apos;re glad to have you here! Let&apos;s start off by setting up your website.</Text>

                                <VStack alignItems='stretch'>
                                    <Text>1. What&apos;s the name of your website?</Text>
                                    <Input mb={2} placeholder='Afficone' value={setup.name}
                                           onChange={(e) => setSetup({ ...setup, name: e.target.value })}/>

                                    <Text>2. Where is your website located?</Text>
                                    <Input mb={2} placeholder='https://afficone.com' value={setup.url}
                                           onChange={(e) => {
                                               setSetup({
                                                   ...setup,
                                                   url: e.target.value
                                               });

                                               setState({
                                                   ...state,
                                                   valid_url: e.target.value.match(regex) != null
                                               })
                                           }}/>

                                    <Text>3. Where would you like your affiliate dashboard to be?</Text>
                                    <InputGroup>
                                        <InputLeftAddon>https://</InputLeftAddon>
                                        <Input placeholder='prefix' value={setup.prefix}
                                               onChange={(e) => {
                                                   const result = e.target.value.replace(/[^a-z0-9]/gi, '');

                                                   setSetup({
                                                       ...setup,
                                                       prefix: result
                                                   });
                                               }} />

                                        <InputRightAddon>.afficone.com</InputRightAddon>
                                    </InputGroup>
                                    <Text fontSize={14}>* You <strong>cannot</strong> change this, but you can later use your domain.</Text>
                                </VStack>
                            </TitleCard>
                        );
                    case 'select-sdk':
                        return (
                            <TitleCard size='4xl' title={<EasyModalTitle title='🔧 Integration' icon={<FaChevronLeft />} onIconClick={() => GoTo('start')} ariaLabel='Go Back' />}>
                                <TitleOption title='What payment platform does your website use?'>
                                    <SimpleGrid my={6} columns={3} spacing={4}>
                                        <Button variant='ghost' h='90px' data-sdk='woo' onClick={SelectSDK}>
                                            <Image pointerEvents='none' src='/images/logos/woocommerce.svg' alt='WooCommerce' />
                                        </Button>

                                        <Button variant='ghost' h='90px' fontSize={24}
                                                data-sdk='custom' onClick={SelectSDK} leftIcon={<Icon as={FaWrench} mr={2}/>}>Custom SDK</Button>
                                    </SimpleGrid>
                                </TitleOption>
                            </TitleCard>
                        )
                    case 'woo-sdk':
                        return (
                            <TitleCard size='4xl' title={<EasyModalTitle title='🔧 WooCommerce Setup' icon={<FaChevronLeft />} onIconClick={() => GoTo('select-sdk')} ariaLabel='Go Back' />}>
                                <VStack alignItems='stretch' spacing={4}>
                                    <Text>1. Install the Afficone WordPress plugin.</Text>

                                    <span>
                                        <Link href='/plugins/wordpress-plugin.zip' download>
                                            Download Plugin
                                        </Link>
                                    </span>

                                    <Accordion mt={2} allowToggle>
                                        <AccordionItem>
                                            <AccordionButton cursor='pointer' w='100%' as={HStack} justifyContent='space-between'>
                                                <Text>Guide: How to install a WordPress plugin?</Text>

                                                <AccordionIcon />
                                            </AccordionButton>

                                            <AccordionPanel as={VStack} alignItems='stretch'>
                                                <li>Open the Plugins dropdown and select <strong>Add New Plugin</strong>.</li>
                                                <li>Press on the <strong>Upload Plugin</strong> button.</li>

                                                <Image my={2} src='/images/guides/wordpress_plugins_step1.png' />

                                                <li>Select and upload the .zip file.</li>

                                                <Image my={2} src='/images/guides/wordpress_plugins_step2.png' />
                                            </AccordionPanel>
                                        </AccordionItem>
                                    </Accordion>

                                    <HStack justifyContent='space-between'>
                                        <Text>2. Verify that the plugin is working properly.</Text>
                                        <Button isLoading={state.loading} onClick={FinishSetup} rightIcon={<FaMagnifyingGlass />}>Verify</Button>
                                    </HStack>

                                </VStack>
                            </TitleCard>
                        )
                    case 'custom-sdk':
                        return (
                            <TitleCard size='4xl' title={<HStack mb={4} spacing={4}>
                                <IconButton onClick={() => GoTo('select-sdk')} variant='ghost' size='sm' icon={<FaChevronLeft />} aria-label='Go Back' />
                                <Text fontSize={20} fontWeight='medium'>🔧 Custom SDK</Text>
                            </HStack>}>
                                <Text my={4}>Your unique Shoptoken is <Text as='span' fontWeight='semibold'>{setup.token ?? '...'}</Text>.</Text>

                                <Text>First off, import the Afficone SDK script on your website.</Text>

                                <Box as='pre' my={4}>
                                    <code className='html' ref={x => codesRef.current[0] = x}>{CUSTOM_SDK_CODE.replace('[site_id]', setup.token)}</code>
                                </Box>

                                <Text>We will automatically track leads and clicks from your affiliates. If you want to track conversions, please use the <code style={{ fontWeight: 'bold' }}>affiConversion</code> function with the appropriate parameters.</Text>

                                <Box as='pre' my={4}>
                                    <code className='html' ref={x => codesRef.current[1] = x}>{CUSTOM_SDK_CODE2}</code>
                                </Box>

                                <Text mb={8}>Once you&apos;ve imported the Afficone SDK, press the button below and we&apos;ll check if the script is on your website.</Text>

                                <HStack w='100%' justifyContent='space-between'>
                                    <Text>If you need a more complex integration, check out our <Link>API docs.</Link></Text>

                                    <Button onClick={FinishSetup} rightIcon={<Icon as={FaArrowRight} ms={2}/>}>Complete Setup</Button>
                                </HStack>
                            </TitleCard>
                        )
                }
            })()}
        </>
    );
};

export default CreateWebsite;