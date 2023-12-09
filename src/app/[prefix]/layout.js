import React from 'react';
import { Box, Flex } from "@chakra-ui/react";
import { redirect } from "next/navigation";

import Api from "../../lib/api";
import './styles.css';

const Layout = async ({ children, params }) => {
    const res = await Api.get(`/website/by?prefix=${params.prefix}`);
    const data = res.data;
    params.data = data;

    if (res.status !== 200) {
        redirect('/');
    }

    return (
        <Flex w='100%' h='100%' justifyContent='center' alignItems='center'
              bg={data.settings.background.useImage ? `url(${data.settings.background.image})` : data.settings.background.color}>
            <Box p={4}>
                {children}
            </Box>
        </Flex>
    );
};

export default Layout;