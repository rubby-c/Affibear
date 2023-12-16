import React from 'react';
import Api from "@/lib/api";
import { cookies } from "next/headers";
import Dashboard from "@/components/pages/dashboard/Dashboard";

const Page = async () => {
    const res = await Api.get('/website/dashboard', {
        headers: {
            Cookie: cookies().toString()
        }
    });

    return (
        <Dashboard _data={res.data} />
    );
};

export default Page;