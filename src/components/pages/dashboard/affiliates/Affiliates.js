'use client'

import React from 'react';

import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Button,
    HStack,
    Text,
    useDisclosure,
    Input,
    InputGroup,
    InputRightAddon,
    Link,
    VStack,
    Checkbox,
    useToast,
    Tag,
    Popover,
    PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverArrow
} from '@chakra-ui/react'

import {
    FaArrowRight,
    FaEnvelope,
    FaPlus,
    FaTrash,
    FaWrench
} from "react-icons/fa";

import { BiUser } from "react-icons/bi";

import NextLink from "next/link";
import { useRouter } from "next/navigation";

import EasyModal from "@/components/elements/EasyModal";
import Api from "@/lib/api";
import TitleCard from "@/components/elements/TitleCard";
import TitleOption from "@/components/elements/TitleOption";
import { TOAST_OPTIONS } from "@/lib/constants";
import { GetNumber } from "@/lib/helpers";
import SearchBar from "@/components/elements/SearchBar";
import NoSsr from "@/components/helpers/NoSsr";

const Affiliates = ({ data }) => {
    const router = useRouter();

    const [list, setList] = React.useState(data);
    const [results, setResults] = React.useState(data);

    const toast = useToast(TOAST_OPTIONS);
    const invite = useDisclosure(), add = useDisclosure();

    const [state, setState] = React.useState({
        affiliate: {
            name: '',
            email: '',
            password: '',
            promos: true
        },
        invite: {
            name: '',
            email: ''
        },
        currentAffiliateId: null
    });

    async function AddAffiliate() {
        const res = await Api.post('/website/affiliates', state.affiliate);
        if (res.status === 200) {
            toast({
                title: 'Success',
                status: 'success',
                description: 'You have added a new affiliate.'
            });

            setState({
                ...state,
                affiliate: {
                    ...state.affiliate,
                    name: '',
                    email: '',
                    password: ''
                }
            });

            const arr = [...list];
            arr.push(res.data);

            setList(arr);
            setResults(arr);

            add.onClose();
        } else {
            toast({
                title: 'Error',
                status: 'error',
                description: res.data.status ?? res.data
            });
        }
    }
    async function DeleteAffiliate(id) {
        const res = await Api.delete(`/website/affiliates?id=${id}`);

        if (res.status === 200) {
            toast({
                title: 'Success',
                status: 'success',
                description: 'You have deleted an affiliate.'
            });

            const arr = [...list].filter(i => i.id !== id);
            setList(arr);
            setResults(arr);
        } else {
            toast({
                title: 'Error',
                status: 'error',
                description: res.data.status ?? res.data
            });
        }
    }

    const [search, setSearch] = React.useState('');

    React.useEffect(() => {
        const arr = list.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
        setResults(arr);
    }, [search]);

    return (
        <>
            <TitleCard icon={<BiUser/>} title='Affiliates' item={<HStack>
                <Button size='sm' leftIcon={<FaEnvelope/>} onClick={invite.onOpen}>Invite</Button>
                <Button size='sm' leftIcon={<FaPlus/>} onClick={add.onOpen}>Manual Add</Button>
            </HStack>}>
                <SearchBar state={search} setState={setSearch} />

                {results.length > 0 ? <TableContainer>
                        <Table my={4} variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Clicks</Th>
                                    <Th>Conversions</Th>
                                    <Th>Revenue</Th>
                                    <Th>Commission</Th>
                                    <Th isNumeric>Actions</Th>
                                </Tr>
                            </Thead>

                            <Tbody>
                                {list.map((item, idx) => {
                                    const stats = GetStats(item.stats);

                                    return (
                                        <Tr key={idx}>
                                            <Td>{item.name}</Td>
                                            <Td>{stats.clicks}</Td>
                                            <Td>{stats.conversions}</Td>
                                            <Td>
                                                <NoSsr>
                                                    {GetNumber(stats.revenue)}
                                                </NoSsr>
                                            </Td>

                                            <Td>
                                                <HStack>
                                                    <Text>{item.commissions.amount}{item.commissions.type === 0 ? '%' : '$'}</Text>
                                                    <Tag>{item.commissions.type === 0 ? 'Percentage' : 'Fixed'}</Tag>
                                                </HStack>
                                            </Td>

                                            <Td>
                                                <HStack justifyContent='end'>
                                                    <Button onClick={() => router.push(`/dashboard/affiliates/${item.id}`)} size='sm' leftIcon={<FaWrench/>}>Manage</Button>

                                                    <Popover placement='bottom-end' isLazy size='sm'>
                                                        <PopoverTrigger>
                                                            <Button size='sm' leftIcon={<FaTrash/>}
                                                                    colorScheme='red'>Delete</Button>
                                                        </PopoverTrigger>

                                                        <PopoverContent w='200px'>
                                                            <PopoverArrow/>
                                                            <PopoverHeader>Are you sure?</PopoverHeader>
                                                            <PopoverBody>
                                                                <Button w='100%'
                                                                        onClick={() => DeleteAffiliate(item.id)}
                                                                        size='sm' leftIcon={<FaTrash/>}
                                                                        colorScheme='red'>
                                                                    Delete
                                                                </Button>
                                                            </PopoverBody>
                                                        </PopoverContent>
                                                    </Popover>
                                                </HStack>
                                            </Td>
                                        </Tr>
                                    );
                                })}
                            </Tbody>
                        </Table>
                    </TableContainer>
                    : search.length > 0 ? <Text>No results could be found.</Text> : <Text>You don&apos;t have any affiliates.</Text>}
            </TitleCard>

            <EasyModal title='Invite Affiliate' isOpen={invite.isOpen} onClose={invite.onClose}
                       footer={<Text mt={4}>You can <Link as={NextLink} href='#'>customize your email</Link> template.</Text>}>
                <VStack w='100%' alignItems='stretch'>
                    <TitleOption title='Full Name'>
                        <Input value={state.invite.name} placeholder='John Doe'
                               onChange={e => setState({...state, invite: {...state.invite, name: e.target.value}})}/>
                    </TitleOption>

                    <TitleOption title='Email'>
                        <InputGroup>
                            <Input value={state.invite.email} placeholder='example@email.com'
                                   onChange={e => setState({...state, email: {...state.email, name: e.target.value}})}/>

                            <InputRightAddon as={Button} rightIcon={<FaArrowRight/>}>
                                Send
                            </InputRightAddon>
                        </InputGroup>
                    </TitleOption>
                </VStack>
            </EasyModal>

            <EasyModal title='Add Affiliate' isOpen={add.isOpen} onClose={add.onClose}
                       footer={<Button onClick={AddAffiliate} leftIcon={<FaPlus/>}>Add</Button>}>
                <VStack w='100%' alignItems='stretch'>
                    <TitleOption title='Full Name'>
                        <Input value={state.affiliate.name} placeholder='John Doe'
                               onChange={e => setState({
                                   ...state,
                                   affiliate: {...state.affiliate, name: e.target.value}
                               })}/>
                    </TitleOption>

                    <TitleOption title='Email'>
                        <Input value={state.affiliate.email} type='email' placeholder='example@email.com'
                               onChange={e => setState({
                                   ...state,
                                   affiliate: {...state.affiliate, email: e.target.value}
                               })}/>
                    </TitleOption>

                    <TitleOption title='Password'>
                        <Input value={state.affiliate.password} type='password' placeholder='********'
                               onChange={e => setState({
                                   ...state,
                                   affiliate: {...state.affiliate, password: e.target.value}
                               })}/>
                    </TitleOption>

                    <TitleOption title='Promotional emails'
                                 subtitle='Send your affiliates emails about discounts and sales.'>
                        <Checkbox isChecked={state.affiliate.promos}
                                  onChange={e => setState({
                                      ...state,
                                      affiliate: {...state.affiliate, promos: e.target.checked}
                                  })}>Enabled</Checkbox>
                    </TitleOption>
                </VStack>
            </EasyModal>
        </>
    );
};

function GetStats(data) {
    if (data === null) {
        return null;
    }

    let clicks = 0;
    let conversions = 0;
    let revenue = 0;

    for (let i = 0; i < data.length; i++) {
        clicks += data[i].clicks;
        conversions += data[i].orders.length;
        revenue += data[i].orders
            .reduce((a, b) => a + b.products.reduce((x, y) => x + y.total, 0), 0);
    }

    return {
        clicks,
        conversions,
        revenue
    };
}

export default Affiliates;