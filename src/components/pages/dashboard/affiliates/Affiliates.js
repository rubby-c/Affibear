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
    PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverArrow, Select
} from '@chakra-ui/react'

import {
    FaArrowRight,
    FaEnvelope,
    FaPlus,
    FaTrash, FaUser,
    FaWrench
} from "react-icons/fa";

import { BiUser } from "react-icons/bi";

import NextLink from "next/link";
import { useRouter } from "next/navigation";

import EasyModal from "@/components/elements/EasyModal";
import Api, {SendRequest} from "@/lib/api";
import TitleCard from "@/components/elements/TitleCard";
import TitleOption from "@/components/elements/TitleOption";
import { TOAST_OPTIONS } from "@/lib/constants";
import {GetCurrency, GetNumber} from "@/lib/helpers";
import SearchBar from "@/components/elements/SearchBar";
import NoSsr from "@/components/helpers/NoSsr";
import {BsEnvelope} from "react-icons/bs";
import Pagination, {PerPage} from "@/components/elements/Pagination";

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
            ignoreProducts: false,
            promos: true
        },
        invite: {
            templates: [],
            templateId: '',
            name: '',
            email: ''
        },
        currentAffiliateId: null
    });

    async function AddAffiliate() {
        await SendRequest(
            toast,
            'post',
            `/website/affiliates`,
            state.affiliate,
            (res) => {
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
            },
            null,
            {
                success: {
                    title: 'Success',
                    description: 'You have added a new affiliate.'
                },
                error: (err) => ({
                    title: `Error`,
                    description: err.status ?? err
                }),
                loading: {
                    title: 'Adding..',
                    description: 'Let\'s see how they\'re gonna do!'
                }
            }
        );
    }

    async function DeleteAffiliate(id) {
        await SendRequest(
            toast,
            'delete',
            `/website/affiliates?id=${id}`,
            null,
            () => {
                const arr = [...list].filter(i => i.id !== id);
                setList(arr);
                setResults(arr);
            },
            null,
            {
                success: {
                    title: 'Success',
                    description: 'You have deleted an affiliate.'
                },
                error: (err) => ({
                    title: `Error`,
                    description: err.status ?? err
                }),
                loading: {
                    title: 'Deleting..',
                    description: 'Sad to see you go..'
                }
            }
        );
    }

    const [search, setSearch] = React.useState('');

    React.useEffect(() => {
        const query = search.toLowerCase();

        const arr = list.filter(i => i.name.toLowerCase().includes(query) || i.coupon.toLowerCase().includes(query));
        if (arr.length > 0) {
            setPage(1);
        }

        setResults(arr);
    }, [search]);

    async function InviteAffiliate() {
        if (state.invite.templateId === '' || state.invite.name === '' || state.invite.email === '')
            return;

        await SendRequest(
            toast,
            'post',
            `/website/invite-affiliate`,
            {
                templateId: state.invite.templateId,
                name: state.invite.name,
                email: state.invite.email
            },
            () => setState({ ...state, invite: { ...state.invite, name: '', email: '' }}),
            null,
            {
                success: {
                    title: 'Success',
                    description: `You have invited ${state.invite.name}.`
                },
                error: (err) => ({
                    title: `Error`,
                    description: err.status ?? err
                }),
                loading: {
                    title: 'Inviting..',
                    description: 'Sending a nice email 🤗'
                }
            }
        );
    }

    const [page, setPage] = React.useState(1);

    return (
        <>
            <TitleCard icon={<BiUser />} title='Affiliates' item={<HStack>
                <Button size='sm' leftIcon={<FaEnvelope />} onClick={async () => {
                    const res = await Api.get('/website/email-templates');

                    const defaults = res.data.templates.find(i => i.name === 'Default Affiliate Invitation');

                    if (defaults !== undefined) {
                        setState({
                            ...state,
                            invite: {
                                ...state.invite,
                                templateId: defaults.id,
                                templates: res.data.templates.map(i => ({ id: i.id, name: i.name }))
                            }
                        });
                    } else {
                        setState({ ...state, invite: { ...state.invite, templates: res.data.templates.map(i => ({ id: i.id, name: i.name }))}});
                    }

                    invite.onOpen();
                }}>Invite</Button>
                <Button size='sm' leftIcon={<FaPlus/>} onClick={add.onOpen}>Manual Add</Button>
            </HStack>}>
                <SearchBar placeholder='Search by name or coupon..' state={search} setState={setSearch} />

                {results.length > 0 ? <TableContainer>
                        <Table my={4} variant='striped'>
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
                                {results.slice((page - 1) * PerPage, page * PerPage).map((item, idx) => {
                                    const stats = GetStats(item.stats);

                                    return (
                                        <Tr key={idx}>
                                            <Td>
                                                <HStack spacing={3}>
                                                    <Text fontWeight='medium'>{item.name}</Text>
                                                    <Tag fontWeight='medium'>{item.coupon}</Tag>
                                                </HStack>
                                            </Td>
                                            <Td>{stats.clicks}</Td>
                                            <Td>{stats.conversions}</Td>
                                            <Td>
                                                <NoSsr>
                                                    {GetNumber(stats.commissions)}
                                                </NoSsr>
                                            </Td>

                                            <Td>
                                                <HStack>
                                                    <Text>{item.commissions.amount}{item.commissions.type === 0 ? '%' : GetCurrency()}</Text>
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

                        <Pagination list={results} page={page} setPage={setPage} />
                    </TableContainer>
                    : search.length > 0 ? <Text>No results could be found.</Text> : <Text>You don&apos;t have any affiliates.</Text>}
            </TitleCard>

            <EasyModal icon={BsEnvelope} title='Invite affiliates' isOpen={invite.isOpen} onClose={invite.onClose}>
                <VStack w='100%' alignItems='stretch' spacing={4}>
                    <TitleOption title='Template' subtitle='Invitation emails only support the {AFFILIATE_NAME} variable.'>
                        <Select placeholder='Select a template' value={state.invite.templateId} onChange={e => setState({ ...state, invite: { ...state.invite, templateId: e.target.value }})}>
                            {state.invite.templates.map((template, idx) => <option key={idx} value={template.id}>{template.name}</option>)}
                        </Select>
                    </TitleOption>

                    <TitleOption title='Full Name' subtitle='Leave empty if you do not have a {AFFILIATE_NAME} variable set up in your email template.'>
                        <Input value={state.invite.name} placeholder='John Doe'
                               onChange={e => setState({...state, invite: {...state.invite, name: e.target.value}})}/>
                    </TitleOption>

                    <TitleOption title='Email'>
                        <InputGroup>
                            <Input value={state.invite.email} placeholder='example@email.com'
                                   onChange={e => setState({ ...state, invite: { ...state.invite, email: e.target.value }})}/>

                            <InputRightAddon onClick={InviteAffiliate} as={Button} rightIcon={<FaArrowRight/>}>
                                Send
                            </InputRightAddon>
                        </InputGroup>
                    </TitleOption>
                </VStack>
            </EasyModal>

            <EasyModal icon={FaUser} title='Create affiliate' isOpen={add.isOpen} onClose={add.onClose}
                       footer={<Button onClick={AddAffiliate} leftIcon={<FaPlus/>}>Create</Button>}>
                <VStack spacing={4} w='100%' alignItems='stretch'>
                    <TitleOption title='Name'>
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

                    <TitleOption title='Ignore Products'
                                 subtitle='Product-specific commission rates override set affiliate commission rates.'>
                        <Checkbox isChecked={state.affiliate.ignoreProducts}
                                  onChange={e => setState({
                                      ...state,
                                      affiliate: { ...state.affiliate, ignoreProducts: e.target.checked }
                                  })}>Enabled</Checkbox>
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
    let commissions = 0;

    for (let i = 0; i < data.length; i++) {
        clicks += data[i].clicks;
        conversions += data[i].orders.length;
        commissions += data[i].orders.reduce((a, b) => a + b.commission, 0);
    }

    return {
        clicks,
        conversions,
        commissions
    };
}

export default Affiliates;