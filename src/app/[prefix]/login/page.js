'use client'

import React from 'react';
import {
    Badge,
    Box,
    Button, HStack,
    IconButton,
    Input,
    InputGroup,
    InputRightAddon,
    Link, Tag,
    Text,
    useToast,
    VStack
} from "@chakra-ui/react";

import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import Image from "next/image";
import NextLink from "next/link";

import Turnstile from "react-turnstile";
import Api, { TurnstileKey } from "../../../lib/api";
import { TOAST_OPTIONS } from "../../../lib/constants";
import { useRouter } from "next/navigation";

const Page = ({ params }) => {
    const data = params.data;

    const router = useRouter();
    const toast = useToast(TOAST_OPTIONS);

    const [show, setShow] = React.useState(false);
    const [state, setState] = React.useState({
        prefix: params.prefix,
        email: '',
        password: '',
        token: null
    });

    async function Signin() {
        const res = await Api.post('/affiliates/signin', state);

        if (res.status === 200) {
            await router.push('/analytics');
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
            {data.settings.logo && <Image src={data.settings.logo} alt='' />}

            <Box m={4} w={{ base: '100%', md: '400px' }} p={6} borderRadius='xl' bg='#fff' boxShadow='xl'>
                <HStack justifyContent='space-between' mb={4}>
                    <Text fontWeight='medium' fontSize={20}>{data.name}</Text>
                    <Tag>Affiliate Panel</Tag>
                </HStack>

                <VStack spacing={4}>
                    <Input placeholder='Email' variant='flushed' value={state.email}
                           onChange={(e) => setState({...state, email: e.target.value})}/>

                    <InputGroup variant='flushed'>
                        <Input placeholder='Password' type={show ? 'text' : 'password'} value={state.password}
                               onChange={(e) => setState({...state, password: e.target.value})}/>

                        <InputRightAddon borderBottom='1px solid' borderColor='inherit' bg='transparent' px={0}>
                            <IconButton onClick={() => setShow(!show)} variant='ghost' aria-label='Show / hide password'
                                        icon={show ? <FaEyeSlash/> : <FaEye/>}/>
                        </InputRightAddon>
                    </InputGroup>

                    <Link alignSelf='end' as={NextLink} href='/reset'>Forgot password?</Link>

                    {data.settings.auth.captcha && <Turnstile
                        appearance='always'
                        theme='light'
                        size='normal'
                        sitekey={TurnstileKey}
                        onVerify={(token) => {
                            setState({ ...state, token });
                        }}
                    />}

                    <VStack alignItems='stretch' w='100%'>
                        <Button onClick={Signin}>Sign In</Button>

                        {data.settings.auth.google &&
                            <Button leftIcon={<FcGoogle/>}>Login with Google</Button>}
                    </VStack>
                </VStack>
            </Box>
        </>

    );
};

export default Page;