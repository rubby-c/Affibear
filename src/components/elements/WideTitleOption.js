import React from 'react';
import { HStack, SimpleGrid, Text } from "@chakra-ui/react";

const WideTitleOption = ({ title, subtitle, children }) => {
    return (
        <SimpleGrid columns={2} w='100%' justifyContent='space-between' my={4}>
            <div>
                <Text fontSize={18} fontWeight='medium'>{title}</Text>
                <Text fontSize={14}>{subtitle}</Text>
            </div>

            {children}
        </SimpleGrid>
    );
};

export default WideTitleOption;