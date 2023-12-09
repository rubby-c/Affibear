'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'

import Theme from "../lib/theme";

export function Providers({ children }) {
    return (
        <CacheProvider>
            <ChakraProvider theme={Theme}>
                {children}
            </ChakraProvider>
        </CacheProvider>
    )
}