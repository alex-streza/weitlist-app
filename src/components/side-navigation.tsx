"use client";

import {
  Diamond,
  GearSix,
  IdentificationCard,
  PlugCharging,
  SignOut,
  UsersThree,
} from "@phosphor-icons/react";
import { useAtom } from "jotai";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { selectedWaitlistAtom } from "~/lib/store";
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
import { api } from "~/trpc/react";

const navItemClassName =
  "hover:bg-muted transition-all duration-200 w-full rounded-lg";

const items = [
  {
    label: "Entries",
    icon: <UsersThree />,
  },
  {
    label: "Referral codes",
    icon: <IdentificationCard />,
  },
  {
    label: "Integrations",
    icon: <PlugCharging />,
  },
  {
    label: "Upgrade - soon",
    icon: <Diamond />,
    disabled: true,
  },
  {
    label: "Settings",
    icon: <GearSix />,
  },
];

export const SideNavigation = ({
  initialData,
}: {
  initialData: RouterOutputs["admin"]["getWaitlists"];
}) => {
  const { data: waitlists } = api.admin.getWaitlists.useQuery(undefined, {
    initialData,
  });

  const pathname = usePathname();

  const [selectedWaitlist, selectWaitlist] = useAtom(selectedWaitlistAtom);

  const createWaitlist = api.admin.createWaitlist.useMutation({
    onSuccess: (waitlist) => {
      selectWaitlist(waitlist);
    },
  });

  const handleCreateWaitlist = () => {
    createWaitlist.mutate({
      name: "New waitlist",
    });
  };

  return (
    <NavigationMenu className="fixed left-0 top-0 h-screen w-fit flex-col justify-start gap-8 bg-neutral-900 px-2 py-10 font-sans">
      <Logo />
      <Select
        value={selectedWaitlist?.id}
        disabled={createWaitlist.isLoading}
        onValueChange={(id) =>
          selectWaitlist(waitlists?.filter((w) => w.id === id)[0])
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
          <SelectItem value="new" onClick={handleCreateWaitlist}>
            New waitlist
          </SelectItem>
        </SelectContent>
      </Select>
      <NavigationMenuList className="h-full flex-col items-start gap-1 space-x-0">
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
