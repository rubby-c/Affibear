'use client'

import React from 'react';
import {Text, Box, HStack, Icon} from "@chakra-ui/react";
import {FaChevronDown, FaChevronUp} from "react-icons/fa";
import {GoHorizontalRule} from "react-icons/go";

const TextStatistics = ({ label, value }) => {
    return (
        <Box px={{ base: '4', md: '6' }} py={5} bg='#fff' borderRadius='lg' boxShadow='sm'>
            <Text fontWeight='medium'>
                {label}
            </Text>

            <HStack w='100%' justifyContent='space-between' mt={4}>
                <Text fontWeight='bold'>
                    {value}
                </Text>
            </HStack>
        </Box>
    );
};

export default TextStatistics;