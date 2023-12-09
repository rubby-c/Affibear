import React from 'react';
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { FaMagnifyingGlass } from "react-icons/fa6";

const SearchBar = ({ state, setState }) => {
    return (
        <InputGroup my={4}>
            <InputLeftElement
                pointerEvents='none'
                children={<FaMagnifyingGlass />}
            />

            <Input value={state} onChange={(e) => setState(e.target.value)} placeholder='Search..'  />
        </InputGroup>
    );
};

export default SearchBar;