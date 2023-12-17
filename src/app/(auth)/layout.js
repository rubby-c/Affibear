import '../globals.css'

import { cookies } from 'next/headers';
import { redirect } from "next/navigation";

export const metadata = {
    title: 'Afficone',
    robots: {
        index: false,
        follow: false,
        nocache: true
    }
}

async function Redirect() {
    const arr = cookies();
    const token = arr.get('Token');

    if (token) {
        // redirect('/dashboard');
    }
}

export default async function Layout({ children }) {
    await Redirect();
    return children;
}