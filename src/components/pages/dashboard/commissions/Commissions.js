'use client';

import React from 'react';

import {
    Button,
    Checkbox,
    Divider,
    HStack,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    Radio,
    RadioGroup,
    Select,
    SimpleGrid,
    Tab,
    Table, TableContainer,
    TabList,
    TabPanel,
    TabPanels,
    Tabs, Tag,
    Tbody, Td,
    Text,
    Th,
    Thead, Tooltip,
    Tr, useDisclosure,
    useToast,
    VStack
} from "@chakra-ui/react";

import {BsCoin, BsPercent} from "react-icons/bs";

import TitleCard from "@/components/elements/TitleCard";
import TitleOption from "@/components/elements/TitleOption";
import WideTitleOption from "@/components/elements/WideTitleOption";

import Api from "@/lib/api";
import { TOAST_OPTIONS } from "@/lib/constants";
import {FaDollarSign, FaInfoCircle, FaPlus, FaTrash, FaWrench} from "react-icons/fa";
import NextLink from "next/link";
import EasyModal from "@/components/elements/EasyModal";
import IfElse from "@/components/helpers/IfElse";
import { GetCurrency } from "@/lib/helpers";
import Pagination, {PerPage} from "@/components/elements/Pagination";

const Commissions = ({ data }) => {
    const toast = useToast(TOAST_OPTIONS);

    const [commissions, setCommissions] = React.useState(data.commissions);
    const [royalties, setRoyalties] = React.useState(data.royalties);

    const [tab, setTab] = React.useState(0);
    const [affiliates, setAffiliates] = React.useState([]);

    const royaltyModal = useDisclosure();
    const [royalty, setRoyalty] = React.useState({
        affiliateId: '',
        amount: 10,
        type: 0,
        applyIndividual: true,
        ignoreProducts: true
    });

    async function SaveCommissions() {
        const res = await Api.post('/website/commissions', data.commissions);

        if (res.status === 200) {
            toast({
                title: 'Success',
                status: 'success',
                description: 'Your changes have been saved.'
            });
        } else {
            toast({
                title: 'Error',
                status: 'error',
                description: res.data.status ?? res.data
            });
        }
    }

    async function CreateRoyalty() {
        const res = await Api.post(`/website/royalties`, royalty);

        if (res.status === 200) {
            setRoyalties([...royalties, royalty]);

            toast({
                title: 'Success',
                status: 'success',
                description: 'You have successfully created a royalty.'
            });
        } else {
            toast({
                title: 'Error',
                status: 'error',
                description: res.data.status ?? res.data
            });
        }
    }

    async function DeleteRoyalty(id) {
        const res = await Api.delete(`/website/royalties?id=${id}`);

        if (res.status === 200) {
            setRoyalties(royalties.filter(i => i.id !== id));

            toast({
                title: 'Success',
                status: 'success',
                description: 'You have successfully deleted a royalty.'
            });
        } else {
            toast({
                title: 'Error',
                status: 'error',
                description: res.data.status ?? res.data
            });
        }
    }

    const [page, setPage] = React.useState(1);

    return (
        <>
            <TitleCard title='Commissions' icon={<BsPercent fontSize={20} />} item={
                <IfElse boolean={tab === 0}>
                    <Button onClick={SaveCommissions} leftIcon={<FaWrench />}>Save Changes</Button>
                    <Button onClick={async () => {
                        const res = await Api.get('/website/affiliate-emails');

                        setAffiliates(res.data);
                        royaltyModal.onOpen();
                    }} leftIcon={<FaPlus />}>Create Rates</Button>
                </IfElse>
            }>
                <Tabs index={tab} onChange={val => setTab(val)} variant='soft-rounded' colorScheme='gray' isLazy>
                    <TabList as={HStack}>
                        <Tab>Commissions</Tab>
                        <Tab>
                            <HStack spacing={2}>
                                <Text>Royalties</Text>
                                <Tooltip label='Royalties are commissions that are paid out to specific affiliates on every sale, no matter the affiliate who refers the sale.'>
                                    <span>
                                        <FaInfoCircle fontSize={14} />
                                    </span>
                                </Tooltip>
                            </HStack>
                        </Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel p={0} pt={4}>
                            <SimpleGrid spacing={4} columns={2}>
                                <TitleOption title='Default Commission' subtitle='Commission rates applied to all affiliates.'>
                                    <RadioGroup value={commissions.type.toString()} as={VStack} w='100%'
                                                alignItems='start'
                                                onChange={(value) => setCommissions({
                                                    ...commissions,
                                                    type: Number(value)
                                                })}>

                                        <HStack spacing={4}>
                                            <Radio colorScheme='brand' value='0'>Percentage</Radio>
                                            <Radio colorScheme='brand' value='1'>Fixed</Radio>
                                        </HStack>

                                        {commissions.type === 0 && <InputGroup size='sm'>
                                            <Input type='number' w='150px' value={commissions.amount}
                                                   onChange={(e) => setCommissions({
                                                       ...commissions,
                                                       amount: e.target.value
                                                   })}/>
                                            <InputRightAddon>%</InputRightAddon>
                                        </InputGroup>}

                                        {commissions.type === 1 && <>
                                            <InputGroup size='sm'>
                                                <InputLeftAddon>{GetCurrency()}</InputLeftAddon>
                                                <Input w='150px' value={commissions.amount}/>
                                            </InputGroup>

                                            <Checkbox size='sm' isChecked={commissions.applyIndividual}
                                                      onChange={(e) => setCommissions({
                                                          ...commissions,
                                                          applyIndividual: e.target.checked
                                                      })}>
                                                Apply on each product
                                            </Checkbox>
                                        </>}
                                    </RadioGroup>
                                </TitleOption>

                                <TitleOption title='Product Commissions' subtitle={`${commissions.productList.length} product-specific commissions.`}>
                                    <Button as={NextLink} href='/dashboard/commissions/products' leftIcon={<FaWrench />} my={2}>Manage</Button>
                                </TitleOption>
                            </SimpleGrid>

                            <WideTitleOption title='Payout Schedule' subtitle='The period between generating automated payouts.'>
                                <Select>
                                    <option value={0}>Monthly</option>
                                    <option value={1}>Weekly</option>
                                </Select>
                            </WideTitleOption>
                        </TabPanel>

                        <TabPanel p={0} pt={4}>
                            <IfElse boolean={royalties.length > 0}>
                                <TableContainer>
                                    <Table variant='striped'>
                                        <Thead>
                                            <Tr>
                                                <Th>Affiliate</Th>
                                                <Th>Commission</Th>
                                                <Th isNumeric>Actions</Th>
                                            </Tr>
                                        </Thead>

                                        <Tbody>
                                            {royalties.slice((page - 1) * PerPage, page * PerPage).map((item, idx) => <Tr key={idx}>
                                                <Td fontWeight='medium'>
                                                    <NextLink href={`/dashboard/affiliates/${item.affiliateId}`} target='_blank'>
                                                        {item.affiliateName}
                                                    </NextLink>
                                                </Td>

                                                <Td>
                                                    <HStack>
                                                        <Text>{item.amount}{item.type === 0 ? '%' : GetCurrency()}</Text>
                                                        <Tag>{item.type === 0 ? 'Percentage' : 'Fixed'}</Tag>
                                                    </HStack>
                                                </Td>

                                                <Td isNumeric>
                                                    <Button onClick={() => DeleteRoyalty(item.id)} colorScheme='red' leftIcon={<FaTrash />} size='sm'>Delete</Button>
                                                </Td>
                                            </Tr>)}
                                        </Tbody>
                                    </Table>

                                    <Pagination list={royalties} page={page} setPage={setPage} />
                                </TableContainer>

                                <Text>You don&apos;t have any royalties.</Text>
                            </IfElse>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </TitleCard>

            <EasyModal isOpen={royaltyModal.isOpen} onClose={royaltyModal.onClose}
                       icon={FaDollarSign} title='Create Royalty Commissions' footer={<Button isDisabled={affiliates.length === 0} onClick={CreateRoyalty} leftIcon={<FaPlus />}>Set Rates</Button>}>
                <VStack alignItems='stretch' spacing={4}>
                    <TitleOption title='Affiliate' subtitle='You can have multiple royalty rates on a single affiliate.'>
                        <Select value={royalty.affiliateId} onChange={(e) => setRoyalty({ ...royalty, affiliateId: e.target.value })}
                                placeholder={affiliates.length > 0 ? 'Select an affiliate' : 'You don\'t have any affiliates.'}>
                            {affiliates.map((aff, idx) => <option key={idx} value={aff.id}>{`${aff.name} (${aff.email})`}</option>)}
                        </Select>
                    </TitleOption>

                    <TitleOption title='Commission' subtitle='Royalty commission given to the affiliate.'>
                        <RadioGroup value={royalty.type.toString()} as={VStack} w='100%'
                                    alignItems='start'
                                    onChange={(value) => setRoyalty({
                                        ...royalty,
                                        type: Number(value)
                                    })}>

                            <HStack spacing={4}>
                                <Radio colorScheme='brand' value='0'>Percentage</Radio>
                                <Radio colorScheme='brand' value='1'>Fixed</Radio>
                            </HStack>

                            {royalty.type === 0 && <InputGroup size='sm'>
                                <Input type='number' value={royalty.amount}
                                       onChange={(e) => setRoyalty({
                                           ...royalty,
                                           amount: e.target.value
                                       })} />
                                <InputRightAddon>%</InputRightAddon>
                            </InputGroup>}

                            {royalty.type === 1 && <>
                                <InputGroup size='sm'>
                                    <InputLeftAddon>{GetCurrency()}</InputLeftAddon>
                                    <Input value={royalty.amount}/>
                                </InputGroup>

                                <Checkbox size='sm' isChecked={royalty.applyIndividual}
                                          onChange={(e) => setRoyalty({
                                              ...royalty,
                                              applyIndividual: e.target.checked
                                          })}>
                                    Apply on each product
                                </Checkbox>
                            </>}
                        </RadioGroup>
                    </TitleOption>

                    <TitleOption title='Product-specific commissions'
                                 subtitle={<Text fontSize={14} mb={2}>If you have product-specific commissions set up, the commission above <Text as='span' fontWeight='bold'>will be ignored</Text>.</Text>}>
                        <Checkbox isChecked={royalty.ignoreProducts} onChange={(e) => setRoyalty({ ...royalty, ignoreProducts: e.target.checked })}>Ignore Products</Checkbox>
                    </TitleOption>
                </VStack>
            </EasyModal>
        </>
    );
};

export default Commissions;