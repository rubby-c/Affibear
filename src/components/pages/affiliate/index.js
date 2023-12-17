'use client';

import React from 'react';
import Api from "@/lib/api";

import {
    Button,
    Checkbox,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputRightAddon,
    Link,
    Image,
    SimpleGrid,
    Text,
    useToast,
    VStack
} from "@chakra-ui/react";

import { default as NextImage } from 'next/image'

import NextLink from "next/link";
import { useRouter } from "next/navigation";

import { TOAST_OPTIONS } from "@/lib/constants";
import GoogleTranslate from "@/components/elements/GoogleTranslate";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import Logo from "../../../../public/logo-name.svg";
import AffiliateLayout from "@/components/elements/affiliate/AffiliateLayout";

const Index = ({ data }) => {
    const router = useRouter();
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
            router.push('/analytics');
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
            router.push('/analytics');
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
        <AffiliateLayout data={data}>
            {data.settings.allowTranslation && <GoogleTranslate />}

            {data.settings.useHeader && <Image alt='Affiliate Program Header' mb={4} w='450px' mx='auto' src={data.settings.header ?? '/images/placeholders/no-header.png'} />}

            <SimpleGrid w={{ base: '100%', sm: '100%', md: '600px', lg: '750px', xl: '1000px' }} columns={{ base: 1, xl: 2 }} p={6} borderRadius='xl' bg='#fff' boxShadow='xl' spacing={4}>
                <div>
                    {data.settings.useLogo ? <HStack spacing={4} mb={4}>
                        <Image h='40px' aspectRatio='1 / 1' src={data.settings.logo} alt='Affiliate Program Logo' />
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

                    <Text fontSize={12}>By signing up you agree to Afficone&apos;s <Link as={NextLink} href='/terms'>Terms of Service</Link> and <Link as={NextLink} href='/privacy'>Privacy Policy</Link>.</Text>
                </VStack>
            </SimpleGrid>

            <HStack my={4} w='100%' justifyContent='end'>
                <Text fontSize={14} fontWeight='bold'>Powered by</Text>

                <a href='https://afficone.com'>
                    <NextImage height={28} src={Logo} alt='Afficone Logo' />
                </a>
            </HStack>
        </AffiliateLayout>
    );
};

export default Index;