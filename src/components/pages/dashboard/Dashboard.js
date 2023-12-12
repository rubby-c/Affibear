'use client';

import React from 'react';
import {
    Box, Button, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger,
    SimpleGrid,
    Step, StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    Stepper, StepSeparator,
    StepStatus, StepTitle, Text,
    useSteps,
    VStack
} from "@chakra-ui/react";

import Statistics from "@/components/elements/Statistics";
import TitleCard from "@/components/elements/TitleCard";
import NextLink from "next/link";
import { BsPercent } from "react-icons/bs";
import { BiScreenshot, BiUser } from "react-icons/bi";
import {FaCalendarAlt, FaCheck, FaDollarSign, FaStar} from "react-icons/fa";

import {GetDateFormat, GetPrettyDate} from "@/lib/helpers";
import { DateRangePicker } from "react-date-range";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const steps = [
    { icon: <BsPercent />, title: 'Commissions', link: '/dashboard/commissions', description: 'Set the default commission rates of your affiliates.' },
    { icon: <BiScreenshot />, title: 'Design', link: '/dashboard/pages', description: 'Customize your affiliate landing page.' },
    { icon: <BiUser />, title: 'Affiliates', link: '/dashboard/affiliates', description: 'Invite or manually add your first affiliate.' }
];

function GetTutorialIndex(tutorial) {
    if (tutorial.affiliates) {
        return 3;
    }

    if (tutorial.design) {
        return 2;
    }

    if (tutorial.commissions) {
        return 1;
    }

    return 0;
}

function GetPreviousRange(x) {
    const range = structuredClone(x);

    const diff = Math.round((range.endDate - range.startDate) / 86400000);

    range.endDate = range.startDate;
    range.startDate.setDate(range.startDate.getDate() - diff);

    return range;
}

function GetStats(x, range) {
    const stats = x.filter(i => i.date >= GetDateFormat(range.startDate) && i.date <= GetDateFormat(range.endDate))

    let _revenueGross = 0;
    let _revenueNet = 0;
    let _clicks = 0;
    let _conversions = 0;
    let _productsSold = 0;

    for (let x = 0; x < stats.length; x++) {
        _clicks += stats[x].clicks;

        for (let y = 0; y < stats[x].orders.length; y++) {
            _conversions += stats[x].orders.length;
            _productsSold += stats[x].orders[y].products.length;

            for (let z = 0; z < stats[x].orders[y].products.length; z++) {
                _revenueGross += stats[x].orders[y].products[z].total === 0 ? stats[x].orders[z].commission : stats[x].orders[y].products[z].total;
                _revenueNet += stats[x].orders[y].products[z].total === 0 ? stats[x].orders[z].commission : stats[x].orders[y].products[z].total - stats[x].orders[z].commission ?? 0;
            }
        }
    }

    return {
        _revenueGross,
        _revenueNet,
        _clicks,
        _conversions,
        _productsSold
    };
}

const Dashboard = ({ _data }) => {
    const { activeStep } = useSteps({
        index: GetTutorialIndex(_data.info.tutorial),
        count: steps.length
    });

    const [range, setRange] = React.useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: new Date(),
        key: 'selection'
    });

    const preValues = GetStats(_data.stats, GetPreviousRange(range));
    const values = GetStats(_data.stats, range);

    const stats = [
        { label: 'Revenue', value: values._revenueGross, prev: 80 },
        { label: 'Revenue', value: values._revenueNet, prev: 80 },
        { label: 'Clicks', value: values._clicks, prev: 10 },
        { label: 'Conversions', value: values._conversions, prev: 10 },
    ];

    const [net, setNet] = React.useState(true);

    return (
        <VStack alignItems='stretch' spacing={4}>
            <TitleCard icon={<FaStar/>} title='Welcome to Affibear' item={<Popover placement='bottom-start'>
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
            </Popover>} mb={2}>
                <Text mb={6}>Let's get you started! First off, you should complete the first essential steps for an great affiliate program.</Text>

                <Stepper colorScheme='brand' index={activeStep}>
                    {steps.map((step, index) => (
                        <Step key={index}>
                            <StepIndicator mr={2}>
                                <StepStatus
                                    complete={<FaCheck/>}
                                    incomplete={step.icon}
                                    active={step.icon}
                                />
                            </StepIndicator>

                            <Box flexShrink='0'>
                                <StepTitle>
                                    <NextLink href={step.link}>
                                        {step.title}
                                    </NextLink>
                                </StepTitle>

                                <StepDescription w={250}>{step.description}</StepDescription>
                            </Box>

                            <StepSeparator />
                        </Step>
                    ))}
                </Stepper>
            </TitleCard>

            <SimpleGrid mb={3} columns={{base: 2, md: 4}} gap={{base: '4', md: '6'}}>
                <Statistics label='Affiliates' value={_data.affiliates}/>

                <Statistics label='Revenue' item={<Button onClick={() => setNet(!net)} leftIcon={<FaDollarSign/>} size='xs' colorScheme={net ? 'brand' : 'red'}>
                        {net ? 'Net' : 'Gross'}
                    </Button>} value={net ? values._revenueNet : values._revenueGross} prev={net ? preValues._revenueNet : preValues._revenueGross}/>

                <Statistics label='Clicks' value={values._clicks} prev={preValues._clicks}/>

                <Statistics label='Conversions' value={values._conversions} prev={preValues._conversions}/>
            </SimpleGrid>
        </VStack>
    );
};

export default Dashboard;