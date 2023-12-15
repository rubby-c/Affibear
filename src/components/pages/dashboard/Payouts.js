'use client';

import React from 'react';
import NextLink from "next/link";

import {
    Button, Checkbox,
    HStack, Input, InputGroup, InputLeftAddon,
    Link,
    Select, SimpleGrid,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead, Tooltip,
    Tr,
    useToast, VStack
} from '@chakra-ui/react'

import { FaCheck, FaWrench } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { BiDollarCircle } from "react-icons/bi";

import { SendRequest } from "@/lib/api";
import { GetCurrency, GetNumber } from "@/lib/helpers";
import { TOAST_OPTIONS } from "@/lib/constants";
import dynamic from "next/dynamic";

import TitleCard from "@/components/elements/TitleCard";
import IfElse from "@/components/helpers/IfElse";
import NoSsr from "@/components/helpers/NoSsr";
import WideTitleOption from "@/components/elements/WideTitleOption";
import TitleOption from "@/components/elements/TitleOption";

const MultiSelect = dynamic(() => import('chakra-multiselect').then(x => x.MultiSelect), {
    ssr: false,
    loading: () => <Text>Loading..</Text>
});

const methods = [
    { id: 'paypal', value: 'PayPal' },
    { id: 'sepa', value: 'Bank Transfer (SEPA)' },
    { id: 'bank', value: 'Bank Transfer' },
    { id: 'cashapp', value: 'Cash App' },
    { id: 'revolut', value: 'Revolut' },
    { id: 'googlepay', value: 'Google Pay' },
    { id: 'bitcoin', value: 'Bitcoin' },
    { id: 'cash', value: 'Cash' },
    { id: 'cheque', value: 'Cheque' },
    { id: 'venmo', value: 'Venmo' },
    { id: 'wechat', value: 'WeChat' },
    { id: 'alipay', value: 'AliPay' },
    { id: 'payoneer', value: 'Payoneer' },
    { id: 'storegiftcard', value: 'Store Gift Card' },
    { id: 'custom', value: 'Custom' }
];

