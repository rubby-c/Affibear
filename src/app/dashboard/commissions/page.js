import React from 'react';
import Api from "@/lib/api";
import { cookies } from "next/headers";
import Commissions from "@/components/pages/dashboard/commissions/Commissions";

const Page = async () => {
    const res = await Api.get('/website/commissions', {
        headers: {
            Cookie: cookies().toString()
        }
    });

    return (
        <Commissions data={res.data} />
    );
};

export default Page;