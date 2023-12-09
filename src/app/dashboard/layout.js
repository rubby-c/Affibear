import './styles.css'

import Api from "../../lib/api";
import DashboardLayout from "../../components/pages/dashboard/DashboardLayout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Layout = async ({ children }) => {
    const res = await Api.get('/dashboard/header', {
        headers: {
            Cookie: cookies().toString()
        }
    });

    if (res.status !== 200) {
        redirect('/signin');
    }

    if (res.data.websites.length === 0 && children.props.childProp.segment !== 'create-website') {
        redirect('/dashboard/create-website');
    }

    return (
        <DashboardLayout data={res.data}>
            {children}
        </DashboardLayout>
    );
};

export default Layout;