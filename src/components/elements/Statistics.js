'use client'

import React from 'react';
import { Text, Box, HStack, Icon } from "@chakra-ui/react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { GoHorizontalRule } from "react-icons/go";
import NoSsr from "@/components/helpers/NoSsr";

const Statistics = ({ label, value, prev, item }) => {
    const change = (value / prev === 0 ? 1 : prev);
    const percent = (change * 100) - 100;

    return (
        <Box px={{ base: '4', md: '6' }} py={5} bg='#fff' borderRadius='lg' boxShadow='sm'>
            {item !== undefined ? <HStack justifyContent='space-between'>
                <Text fontWeight='medium'>
                    {label}
                </Text>

                {item}
            </HStack> : <Text fontWeight='medium'>
                {label}
            </Text>}

            <HStack w='100%' justifyContent='space-between' mt={4}>
                <NoSsr>
                    <Text fontWeight='bold' fontSize='2xl'>
                        {value}
                    </Text>
                </NoSsr>

                {prev !== undefined && <HStack bg={change === 1 ? 'gray.100' : change > 0 ? 'brand.50' : 'red.50'}
                                               fontWeight='semibold' borderRadius='1rem' px={2} py={1}>
                    <Icon as={change === 0 ? GoHorizontalRule : change > 0 ? FaChevronUp : FaChevronDown}
                          color={change === 0 ? 'gray.500' : change > 0 ? 'brand.400' : 'red.300'} />

                    {change !== 0 && <Text color={change > 0 ? 'brand.400' : 'red.400'} fontSize={12}>
                        {`${percent}%`}
                    </Text>}
                </HStack>}
            </HStack>
        </Box>
    );
};

export default Statistics;