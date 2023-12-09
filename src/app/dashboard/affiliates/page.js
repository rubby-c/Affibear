import React from 'react';
import Api from "@/lib/api";
import { cookies } from "next/headers";
import Affiliates from "@/components/pages/dashboard/affiliates/Affiliates";

const Page = async () => {
    const res = await Api.get('/website/affiliates', {
        headers: {
            Cookie: cookies().toString()
        }
    });

    return (
        <Affiliates data={res.data} />
    );
};

export default Page;