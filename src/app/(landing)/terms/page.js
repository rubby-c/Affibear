import React from 'react';

import dynamic from "next/dynamic";
import { FRONTEND_BASE_URL } from "@/lib/api";
import { Box } from "@chakra-ui/react";

const ReactMarkdown = dynamic(() => import('react-markdown'));
import '../styles.css'

const Terms = async () => {
    const res = await fetch(FRONTEND_BASE_URL + '/scripts/tos.txt', { cache: 'no-cache' });
    const content = await res.text();

    return (
        <Box  px={8} my={8} mx='auto' maxW='1028px'>
            <ReactMarkdown className='article-text'>
                {content}
            </ReactMarkdown>
        </Box>
    );
};

export default Terms;