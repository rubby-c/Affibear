'use client';

import React from 'react';

import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button, Checkbox,
    Divider,
    HStack,
    Icon,
    IconButton,
    Input,
    InputGroup,
    InputRightAddon,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger, SimpleGrid,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
    useToast,
    VStack
} from "@chakra-ui/react";

import {
    FaArrowRight, FaCheck, FaEye, FaEyeSlash,
    FaPlus,
    FaStar,
    FaTrash,
    FaWrench
} from "react-icons/fa";

import TitleCard from "@/components/elements/TitleCard";
import TitleOption from "@/components/elements/TitleOption";
import EasyModal from "@/components/elements/EasyModal";

import { EmailEditor } from "react-email-editor";
import Api, { SendRequest } from "@/lib/api";
import { TOAST_OPTIONS } from "@/lib/constants";
import IfElse from "@/components/helpers/IfElse";
import { FaMagnifyingGlass, FaX } from "react-icons/fa6";
import { BsEnvelope } from "react-icons/bs";
import { MultiSelect } from "chakra-multiselect";
import { GetPlural } from "@/lib/helpers";
import { GrTemplate } from "react-icons/gr";
import Pagination, { PerPage } from "@/components/elements/Pagination";

const config = {
    safeHtml: true,
    displayMode: 'email',
    fonts: {
        showDefaultFonts: false,
        customFonts: []
    },
    features: {
        ai: false
    }
};

