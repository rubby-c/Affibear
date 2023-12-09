'use client';

import React from 'react';
import NextLink from "next/link";

import {
    Button,
    HStack,
    Link,
    Select,
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

import { FaCheck } from "react-icons/fa";
import {FaX} from "react-icons/fa6";
import {BiDollarCircle} from "react-icons/bi";

import Api from "@/lib/api";
import { GetNumber } from "@/lib/helpers";
import { TOAST_OPTIONS } from "@/lib/constants";

import TitleCard from "@/components/elements/TitleCard";
import IfElse from "@/components/helpers/IfElse";
import NoSsr from "@/components/helpers/NoSsr";

const Page = ({ _data }) => {
    const toast = useToast(TOAST_OPTIONS);
    const [payouts, setPayouts] = React.useState(_data);

    async function MarkPayout(id, item, paid) {
        const res = await Api.patch('/website/payouts', {
            affiliateId: id,
            payoutId: item.id,
            paid,
            amount: item.amount,
            details: item.details
        });

        if (res.status === 200) {
            const idx = payouts.findIndex(i => i.id === item.id);

            const arr = [...payouts];
            payouts[idx].paid = paid;

            setPayouts(arr);
        } else {
            toast({
                title: 'Error',
                status: 'error',
                description: res.data.status ?? res.data
            });
        }
    }

    const [filter, setFilter] = React.useState('all');

    return (
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
    );
};

export default Page;