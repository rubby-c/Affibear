import React from 'react';
import Api from "@/lib/api";
import { cookies } from "next/headers";
import Pages from "@/components/pages/dashboard/Pages";

const Page = async () => {
    const res = await Api.get('/website/settings', {
        headers: {
            Cookie: cookies().toString()
        }
    });

    return (
        <Pages data={res.data} />
    );
};

export default Page;