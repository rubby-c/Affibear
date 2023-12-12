'use client';

import React from 'react';

import {
    Box, Button,
    HStack, Icon,
    Modal,
    ModalContent,
    ModalOverlay, Tag, Text,
    useDisclosure,
    useMediaQuery,
    VStack
} from "@chakra-ui/react";

import Header from "../../Header";
import Footer from "../../Footer";
import NextLink from "next/link";
import {RiBearSmileLine} from "react-icons/ri";
import {BiCog, BiDollarCircle, BiScreenshot, BiSolidCoupon, BiStats, BiUser} from "react-icons/bi";
import {BsEnvelope, BsPercent} from "react-icons/bs";

const NavCategory = ({ children }) => {
    return (
        <Text my={4} ms={4} w='100%' textAlign='start' letterSpacing='1.25px' color='gray.500'>{children}</Text>
    );
};

const NavButton = ({ icon, href, children }) => {
    return (
        <Button w='100%' variant='ghost' fontWeight='normal'
                leftIcon={<Icon fontSize='xl' as={icon} mr={2} />} justifyContent='start' color='var(--body-text)'
                as={NextLink} href={href}>
            {children}
        </Button>
    )
}

const SidebarContent = ({ payouts, pc, isDisabled }) => {
    return (
        <Box px={pc ? 4 : 8} py={8}>
            <HStack w='100%' justifyContent='center' mb={8}>
                <RiBearSmileLine fontSize={28}/>
                <Text fontWeight='medium' letterSpacing='1.5px' fontSize='xl'>Affibear</Text>
            </HStack>

            <VStack w='100%' pointerEvents={isDisabled ? 'none' : 'unset'} opacity={isDisabled ? 0.5 : 1}>
                <NavButton icon={BiStats} href='/dashboard'>Dashboard</NavButton>
                <NavButton icon={BiUser} href='/dashboard/affiliates'>Affiliates</NavButton>

                <NavCategory>General</NavCategory>

                <NavButton icon={BiCog} href='/dashboard/website'>Website</NavButton>
                <NavButton icon={BiDollarCircle} href='/dashboard/payouts'>
                    <HStack spacing={4}>
                        <Text>Payouts</Text>
                        {payouts > 0 && <Tag colorScheme='red'>{payouts}</Tag>}
                    </HStack>
                </NavButton>

                <NavCategory>Setup</NavCategory>

                <NavButton icon={BsPercent} href='/dashboard/commissions'>Commissions</NavButton>
                <NavButton icon={BiScreenshot} href='/dashboard/pages'>Pages</NavButton>
                <NavButton icon={BsEnvelope} href='/dashboard/emails'>Emails</NavButton>
            </VStack>
        </Box>
    );
};

const DashboardLayout = ({ data, children }) => {
    const [isComputer] = useMediaQuery('(min-width: 976px)', {
        ssr: true,
        fallback: true
    });

    const sidebar = useDisclosure();

    React.useEffect(() => {
        localStorage.setItem('affibear-currency', data.currency);
    },[]);

    return (
        <>
            <HStack minH='100%' bg='var(--bg)' alignItems='stretch' spacing={0}>
                {isComputer ? <Box w='250px' bg='#fff' zIndex={1} boxShadow='sm'>
                        <SidebarContent payouts={data.pendingPayouts} pc={isComputer} isDisabled={data.websites.length === 0} />
                    </Box>
                    : <Modal preserveScrollBarGap size='sm' motionPreset='slideInBottom'
                             isOpen={sidebar.isOpen} onClose={sidebar.onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <SidebarContent />
                        </ModalContent>
                    </Modal>
                }

                <VStack w='100%' h='100%' spacing={0}>
                    <Header data={data} pc={isComputer} sidebar={sidebar} />

                    <Box as='main' w='100%' p={4}>
                        {children}
                    </Box>
                </VStack>
            </HStack>

            <Footer />
        </>
    )
};

export default DashboardLayout;