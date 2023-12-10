import React from 'react';
import { Box, Flex } from "@chakra-ui/react";

import Api from "../../lib/api";
import './styles.css';
import { headers } from "next/headers";
import Head from "next/head";
import { redirect } from "next/navigation";

export async function generateMetadata() {
    const host = headers().get('Host');
    const res = await Api.get(`/website/by-metadata?host=${host}`);

    const { custom, key, ...rest } = res.data;

    return {
        ...rest,
        other: {
            'affibear-key': key,
            ...custom
        }
    }
}

const Layout = async ({ children, params }) => {
    const host = headers().get('Host');

    const res = await Api.get(`/website/by?host=${host}`);
    const data = res.data;
    params.data = data;

    if (res.status !== 200) {
        redirect('https://affibear.com');
    }

    return (
        <>
            <Head>
                <meta name='affibear-subdomain' content={host} />
            </Head>

            <Flex w='100%' h='100%' justifyContent='center' alignItems='center'
                  bg={data.settings.background.useImage ? `url(${data.settings.background.image})` : data.settings.background.color}>
                <Box p={4}>
                    {children}
                </Box>
            </Flex>
        </>
    );
};

export default Layout;