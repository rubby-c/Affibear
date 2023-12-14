'use client';

import React from 'react';
import { useRouter } from "next/navigation";

import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel,
    Box,
    Button,
    Checkbox,
    HStack,
    Icon,
    IconButton,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    Popover, PopoverArrow, PopoverBody,
    PopoverCloseButton,
    PopoverContent, PopoverHeader,
    PopoverTrigger,
    Radio,
    RadioGroup, Select,
    SimpleGrid,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Tab,
    Table,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tag,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tooltip,
    Tr,
    useDisclosure,
    useToast,
    VStack
} from "@chakra-ui/react";

import {
    FaArrowLeft,
    FaArrowRight, FaCalendar, FaCalendarAlt, FaCheck,
    FaChevronLeft, FaCrown, FaDollarSign, FaEdit, FaInfoCircle, FaPencilAlt, FaPlus,
    FaRegCopy, FaShoppingBasket,
    FaTrash, FaWrench
} from "react-icons/fa";
import {FaInfo, FaPencil, FaX} from 'react-icons/fa6'
import { LuMousePointerClick } from "react-icons/lu";

import TitleCard from "@/components/elements/TitleCard";
import TitleOption from "@/components/elements/TitleOption";
import EasyModal from "@/components/elements/EasyModal";
import IfElse from "@/components/helpers/IfElse";

import Api from "@/lib/api";
import { GetAffiliateChart } from "@/lib/charts";
import { COUNTRIES, FLAG_CODE_TABLE, TOAST_OPTIONS } from "@/lib/constants";
import {
    CopyToClipboard,
    GetCurrency,
    GetDateFormat,
    GetDurationText,
    GetNumber,
    GetPlural,
    GetPrettyDate
} from "@/lib/helpers";

import EChartsReact from "echarts-for-react";
import NoSsr from "@/components/helpers/NoSsr";

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from "react-date-range";
import EmojiFlag from "@/components/elements/EmojiFlag";
import {BiReceipt, BiSolidCoupon} from "react-icons/bi";
import {BsCart4} from "react-icons/bs";
import Pagination, {PerPage} from "@/components/elements/Pagination";

