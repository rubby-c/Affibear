'use client';

import React from 'react';
import {
    Avatar, AvatarBadge,
    Box, Button, Circle,
    HStack, Icon,
    IconButton,
    Menu, MenuButton, MenuDivider, MenuItem, MenuList,
    Popover,
    PopoverContent, PopoverFooter,
    PopoverHeader,
    PopoverTrigger, Tag,
    Text, useDisclosure, useToast, VStack
} from '@chakra-ui/react';

import { FaBell, FaCheck, FaChevronDown, FaChevronUp, FaPlus, FaSignOutAlt, FaWrench } from 'react-icons/fa';
import Api, { SendRequest } from '../lib/api';

import {TOAST_OPTIONS} from "@/lib/constants";
import { useRouter } from 'next/navigation'
import NextLink from 'next/link';
import Image from 'next/image'

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime);

import EasyModal from './elements/EasyModal';

import {TbGlobeFilled} from "react-icons/tb";

const Notification = ({ timestamp, important, text, link }) => {
    return (
        <HStack p={4} as={NextLink} href='/'>
            <FaCheck />

            <Box ms={4}>
                {important ? <HStack spacing={4}>
                    <Circle bg='red.300' />
                    <Text>{text}</Text>
                </HStack> : <Text>{text}</Text>}

                <Text fontSize={14} color='gray.500'>{dayjs(timestamp).fromNow()}</Text>
            </Box>
        </HStack>
    );
};

const Header = ({ data, pc, sidebar }) => {
    const router = useRouter();
    const toast = useToast(TOAST_OPTIONS);
    const shopSelect = useDisclosure();

    async function SwitchWebsite(id) {
        if (id === data.websites[0].id) {
            return;
        }

        await SendRequest(
            toast,
            'get',
            `/website/switch?id=${id}`,
            null,
            () => window.location.reload(),
            null,
            {
                success: {
                    title: `Success`,
                    description: ''
                },
                error: (err) => ({
                    title: `Failure`,
                    description: err.status ?? err
                }),
                loading: {
                    title: 'Switching..'
                }
            }
        );
    }

    async function SignOut() {
        await Api.get('/account/signout');
    }

    return (
        <HStack bg='#fff' boxShadow='sm' p={4} as='header' w='100%' justifyContent={pc ? 'end' : 'space-between'}>
            {!pc && <IconButton variant='ghost' onClick={sidebar.onToggle}
                                icon={sidebar.isOpen ? null : <FaChevronUp/>} isDisabled={sidebar.isOpen}
                                aria-label='Collapse Sidebar'/>}

            <HStack w='100%' justifyContent={data.websites.length > 0 && !data.websites[0].active ? 'space-between' : 'end'} spacing={8}>
                {data.websites.length > 0 && !data.websites[0].active && <NextLink href='/dashboard/website'>
                    <Tag colorScheme='red'>DISABLED</Tag>
                </NextLink>}

                <HStack spacing={8}>
                    <Popover size='sm'>
                        <PopoverTrigger>
                            <IconButton pos='relative' icon={
                                <>
                                    {data.notifications.flatMap(i => i.data).length > 0 && <Text fontWeight='medium' fontSize={11} w='20px' h='20px' lineHeight='20px' borderRadius='50%' pos='absolute' top='0' right='0' bg='red.200'>
                                        {data.notifications.flatMap(i => i.data).length}
                                    </Text>}

                                    <FaBell />
                                </>
                            } variant='ghost' aria-label='Notifications' />
                        </PopoverTrigger>

                        <PopoverContent size='sm'>
                            <PopoverHeader fontWeight='medium'>Notifications</PopoverHeader>

                            {data.notifications.flatMap(i => i.data).length > 0 ? <Box maxH={300} className='v-scroll'>
                                {data.notifications.map(entry => {
                                    return entry.data.map((n, idx) =>
                                        <Notification key={idx} timestamp={n.timestamp} title={entry.name} text={n.text} link={n.link} important={n.important}/>
                                    );
                                })}
                            </Box> : <Text textAlign='center' h='75px' lineHeight='75px'>You don&apos;t have any notifications!</Text>}

                            <PopoverFooter as={HStack} justifyContent='center'>
                                <Button variant='link'>Mark all as read</Button>
                            </PopoverFooter>
                        </PopoverContent>
                    </Popover>

                    <Menu isLazy>
                        <MenuButton>
                            <HStack spacing={4}>
                                <Avatar size='sm'>
                                    <AvatarBadge bg='brand.300' boxSize='1.5em'/>
                                </Avatar>

                                <Box textAlign='start'>
                                    <Text fontSize={16}>{data.name}</Text>
                                    <Text fontSize={14} color='gray.500'>Admin</Text>
                                </Box>

                                <Box mx={2}>
                                    <FaChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>

                        <MenuList>
                            <MenuItem as={Button} onClick={shopSelect.onOpen} borderRadius='none' justifyContent='space-between' rightIcon={<FaWrench />}>
                                Select Website
                            </MenuItem>

                            <MenuDivider/>

                            <MenuItem borderRadius='none' onClick={SignOut} as={Button} justifyContent='space-between' rightIcon={<FaSignOutAlt />}>
                                Sign Out
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </HStack>
            </HStack>

            <EasyModal icon={TbGlobeFilled} title='Select your website' isOpen={shopSelect.isOpen} onClose={shopSelect.onClose}
                       footer={
                           <Button size='sm' onClick={() => {
                               shopSelect.onClose();
                               router.push('/dashboard/create-website');
                           }} alignSelf='end' leftIcon={<FaPlus />}>Create new website</Button>
                       }>
                <VStack spacing={4}>
                    {data.websites.length > 0 && data.websites.filter(i => i.finished).map(website =>
                        <HStack onClick={() => SwitchWebsite(website.id)} p={2} key={website.id} w='100%'
                                variant='ghost' justifyContent='space-between' cursor='pointer'>
                            <HStack spacing={4}>
                                {website.iconUrl &&
                                    <Image loading='eager' width={35} height={35}
                                           src={website.iconUrl} alt={website.name}/>}

                                <div>
                                    <Text fontWeight='medium'>{website.name} ({website.token})</Text>
                                    <Text color='gray.700' fontSize={12}>{website.url}</Text>
                                </div>
                            </HStack>

                            <Icon color='gray.700' as={FaCheck} />
                        </HStack>
                    )}
                </VStack>
            </EasyModal>
        </HStack>
    );
};

export default Header;