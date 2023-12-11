import { SideNavigation } from "~/components/side-navigation";
import { api } from "~/trpc/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const waitlists = await api.admin.getWaitlists.query();

  return (
    <>
      <SideNavigation initialData={waitlists} />
      {children}
    </>
  );
}
