import React from 'react';
import { Box, Heading, Icon, Link, Text } from "@chakra-ui/react";

import { BiLinkExternal } from "react-icons/bi";

import Api from "@/lib/api";
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { redirect } from "next/navigation";

import remarkGfm from 'remark-gfm'
import remarkUnwrapImages from 'remark-unwrap-images'
import remarkToc from "remark-toc";
import { GetPrettyDate } from "@/lib/helpers";

const ReactMarkdown = dynamic(() => import('react-markdown'));

const components = {
    a: props => {
        const { children } = props;
        const external = !props.href.includes('affibear.com') && !props.href.startsWith('#');

        return (
            <Link href={props.href} isExternal={external}>
                {children}
                {external && <Box display='inline-block' as='span'  mx={2}><BiLinkExternal /></Box> }
            </Link>
        );
    },
    img: props => {
        return (
            <div className='image-container'>
                <Image
                    className='image'
                    src={props.src}
                    alt={props.alt}
                    loading='lazy'
                    quality={100}
                    fill />
            </div>
        );
    },
    table: props => {
        const { children } = props;

        return (
            <div className='table-container'>
                <table>
                    {children}
                </table>
            </div>
        );
    }
};

function ToIso(timestamp) {
    return new Date(timestamp).toISOString();
}

import './styles.css'
import Header from "@/components/elements/landing/Header";

const Page = async ({ params }) => {
    const res = await Api.get(`/blog/get?id=${params.slug}`);

    if (res.status !== 200) {
        redirect('/blog')
    }

    const post = res.data;

    return (
        <>
            <Header />

            <Box px={8} my={8} width='full' minH='100vh'>
                <main className='content'>
                    <article itemScope itemType='https://schema.org/CreativeWork'>
                        <header className='article-header'>
                            <Heading as='h1' fontSize={{ sm: '30px', md: '45px' }} itemProp='headline'>{post.title}</Heading>
                            <Text fontWeight='medium' fontSize={20} className='post-meta' as='p' mb={8} mt={4}>
                                <time itemProp='datePublished' dateTime={ToIso(post.metadata.updatedAt)}>{GetPrettyDate(post.metadata.updatedAt)}</time>
                                <Text as='span'>
                                    {' - '}
                                    <Text as='span' itemProp='author' itemScope itemType='https://schema.org/Person'>
                                        <span className='author-link' rel='author' itemProp='name'>{post.metadata.author}</span>
                                    </Text>
                                </Text>
                            </Text>
                        </header>

                        <Image loading='eager' priority fetchPriority='high' width={1000} height={500} quality={100} itemProp='thumbnailUrl' src={post.image} alt='Article Image Header' />

                        <Box my={4} itemProp='text'>
                            <ReactMarkdown
                                className='article-text'
                                components={components}
                                remarkPlugins={[remarkGfm, remarkUnwrapImages, remarkToc]}>
                                {post.content}
                            </ReactMarkdown>
                        </Box>
                    </article>

                    { /* <Newsletter /> */ }
                </main>
            </Box>

        </>
    );
};

export default Page;