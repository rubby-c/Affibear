import React from 'react';
import Api from "@/lib/api";
import {cookies} from "next/headers";
import Products from "@/components/pages/dashboard/commissions/Products";

const Page = async () => {
    const res = await Api.get('/website/commissions/products', {
        headers: {
            Cookie: cookies().toString()
        }
    });

    return (
        <Products _data={res.data} />
    );
};

export default Page;