import React from 'react';
import { Box, Button, HStack, Icon, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import Logo from "@/components/elements/Logo";
import { FaArrowRight } from "react-icons/fa";

const Header = () => {
    return (
        <Box zIndex={1337} bg='#fff' p={4} w='100%' pos='sticky' top='0'>
            <HStack mx='auto' maxW={1280} as='header' justifyContent='space-between'>
                <HStack spacing={8}>
                    <NextLink href='/'>
                        <Logo />
                    </NextLink>

                    <HStack fontSize='lg' spacing={8}>
                        <Link color='inherit' variant='jumpy' as={NextLink} href='/features'>
                            Features
                        </Link>

                        <Link color='inherit' variant='jumpy' as={NextLink} href='/pricing'>
                            Pricing
                        </Link>

                        <Link color='inherit' variant='jumpy' as={NextLink} href='/blog'>
                            Blog
                        </Link>

                        <Link color='inherit' variant='jumpy' as={NextLink} href='/signin'>
                            Log In
                        </Link>
                    </HStack>
                </HStack>

                <Button rightIcon={<Box ml={2}><FaArrowRight/></Box>} colorScheme='brand'>Setup Affiliate Program</Button>
            </HStack>
        </Box>
    );
};

export default Header;