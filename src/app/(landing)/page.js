import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";

export default function Home() {
    return (
        <Box>
            <VStack p={16} mx='auto' maxW={1280}>
                <Heading mb={4} textAlign='center' size='4xl'>All-in-One Affiliate Management Software</Heading>

                <Text my={4} maxW={800} textAlign='center'>Rewardful is a comprehensive affiliate marketing software that
                    enables SaaS companies to set up affiliate and referral programs with Stripe & Paddle. Just connect
                    your account and let us track referrals, discounts and commissions for you!</Text>

                <Button colorScheme='brand' size='xl'>Begin your affiliate program</Button>
            </VStack>
        </Box>
    )
}
