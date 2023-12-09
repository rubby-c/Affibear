'use client';

import React from 'react';
import {
    Box,
    Button, Checkbox, CheckboxIcon, HStack,
    IconButton, Image,
    Input,
    InputGroup,
    InputRightAddon,
    Link,
    SimpleGrid,
    Text, useToast,
    VStack
} from "@chakra-ui/react";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import NextLink from "next/link";
import { redirect } from "next/navigation";

import Turnstile from "react-turnstile";
import Api, { TurnstileKey } from "../../lib/api";

import { TOAST_OPTIONS } from "../../lib/constants";
import GoogleTranslate from "../../components/elements/GoogleTranslate";

const Page = ({ params }) => {
    const data = params.data;
    const toast = useToast(TOAST_OPTIONS);

    const [show, setShow] = React.useState(false);
    const [state, setState] = React.useState({
        prefix: data.prefix,
        name: '',
        email: '',
        password: '',
        promos: false,
        token: null
    });

    async function Signup() {
        const res = await Api.post('/affiliates/signup', state);

        if (res.status === 200) {
            await redirect('/analytics');
        }
        else {
            toast({
                title: 'We couldn\'t log you in.',
                status: 'error',
                description: res.data.status ?? res.data
            });
        }
    }

    async function Signin() {
        const res = await Api.post('/affiliates/signin', {
            email: state.email,
            password: state.password,
            token: state.token
        });

        if (res.status === 200) {
            await redirect('/analytics');
        }
        else {
            toast({
                title: 'We couldn\'t log you in.',
                status: 'error',
                description: res.data.status ?? res.data
            });
        }
    }

    return (
        <>
            {data.settings.allowTranslation && <GoogleTranslate />}

            {data.settings.useHeader && <Image mb={4} alignSelf='center' w='450px' src={data.settings.header ?? '/images/placeholders/no-header.png'} />}

            <SimpleGrid w={{ base: '100%', sm: '100%', md: '600px', lg: '750px', xl: '1000px' }} columns={{ base: 1, xl: 2 }} p={6} borderRadius='xl' bg='#fff' boxShadow='xl' spacing={4}>
                <div>
                    {data.settings.useLogo ? <HStack spacing={4} mb={4}>
                        <Image h='40px' aspectRatio='1 / 1' src={data.settings.logo} />
                        <Text fontWeight='medium' fontSize={48}>{data.name}</Text>
                    </HStack> : <Text mb={4} fontWeight='medium' fontSize={48}>{data.name}</Text>}

                    <Text fontSize={18}>{data.settings.description}</Text>

                    <VStack my={6} ps={6} alignItems='start' as='ul' fontSize={18}>
                        {data.settings.callouts.map((text, idx) => text.length > 0 && <li key={idx}>{text}</li>)}
                    </VStack>
                </div>

                <VStack w='100%'  spacing={6}>
                    <Input placeholder='Full Name' variant='flushed' value={state.name}
                           onChange={(e) => setState({...state, name: e.target.value})}/>

                    <Input placeholder='Email' variant='flushed' value={state.email}
                           onChange={(e) => setState({...state, email: e.target.value})}/>

                    <InputGroup variant='flushed'>
                        <Input placeholder='Password' type={show ? 'text' : 'password'} value={state.password}
                               onChange={(e) => setState({...state, password: e.target.value})}/>

                        <InputRightAddon borderBottom='1px solid' borderColor='inherit' bg='transparent' px={0}>
                            <IconButton onClick={() => setShow(!show)} variant='ghost' aria-label='Show / hide password'
                                        icon={show ? <FaEyeSlash /> : <FaEye />} />
                        </InputRightAddon>
                    </InputGroup>

                    <Checkbox isChecked={state.promos} onChange={(e) => setState({...state, promos: e.target.checked})} alignSelf='start'>
                        I would like to receive promotional emails.
                    </Checkbox>

                    <VStack w='100%'>
                        <Button onClick={Signup} w='100%'>Create Account</Button>

                        {data.settings.auth.google &&
                            <Button w='100%' leftIcon={<FcGoogle/>}>Login with Google</Button>}
                    </VStack>

                    <Text fontSize={12}>By signing up you agree to Affibear&apos;s <Link as={NextLink} href='/terms'>Terms of Service</Link> and <Link as={NextLink} href='/privacy'>Privacy Policy</Link>.</Text>
                </VStack>
            </SimpleGrid>

            <HStack w='100%' justifyContent='space-between'>
                <Link href={data.url}>&lt; Back to {data.name}</Link>
                <Text fontSize={14} fontWeight='medium' my={4}>Powered by Affibear 🐻</Text>
            </HStack>
        </>
    );
};

export default Page;