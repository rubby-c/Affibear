import './globals.css'

import { Providers } from "./providers";

import './globals.css'

export const metadata = {
    title: 'Afficone',
    description: 'booyah'
}

export const viewport = {
    width: 'device-width',
    initialScale: 0.75,
    maximumScale: 0.75
}

export default function Layout({ children }) {
    return (
        <html lang='en'>
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    )
}
