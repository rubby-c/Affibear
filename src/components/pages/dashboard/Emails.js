'use client';

import React from 'react';

import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel,
    Box,
    Button, Divider, HStack, Icon, IconButton,
    Input, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverHeader, PopoverTrigger, Select,
    Table,
    TableContainer, Tag, TagCloseButton, TagLabel,
    Tbody, Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure, useToast,
    VStack
} from "@chakra-ui/react";

import {
    FaArrowRight, FaCheck,
    FaEnvelope,
    FaPen,
    FaPencilAlt,
    FaPlus,
    FaSave,
    FaStar,
    FaStarHalfAlt, FaTrash,
    FaWrench
} from "react-icons/fa";

import TitleCard from "@/components/elements/TitleCard";
import TitleOption from "@/components/elements/TitleOption";
import EasyModal from "@/components/elements/EasyModal";

import { EmailEditor } from "react-email-editor";
import Api from "@/lib/api";
import { TOAST_OPTIONS } from "@/lib/constants";
import IfElse from "@/components/helpers/IfElse";
import {FaPencil, FaRankingStar, FaX} from "react-icons/fa6";
import {BsEnvelope} from "react-icons/bs";
import {MultiSelect} from "chakra-multiselect";
import {GetPlural} from "@/lib/helpers";

const config = {
    safeHtml: true,
    displayMode: 'email',
    fonts: {
        showDefaultFonts: false,
        customFonts: [

        ]
    },
    features: {
        ai: false
    }
};

const Emails = ({ _data }) => {
    const toast = useToast(TOAST_OPTIONS);
    const modal = useDisclosure();

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

    const [data, setData] = React.useState(_data);

    const [state, setState] = React.useState({
        id: '',
        favorite: false,
        name: '',
        title: '',
        data: '',
        html: ''
    });

    async function FavoriteTemplate(template) {
        template.favorite = !template.favorite;

        const res = await Api.patch('/website/email-templates', template);

        if (res.status === 200) {
            const arr = [...data];
            const idx = arr.findIndex(i => i.id === template.id);
            arr[idx].favorite = template.favorite;

            setData(arr);
        } else {
            toast({
                title: `Error`,
                description: res.data.status ?? res.data,
                status: 'error'
            });
        }
    }

    function CreateTemplate() {
        editor.exportHtml(async (result) => {
            const res = await Api.post('/website/email-templates', {
                name: state.name,
                title: state.title,
                data: JSON.stringify(result.design),
                html: result.html
            });

            if (res.status === 200) {
                setData([...data, res.data]);

                toast({
                    title: `Success`,
                    description: 'You have successfully created an email template.',
                    status: 'success'
                });

                setState({
                    name: ''
                });

                modal.onClose();
            } else {
                toast({
                    title: `Error`,
                    description: res.data.status ?? res.data,
                    status: 'error'
                });
            }
        });
    }

    function EditTemplate() {
        editor.exportHtml(async (result) => {
            const res = await Api.patch('/website/email-templates', {
                id: state.id,
                favorite: state.favorite,
                name: state.name,
                title: state.title,
                data: JSON.stringify(result.design),
                html: result.html
            });

            if (res.status === 200) {
                const arr = [...data];
                const idx = arr.findIndex(i => i.id === state.id);
                arr[idx] = {
                    id: state.id,
                    favorite: state.favorite,
                    name: state.name,
                    title: state.title,
                    data: JSON.stringify(result.design),
                    html: result.html
                };

                setData(arr);

                modal.onClose();
            } else {
                toast({
                    title: `Error`,
                    description: res.data.status ?? res.data,
                    status: 'error'
                });
            }
        });
    }

    const [sendState, setSendState] = React.useState({
        open: false,
        emails: [],
        templateId: null,
        affiliates: []
    });

    async function SendTemplate() {
        const res = await Api.post('/website/send-email', {
            templateId: sendState.templateId,
            affiliates: sendState.affiliates.map(i => i.id)
        });

        if (res.status === 200) {
            toast({
                title: `Success`,
                description: `You have successfully sent an email to ${sendState.affiliates.length} affiliates.`,
                status: 'success'
            });

            setSendState({
                open: false,
                emails: [],
                templateId: null,
                affiliates: []
            });
        } else {
            toast({
                title: `Error`,
                description: res.data.status ?? res.data,
                status: 'error'
            });
        }
    }

    async function DeleteTemplate(id) {
        const res = await Api.delete(`/website/email-templates?id=${id}`);

        if (res.status === 200) {
            toast({
                title: `Success`,
                description: `You have successfully deleted an email template.`,
                status: 'success'
            });

            setData(data.filter(i => i.id !== id));
        } else {
            toast({
                title: `Error`,
                description: res.data.status ?? res.data,
                status: 'error'
            });
        }
    }

    return (
        <>
            <TitleCard icon={<BsEnvelope/>} title='Emails' item={
                <Button leftIcon={<FaPlus/>} onClick={modal.onOpen}>Create Template</Button>
            }>
                <IfElse boolean={data.length > 0}>
                    <TableContainer>
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th isNumeric>Actions</Th>
                                </Tr>
                            </Thead>

                            <Tbody>
                                {data.sort((x, y) => y.favorite - x.favorite).map((template, idx) => <Tr key={idx}>
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
                                            }} leftIcon={<FaWrench />} size='sm'>Edit</Button>

                                            <Button onClick={async () => {
                                                const res = await Api.get('/website/emails');

                                                setSendState({
                                                    ...sendState,
                                                    open: true,
                                                    emails: res.data,
                                                    templateId: template.id
                                                });
                                            }} colorScheme='brand' rightIcon={<FaArrowRight />} size='sm'>Send</Button>

                                            <Popover placement='bottom-end' isLazy
                                                     size='sm'>
                                                <PopoverTrigger>
                                                    <IconButton size='sm' colorScheme='red' icon={<FaTrash />} aria-label='Delete Template' />
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

                    <Text>You don&apos;t have any email templates.</Text>
                </IfElse>
            </TitleCard>

            <EasyModal title={<TitleOption title='Template Name'>
                    <Input variant='flushed' value={state.name}
                           onChange={(e) => setState({...state, name: e.target.value})}
                           placeholder='Test Email Campaign'/>
                </TitleOption>} size='6xl' isOpen={modal.isOpen}
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
                               <Button onClick={CreateTemplate} leftIcon={<FaPlus/>}>Create</Button>
                               <Button onClick={EditTemplate} leftIcon={<Icon as={FaCheck} mr={1}/>}>Save Template</Button>
                           </IfElse>}>
                <VStack mt={4} spacing={4} alignItems='stretch'>
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

                                            <TitleOption title='{AFFILIATE_NAME}' subtitle='Full name of the affiliate.'/>

                                            <Divider/>

                                            <TitleOption title='{AFFILIATE_LINK}' subtitle='Link to the affiliate&apos;s dashboard.'/>

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

            <EasyModal title='Send Template' isOpen={sendState.open} onClose={() => setSendState({ ...sendState, open: false, emails: [], templateId: null, affiliates: [] })}
                       footer={<Button onClick={SendTemplate} colorScheme='brand' rightIcon={<Icon as={FaArrowRight} ml={1} />}>Send Emails</Button>}>
                <TitleOption title='Send to:'>
                    <MultiSelect value={sendState.affiliates}
                                 selectedListProps={{
                                     size: 'sm'
                                 }}
                                 onChange={(values) => setSendState({ ...sendState, affiliates: values })}
                                 options={sendState.emails.map(item => ({ id: item.email, value: item.name + ` (${item.email})` }))}
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
        </>
    );
};

export default Emails;