import React from 'react';
import { HStack, IconButton, Text } from "@chakra-ui/react";

const EasyModalTitle = ({ icon, ariaLabel, onIconClick, title }) => {
    return (
        <HStack mb={4} spacing={4}>
            <IconButton onClick={onIconClick} variant='ghost' size='sm' icon={icon} aria-label={ariaLabel} />
            <Text fontSize={20} fontWeight='medium'>{title}</Text>
        </HStack>
    );
};

export default EasyModalTitle;