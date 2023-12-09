'use client';

import React from 'react';

import {
    Button, Checkbox, HStack,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    Radio,
    RadioGroup, Select, SimpleGrid, Tab, TabList, TabPanel, TabPanels, Tabs,
    Text, useToast,
    VStack
} from "@chakra-ui/react";

import { BsPercent } from "react-icons/bs";

import TitleCard from "@/components/elements/TitleCard";
import TitleOption from "@/components/elements/TitleOption";
import WideTitleOption from "@/components/elements/WideTitleOption";

import Api from "@/lib/api";
import { TOAST_OPTIONS } from "@/lib/constants";
import {FaWrench} from "react-icons/fa";
import NextLink from "next/link";

const Commissions = ({ _data }) => {
    const toast = useToast(TOAST_OPTIONS);
    const [state, setState] = React.useState(_data);

    async function Save() {
        const res = await Api.post('/website/commissions', state);

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

    return (
        <>
            {state !== null ? <TitleCard title='Commissions' icon={<BsPercent fontSize={20} />}>
                <Tabs size='sm' variant='soft-rounded' colorScheme='gray' isLazy>
                    <TabList as={HStack}>
                        <Tab>Commissions</Tab>
                        <Tab>Royalties</Tab>
                    </TabList>

                    <TabPanels>
                        <TabPanel px={0}>
                            <SimpleGrid spacing={4} columns={2}>
                                <TitleOption title='Default Commission' subtitle='Commission rates applied to all affiliates.'>
                                    <RadioGroup value={state.commissions.type.toString()} as={VStack} w='100%'
                                                alignItems='start'
                                                onChange={(value) => setState({
                                                    ...state,
                                                    commissions: {...state.commissions, type: Number(value)}
                                                })}>

                                        <HStack spacing={4}>
                                            <Radio colorScheme='brand' value='0'>Percentage</Radio>
                                            <Radio colorScheme='brand' value='1'>Fixed</Radio>
                                        </HStack>

                                        {state.commissions.type === 0 && <InputGroup size='sm'>
                                            <Input type='number' w='150px' value={state.commissions.amount}
                                                   onChange={(e) => setState({
                                                       ...state,
                                                       commissions: {...state.commissions, amount: e.target.value}
                                                   })}/>
                                            <InputRightAddon>%</InputRightAddon>
                                        </InputGroup>}

                                        {state.commissions.type === 1 && <>
                                            <InputGroup size='sm'>
                                                <InputLeftAddon>$</InputLeftAddon>
                                                <Input w='150px' value={state.commissions.amount}/>
                                            </InputGroup>

                                            <Checkbox size='sm' isChecked={state.commissions.applyIndividual}
                                                      onChange={(e) => setState({
                                                          ...state,
                                                          commissions: {
                                                              ...state.commissions,
                                                              applyIndividual: e.target.checked
                                                          }
                                                      })}>
                                                Apply on each product
                                            </Checkbox>
                                        </>}
                                    </RadioGroup>
                                </TitleOption>

                                <TitleOption title='Product Commissions' subtitle={`${state.commissions.productList.length} product-specific commissions.`}>
                                    <Button as={NextLink} href='/dashboard/commissions/products' leftIcon={<FaWrench />} my={2}>Manage</Button>
                                </TitleOption>
                            </SimpleGrid>
                        </TabPanel>

                        <TabPanel px={0}>

                        </TabPanel>
                    </TabPanels>
                </Tabs>

                <WideTitleOption title='Payout Schedule' subtitle='The period between generating automated payouts.'>
                    <Select>
                        <option value={0}>Monthly</option>
                        <option value={1}>Weekly</option>
                    </Select>
                </WideTitleOption>
            </TitleCard> : <Text>Loading..</Text>}
        </>
    );
};

export default Commissions;