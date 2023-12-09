'use client'

import React from 'react';

import {
    Box,
    Button, Checkbox, CheckboxIcon,
    Heading, HStack,
    IconButton,
    Input,
    InputGroup,
    InputRightAddon,
    Link,
    Text, useToast,
    VStack
} from '@chakra-ui/react';

import NextLink from "next/link";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import Turnstile from "react-turnstile";
import { useCookies } from "react-cookie";

import Api, { TurnstileKey } from "../../../lib/api";

const Auth = () => {
    const toast = useToast({
        position: 'top',
        variant: 'notification',
        duration: 9000,
        isClosable: true
    });

    const [show, setShow] = React.useState(false);
    const [turnstile, setTurnstile] = React.useState(null);
    const [cookies, setCookies] = useCookies(['Token', 'ref']);

    const [state, setState] = React.useState({
        name: '',
        email: '',
        businessName: '',
        businessWebsite: '',
        password: '',
        promos: false
    });

    async function Process() {
        const res = await Api.post('/account/signup', {
            ...state,
            token: turnstile,
            referral: cookies.ref
        });

        if (res.status === 200) {
            setCookies('Token', res.data, {
                path: '/',
                maxAge: 604800,
                sameSite: true
            });

            window.location.href = '/dashboard';
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
            <Box bg='var(--gray-3)' position='relative' h='100vh'>
                <Box pos='absolute' top='50%' left='50%' transform='translate(-50%, -50%)'>
                    <Box my={4} bg='#fff' boxShadow='lg' borderRadius='xl' p={8}>
                        <Heading textAlign='center' as='h1' fontWeight='medium'>Sign Up</Heading>

                        <VStack my={4} w='400px' spacing={6}>
                            <Input placeholder='Full Name' variant='flushed' value={state.name}
                                   onChange={(e) => setState({...state, name: e.target.value})}/>

                            <Input placeholder='Email' variant='flushed' value={state.email}
                                   onChange={(e) => setState({...state, email: e.target.value})}/>

                            <Input placeholder='Business Name' variant='flushed' value={state.businessName}
                                   onChange={(e) => setState({...state, businessName: e.target.value})}/>

                            <Input placeholder='Business Website' variant='flushed' value={state.businessWebsite}
                                   onChange={(e) => setState({...state, businessWebsite: e.target.value})}/>

                            <InputGroup variant='flushed'>
                                <Input placeholder='Password' type={show ? 'text' : 'password'} value={state.password}
                                       onChange={(e) => setState({...state, password: e.target.value})}/>

                                <InputRightAddon borderBottom='1px solid' borderColor='inherit' bg='transparent' px={0}>
                                    <IconButton onClick={() => setShow(!show)} variant='ghost' aria-label='Show / hide password'
                                                icon={show ? <FaEyeSlash /> : <FaEye />} />
                                </InputRightAddon>
                            </InputGroup>

                            <Checkbox isChecked={state.promos} onChange={(e) => setState({...state, promos: e.target.checked})} icon={<CheckboxIcon fontSize={10} />} alignSelf='start'>
                                I would like to receive promotional emails.
                            </Checkbox>
                        </VStack>

                        <Turnstile
                            sitekey={TurnstileKey}
                            onVerify={(token) => {
                                setTurnstile(token);
                            }}
                        />

                        <Button onClick={Process} mb={4} w='100%'>Create Account</Button>

                        <Text fontSize={12}>By signing up you agree to Affibear&apos;s <Link as={NextLink} href='/terms'>Terms of Service</Link> and <Link as={NextLink} href='/privacy'>Privacy Policy</Link>.</Text>
                    </Box>

                    <Text textAlign='center' fontWeight='medium'>Have an account? <Link as={NextLink} href='/signin' variant='jumpy'>Sign In</Link></Text>
                </Box>
            </Box>
        </>
    );
};

export default Auth;