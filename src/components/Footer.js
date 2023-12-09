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
    IconButton,
} from "@chakra-ui/react";
import {FaEnvelope, FaInstagram, FaTwitter, FaYoutube} from "react-icons/fa";

import NextLink from 'next/link';

const SocialButton = ({ children, label, href }) => {
    return (
        <IconButton size='sm' rounded='full' aria-label={label} as='a' href={href} icon={children} />
    );
};

const ListHeader = ({ children }) => {
    return (
        <Text fontWeight='medium' fontSize='lg' mb={2}>
            {children}
        </Text>
    );
};

const ListItem = ({ text, href }) => {
    return (
        <Link color='inherit' variant='jumpy' as={NextLink} href={href}>
            {text}
        </Link>
    );
};

const Footer = () => {
    return (
        <Box as='footer' zIndex={1337} py={8}>
            <Container maxW={1280} py={8}>
                <SimpleGrid
                    templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 2fr' }}
                    spacing={8}>
                    <Stack spacing={6}>
                        <Box>
                            <Text>logo here</Text>
                        </Box>

                        <Text fontSize='sm'>© 2023 Affibear. All rights reserved</Text>

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
                        <ListHeader>Company</ListHeader>

                        <ListItem text='Pricing' href='#'/>
                        <ListItem text='Blog' href='#'/>
                        <ListItem text='Contact us' href='#'/>
                        <ListItem text='About us' href='#'/>
                    </VStack>

                    <VStack alignItems='start'>
                        <ListHeader>Support</ListHeader>

                        <ListItem text='Help Center' href='#'/>
                        <ListItem text='Terms of Service' href='#'/>
                        <ListItem text='Privacy Policy' href='#'/>
                        <ListItem text='Service Status' href='#'/>
                    </VStack>

                    <VStack alignItems='start'>
                        <ListHeader>Stay up to date</ListHeader>

                        <HStack>
                            <Input placeholder='Your email address' />

                            <IconButton
                                colorScheme='brand'
                                aria-label='Subscribe'
                                icon={<FaEnvelope />}
                            />
                        </HStack>
                    </VStack>
                </SimpleGrid>
            </Container>
        </Box>
    );
};

export default Footer;