const Affiliate = ({ _stats, _data }) => {
    const toast = useToast(TOAST_OPTIONS);
    const router = useRouter();

    const modals = {
        coupon: useDisclosure(),
        payout: useDisclosure(),
        conversion: useDisclosure()
    };

    const [customer, setCustomer] = React.useState({
        open: false,
        data: {}
    });

    const [products, setProducts] = React.useState({
        open: false,
        extra: {},
        array: []
    });
    
    const [affiliate, setAffiliate] = React.useState(_data);
    const [stats, setStats] = React.useState(_stats);
    
    // region Pagination

    const [page, setPage] = React.useState(1);


    
    // endregion

    async function Approve(bool) {
        const res = await Api.patch(`/website/affiliates/approval`, {
            id: affiliate.id,
            approved: bool
        });

        if (res.status === 200) {
            setAffiliate({
                ...affiliate,
                approved: bool
            });
        } else {
            toast({
                title: 'Error',
                status: 'error',
                description: res.data.status ?? res.data
            });
        }
    }

    async function ChangeCoupon() {
        const val = state.coupon.current.value.toUpperCase();

        if (affiliate.coupon === val || val.length < 3) {
            return;
        }

        const res = await Api.patch('/website/affiliates/coupon', {
            affiliateId: affiliate.id,
            coupon: state.coupon.current.value.toUpperCase()
        });

        if (res.status === 200) {
            setAffiliate({
                ...affiliate,
                coupon: state.coupon.current.value.toUpperCase()
            });

            modals.coupon.onClose();
        } else {
            toast({
                title: 'Error',
                status: 'error',
                description: res.data.status ?? res.data
            });
        }
    }

    const state = {
        coupon: React.useRef(null),
        conversions: {
            productName: React.useRef(null),
            commission: React.useRef(null),
            isRoyalty: React.useRef(null),

            quantity: React.useRef(null),
            total: React.useRef(null),
            subtotal: React.useRef(null),

            firstName: React.useRef(null),
            lastName: React.useRef(null),
            email: React.useRef(null),
            country: React.useRef(null)
        },
        payout: {
            amount: React.useRef(null),
            details: React.useRef(null)
        }
    }

    const [tab, setTab] = React.useState(0);

    // region Conversions

    async function AddCustomConversion() {
        let customer = null;

        if (state.conversions.firstName.current.value.length > 0
            || state.conversions.lastName.current.value > 0
            || state.conversions.email.current.value > 0
            || state.conversions.country.current.value > 0) {
            customer = {
                firstName: state.conversions.firstName.current.value,
                lastName: state.conversions.lastName.current.value,
                email: state.conversions.email.current.value,
                country: state.conversions.country.current.value
            };
        }

        const res = await Api.post('/website/conversions', {
            affiliateId: affiliate.id,
            order: {
                commission: state.conversions.commission.current.value,
                isRoyalty: state.conversions.isRoyalty.current.checked,
                product: {
                    name: state.conversions.productName.current.value,
                    quantity: state.conversions.quantity.current.value,
                    total: state.conversions.total.current.value,
                    subTotal: state.conversions.subtotal.current.value
                },
                customer
            }
        });

        if (res.status === 200) {
            setStats(res.data);

            toast({
                title: 'Success',
                status: 'success',
                description: 'You have successfully added a custom conversion.'
            });
        } else {
            toast({
                title: 'Error',
                status: 'error',
                description: res.data.status ?? res.data
            });
        }
    }

    async function DeleteConversion(id) {
        const res = await Api.delete(`/website/conversions?affiliateId=${affiliate.id}&id=${id}`);

        if (res.status === 200) {
            const arr = [...stats];

            const idx = arr.findIndex(x => x.orders.findIndex(y => y.orderId === id) !== -1);
            arr[idx].orders = arr[idx].orders.filter(x => x.orderId !== id);

            setStats(arr);

            toast({
                title: 'Success',
                status: 'success',
                description: 'You have successfully deleted a conversion.'
            });
        } else {
            toast({
                title: 'Error',
                status: 'error',
                description: res.data.status ?? res.data
            });
        }
    }
    
    // endregion

    // region Payouts
    
    async function AddCustomPayout() {
        const res = await Api.post('/website/payouts', {
            affiliateId: affiliate.id,
            amount: state.payout.amount.current.value,
            details: state.payout.details.current.value,
        });

        if (res.status === 200) {
            setAffiliate({ ...affiliate, payouts: [...affiliate.payouts, res.data] });
            modals.payout.onClose();

            toast({
                title: 'Success',
                status: 'success',
                description: 'You have added a custom payout.'
            });
        }
    }

    async function MarkPayout(item, paid) {
        const res = await Api.patch('/website/payouts', {
            affiliateId: affiliate.id,
            payoutId: item.id,
            paid,
            amount: item.amount,
            details: item.details
        });

        if (res.status === 200) {
            const idx = affiliate.payouts.findIndex(i => i.id === item.id);
            const arr = [...affiliate.payouts];
            arr[idx].paid = paid;

            setAffiliate({ ...affiliate, payouts: arr });
            modals.payout.onClose();
        } else {
            toast({
                title: 'Error',
                status: 'error',
                description: res.data.status ?? res.data
            });
        }
    }

    async function DeletePayout(payoutId) {
        const res = await Api.delete(`/website/payouts?affiliateId=${affiliate.id}&id=${payoutId}`);

        if (res.status === 200) {
            const arr = affiliate.payouts.filter(i => i.id !== payoutId);

            setAffiliate({ ...affiliate, payouts: arr });
            modals.payout.onClose();
        } else {
            toast({
                title: 'Error',
                status: 'error',
                description: res.data.status ?? res.data
            });
        }
    }
    
    // endregion

    const [range, setRange] = React.useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: new Date(),
        key: 'selection'
    });

    const filteredStats = stats.filter(i => i.date >= GetDateFormat(range.startDate) && i.date <= GetDateFormat(range.endDate));
    const orders = filteredStats.flatMap(i => i.orders);

    return (
        <>
            <VStack spacing={4} alignItems='stretch'>
                <TitleCard title={affiliate.name}
                           icon={<IconButton onClick={() => router.push('/dashboard/affiliates')} aria-label='Go Back' size='sm' variant='ghost' icon={<FaChevronLeft/>}/>}
                           item={
                               <HStack>
                                   <Popover placement='bottom-start'>
                                       <PopoverTrigger>
                                           <Button size='sm' leftIcon={<FaCalendarAlt/>}
                                                   fontWeight='medium'>{`${GetPrettyDate(range.startDate)} - ${GetPrettyDate(range.endDate)}`}</Button>
                                       </PopoverTrigger>

                                       <PopoverContent w='100%'>
                                           <PopoverArrow/>

                                           <PopoverBody>
                                               <DateRangePicker ranges={[range]} onChange={(e) => setRange({
                                                   ...range,
                                                   startDate: e.selection.startDate,
                                                   endDate: e.selection.endDate
                                               })}/>
                                           </PopoverBody>
                                       </PopoverContent>
                                   </Popover>

                                   <Tooltip placement='bottom-start' label='Click to copy affiliate ID.'>
                                       <IconButton size='sm' variant='ghost' icon={<FaRegCopy/>} aria-label='Copy ID'
                                                   onClick={() => CopyToClipboard(affiliate.id)}/>
                                   </Tooltip>
                               </HStack>
                           }>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <VStack alignItems='start' spacing={4}>
                            <VStack alignItems='start'>
                                <HStack>
                                    <Text>Email: </Text>
                                    <Text pr={2} fontWeight='bold' as='span'>{affiliate.email}</Text>
                                    <IconButton size='sm' icon={<FaRegCopy/>} aria-label='Copy Email'
                                                onClick={() => CopyToClipboard(affiliate.email)}/>
                                </HStack>

                                <HStack spacing={3}>
                                    <Text>Coupon: </Text>
                                    <Tag fontWeight='bold' as='span'>{affiliate.coupon ?? 'None'}</Tag>
                                    <IconButton size='sm' icon={<FaPencil/>} aria-label='Copy Email'
                                                onClick={modals.coupon.onOpen}/>
                                </HStack>
                            </VStack>

                            <SimpleGrid my={2} w='100%' columns={{base: 2, xl: 4}} spacing={8}>
                                <Stat>
                                    <StatLabel>Commissions</StatLabel>
                                    <StatNumber>
                                        <NoSsr>
                                            {GetNumber(
                                                orders.map(i => i.commission)
                                                    .reduce((sum, a) => sum + a, 0)
                                            )}
                                        </NoSsr>
                                    </StatNumber>
                                    <StatHelpText>{`${GetPrettyDate(range.startDate)} - ${GetPrettyDate(range.endDate)}`}</StatHelpText>
                                </Stat>

                                <Stat>
                                    <StatLabel>Clicks</StatLabel>

                                    <HStack spacing={3}>
                                        <StatNumber>
                                            {
                                                filteredStats
                                                    .map(x => x.clicks)
                                                    .reduce((sum, a) => sum + a, 0)
                                            }
                                        </StatNumber>
                                        <LuMousePointerClick fontSize={24}/>
                                    </HStack>

                                    <StatHelpText>{`${GetPrettyDate(range.startDate)} - ${GetPrettyDate(range.endDate)}`}</StatHelpText>
                                </Stat>

                                <Stat>
                                    <StatLabel>Conversions</StatLabel>
                                    <StatNumber>
                                        {
                                            filteredStats
                                                .map(x => x.orders.length)
                                                .reduce((sum, a) => sum + a, 0)
                                        }
                                    </StatNumber>
                                    <StatHelpText>{`${GetPrettyDate(range.startDate)} - ${GetPrettyDate(range.endDate)}`}</StatHelpText>
                                </Stat>

                                <Stat>
                                    <StatLabel>Products Sold</StatLabel>
                                    <StatNumber>
                                        {
                                            orders.map(y => y.products.length)
                                                .reduce((sum, a) => sum + a, 0)
                                        }
                                    </StatNumber>
                                    <StatHelpText>{`${GetPrettyDate(range.startDate)} - ${GetPrettyDate(range.endDate)}`}</StatHelpText>
                                </Stat>
                            </SimpleGrid>

                            <SimpleGrid w='100%' columns={2} spacing={4}>
                                <TitleOption title='Status' subtitle='Unapproved affiliates can&apos;t get sales.'>
                                    <HStack mb={2} spacing={4}>
                                        {affiliate.approved !== null ?
                                            <>
                                                {affiliate.approved ?
                                                    <Tag colorScheme='brand'>APPROVED</Tag>
                                                    : <Tag colorScheme='red'>NOT APPROVED</Tag>}

                                                <IconButton onClick={() => Approve(null)} size='sm'
                                                            icon={<FaPencilAlt/>} aria-label='Change'/>
                                            </>
                                            : <HStack>
                                                <Button onClick={() => Approve(true)} size='sm'
                                                        colorScheme='brand'>Approve</Button>
                                                <Button onClick={() => Approve(false)} size='sm'
                                                        colorScheme='red'>Ignore</Button>
                                            </HStack>}
                                    </HStack>

                                    <NoSsr>
                                        <Text>Affiliate for <Tooltip placement='bottom' label={`Registered on ${new Date(affiliate.registeredAt).toLocaleString()}`}>
                                            <Text fontWeight='bold' as='span'>{GetDurationText(new Date() - new Date(affiliate.registeredAt))}</Text>
                                        </Tooltip>.</Text>
                                    </NoSsr>
                                </TitleOption>

                                <TitleOption title='Commission' subtitle='Commission rates of this affiliate.'>
                                    <RadioGroup value={affiliate.commissions.type.toString()} as={VStack} w='100%'
                                                alignItems='start'
                                                onChange={(value) => setAffiliate({
                                                    ...affiliate,
                                                    commissions: {...affiliate.commissions, type: Number(value)}
                                                })}>

                                        <HStack spacing={4}>
                                            <Radio colorScheme='brand' value='0'>Percentage</Radio>
                                            <Radio colorScheme='brand' value='1'>Fixed</Radio>
                                        </HStack>

                                        {affiliate.commissions.type === 0 && <>
                                            <InputGroup size='sm'>
                                                <Input type='number' w='150px' value={affiliate.commissions.amount}
                                                       onChange={(e) => setAffiliate({
                                                           ...affiliate,
                                                           commissions: {...affiliate.commissions, amount: e.target.value}
                                                       })}/>
                                                <InputRightAddon>%</InputRightAddon>
                                            </InputGroup>

                                            <HStack>
                                                <Checkbox size='sm' isChecked={affiliate.commissions.ignoreProducts}
                                                          onChange={(e) => setAffiliate({
                                                              ...affiliate,
                                                              commissions: {
                                                                  ...affiliate.commissions,
                                                                  ignoreProducts: e.target.checked
                                                              }
                                                          })}>
                                                    Ignore Products
                                                </Checkbox>

                                                <Tooltip label='Product-specific commissions will override affiliate commissions, unless you check this.'>
                                                    <span><FaInfoCircle /></span>
                                                </Tooltip>
                                            </HStack>
                                        </>}

                                        {affiliate.commissions.type === 1 && <>
                                            <InputGroup size='sm'>
                                                <InputLeftAddon>{GetCurrency()}</InputLeftAddon>
                                                <Input w='150px' value={affiliate.commissions.amount}/>
                                            </InputGroup>

                                            <HStack>
                                                <Checkbox size='sm' isChecked={affiliate.commissions.ignoreProducts}
                                                          onChange={(e) => setAffiliate({
                                                              ...affiliate,
                                                              commissions: {
                                                                  ...affiliate.commissions,
                                                                  ignoreProducts: e.target.checked
                                                              }
                                                          })}>
                                                    Ignore Products
                                                </Checkbox>

                                                <Tooltip label='Product-specific commissions will override affiliate commissions, unless you check this.'>
                                                    <span><FaInfoCircle /></span>
                                                </Tooltip>
                                            </HStack>

                                            <Checkbox size='sm' isChecked={affiliate.commissions.applyIndividual}
                                                      onChange={(e) => setAffiliate({
                                                          ...affiliate,
                                                          commissions: {
                                                              ...affiliate.commissions,
                                                              applyIndividual: e.target.checked
                                                          }
                                                      })}>
                                                Apply on each product
                                            </Checkbox>
                                        </>}
                                    </RadioGroup>
                                </TitleOption>
                            </SimpleGrid>
                        </VStack>

                        <VStack justifyContent='center'>
                            <IfElse boolean={filteredStats.length > 0}>
                                <Box w='100%' h={325}>
                                    <EChartsReact notMerge opts={{ height: 325 }} option={GetAffiliateChart(filteredStats)} />
                                </Box>

                                <Text my={8}>No data available.</Text>
                            </IfElse>
                        </VStack>
                    </SimpleGrid>
                </TitleCard>

                <Tabs size='sm' tabIndex={tab} onChange={(num) => setTab(num)} variant='soft-rounded' colorScheme='gray'
                      isLazy>
                    <TitleCard title={<TabList as={HStack}>
                        <Tab py={2} cursor='pointer' as={HStack}>
                            <FaShoppingBasket/>
                            <Text>{GetPlural('Conversion', orders.length)}</Text>
                        </Tab>

                        <Tab py={2} cursor='pointer' as={HStack}>
                            <FaDollarSign/>
                            <Text>{`${affiliate.payouts.length} Payout${affiliate.payouts.length > 1 ? 's' : ''}`}</Text>
                        </Tab>
                    </TabList>} item={<IfElse boolean={tab === 0}>
                        <Button size='sm' onClick={modals.conversion.onOpen} leftIcon={<FaPlus/>}>Create</Button>
                        <Button size='sm' onClick={modals.payout.onOpen} leftIcon={<FaPlus/>}>Create</Button>
                    </IfElse>}>
                        <TabPanels>
                            <TabPanel p={0}>
                                <IfElse boolean={
                                    stats.length > 0 &&
                                    filteredStats.reduce((x, y) => x + y.orders.length, 0) > 0
                                }>
                                    <>
                                        <Box overflowX='auto'>
                                            <Table variant='striped'>
                                                <Thead>
                                                    <Tr>
                                                        <Th>Time</Th>
                                                        <Th>Order Id</Th>
                                                        <Th>Customer</Th>
                                                        <Th>Products</Th>
                                                        <Th>Commission</Th>
                                                        <Th isNumeric>Actions</Th>
                                                    </Tr>
                                                </Thead>

                                                <Tbody>
                                                    {filteredStats.flatMap(i => i.orders).slice((page - 1) * PerPage, page * PerPage).map((order, idx) => {
                                                        return (
                                                            <Tr key={idx}>
                                                                <Td>{new Date(order.timestamp).toLocaleString()}</Td>

                                                                <Td>
                                                                    <Tooltip label='Click to copy the order ID'>
                                                                        <Text as='span' cursor='pointer'
                                                                              onClick={() => CopyToClipboard(order.orderId)}>
                                                                            {order.orderId.substring(0, 6) + '..'}
                                                                        </Text>
                                                                    </Tooltip>
                                                                </Td>

                                                                <Td>
                                                                    {order.customer !== null ? <HStack spacing={3}>
                                                                        <EmojiFlag code={order.customer.country}/>

                                                                        <Text cursor='pointer'
                                                                              onClick={() => setCustomer({
                                                                                  open: true,
                                                                                  data: order.customer
                                                                              })}>{order.customer.firstName}</Text>
                                                                    </HStack> : '─'}
                                                                </Td>

                                                                <Td>
                                                                    <Text as='span' cursor='pointer'
                                                                          onClick={() => setProducts({
                                                                              open: true,
                                                                              custom: order.custom,
                                                                              extra: order.metadata,
                                                                              array: order.products
                                                                          })}>
                                                                        {order.products.length > 1 ?
                                                                            `${order.products.length} products`
                                                                            : order.products[0].quantity > 1
                                                                                ? `${order.products[0].quantity} x ${order.products[0].name}`
                                                                                : order.products[0].name
                                                                        }
                                                                    </Text>
                                                                </Td>

                                                                <Td>
                                                                    <NoSsr>
                                                                        {order.isRoyalty ? <HStack spacing={3}>
                                                                            <Text>{GetNumber(order.commission)}</Text>
                                                                            <Tooltip label='This is a royalty commission.'>
                                                                                <span><FaCrown /></span>
                                                                            </Tooltip>
                                                                        </HStack> : GetNumber(order.commission)}
                                                                    </NoSsr>
                                                                </Td>

                                                                <Td>
                                                                    <HStack justifyContent='end'>
                                                                        <Popover placement='bottom-end' isLazy
                                                                                 size='sm'>
                                                                            <PopoverTrigger>
                                                                                <Button size='sm' leftIcon={<FaTrash/>}
                                                                                        colorScheme='red'>
                                                                                    Delete
                                                                                </Button>
                                                                            </PopoverTrigger>

                                                                            <PopoverContent w='200px'>
                                                                                <PopoverArrow/>
                                                                                <PopoverHeader>Are you sure?</PopoverHeader>
                                                                                <PopoverBody>
                                                                                    <Button w='100%' size='sm'
                                                                                            leftIcon={<FaTrash/>}
                                                                                            onClick={() => DeleteConversion(order.orderId)}
                                                                                            colorScheme='red'>
                                                                                        Delete
                                                                                    </Button>
                                                                                </PopoverBody>
                                                                            </PopoverContent>
                                                                        </Popover>
                                                                    </HStack>
                                                                </Td>
                                                            </Tr>
                                                        )
                                                    })}
                                                </Tbody>
                                            </Table>
                                        </Box>

                                        <Pagination list={stats.flatMap(x => x.orders)} page={page} setPage={setPage} />
                                    </>

                                    <Text>This affiliate doesn&apos;t have any conversions.</Text>
                                </IfElse>
                            </TabPanel>

                            <TabPanel p={0}>
                                <IfElse boolean={affiliate.payouts.length > 0}>
                                    <Box overflowX='auto'>
                                        <Table variant='striped'>
                                            <Thead>
                                                <Tr>
                                                    <Th>Time</Th>
                                                    <Th>Id</Th>
                                                    <Th>Amount</Th>
                                                    <Th>Details</Th>
                                                    <Th>Paid</Th>
                                                    <Th isNumeric>Actions</Th>
                                                </Tr>
                                            </Thead>

                                            <Tbody>
                                                {affiliate.payouts
                                                    .filter(i => new Date(i.createdAt) >= range.startDate && new Date(i.date) <= range.endDate)
                                                    .map((payout, idx) => <Tr key={idx}>
                                                    <Td>{new Date(payout.updatedAt ?? payout.createdAt).toLocaleString()}</Td>
                                                    <Td>
                                                        <Tooltip label={payout.id}>
                                                            <Text as='span' cursor='pointer'
                                                                  onClick={() => CopyToClipboard(payout.id)}>
                                                                {payout.id.substring(0, 6) + '..'}
                                                            </Text>
                                                        </Tooltip>
                                                    </Td>
                                                    <Td>{GetNumber(payout.amount)}</Td>
                                                    <Td>
                                                        <Tooltip label={payout.details}>
                                                            <Text overflow='hidden' whiteSpace='nowrap' w='150px'
                                                                  textOverflow='ellipsis'>
                                                                {payout.details}
                                                            </Text>
                                                        </Tooltip>
                                                    </Td>
                                                    <Td>{payout.paid ? <Icon color='brand.500' as={FaCheck}/> :
                                                        <Icon color='red.500' as={FaX}/>}</Td>
                                                    <Td>
                                                        <HStack justifyContent='end'>
                                                            {payout.paid ?
                                                                <Button onClick={() => MarkPayout(payout, false)}
                                                                        size='sm' leftIcon={<FaX/>}>Mark as
                                                                    pending</Button>
                                                                : <Button onClick={() => MarkPayout(payout, true)}
                                                                          colorScheme='brand' size='sm'
                                                                          leftIcon={<FaCheck/>}>Mark as paid</Button>}

                                                            <Popover placement='bottom-end' isLazy size='sm'>
                                                                <PopoverTrigger>
                                                                    <IconButton colorScheme='red' size='sm'
                                                                                icon={<FaTrash/>} aria-label='Delete'/>
                                                                </PopoverTrigger>

                                                                <PopoverContent w='200px'>
                                                                    <PopoverArrow/>
                                                                    <PopoverCloseButton/>
                                                                    <PopoverHeader>Are you sure?</PopoverHeader>
                                                                    <PopoverBody>
                                                                        <Button onClick={() => DeletePayout(payout.id)}
                                                                                w='100%' size='sm' leftIcon={<FaTrash/>}
                                                                                colorScheme='red'>Delete Payout</Button>
                                                                    </PopoverBody>
                                                                </PopoverContent>
                                                            </Popover>
                                                        </HStack>
                                                    </Td>
                                                </Tr>)}
                                            </Tbody>
                                        </Table>
                                    </Box>

                                    <Text>This affiliate doesn&apos;t have any payouts.</Text>
                                </IfElse>
                            </TabPanel>
                        </TabPanels>
                    </TitleCard>
                </Tabs>
            </VStack>

            <EasyModal icon={BiSolidCoupon} title='Change Code' isOpen={modals.coupon.isOpen} onClose={modals.coupon.onClose}
                       footer={<Button onClick={ChangeCoupon} leftIcon={<Icon as={FaCheck} mr={1}/>}>Save Coupon</Button>}>
                <TitleOption title='Coupon Code' subtitle='Coupon codes have to be unique for every affiliate.'>
                    <Input textTransform='uppercase' fontWeight='medium' placeholder='COUPON123' maxLength={16} ref={state.coupon}/>
                </TitleOption>
            </EasyModal>

            <EasyModal icon={BiReceipt} title='Custom Conversion' isOpen={modals.conversion.isOpen} onClose={modals.conversion.onClose}
                       footer={<Button onClick={AddCustomConversion} leftIcon={<FaPlus/>}>Create</Button>}>
                <VStack alignItems='stretch' spacing={3}>
                    <TitleOption title='Product Name' subtitle='The name of the product being sold.'>
                        <Input type='text' placeholder='1 month subscription' ref={state.conversions.productName}/>
                    </TitleOption>

                    <TitleOption title='Commission' subtitle='The commission for this order.'>
                        <Input type='number' placeholder='10' ref={state.conversions.commission}/>
                    </TitleOption>

                    <TitleOption title='Is this a royalty commission?' subtitle='Royalty commissions are shared with specific affiliates on every sale your shop makes.'>
                        <Checkbox ref={state.conversions.isRoyalty}>Yes</Checkbox>
                    </TitleOption>

                    <Accordion allowToggle>
                        <AccordionItem border='none'>
                            <AccordionButton>
                                <Text fontWeight='medium' as='span' flex='1' textAlign='left'>Product Details
                                    (optional)</Text>

                                <AccordionIcon/>
                            </AccordionButton>

                            <AccordionPanel as={VStack} alignItems='stretch' spacing={4}>
                                <TitleOption title='Quantity' subtitle='How many products have been purchased.'>
                                    <Input type='number' defaultValue={1} placeholder='1'
                                           ref={state.conversions.quantity}/>
                                </TitleOption>

                                <TitleOption title='Total' subtitle='The total price after taxes & discounts.'>
                                    <Input type='number' defaultValue={0} placeholder='(optional)'
                                           ref={state.conversions.total}/>
                                </TitleOption>

                                <TitleOption title='Subtotal' subtitle='The original price of the product.'>
                                    <Input type='number' defaultValue={0} placeholder='(optional)'
                                           ref={state.conversions.subtotal}/>
                                </TitleOption>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>

                    <Accordion allowToggle>
                        <AccordionItem border='none'>
                            <AccordionButton>
                                <Text fontWeight='medium' as='span' flex='1' textAlign='left'>Customer (optional)</Text>

                                <AccordionIcon/>
                            </AccordionButton>

                            <AccordionPanel as={VStack} alignItems='stretch' spacing={4}>
                                <TitleOption title='Name' subtitle='The name of the customer.'>
                                    <Input mb={2} placeholder='First Name' ref={state.conversions.firstName}/>
                                    <Input placeholder='Last Name' ref={state.conversions.lastName}/>
                                </TitleOption>

                                <TitleOption title='Email' subtitle='The customer&apos;s email.'>
                                    <Input type='email' placeholder='(optional)' ref={state.conversions.email}/>
                                </TitleOption>

                                <TitleOption title='Country' subtitle='The customer&apos;s country.'>
                                    <Select defaultValue='US' ref={state.conversions.country}>
                                        {COUNTRIES.map((item, idx) => <option key={idx} value={item.code}>{item.name}</option>)}
                                    </Select>
                                </TitleOption>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                </VStack>
            </EasyModal>

            <EasyModal icon={BiReceipt} title='Custom Payout' isOpen={modals.payout.isOpen} onClose={modals.payout.onClose}
                       footer={<Button onClick={AddCustomPayout} leftIcon={<FaPlus/>}>Create</Button>}>
                <Text mb={4} fontWeight='medium'>* Note: Payouts are automatically created at the end of every payout
                    period.</Text>

                <VStack alignItems='stretch' spacing={3}>
                    <TitleOption title='Amount' subtitle='The amount of money being paid.'>
                        <Input placeholder='100' type='number' ref={state.payout.amount}/>
                    </TitleOption>

                    <TitleOption title='Details' subtitle='Details about the payout, e.g. payout method.'>
                        <Input placeholder='PayPal' ref={state.payout.details}/>
                    </TitleOption>
                </VStack>
            </EasyModal>

            <EasyModal icon={FaInfo} title='Customer Information' isOpen={customer.open}
                       onClose={() => setCustomer({open: false, data: {}})}>
                <VStack alignItems='stretch' spacing={4}>
                    <SimpleGrid columns={2}>
                        <TitleOption title='First Name'>
                            <Text>{customer.data.firstName ?? 'Unknown'}</Text>
                        </TitleOption>

                        <TitleOption title='Last Name'>
                            <Text>{customer.data.lastName ?? 'Unknown'}</Text>
                        </TitleOption>
                    </SimpleGrid>`
                    <TitleOption title='Email'>
                        <Text>{customer.data.email ?? 'Unknown'}</Text>
                    </TitleOption>

                    <TitleOption title='Country'>
                        <HStack>
                            <EmojiFlag code={customer.data.country}/>
                            <Text>{FLAG_CODE_TABLE[customer.data.country] ?? 'Unknown'}</Text>
                        </HStack>
                    </TitleOption>

                    <TitleOption title='IP Address'>
                        <Text>{customer.data.ip ?? 'Unknown'}</Text>
                    </TitleOption>
                </VStack>
            </EasyModal>

            <EasyModal icon={BsCart4} title='Products' isOpen={products.open}
                       onClose={() => setProducts({open: false, custom: false, extra: [], array: []})}
                       footer={products.custom &&
                           <Text my={2} fontWeight='medium'>* This order has been manually added.</Text>}>
                <VStack alignItems='stretch' spacing={4}>
                    {products.array.map((product, idx) => <TitleOption key={idx} title={product.quantity + ' x ' + product.name}>
                        <Text>Total: {GetNumber(product.total)}</Text>
                        <Text>Subtotal: {GetNumber(product.subTotal)}</Text>
                    </TitleOption>)}

                    {products.extra !== null && <TitleOption title='Extra'>
                        {Object.keys(products.extra).map((key, idx) => <TitleOption key={idx} title={key}>{products.extra[key]}</TitleOption>)}
                    </TitleOption>}
                </VStack>
            </EasyModal>
        </>
    );
};

export default Affiliate;