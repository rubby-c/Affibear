'use client';

import React from 'react';

import {
    Box,
    Button,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputRightAddon,
    Link,
    Text, useToast,
    VStack
} from '@chakra-ui/react';

import NextLink from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import Turnstile from "react-turnstile";
import Api, { TurnstileKey } from '../../../lib/api';

import { useRouter } from "next/navigation";

const Auth = () => {
    const router = useRouter();

    const toast = useToast({
        position: 'top',
        variant: 'notification',
        duration: 9000,
        isClosable: true
    });

    const [show, setShow] = React.useState(false);
    const [turnstile, setTurnstile] = React.useState(null);

    const [state, setState] = React.useState({
        email: '',
        password: ''
    });

    async function Process() {
        const res = await Api.post('/account/signin', {
            ...state,
            token: turnstile
        });

        if (res.status === 200) {
            await router.push('/dashboard');
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
        <Box bg='var(--gray-3)' position='relative' h='100vh'>
            <Box pos='absolute' top='50%' left='50%' transform='translate(-50%, -50%)'>
                <Box my={4} bg='#fff' boxShadow='lg' borderRadius='xl' p={8}>
                    <Heading textAlign='center' as='h1' fontWeight='medium'>Sign In</Heading>

                    <VStack my={4} w='400px' spacing={4}>
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

                        <Link alignSelf='end' as={NextLink} href='/reset'>Forgot password?</Link>
                    </VStack>

                    { /*

                                         <Turnstile
                        sitekey={TurnstileKey}
                        onVerify={(token) => {
                            setTurnstile(token);
                        }}
                    />

                     */ }


                    <Button onClick={Process} w='100%'>Continue</Button>
                </Box>

                <Text textAlign='center' fontWeight='medium'>New to Affibear? <Link as={NextLink} href='/signup' variant='jumpy'>Sign Up</Link></Text>
            </Box>
        </Box>
    );
};

export default Auth;