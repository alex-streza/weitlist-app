import { api } from "~/trpc/server";
import { Content } from "./content";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";

export default async function Entries() {
  const session = await getServerSession(authOptions);
  // const data = await api.admin.getWaitlistEntries.query({
  //   id,
  // });

  return <Content />;
}
