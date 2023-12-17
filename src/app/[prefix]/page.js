import React from 'react';
import Api from "../../lib/api";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Index from "@/components/pages/affiliate";

const Page = async () => {
    const host = headers().get('Host');
    const res = await Api.get(`/website/by?host=${host}`);

    if (res.status !== 200) {
        redirect('https://afficone.com');
    }

    return <Index data={res.data} />
};

export default Page;