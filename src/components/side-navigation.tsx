"use client";

import {
  Diamond,
  IdentificationCard,
  PlugCharging,
  Plus,
  SignOut,
  UsersThree,
} from "@phosphor-icons/react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import type { RouterOutputs } from "~/trpc/shared";
import { Logo } from "./logo";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useWaitlists } from "~/lib/use-waitlists";
import Link from "next/link";

const navItemClassName =
  "hover:bg-muted transition-all duration-200 w-full rounded-lg";

const items = [
  {
    label: "Entries",
    icon: <UsersThree />,
  },
  {
    label: "Integrations",
    icon: <PlugCharging />,
  },
  {
    label: "Upgrade",
    icon: <Diamond />,
    disabled: true,
  },
  // {
  //   label: "Settings",
  //   icon: <GearSix />,
  // },
];

export const SideNavigation = ({
  initialData,
}: {
  initialData: RouterOutputs["admin"]["getWaitlists"];
}) => {
  const { waitlists, selectedWaitlist, createWaitlist, selectWaitlist } =
    useWaitlists(initialData);

  const pathname = usePathname();

  const handleCreateWaitlist = () => {
    createWaitlist.mutate({
      name: "New waitlist " + (waitlists?.length ?? 0),
    });
  };

  return (
    <NavigationMenu className="fixed left-0 top-0 hidden h-screen w-fit flex-col justify-start gap-8 bg-neutral-900 px-2 py-10 font-sans md:flex">
      <Link href="/" title="go to home page">
        <Logo />
      </Link>
      <Select
        value={selectedWaitlist?.id}
        disabled={createWaitlist.isLoading}
        onValueChange={(id) =>
          id === "new"
            ? handleCreateWaitlist()
            : selectWaitlist.mutate({
                id,
              })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Pick a waitlist" />
        </SelectTrigger>
        <SelectContent>
          {waitlists?.map((waitlist) => (
            <SelectItem key={waitlist.id} value={waitlist.id}>
              {waitlist.name}
            </SelectItem>
          ))}
          <SelectItem value="new" className="font-bold">
            <Plus className="absolute left-2 top-2" size={16} weight="bold" />
            New waitlist
          </SelectItem>
        </SelectContent>
      </Select>
      <NavigationMenuList className="h-full w-[180px] flex-col items-start gap-1 space-x-0">
        {items.map(({ label, icon, disabled }, index) => (
          <NavigationMenuItem
            key={index}
            className={cn(
              navItemClassName,
              pathname === `/admin/${label.toLowerCase().replace(" ", "-")}` &&
                "bg-muted",
            )}
          >
            <NavigationMenuLink
              className={cn(
                "flex items-center gap-2 px-3 py-2",
                disabled && "pointer-events-none opacity-50",
              )}
              href={`/admin/${label.toLowerCase().replace(" ", "-")}`}
            >
              {icon}
              {label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
      <NavigationMenuItem
        className={cn(
          navItemClassName,
          "mt-auto flex cursor-pointer list-none items-center gap-2 px-3 py-2",
        )}
        onClick={() =>
          signOut({
            callbackUrl: "/",
          })
        }
      >
        <SignOut />
        <NavigationMenuLink>Log out</NavigationMenuLink>
      </NavigationMenuItem>{" "}
    </NavigationMenu>
  );
};
