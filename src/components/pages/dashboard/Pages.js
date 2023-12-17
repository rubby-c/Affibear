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

import { FaEye, FaWrench } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BiScreenshot } from "react-icons/bi";

import Api, {SendRequest} from "@/lib/api";

import ColorPicker from "@/components/elements/ColorPicker";
import TitleCard from "@/components/elements/TitleCard";
import FileUpload from "@/components/elements/FileUpload";
import IfElse from "@/components/helpers/IfElse";

import { TOAST_OPTIONS } from "@/lib/constants";
import { BlobToBase64 } from "@/lib/helpers";
import TitleOption from "@/components/elements/TitleOption";

const Pages = ({ data }) => {
    const [isComputer] = useMediaQuery('(min-width: 976px)', {
        ssr: true,
        fallback: true
    });

    const toast = useToast(TOAST_OPTIONS)
    const [settings, setSettings] = React.useState(data.settings);

    const [files, setFiles] = React.useState({
        logo: null,
        header: null,
        background: null
    });

    async function Update() {
        await SendRequest(
            toast,
            'post',
            `/website/settings`,
            settings,
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
        setSettings({
            ...settings,
            logo: files.logo !== null ? await BlobToBase64(files.logo) : settings.logo,
            header: files.header !== null ? await BlobToBase64(files.header) : settings.header,
            background: {
                ...settings.background,
                image: files.background !== null ? await BlobToBase64(files.background) : settings.background.image
            }
        });
    }

    React.useEffect(() => { UpdatePreviews(); }, [files]);

    return (
        <TitleCard title='Registration' icon={<BiScreenshot fontSize={20} />} item={<Button onClick={Update} leftIcon={<FaWrench />}>Save Changes</Button>}>
            <Flex flexDirection={{ base: 'column', xl: 'row' }} justifyContent='start' alignItems='stretch' gap='32px'>
                <VStack w={{ base: '100%', xl: 'auto' }} alignItems='stretch' spacing={4} flex='1'>
                    <SimpleGrid columns={2}>
                        <div>
                            <Checkbox isChecked={settings.useLogo}
                                      onChange={(e) => setSettings({ ...settings, useLogo: e.target.checked })}
                                      fontWeight='medium'>Website Logo</Checkbox>

                            <Text fontSize={14} mb={2}>min. 256x256 (1:1)</Text>

                            <FileUpload
                                hasFile={settings.logo !== null}
                                name='logo' w='100px' h='100px'
                                onChange={(file) => setFiles({ ...files, logo: file })}
                                types={['.png', '.jpg', '.jpeg', '.webp']}
                                maxSize={8}
                                children={
                                    <Image bg='var(--bg)' w='100px' h='100px' aspectRatio='1 / 1' src={settings.logo} />
                                }
                            />
                        </div>

                        <div>
                            <Checkbox isChecked={settings.useHeader}
                                      onChange={(e) => setSettings({ ...settings, useHeader: e.target.checked })}
                                      fontWeight='medium'>Header Image</Checkbox>

                            <Text fontSize={14} mb={2}>min. 960x240 (4:1)</Text>

                            <FileUpload
                                hasFile={settings.header !== null}
                                name='header' w='auto'
                                onChange={(file) => {
                                    setFiles({ ...files, header: file });
                                }}
                                types={['.png', '.jpg', '.jpeg', '.webp']}
                                maxSize={8}
                                children={
                                    <Image bg='var(--bg)' w='100%' maxH='100px' src={settings.header ?? '/images/placeholders/no-header.png'} />
                                }
                            />
                        </div>
                    </SimpleGrid>

                    <TitleOption category='Settings' title='Authentication'>
                        <VStack alignItems='stretch'>
                            <Checkbox isChecked={settings.auth.captcha}
                                      onChange={(e) => setSettings({ ...settings, auth: { ...settings.auth, captcha: e.target.checked }})}
                                      fontWeight='medium'>Use invisible captcha (recommended)</Checkbox>

                            <Checkbox isChecked={settings.auth.google}
                                      onChange={(e) => setSettings({ ...settings, auth: { ...settings.auth, google: e.target.checked }})}
                                      fontWeight='medium'>Allow Google login</Checkbox>
                        </VStack>
                    </TitleOption>

                    <TitleOption title='Background'>
                        <RadioGroup value={settings.background.useImage.toString()} as={VStack} w='100%'
                                    onChange={(val) => setSettings({ ...settings, background: { ...settings.background, useImage: val === 'true' }})}>
                            <HStack w='100%' justifyContent='space-between'>
                                <Radio value='false' colorScheme='brand'>Color</Radio>

                                <ColorPicker color={settings.background.color} button
                                             setColor={(value) => setSettings({ ...settings, background: { ...settings.background, color: value }})}/>
                            </HStack>

                            <HStack w='100%' justifyContent='space-between'>
                                {settings.background.useImage ? <VStack alignItems='start'>
                                    <Radio value='true' colorScheme='brand'>
                                        Image
                                        {settings.background.useImage && <Text fontSize={14}>recom. 1920x1080 (16:9)</Text>}
                                    </Radio>

                                    <VStack alignItems='stretch'>
                                        <TitleOption subtitle={<Text mb={2}><Text as='code' fontWeight='bold'>background-repeat</Text> property:</Text>}>
                                            <Input value={settings.backgroundRepeat} onChange={(e) => setSettings({ ...settings, background: { ...settings.background, backgroundRepeat: e.target.value } })} placeholder='no-repeat' size='sm' />
                                        </TitleOption>

                                        <TitleOption subtitle={<Text mb={2}><Text as='code' fontWeight='bold'>background-size</Text> property:</Text>}>
                                            <Input value={settings.backgroundSize} onChange={(e) => setSettings({ ...settings, background: { ...settings.background, backgroundSize: e.target.value } })} placeholder='cover' size='sm' />
                                        </TitleOption>
                                    </VStack>
                                </VStack> : <Radio value='true' colorScheme='brand'>
                                    Image
                                </Radio>}

                                {settings.background.useImage && <FileUpload
                                    hasFile={settings.background.image !== null}
                                    name='background' w='100px'
                                    onChange={(file) => {
                                        setFiles({ ...files, background: file });
                                    }}
                                    types={['.png', '.jpg', '.jpeg', '.webp']}
                                    maxSize={8}
                                    children={
                                        <Image bg='var(--bg)' w='100px' aspectRatio='16 / 9' src={settings.background.image} />
                                    }
                                />}
                            </HStack>
                        </RadioGroup>
                    </TitleOption>

                    <VStack alignItems='stretch' spacing={4}>
                        <TitleOption category='Content' title='Description'>
                            <Input value={settings.description} onChange={(e) => setSettings({ ...settings, description: e.target.value })} />
                        </TitleOption>

                        <TitleOption sub title='Callout #1'>
                            <Input value={settings.callouts[0]}
                                   onChange={(e) => setSettings({ ...settings, callouts: [e.target.value, settings.callouts[1], settings.callouts[2]] })}
                                   size='sm' placeholder='<empty>' />
                        </TitleOption>

                        <TitleOption sub title='Callout #2'>
                            <Input value={settings.callouts[1]}
                                   onChange={(e) => setSettings({ ...settings, callouts: [settings.callouts[0], e.target.value, settings.callouts[2]] })}
                                   size='sm' placeholder='<empty>' />
                        </TitleOption>

                        <TitleOption sub title='Callout #3'>
                            <Input value={settings.callouts[2]}
                                   onChange={(e) => setSettings({ ...settings, callouts: [settings.callouts[0], settings.callouts[1], e.target.value] })}
                                   size='sm' placeholder='<empty>' />
                        </TitleOption>
                    </VStack>
                </VStack>

                <IfElse boolean={isComputer}>
                    <VStack pos='relative' flex='2' boxShadow='lg' w='100%' justifyContent='center'
                            bg={settings.background.useImage ? `url(${settings.background.image})` : settings.background.color}>

                        <Box bg='#fdffb6' pos='absolute' top='0' left='0' fontWeight='bold' p={2}>
                            <Text>Live Demo</Text>
                        </Box>

                        <VStack w='100%' justifyContent='center' transform='scale(0.75)' aspectRatio='16 / 9'>
                            {settings.useHeader && <Image mb={4} alignSelf='center' w='500px' src={settings.header ?? '/images/placeholders/no-header.png'} />}

                            <SimpleGrid maxW='1000px' columns={2} p={6} borderRadius='xl' bg='#fff' boxShadow='xl' spacing={4}>
                                <div>
                                    {settings.useLogo ? <HStack spacing={4} mb={4}>
                                        <Image h='40px' aspectRatio='1 / 1' src={settings.logo} />
                                        <Text fontWeight='medium' fontSize={48}>{data.name}</Text>
                                    </HStack> : <Text mb={4} fontWeight='medium' fontSize={48}>{data.name}</Text>}

                                    <Text fontSize={18}>{settings.description}</Text>

                                    <VStack my={8} ps={4} alignItems='start' as='ul' fontSize={18}>
                                        {settings.callouts.map((text, idx) => text.length > 0 && <li key={idx}>{text}</li>)}
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

                                        {settings.auth.google &&
                                            <Button leftIcon={<FcGoogle/>}>Login with Google</Button>}
                                    </VStack>

                                    <Text fontSize={12}>By signing up you agree to Afficone&apos;s <Link as={NextLink} href='#'>Terms of Service</Link> and <Link as={NextLink} href='/privacy'>Privacy Policy</Link>.</Text>
                                </VStack>
                            </SimpleGrid>
                        </VStack>
                    </VStack>

                    <Text fontSize={18} mb={2} fontWeight='bold' textAlign='center'>Live Demo is not available on small screens.</Text>
                </IfElse>
            </Flex>
        </TitleCard>
    );
};

export default Pages;