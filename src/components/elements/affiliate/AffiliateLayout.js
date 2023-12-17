'use client';

import React from 'react';
import { Box, Flex } from "@chakra-ui/react";

const AffiliateLayout = ({ data, children }) => {
    return (
        <Flex w='100%' h='100%' justifyContent='center' alignItems='center'
              bg={data.settings.background.useImage ? `url(${data.settings.background.image})` : data.settings.background.color}
              backgroundRepeat={data.settings.background.backgroundRepeat}
              backgroundSize={data.settings.background.backgroundSize}>
            <Box p={4}>
                {children}
            </Box>
        </Flex>
    );
};

export default AffiliateLayout;