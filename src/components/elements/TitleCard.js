import React from 'react';
import {Box, HStack, Text} from "@chakra-ui/react";

const TitleCard = ({item = null, icon = null, title = null, mb, as, children}) => {
    return (
        <Box as={as} bg='#fff' borderRadius='xl' p={6}>
            <HStack alignItems='start' justifyContent='space-between' mb={mb ?? 4} spacing={3}>
                <HStack spacing={3}>
                    {icon}
                    {typeof title === 'string' ? <Text fontWeight='medium' fontSize={20}>{title}</Text> : title}
                </HStack>
                {item}
            </HStack>

            {children}
        </Box>
    );
};

export default TitleCard;