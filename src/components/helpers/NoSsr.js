import React from 'react';
import dynamic from "next/dynamic";
import {Text} from "@chakra-ui/react";

const NoSsr = ({ children }) => {
    return children;
};

export default dynamic(() => Promise.resolve(NoSsr), {
    ssr: false,
    loading: () => <Text>...</Text>
});