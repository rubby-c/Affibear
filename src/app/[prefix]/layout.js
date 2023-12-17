import React from 'react';

import Api from "../../lib/api";

import { headers } from "next/headers";
import Head from "next/head";

import './styles.css';

export async function generateMetadata() {
    const host = headers().get('Host');
    const res = await Api.get(`/website/by-metadata?host=${host}`);

    const { custom, key, ...rest } = res.data;

    return {
        ...rest,
        other: {
            'afficone-key': key,
            ...custom
        }
    }
}

const Layout = async (props) => {
    const host = headers().get('Host');

    return (
        <>
            <Head>
                <meta name='afficone-subdomain' content={host} />
            </Head>

            {props.children}
        </>
    );
};

export default Layout;