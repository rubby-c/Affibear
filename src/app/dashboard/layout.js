import './styles.css'

import Api from "../../lib/api";
import DashboardLayout from "../../components/pages/dashboard/DashboardLayout";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const Layout = async ({ children }) => {
    const res = await Api.get('/website/header', {
        headers: {
            Cookie: cookies().toString()
        }
    });

    if (res.status !== 200) {
        redirect('/signin');
    }

    const path = headers().get('x-path');

    if (res.data.websites.length === 0 && path !== '/dashboard/create-website') {
        redirect('/dashboard/create-website');
    }

    return (
        <DashboardLayout data={res.data}>
            {children}
        </DashboardLayout>
    );
};

export default Layout;