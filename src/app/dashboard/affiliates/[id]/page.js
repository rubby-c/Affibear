import React from 'react';
import Api from "@/lib/api";
import { cookies } from "next/headers";
import Affiliate from "@/components/pages/dashboard/affiliates/Affiliate";

const Page = async ({ params }) => {
    const res = await Api.get(`/website/affiliate?id=${params.id}`, {
        headers: {
            Cookie: cookies().toString()
        }
    });

    const { stats, ...data } = res.data;

    stats.sort((a, b) => new Date(b.date) - new Date(a.date));
    data.payouts.sort((a, b) => new Date(b.updatedAt ?? b.createdAt) - new Date(a.updatedAt ?? a.createdAt));

    return (
        <Affiliate _stats={stats} _data={data} />
    );
};

export default Page;