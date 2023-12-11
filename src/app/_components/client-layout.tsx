"use client";

import { SessionProvider } from "next-auth/react";
import type { PropsWithChildren } from "react";

export const ClientLayout = ({ children }: PropsWithChildren) => {
  return <SessionProvider>{children}</SessionProvider>;
};
