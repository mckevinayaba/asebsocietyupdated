import * as React from 'react'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

const LOGO_URL = 'https://www.asebsociety.org/images/brand/aseb-society-mark-on-light.png'

export const SignupEmail = ({ siteName, siteUrl, recipient, confirmationUrl }: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head>
      <style>{darkModeCss}</style>
    </Head>
    <Preview>Welcome to the Village. Confirm your email address.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={band}>
          <Img src={LOGO_URL} alt={siteName} height="44" style={{ display: 'block' }} />
        </Section>
        <Section style={card}>
          <Heading style={h1}>Welcome to the Village.</Heading>
          <Text style={text}>
            Thank you for becoming part of Africa's ecosystem building community.
          </Text>
          <Text style={text}>
            You are joining a platform dedicated to advancing ecosystem building as a professional
            practice and a recognised profession across Africa.
          </Text>
          <Text style={text}>
            Please confirm your email address ({recipient}) to activate your account.
          </Text>
          <Button className="dm-btn" style={button} href={confirmationUrl}>
            Verify My Email Address
          </Button>
          <Text style={text}>
            Together, we are strengthening the people, institutions and systems that make African
            entrepreneurship possible.
          </Text>
          <Text style={motto}>One village. Many voices. Shared responsibility.</Text>
          <Text style={text}>
            Warm regards,
            <br />
            The ASEB Society Secretariat
          </Text>
          <Hr style={rule} />
          <Text style={notice}>
            If you did not register with ASEB Society, you can safely ignore this email. No account
            will be activated and no further messages will be sent.
          </Text>
        </Section>
        <Text style={footer}>
          Africa Startup Ecosystem Builders Society · It Takes a Village.
          <br />
          <Link href={siteUrl} style={footerLink}>www.asebsociety.org</Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const serif = "Georgia, 'Times New Roman', serif"
const main = { backgroundColor: '#ffffff', fontFamily: serif }
const container = { maxWidth: '560px', margin: '0 auto', padding: '24px 16px' }
const band = { backgroundColor: '#faf8f2', borderTop: '3px solid #b8913a', padding: '20px 28px' }
const card = { backgroundColor: '#faf8f2', padding: '8px 28px 28px' }
const h1 = { fontSize: '26px', fontWeight: 'normal' as const, color: '#0f5a55', margin: '12px 0 20px' }
const text = { fontSize: '15px', color: '#2b2b26', lineHeight: '1.6', margin: '0 0 18px' }
const motto = { ...text, color: '#b5532f', fontStyle: 'italic' as const }
const button = {
  backgroundColor: '#0f5a55',
  color: '#ffffff',
  fontSize: '15px',
  borderRadius: '4px',
  padding: '14px 24px',
  textDecoration: 'none',
  margin: '6px 0 24px',
}
const rule = { borderColor: '#e4dfd2', margin: '8px 0 16px' }
const notice = { fontSize: '13px', color: '#6b6b63', lineHeight: '1.5', margin: 0 }
const footer = { fontSize: '12px', color: '#6b6b63', textAlign: 'center' as const, lineHeight: '1.6', margin: '20px 0 0' }
const footerLink = { color: '#0f5a55' }
const darkModeCss = `
  @media (prefers-color-scheme: dark) {
    .dm-btn { background-color: #0f5a55 !important; color: #ffffff !important; }
  }
`
