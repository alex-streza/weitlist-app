import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";
import { Tailwind } from "@react-email/components";

interface JoinedEmailProps {
  name?: string;
  link?: string;
  regards?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const JoinedEmail = ({
  name = "there",
  link = "https://www.weitlist.me",
  regards = "The Morrow Team",
}: JoinedEmailProps) => (
  <Html>
    <Head />
    <Preview>Log in with this magic link</Preview>
    <Tailwind>
      <Body className="mx-auto max-w-[600px] bg-white p-5 font-sans">
        <Container>
          <Link href="https://www.weitlist.me">
            <Img
              alt="Weitlist Logo"
              src={`${baseUrl}/static/logo.png`}
              className="mx-auto"
            />
          </Link>
          <Heading className="text-xl">Hi {name},</Heading>
          <Text className="mb-0">
            Thanks for signing up. You'll be the first to hear when we launch.
            <br />
            <br />
            Your current position is #129. Share your unique referral link with
            your friends to get some fabulous rewards and move up the waitlist:
            <br />
            <br />
            <Link href={link} target="_blank">
              {link}
            </Link>
            <br />
            <br />
          </Text>
          <Button
            href={link}
            className="bg-zinc-900 px-4 py-2 text-sm text-white"
          >
            Check your position
          </Button>
          <Text>{regards}</Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default JoinedEmail;
