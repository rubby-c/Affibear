import React from 'react';
import {Box, Text} from "@chakra-ui/react";

const TitleOption = ({ w, as, sub, title, subtitle, category, children }) => {
    return (
        <Box w={w} as={as}>
            {category && <Text mb={4} fontSize={18} fontWeight='bold'>{category}</Text>}

            <Text fontSize={sub ? 14: 16} fontWeight='medium' mb={subtitle ? 0 : 2}>{title}</Text>
            {typeof subtitle === 'string' ? <Text fontSize={sub ? 12 : 14} mb={2}>{subtitle}</Text> : subtitle}

            {children}
        </Box>
    );
};

export default TitleOption;