'use client';

import React from 'react';
import NextLink from "next/link";

import {
    Box, Button, Checkbox,
    Flex,
    HStack, IconButton, Image,
    Input,
    InputGroup,
    InputRightAddon, Link, Radio, RadioGroup,
    SimpleGrid,
    Text, useMediaQuery, useToast,
    VStack
} from "@chakra-ui/react";

import { FaEye, FaSave } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BiScreenshot } from "react-icons/bi";

import Api, {SendRequest} from "@/lib/api";

import ColorPicker from "@/components/elements/ColorPicker";
import TitleCard from "@/components/elements/TitleCard";
import FileUpload from "@/components/elements/FileUpload";
import IfElse from "@/components/helpers/IfElse";

import { TOAST_OPTIONS } from "@/lib/constants";
import { BlobToBase64 } from "@/lib/helpers";

const Pages = ({ _data }) => {
    const [isComputer] = useMediaQuery('(min-width: 976px)', {
        ssr: true,
        fallback: true
    });

    const toast = useToast(TOAST_OPTIONS)
    const [data, setData] = React.useState(_data);

    const [files, setFiles] = React.useState({
        logo: null,
        header: null,
        background: null
    });

    async function Update() {
        await SendRequest(
            toast,
            'post',
            `/website/modify`,
            data,
            null,
            null,
            {
                success: {
                    title: `Success`,
                    description: 'Your changes have been saved.'
                },
                error: (err) => ({
                    title: `Error`,
                    description: err.status ?? err
                }),
                loading: {
                    title: 'Saving..'
                }
            }
        );
    }

    async function UpdatePreviews() {
        if (data === null) {
            return;
        }

        setData({
            ...data,
            settings: {
                ...data.settings,
                logo: files.logo !== null ? await BlobToBase64(files.logo) : data.settings.logo,
                header: files.header !== null ? await BlobToBase64(files.header) : data.settings.header,
                background: {
                    ...data.settings.background,
                    image: files.background !== null ? await BlobToBase64(files.background) : data.settings.background.image
                }
            }
        });
    }

    React.useEffect(() => UpdatePreviews, [files]);

    return (
        <>
            {data && <TitleCard title='Registration' icon={<BiScreenshot fontSize={20} />} item={<Button onClick={Update} colorScheme='brand' leftIcon={<FaSave />}>Save</Button>}>
                <Flex flexDirection={{ base: 'column', xl: 'row' }} justifyContent='start' alignItems='stretch' gap='32px'>
                    <Box w={{ base: '100%', xl: 'auto' }} flex='1'>
                        <SimpleGrid columns={2}>
                            <div>
                                <Checkbox isChecked={data.settings.useLogo}
                                          onChange={(e) => setData({ ...data, settings: { ...data.settings, useLogo: e.target.checked } } )}
                                          fontWeight='medium'>Website Logo</Checkbox>

                                <Text fontSize={14} mb={2}>min. 256x256 (1:1)</Text>

                                <FileUpload
                                    hasFile={data.settings.logo !== null}
                                    name='logo' w='100px' h='100px'
                                    onChange={(file) => {
                                        setFiles({ ...files, logo: file });
                                    }}
                                    types={['.png', '.jpg', '.jpeg', '.webp']}
                                    maxSize={8}
                                    children={
                                        <Image bg='var(--bg)' w='100px' h='100px' aspectRatio='1 / 1' src={data.settings.logo} />
                                    }
                                />
                            </div>

                            <div>
                                <Checkbox isChecked={data.settings.useHeader}
                                          onChange={(e) => setData({ ...data, settings: { ...data.settings, useHeader: e.target.checked }})}
                                          fontWeight='medium'>Header Image</Checkbox>

                                <Text fontSize={14} mb={2}>min. 960x240 (4:1)</Text>

                                <FileUpload
                                    hasFile={data.settings.header !== null}
                                    name='header' w='auto'
                                    onChange={(file) => {
                                        setFiles({ ...files, header: file });
                                    }}
                                    types={['.png', '.jpg', '.jpeg', '.webp']}
                                    maxSize={8}
                                    children={
                                        <Image bg='var(--bg)' w='100%' maxH='100px' src={data.settings.header ?? '/images/placeholders/no-header.png'} />
                                    }
                                />
                            </div>
                        </SimpleGrid>

                        <Text fontWeight='medium' my={4} color='gray.500'>Settings</Text>

                        <VStack w='100%' alignItems='start'>
                            <Checkbox isChecked={data.settings.auth.captcha}
                                      onChange={(e) => setData({ ...data, settings: { ...data.settings, auth: { ...data.settings.auth, captcha: e.target.checked }}})}
                                      fontWeight='medium'>Use invisible captcha (recommended)</Checkbox>

                            <Checkbox isChecked={data.settings.auth.google}
                                      onChange={(e) => setData({ ...data, settings: { ...data.settings, auth: { ...data.settings.auth, google: e.target.checked }}})}
                                      fontWeight='medium'>Allow Google login</Checkbox>
                        </VStack>

                        <Text fontWeight='medium' my={4} color='gray.500'>Background</Text>

                        <RadioGroup value={data.settings.background.useImage.toString()} as={VStack} w='100%'
                                    onChange={(val) => setData({ ...data, settings: { ...data.settings, background: { ...data.settings.background, useImage: val === 'true' }}})}>
                            <HStack w='100%' justifyContent='space-between'>
                                <Radio value='false' colorScheme='brand'>Color</Radio>

                                <ColorPicker color={data.settings.background.color} button
                                             setColor={(value) => setData({ ...data, settings: { ...data.settings, background: { ...data.settings.background, color: value }}})}/>
                            </HStack>

                            <HStack w='100%' justifyContent='space-between'>
                                <Radio value='true' colorScheme='brand'>
                                    Image
                                    {data.settings.background.useImage && <Text fontSize={14}>recom. 1280x720 (16:9)</Text>}
                                </Radio>

                                {data.settings.background.useImage && <FileUpload
                                    hasFile={data.settings.background.image !== null}
                                    name='background' w='100px'
                                    onChange={(file) => {
                                        setFiles({ ...files, background: file });
                                    }}
                                    types={['.png', '.jpg', '.jpeg', '.webp']}
                                    maxSize={8}
                                    children={
                                        <Image bg='var(--bg)' w='100px' aspectRatio='16 / 9' src={data.settings.background.image} />
                                    }
                                />}
                            </HStack>
                        </RadioGroup>

                        <Text fontWeight='medium' my={4} color='gray.500'>Content</Text>

                        <VStack w='100%' alignItems='start'>
                            <Box w='100%'>
                                <Text mb={2}>Description</Text>
                                <Input value={data.settings.description} onChange={(e) => setData({ ...data, settings: { ...data.settings, description: e.target.value }})} />
                            </Box>

                            <Text>Callouts</Text>

                            <Input value={data.settings.callouts[0]}
                                   onChange={(e) => setData({ ...data, settings: { ...data.settings, callouts: [e.target.value, data.settings.callouts[1], data.settings.callouts[2]] }})}
                                   size='sm' placeholder='<empty>' />
                            <Input value={data.settings.callouts[1]}
                                   onChange={(e) => setData({ ...data, settings: { ...data.settings, callouts: [data.settings.callouts[0], e.target.value, data.settings.callouts[2]] }})}
                                   size='sm' placeholder='<empty>' />
                            <Input value={data.settings.callouts[2]}
                                   onChange={(e) => setData({ ...data, settings: { ...data.settings, callouts: [data.settings.callouts[0], data.settings.callouts[1], e.target.value] }})}
                                   size='sm' placeholder='<empty>' />
                        </VStack>
                    </Box>

                    <IfElse boolean={isComputer}>
                        <VStack pos='relative' flex='2' boxShadow='lg' w='100%' justifyContent='center'
                                bg={data.settings.background.useImage ? `url(${data.settings.background.image})` : data.settings.background.color}>

                            <Box bg='#fdffb6' pos='absolute' top='0' left='0' fontWeight='bold' p={2}>
                                <Text>Live Demo</Text>
                            </Box>

                            <VStack w='100%' justifyContent='center' transform='scale(0.75)' aspectRatio='16 / 9'>
                                {data.settings.useHeader && <Image mb={4} alignSelf='center' w='500px' src={data.settings.header ?? '/images/placeholders/no-header.png'} />}

                                <SimpleGrid maxW='1000px' columns={2} p={6} borderRadius='xl' bg='#fff' boxShadow='xl' spacing={4}>
                                    <div>
                                        {data.settings.useLogo ? <HStack spacing={4} mb={4}>
                                            <Image h='40px' aspectRatio='1 / 1' src={data.settings.logo} />
                                            <Text fontWeight='medium' fontSize={48}>{data.name}</Text>
                                        </HStack> : <Text mb={4} fontWeight='medium' fontSize={48}>{data.name}</Text>}

                                        <Text fontSize={18}>{data.settings.description}</Text>

                                        <VStack my={8} ps={4} alignItems='start' as='ul' fontSize={18}>
                                            {data.settings.callouts.map((text, idx) => text.length > 0 && <li key={idx}>{text}</li>)}
                                        </VStack>
                                    </div>

                                    <VStack w='100%' my={4} spacing={6}>
                                        <Input placeholder='Full Name' variant='flushed' />

                                        <Input placeholder='Email' variant='flushed' />

                                        <InputGroup variant='flushed'>
                                            <Input placeholder='Password' type='password' />

                                            <InputRightAddon borderBottom='1px solid' borderColor='inherit' bg='transparent' px={0}>
                                                <IconButton icon={<FaEye />} variant='ghost' aria-label='Show / hide password' />
                                            </InputRightAddon>
                                        </InputGroup>

                                        <Checkbox alignSelf='start'>
                                            I would like to receive promotional emails.
                                        </Checkbox>

                                        <VStack alignItems='stretch' w='100%'>
                                            <Button>Create Account</Button>

                                            {data.settings.auth.google &&
                                                <Button leftIcon={<FcGoogle/>}>Login with Google</Button>}
                                        </VStack>

                                        <Text fontSize={12}>By signing up you agree to Affibear&apos;s <Link as={NextLink} href='#'>Terms of Service</Link> and <Link as={NextLink} href='/privacy'>Privacy Policy</Link>.</Text>
                                    </VStack>
                                </SimpleGrid>
                            </VStack>
                        </VStack>

                        <Text fontSize={18} mb={2} fontWeight='bold' textAlign='center'>Live Demo is not available on small screens.</Text>
                    </IfElse>
                </Flex>
            </TitleCard>}
        </>
    );
};

export default Pages;