const Payouts = ({ data }) => {
    const toast = useToast(TOAST_OPTIONS);
    const [payouts, setPayouts] = React.useState(data.payouts);
    const [settings, setSettings] = React.useState(data.settings);

    async function SaveSettings() {
        await SendRequest(
            toast,
            'post',
            '/website/payout-settings',
            {
                ...settings,
                methods: settings.methods.map(i => i.value)
            },
            null,
            null,
            {
                success: {
                    title: `Success`,
                    description: 'Your settings have been saved.'
                },
                error: (err) => ({
                    title: `Error`,
                    description: err.status ?? err
                }),
                loading: {
                    title: 'Saving..'
                }
            }
        );
    }

    async function MarkPayout(id, item, paid) {
        await SendRequest(
            toast,
            'patch',
            `/website/payouts`,
            {
                affiliateId: id,
                payoutId: item.id,
                paid,
                amount: item.amount,
                details: item.details
            },
            () => {
                const idx = payouts.findIndex(i => i.id === item.id);
                const arr = [...payouts];
                payouts[idx].paid = paid;

                setPayouts(arr);
            }
        );
    }

    const [filter, setFilter] = React.useState('all');

    return (
        <VStack alignItems='stretch' spacing={4}>
            <TitleCard title='Payout Settings' icon={<FaWrench fontSize={20}/>}
                       item={<Button onClick={SaveSettings} leftIcon={<FaWrench />}>Save Changes</Button>}>

                <VStack alignItems='stretch' spacing={4}>
                    <SimpleGrid spacing={4} columns={{ base: 1, lg: 2 }}>
                        <TitleOption title='Minimum Payout' subtitle='The minimum balance before an automated payout can be generated.'>
                            <InputGroup mb={3}>
                                <InputLeftAddon>{GetCurrency()}</InputLeftAddon>
                                <Input isDisabled={!settings.useMinimum} type='number' placeholder={50}
                                       value={settings.minimum} onChange={(e) => setSettings({ ...settings, minimum: e.target.value })} />
                            </InputGroup>

                            <Checkbox isChecked={settings.useMinimum} onChange={(e) => setSettings({ ...settings, useMinimum: e.target.checked })} mb={3}>
                                Require minimum balance
                            </Checkbox>
                        </TitleOption>

                        <TitleOption title='Payout Methods' subtitle='Allowed payout methods affiliates can choose from.'>
                            <MultiSelect value={settings.methods} multiple
                                         onChange={(value) => setSettings({ ...settings, methods: value })}
                                         placeholder='Select methods..'
                                         options={methods}
                                         actionGroupProps={{
                                             clearButtonProps: {
                                                 icon: () => <FaX />,
                                                 size: 'sm'
                                             },
                                             toggleButtonProps: {
                                                 m: 2
                                             }
                                         }}/>
                        </TitleOption>
                    </SimpleGrid>

                    <WideTitleOption title='Payout Schedule' subtitle='The period between generating automated payouts.'>
                        <Select value={settings.schedule} onChange={(e) => setSettings({ ...settings, schedule: Number(e.target.value) })}>
                            <option value={0}>Monthly (end of month)</option>
                            <option value={1}>Monthly (every 15th day)</option>
                            <option value={2}>Weekly</option>
                        </Select>
                    </WideTitleOption>
                </VStack>
            </TitleCard>

            <TitleCard title='Payouts' icon={<BiDollarCircle fontSize={20}/>}
                       item={<Select w='200px' value={filter} onChange={(e) => setFilter(e.target.value)}>
                           <option value='all'>All Payouts</option>
                           <option value='paid'>Paid</option>
                           <option value='pending'>Pending</option>
                       </Select>}>
                <VStack alignItems='stretch' spacing={4}>
                    {(() => {
                        let arr = [];

                        switch (filter) {
                            case 'all':
                                arr = payouts;
                                break;
                            case 'paid':
                                arr = payouts.filter(i => i.paid);
                                break;
                            case 'pending':
                                arr = payouts.filter(i => !i.paid);
                                break;
                        }

                        return (
                            <IfElse boolean={arr.length > 0}>
                                <TableContainer>
                                    <Table variant='simple'>
                                        <Thead>
                                            <Tr>
                                                <Th>Created At</Th>
                                                <Th>Affiliate</Th>
                                                <Th>Amount</Th>
                                                <Th>Details</Th>
                                                <Th isNumeric>Actions</Th>
                                            </Tr>
                                        </Thead>

                                        <Tbody>
                                            {arr.map((payout, idx) => <Tr key={idx}>
                                                <Td>{new Date(payout.updatedAt ?? payout.createdAt).toLocaleString()}</Td>
                                                <Td>
                                                    <Link as={NextLink} target='_blank'
                                                          href={`/dashboard/affiliates/${payout.affiliateId}`}>
                                                        {payout.affiliateName}
                                                    </Link>
                                                </Td>
                                                <Td>
                                                    <NoSsr>
                                                        {GetNumber(payout.amount)}
                                                    </NoSsr>
                                                </Td>
                                                <Td>
                                                    <Tooltip label={payout.details}>
                                                        <Text overflow='hidden' whiteSpace='nowrap' w='150px' textOverflow='ellipsis'>
                                                            {payout.details}
                                                        </Text>
                                                    </Tooltip>
                                                </Td>
                                                <Td>
                                                    <HStack justifyContent='end'>
                                                        {payout.paid ?
                                                            <Button
                                                                onClick={() => MarkPayout(payout.affiliateId, payout, false)}
                                                                size='sm' leftIcon={<FaX/>}>Mark as pending</Button>
                                                            :
                                                            <Button onClick={() => MarkPayout(payout.affiliateId, payout, true)}
                                                                    size='sm' leftIcon={<FaCheck/>}
                                                                    colorScheme='brand'>Mark as paid</Button>}
                                                    </HStack>
                                                </Td>
                                            </Tr>)}
                                        </Tbody>
                                    </Table>
                                </TableContainer>

                                <Text>We couldn&apos;t find any payouts.</Text>
                            </IfElse>
                        );
                    })()}
                </VStack>
            </TitleCard>
        </VStack>
    );
};

export default Payouts;