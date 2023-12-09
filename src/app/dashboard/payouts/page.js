import React from 'react';
import Api from "@/lib/api";
import { cookies } from "next/headers";
import Payouts from "@/components/pages/dashboard/Payouts";

const Page = async () => {
    const res = await Api.get('/website/payouts', {
        headers: {
            Cookie: cookies().toString()
        }
    });

    return (
        <Payouts _data={res.data} />
    );
};

export default Page;