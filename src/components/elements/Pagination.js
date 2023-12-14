import React from 'react';
import { HStack, IconButton, Text } from "@chakra-ui/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export const PerPage = 10;

const Pagination = ({ list, page, setPage }) => {
    function NextPage() {
        const _page = page + 1;

        if (list.length < ((_page - 1) * PerPage) + 1) {
            return;
        }

        const start = (_page - 1) * PerPage;
        const end = _page * 10;
        const arr = list.slice(start, end);

        if (arr.length > 0 && list.length >= PerPage) {
            setPage(_page);
        }
    }

    function PreviousPage() {
        const _page = page - 1;
        if (_page < 1) {
            return;
        }

        const start = (_page - 1) * PerPage;
        const end = _page * PerPage;
        const arr = list.slice(start, end);

        if (arr.length > 0) {
            setPage(_page);
        }
    }

    return (
        <HStack mt={4} justifyContent='space-between' spacing={4}>
            <IconButton variant='ghost' icon={<FaArrowLeft/>}
                        onClick={() => PreviousPage()} aria-label='Previous Page'/>

            <Text>Page: <Text as='span' fontWeight='bold'>{page}</Text></Text>

            <IconButton variant='ghost' icon={<FaArrowRight/>}
                        onClick={() => NextPage()} aria-label='Next Page'/>
        </HStack>
    );
};

export default Pagination;