import React from 'react';
import { Box, HStack, Text } from "@chakra-ui/react";
import { FaRegLightbulb } from "react-icons/fa";

const Tip = ({ title, content }) => {
    return (
        <Box borderRadius='lg' p={4} bg='gray.50' boxShadow='xs'>
            <HStack fontSize={18} mb={2}>
                <FaRegLightbulb />
                <Text fontWeight='bold'>{title}</Text>
            </HStack>

            {typeof content === 'string' ? <Text fontWeight='medium' fontSize={14}>{content}</Text> : content}
        </Box>
    );
};

export default Tip;