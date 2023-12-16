import React from 'react';
import {
    Text,
    Box,
    Container,
    SimpleGrid,
    Stack,
    Link,
    VStack,
    HStack,
    Input,
    IconButton, Tooltip,
} from "@chakra-ui/react";
import { FaEnvelope, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

import NextLink from 'next/link';

const SocialButton = ({ children, label, href }) => {
    return (
        <IconButton size='sm' rounded='full' aria-label={label} as='a' href={href} icon={children} />
    );
};

const ListHeader = ({ children }) => {
    return (
        <Text className={headerFont.className} fontWeight='medium' fontSize='lg' mb={2}>
            {children}
        </Text>
    );
};

const ListItem = ({ text, href }) => {
    return (
        <Link className={itemFont.className} color='inherit' variant='jumpy' as={NextLink} href={href}>
            {text}
        </Link>
    );
};

import Logo from '../../public/logo-name.svg'
import Image from "next/image";

import { Space_Mono, Roboto_Mono } from 'next/font/google';

const headerFont = Space_Mono({ subsets: ['latin'], weight: '700' });
const itemFont = Roboto_Mono({ subsets: ['latin'] })

const Footer = () => {
    return (
        <Box as='footer' zIndex={1337} p={8}>
            <Container maxW={1280} py={8}>
                <SimpleGrid
                    templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 2fr' }}
                    spacing={8}>
                    <Stack spacing={6}>
                        <Image width={200} src={Logo} alt='Afficone logo' />

                        <Text className={itemFont.className} fontSize='sm'>© 2023 Afficone. All rights reserved</Text>

                        <Stack direction='row' spacing={6}>
                            <SocialButton label='Twitter' href='#'>
                                <FaTwitter />
                            </SocialButton>

                            <SocialButton label='YouTube' href='#'>
                                <FaYoutube />
                            </SocialButton>

                            <SocialButton label='Instagram' href='#'>
                                <FaInstagram />
                            </SocialButton>
                        </Stack>
                    </Stack>

                    <VStack alignItems='start'>
                        <ListHeader>Products</ListHeader>

                        <ListItem text='Integrations' href='/integrations' />
                        <ListItem text='Features' href='/features' />
                        <ListItem text='Pricing' href='/pricing' />
                        <ListItem text='Updates' href='/updates' />
                    </VStack>

                    <VStack alignItems='start'>
                        <ListHeader>Company</ListHeader>

                        <ListItem text='Blog' href='/blog' />
                        <ListItem text='Contact us' href='/contact' />
                    </VStack>

                    <VStack alignItems='start'>
                        <ListHeader>Support</ListHeader>

                        <ListItem text='Help Center' href='https://afficone.freshdesk.com/support/home'/>
                        <ListItem text='Terms of Service' href='/terms'/>
                        <ListItem text='Privacy Policy' href='/privacy'/>
                        <ListItem text='Service Status' href='/status'/>
                    </VStack>
                </SimpleGrid>
            </Container>
        </Box>
    );
};

export default Footer;