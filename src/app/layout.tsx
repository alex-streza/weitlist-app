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
  title: "Weitlist",
  description: "Work on your app not on your waitlist",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
