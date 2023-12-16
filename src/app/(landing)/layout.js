import '../globals.css'

import { Box } from "@chakra-ui/react";
import Header from "@/components/elements/landing/Header";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
    return (
        <Box w='100%'>
            <Header />

            <Box bg='#fcfcfc' p={16} as='main' w='100%' minH='100vh'>
                {children}
            </Box>

            <Footer />
        </Box>
    )
}
