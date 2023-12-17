'use client';

import React from 'react';
import {Button, Heading, Icon, Input, Link, Text, Textarea, useToast, VStack} from "@chakra-ui/react";
import TitleOption from "@/components/elements/TitleOption";
import { FaArrowRight } from "react-icons/fa";
import Api, { SendRequest } from "@/lib/api";

import { TOAST_OPTIONS } from "@/lib/constants";
import Tip from "@/components/elements/Tip";

const Contact = () => {
    const toast = useToast(TOAST_OPTIONS);

    const [email, setEmail] = React.useState('');
    const [subject, setSubject] = React.useState('');
    const [content, setContent] = React.useState('');

    const error = email === '' || subject === '' || content === '';

    const [done, setDone] = React.useState(false);

    async function Send() {
        await SendRequest(
            toast,
            'post',
            `/public/contact`,
            {
                email,
                subject,
                content
            },
            () => setDone(true),
            null,
            {
                success: {
                    title: `Success`,
                    description: 'We have received your message and will respond shortly.'
                },
                error: (err) => ({
                    title: `Error`,
                    description: err.status ?? err
                }),
                loading: {
                    title: 'Sending..',
                    description: 'Our professional pigeons are delivering your message.'
                }
            }
        );
    }

    return (
        <VStack maxW='384px' mx='auto' alignItems='stretch' spacing={4}>
            <Tip title='Need support?' content={<Text fontWeight='medium'>Check out our <Link href='https://afficone.freshdesk.com/support/home'>Help Desk</Link>!</Text>}/>

            <Heading mt={8} textAlign='center' as='h1'>Contact Us</Heading>

            <TitleOption title='Email'>
                <Input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='example@email.com' />
            </TitleOption>

            <TitleOption title='Subject'>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder='I have a question about..' />
            </TitleOption>

            <TitleOption title='Content'>
                <Textarea rows={5} value={content} onChange={(e) => setContent(e.target.value)} placeholder='Would you implemenent..' />
            </TitleOption>

            <Button onClick={Send} isDisabled={error || done} rightIcon={<Icon as={FaArrowRight} ml={2} />}>Send</Button>
        </VStack>
    );
};

export default Contact;