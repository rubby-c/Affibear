import React from 'react';
import Api from "@/lib/api";
import { cookies } from "next/headers";
import Website from "@/components/pages/dashboard/Website";

const Page = async () => {
    const res = await Api.get('/website/current', {
        headers: {
            Cookie: cookies().toString()
        }
    });

    return (
        <Website _data={res.data} />
    );
};

export default Page;