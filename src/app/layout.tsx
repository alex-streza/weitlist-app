import "~/styles/globals.css";

import localFont from "next/font/local";
import { DM_Sans } from "next/font/google";
import { cookies } from "next/headers";
import { TRPCReactProvider } from "~/trpc/react";
import { ClientLayout, PostHogPageview } from "./_components/client-layout";
import { Suspense } from "react";

const dm_sans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

// Font files can be colocated inside of `app`
const offbit = localFont({
  src: [
    {
      path: "./fonts/OffBitTrial-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/OffBitTrial-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-offbit",
});

export const metadata = {
  title: "Weitlist | Work on your app development not on your waitlist",
  description:
    "Accelerate your app's progress effortlessly with Weitlist - freeing you from waitlist management to focus on crafting your application's success story. Say goodbye to waitlist hassles and hello to seamless app development.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase: "https://weitlist.me",
  openGraph: {
    images: ["https://weitlist.me/og.png"],
    title: "Home",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${offbit.variable} ${dm_sans.variable}`}>
      <body>
        <Suspense>
          <PostHogPageview />
        </Suspense>
        <TRPCReactProvider cookies={cookies().toString()}>
          <ClientLayout>
            <main className="relative h-screen w-screen overflow-hidden bg-gray-950 text-white">
              {children}
            </main>
          </ClientLayout>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
