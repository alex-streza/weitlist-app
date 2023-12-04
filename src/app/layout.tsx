import "~/styles/globals.css";

import { cookies } from "next/headers";
import localFont from "next/font/local";
import { TRPCReactProvider } from "~/trpc/react";

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
});

export const metadata = {
  title: "Weitlist | Work on your app development not on your waitlist",
  description:
    "Accelerate your app's progress effortlessly with Weitlist - freeing you from waitlist management to focus on crafting your application's success story. Say goodbye to waitlist hassles and hello to seamless app development.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
    <html lang="en" className="dark">
      <body className={`${offbit.className}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
