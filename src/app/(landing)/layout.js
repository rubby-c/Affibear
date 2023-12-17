import '../globals.css'

import { Box } from "@chakra-ui/react";
import Header from "@/components/elements/landing/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

export default function RootLayout({ children }) {
    return (
        <Box w='100%'>
            <Header />

            <Box bg='#fcfcfc' p={16} as='main' w='100%' minH='100vh'>
                {children}
            </Box>

            <Script src='https://afficone.com/scripts/sdk.js?token=2464485263553042' />

            <Footer />
        </Box>
    )
}
