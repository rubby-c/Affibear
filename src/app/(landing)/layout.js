import { Providers } from '../providers';
import '../globals.css'

import {Box, Button, Grid, GridItem, HStack, Icon, Link, Text, VStack} from "@chakra-ui/react";
import NextLink from "next/link";

import { RiBearSmileLine } from "react-icons/ri";

export default function RootLayout({ children }) {
    return (
        <Box w='100%'>
            <Box p={4} w='100%' bg='var(--gray-4)' pos='sticky' top='0'>
                <HStack mx='auto' maxW={1280} as='header' justifyContent='space-between'>
                    <HStack>
                        <RiBearSmileLine fontSize={28} />
                        <Text fontWeight='medium' letterSpacing='1.5px' fontSize='xl'>Affibear</Text>
                    </HStack>

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

                    <Button colorScheme='brand'>Begin your affiliate program</Button>
                </HStack>
            </Box>

            <Box as='main' w='100%' h='100vh'>
                {children}
            </Box>
1
            <Box as='footer' h='400px' bg='blue'>

            </Box>
        </Box>
    )
}
