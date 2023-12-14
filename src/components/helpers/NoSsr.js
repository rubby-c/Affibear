import React from 'react';
import dynamic from "next/dynamic";
import {Spinner, Text} from "@chakra-ui/react";

const NoSsr = ({ children }) => {
    return children;
};

export default dynamic(() => Promise.resolve(NoSsr), {
    ssr: false,
    loading: () => <Spinner size='sm' />
});