const Emails = ({data}) => {
    const toast = useToast(TOAST_OPTIONS);
    const modal = useDisclosure();

    const [templates, setTemplates] = React.useState(data.templates);
    const [smtp, setSmtp] = React.useState(data.smtp);

    const [view, setView] = React.useState('create');
    const [editor, setEditor] = React.useState();

    function OnEditorLoad(instance) {
        if (state.data !== '') {
            const json = JSON.parse(state.data);
            instance.loadDesign(json);
        }
    }

    const refHandler = React.useCallback((node) => {
        if (node !== null && node.editor !== null) {
            setEditor(node.editor);

            node.editor.registerCallback('image', async function (file, done) {
                done({ progress: 25 });

                const form = new FormData();
                form.append('image', file.attachments[0]);

                const res = await Api.postForm('/images', form);

                done({ progress: 100, url: res.data });
            });
        }
    }, []);

    const [state, setState] = React.useState({
        id: '',
        favorite: false,
        name: '',
        title: '',
        data: '',
        html: ''
    });

    const [smtpState, setSmtpState] = React.useState({
        open: false,
        view: false,
        success: false,
        loading: false,

        enabled: false,
        server: '',
        port: 587,
        sender: '',
        email: '',
        password: ''
    });

    async function FavoriteTemplate(template) {
        template.favorite = !template.favorite;

        await SendRequest(
            toast,
            'patch',
            '/website/email-templates',
            template,
            () => {
                const arr = [...templates];
                const idx = arr.findIndex(i => i.id === template.id);
                arr[idx].favorite = template.favorite;

                setTemplates(arr);
            },
            null,
            {
                success: {
                    title: 'Success'
                },
                error: (err) => ({
                    title: `Error`,
                    description: err.status ?? err
                }),
                loading: {
                    title: 'Loading..'
                }
            }
        );
    }

    function CreateTemplate() {
        if (state.name.length === 0 || state.title.length === 0) {
            return;
        }

        editor.exportHtml(async (result) => {
            await SendRequest(
                toast,
                'post',
                '/website/email-templates',
                {
                    name: state.name,
                    title: state.title,
                    data: JSON.stringify(result.design),
                    html: result.html
                },
                (res) => {
                    setTemplates([...templates, res.data]);

                    setState({
                        id: '',
                        favorite: false,
                        name: '',
                        title: '',
                        data: '',
                        html: ''
                    });

                    modal.onClose();
                },
                null,
                {
                    success: {
                        title: 'Success'
                    },
                    error: (err) => ({
                        title: `Error`,
                        description: err.status ?? err
                    }),
                    loading: {
                        title: 'Creating..'
                    }
                }
            );
        });
    }

    function EditTemplate() {
        if (state.name.length === 0 || state.title.length === 0) {
            return;
        }

        editor.exportHtml(async (result) => {
            await SendRequest(
                toast,
                'patch',
                '/website/email-templates',
                {
                    id: state.id,
                    favorite: state.favorite,
                    name: state.name,
                    title: state.title,
                    data: JSON.stringify(result.design),
                    html: result.html
                },
                () => {
                    const arr = [...templates];
                    const idx = arr.findIndex(i => i.id === state.id);

                    arr[idx] = {
                        id: state.id,
                        favorite: state.favorite,
                        name: state.name,
                        title: state.title,
                        data: JSON.stringify(result.design),
                        html: result.html
                    };

                    setTemplates(arr);
                    modal.onClose();
                },
                null,
                {
                    success: {
                        title: 'Success'
                    },
                    error: (err) => ({
                        title: `Error`,
                        description: err.status ?? err
                    }),
                    loading: {
                        title: 'Sending..'
                    }
                }
            );
        });
    }

    const [sendState, setSendState] = React.useState({
        open: false,
        emails: [],
        templateId: null,
        affiliates: []
    });

    async function SendTemplate() {
        await SendRequest(
            toast,
            'post',
            '/website/send-email',
            {
                templateId: sendState.templateId,
                affiliates: sendState.affiliates.map(i => i.id)
            },
            () => {
                setSendState({
                    open: false,
                    emails: [],
                    templateId: null,
                    affiliates: []
                });
            },
            null,
            {
                success: {
                    title: 'Success'
                },
                error: (err) => ({
                    title: `Error`,
                    description: err.status ?? err
                }),
                loading: {
                    title: 'Sending..'
                }
            }
        );
    }

    async function DeleteTemplate(id) {
        await SendRequest(
            toast,
            'delete',
            `/website/email-templates?id=${id}`,
            null,
            () => {
                setTemplates(templates.filter(i => i.id !== id));
            },
            null,
            {
                success: {
                    title: 'Success'
                },
                error: (err) => ({
                    title: `Error`,
                    description: err.status ?? err
                }),
                loading: {
                    title: 'Deleting..'
                }
            }
        );
    }

    async function TestSMTP() {
        const {open, view, success, loading, ...rest} = smtpState;

        await SendRequest(
            toast,
            'post',
            `/website/smtp-test`,
            rest,
            null,
            null,
            {
                success: (data) => ({
                    title: 'Success',
                    description: `We've sent a test email to ${data}, check your inbox!`
                }),
                error: (err) => ({
                    title: `Error`,
                    description: err.status ?? err
                }),
                loading: {
                    title: 'Testing..',
                    description: 'We\'re trying to connect to your SMTP server..'
                }
            },
            (res) => setSmtpState({
                ...smtpState,
                success: res.status === 200,
                loading: false
            })
        );


    }

    async function SaveSMTP() {
        setSmtpState({
            ...smtpState,
            loading: true
        });

        const { open, view, success, loading, ...rest } = smtpState;

        await SendRequest(
            toast,
            'post',
            `/website/save-smtp`,
            rest,
            () => {
                setSmtp(rest);

                setSmtpState({
                    open: false,
                    view: false,
                    success: false,
                    loading: false,

                    enabled: false,
                    server: '',
                    port: 587,
                    sender: '',
                    email: '',
                    password: ''
                });
            },
            () => {
                setSmtpState({
                    ...smtpState,
                    loading: false
                });
            },
            {
                success: {
                    title: 'Success',
                    description: `You've successfully saved your SMTP configuration!`
                },
                error: (err) => ({
                    title: `Error`,
                    description: err.status ?? err
                }),
                loading: {
                    title: 'Loading',
                    description: 'Saving changes..'
                }
            }
        );
    }

    const [page, setPage] = React.useState(1);

    return (
        <>
            <TitleCard icon={<BsEnvelope/>} title='Emails' item={
                <Button leftIcon={<GrTemplate/>} onClick={modal.onOpen}>Create Template</Button>
            }>
                <TitleOption title='SMTP Configuration'
                             subtitle={<Text>Your emails are sent through <Text fontWeight='bold'
                                                                                as='span'>{smtp.enabled ? smtp.email : 'no-reply@afficone.com'}</Text>.</Text>}>
                    <Button my={2} onClick={() => setSmtpState({...smtpState, open: true})}
                            leftIcon={<FaWrench/>}>Configure</Button>
                </TitleOption>

                <IfElse boolean={templates.length > 0}>
                    <>
                        <TableContainer mt={4}>
                            <Table variant='striped' colorScheme='gray'>
                                <Thead>
                                    <Tr>
                                        <Th>Name</Th>
                                        <Th isNumeric>Actions</Th>
                                    </Tr>
                                </Thead>

                                <Tbody>
                                    {templates.sort((x, y) => y.favorite - x.favorite).slice((page - 1) * PerPage, page * PerPage).map((template, idx) =>
                                        <Tr key={idx}>
                                            <Td>
                                                <HStack spacing={4}>
                                                    <Icon cursor='pointer' fontSize={24} as={FaStar}
                                                          onClick={() => FavoriteTemplate(template)}
                                                          color={template.favorite ? 'yellow.400' : 'gray.300'}
                                                          aria-label='Favorite'/>
                                                    <Text>{template.name}</Text>
                                                </HStack>
                                            </Td>
                                            <Td>
                                                <HStack justifyContent='end'>
                                                    <Button onClick={() => {
                                                        setView('edit');
                                                        setState(template);

                                                        modal.onOpen();
                                                    }} leftIcon={<FaWrench/>} size='sm'>Edit</Button>

                                                    <Button onClick={async () => {
                                                        const res = await Api.get('/website/affiliate-emails');

                                                        setSendState({
                                                            ...sendState,
                                                            open: true,
                                                            emails: res.data,
                                                            templateId: template.id
                                                        });
                                                    }} colorScheme='brand' rightIcon={<FaArrowRight/>}
                                                            size='sm'>Send</Button>

                                                    <Popover placement='bottom-end' isLazy
                                                             size='sm'>
                                                        <PopoverTrigger>
                                                            <IconButton size='sm' colorScheme='red' icon={<FaTrash/>}
                                                                        aria-label='Delete Template'/>
                                                        </PopoverTrigger>

                                                        <PopoverContent w='200px'>
                                                            <PopoverArrow/>
                                                            <PopoverHeader>Are you sure?</PopoverHeader>
                                                            <PopoverBody>
                                                                <Button w='100%' size='sm'
                                                                        leftIcon={<FaTrash/>}
                                                                        onClick={() => DeleteTemplate(template.id)}
                                                                        colorScheme='red'>
                                                                    Delete
                                                                </Button>
                                                            </PopoverBody>
                                                        </PopoverContent>
                                                    </Popover>
                                                </HStack>
                                            </Td>
                                        </Tr>)}
                                </Tbody>
                            </Table>
                        </TableContainer>

                        <Pagination list={templates} page={page} setPage={setPage}/>
                    </>

                    <Text>You don&apos;t have any email templates.</Text>
                </IfElse>
            </TitleCard>


            <EasyModal icon={GrTemplate} title='Create a Template' size='6xl' isOpen={modal.isOpen}
                       onClose={() => {
                           modal.onClose();

                           setState({
                               id: '',
                               favorite: false,
                               name: '',
                               data: ''
                           });
                       }}
                       footer={<IfElse boolean={view === 'create'}>
                           <Button onClick={CreateTemplate} leftIcon={<FaPlus/>}>Create Template</Button>
                           <Button onClick={EditTemplate} leftIcon={<Icon as={FaCheck} mr={1}/>}>Save Template</Button>
                       </IfElse>}>
                <VStack spacing={4} alignItems='stretch'>
                    <TitleOption title='Template Name' subtitle='Private identifier for this template'>
                        <Input variant='flushed' value={state.name}
                               onChange={(e) => setState({...state, name: e.target.value})}
                               placeholder='Test Email Campaign'/>
                    </TitleOption>

                    <HStack w='100%' spacing={4}>
                        <TitleOption w='100%' title='Email Title' subtitle='* You can use variables in here!'>
                            <Input value={state.title} onChange={(e) => setState({...state, title: e.target.value})}
                                   placeholder='{AFFILIATE_NAME}&apos;s Monthly Report'/>
                        </TitleOption>

                        <TitleOption w='100%' title='Variables' subtitle='Make your emails personalized ✨'>
                            <Popover placement='bottom-start' isLazy>
                                <PopoverTrigger>
                                    <Button leftIcon={<FaWrench/>} colorScheme='brand'>
                                        Variables List
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent w='auto'>
                                    <PopoverArrow/>
                                    <PopoverBody>
                                        <Accordion as={VStack} alignItems='stretch' allowToggle allowMultiple>
                                            <Text py={2} fontWeight='medium' whiteSpace='nowrap'>* Variables apply for
                                                all text, including links.</Text>

                                            <TitleOption title='{AFFILIATE_NAME}'
                                                         subtitle='Full name of the affiliate.'/>

                                            <Divider/>

                                            <TitleOption title='{AFFILIATE_LINK}'
                                                         subtitle='Link to the affiliate&apos;s dashboard.'/>

                                            <Divider/>

                                            <AccordionItem border='none'>
                                                <AccordionButton p={0} _hover={{}} as={HStack}
                                                                 justifyContent='space-between'>
                                                    <TitleOption title='{AFFILIATE_EARNINGS}'
                                                                 subtitle='Monthly earnings of the affiliate.'/>

                                                    <AccordionIcon cursor='pointer'/>
                                                </AccordionButton>

                                                <AccordionPanel p={0}>
                                                    <TitleOption sub title='{AFFILIATE_EARNINGS_WEEKLY}'
                                                                 subtitle='Earnings in the past 7 days.'/>
                                                    <TitleOption sub title='{AFFILIATE_EARNINGS_YEARLY}'
                                                                 subtitle='Year-to-date earnings.'/>
                                                </AccordionPanel>
                                            </AccordionItem>

                                            <Divider/>

                                            <AccordionItem border='none'>
                                                <AccordionButton p={0} _hover={{}} as={HStack}
                                                                 justifyContent='space-between'>
                                                    <TitleOption title='{AFFILIATE_CLICKS}'
                                                                 subtitle='Monthly clicks of the affiliate.'/>

                                                    <AccordionIcon cursor='pointer'/>
                                                </AccordionButton>

                                                <AccordionPanel p={0}>
                                                    <TitleOption sub title='{AFFILIATE_CLICKS_WEEKLY}'
                                                                 subtitle='Clicks in the past 7 days.'/>
                                                    <TitleOption sub title='{AFFILIATE_CLICKS_YEARLY}'
                                                                 subtitle='Year-to-date clicks.'/>
                                                </AccordionPanel>
                                            </AccordionItem>

                                            <Divider/>

                                            <AccordionItem border='none'>
                                                <AccordionButton p={0} _hover={{}} as={HStack}
                                                                 justifyContent='space-between'>
                                                    <TitleOption title='{AFFILIATE_CONVERSIONS}'
                                                                 subtitle='Monthly conversions of the affiliate.'/>

                                                    <AccordionIcon cursor='pointer'/>
                                                </AccordionButton>

                                                <AccordionPanel p={0}>
                                                    <TitleOption sub title='{AFFILIATE_CONVERSIONS_WEEKLY}'
                                                                 subtitle='Conversions in the past 7 days.'/>
                                                    <TitleOption sub title='{AFFILIATE_CONVERSIONS_YEARLY}'
                                                                 subtitle='Year-to-date conversions.'/>
                                                </AccordionPanel>
                                            </AccordionItem>
                                        </Accordion>
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                        </TitleOption>
                    </HStack>

                    <Box boxShadow='xs'>
                        <EmailEditor onLoad={OnEditorLoad} editorId='email-editor'
                                     options={config} minHeight='60vh' ref={refHandler}/>
                    </Box>
                </VStack>
            </EasyModal>


            <EasyModal icon={BsEnvelope} title='Send Template' isOpen={sendState.open} onClose={() => setSendState({
                ...sendState,
                open: false,
                emails: [],
                templateId: null,
                affiliates: []
            })} footer={<Button onClick={SendTemplate} colorScheme='brand' rightIcon={<Icon as={FaArrowRight} ml={1}/>}>Send Emails</Button>}>
                <TitleOption title='Send to:'>
                    <MultiSelect value={sendState.affiliates}
                                 selectedListProps={{
                                     size: 'sm'
                                 }}
                                 onChange={(values) => setSendState({ ...sendState, affiliates: values })}
                                 options={sendState.emails.map(item => ({
                                     id: item.email,
                                     value: item.name
                                 }))}
                                 placeholder={GetPlural('Affiliate', sendState.emails.length)}
                                 actionGroupProps={{
                                     clearButtonProps: {
                                         icon: () => <FaX />,
                                         size: 'sm'
                                     },
                                     toggleButtonProps: {
                                         m: 2
                                     }
                                 }}
                                 multiple />

                    <Text mt={2} fontSize={14}>* The email will be sent to all of your affiliates if you do not select anything.</Text>
                </TitleOption>
            </EasyModal>


            <EasyModal size='4xl' icon={FaWrench} title='Configure SMTP' isOpen={smtpState.open}
                       onClose={() => setSmtpState({...smtpState, open: false})}
                       footer={
                           <HStack w='100%' justifyContent='space-between'>
                               <Button isLoading={!smtpState.success && smtpState.loading}
                                       isDisabled={!smtpState.enabled} onClick={TestSMTP}
                                       leftIcon={<FaMagnifyingGlass/>}>Test Configuration</Button>
                               <Button isLoading={smtpState.success && smtpState.loading}
                                       isDisabled={!smtpState.success}
                                       colorScheme={smtpState.success ? 'brand' : 'gray'} onClick={SaveSMTP}
                                       leftIcon={<FaWrench/>}>Save Changes</Button>
                           </HStack>
                       }>
                <Text mb={3}>The data submitted here is securely encrypted on our servers.</Text>

                <SimpleGrid spacing={8} columns={{base: 1, lg: 2}}>
                    <VStack alignItems='stretch' spacing={4}>
                        <TitleOption title='Custom SMTP' subtitle='Do you want to use a custom SMTP server?'
                                     category='Server'>
                            <Checkbox isChecked={smtpState.enabled}
                                      onChange={(e) => setSmtpState({...smtpState, enabled: e.target.checked})}>
                                Enabled
                            </Checkbox>
                        </TitleOption>

                        <TitleOption title='Host' subtitle='The SMTP address of your mail server.' category='Server'>
                            <Input isDisabled={!smtpState.enabled} value={smtpState.server}
                                   onChange={(e) => setSmtpState({...smtpState, server: e.target.value})}
                                   placeholder='smtp.gmail.com'/>
                        </TitleOption>

                        <TitleOption title='Port' subtitle='Most commonly 587 (TLS) or 465 (SSL).'>
                            <Input isDisabled={!smtpState.enabled} value={smtpState.port}
                                   onChange={(e) => setSmtpState({...smtpState, port: e.target.value})} type='number'
                                   placeholder={587}/>
                        </TitleOption>
                    </VStack>

                    <VStack alignItems='stretch' spacing={4}>
                        <TitleOption title='Name' subtitle='The display name of the sender.' category='Sender'>
                            <Input isDisabled={!smtpState.enabled} value={smtpState.sender}
                                   onChange={(e) => setSmtpState({...smtpState, sender: e.target.value})}
                                   placeholder='Your Business Name'/>
                        </TitleOption>

                        <TitleOption title='Email' subtitle='The email address used for sending emails.'>
                            <Input isDisabled={!smtpState.enabled} value={smtpState.email}
                                   onChange={(e) => setSmtpState({...smtpState, email: e.target.value})}
                                   autoComplete='false' type='email' placeholder='example@email.com'/>
                        </TitleOption>

                        <TitleOption title='Password' subtitle='The password of the email address.'>
                            <InputGroup>
                                <Input isDisabled={!smtpState.enabled} value={smtpState.password}
                                       onChange={(e) => setSmtpState({...smtpState, password: e.target.value})}
                                       type={smtpState.view ? 'text' : 'password'} autoComplete='false'
                                       placeholder='Password'/>

                                <InputRightAddon borderBottom='1px solid' borderColor='inherit' bg='transparent' px={0}>
                                    <IconButton onClick={() => setSmtpState({...smtpState, view: !smtpState.view})}
                                                borderRadius='0'
                                                icon={smtpState.view ? <FaEyeSlash/> : <FaEye/>} variant='ghost'
                                                aria-label='Show / hide password'/>
                                </InputRightAddon>
                            </InputGroup>
                        </TitleOption>
                    </VStack>
                </SimpleGrid>
            </EasyModal>
        </>
    );
};

export default Emails;