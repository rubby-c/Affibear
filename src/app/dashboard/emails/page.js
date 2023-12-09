import React from 'react';
import Emails from "@/components/pages/dashboard/Emails";
import Api from "@/lib/api";
import { cookies } from "next/headers";

const Page = async () => {
    const res = await Api.get('/website/email-templates', {
        headers: {
            Cookie: cookies().toString()
        }
    });
    
    return (
        <Emails _data={res.data} />
    );
};

export default Page;