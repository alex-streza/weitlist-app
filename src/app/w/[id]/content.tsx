"use client";

import {
  FacebookLogo,
  LinkedinLogo,
  Spinner,
  TwitterLogo,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CopyableInput } from "~/app/admin/integrations/content";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";

export const Content = ({ id }: { id: string }) => {
  const [joined, setJoined] = useState(false);
  const [email, setEmail] = useState("");
  const [ref, setRef] = useState("");

  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref");

  const { data } = api.waitlist.getReferralInfo.useQuery({
    referralCode: ref,
  });

  const join = api.waitlist.join.useMutation({
    onSuccess: (data) => {
      setRef(data.referralCode);
      setEmail("");
      setJoined(true);
    },
  });

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <>
      {!joined && (
        <form
          className="absolute left-1/2 top-1/2 flex w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 flex-col px-5"
          onSubmit={(e) => {
            e.preventDefault();
            join.mutate({
              refId: id,
              source: window.location.origin,
              referralCode: referralCode ?? undefined,
              email,
            });
          }}
        >
          <Label className="mb-2">Email</Label>
          <Input
            placeholder="Enter your email address"
            className="mb-4"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
          />
          <Button
            className="relative w-full"
            disabled={!validEmail || join.isLoading}
          >
            Submit{" "}
            {join.isLoading && (
              <Spinner
                className="absolute right-5 top-3 animate-spin"
                width={16}
                height={16}
              />
            )}
          </Button>
        </form>
      )}
      {joined && (
        <div className="absolute left-1/2 top-1/2 flex w-full max-w-[600px] -translate-x-1/2 -translate-y-1/2 flex-col px-5">
          <h1 className="mb-5 text-3xl font-bold "> You’re on the waitlist!</h1>
          <p className="mb-8 text-xl text-neutral-400">
            Your current position is{" "}
            <span className="font-bold text-white">
              #{(data?.entriesCount ?? 0) + 1}
            </span>
          </p>
          <p className="mb-3 text-xl font-bold">
            Want to cut the line and get early access?
          </p>
          <p className="mb-8 text-neutral-400">
            Refer your friends and move up the list
          </p>
          <CopyableInput
            defaultValue={`https://${data?.entry.websiteURL}?ref=${ref}`}
          />
          <div className="mt-8 flex gap-5">
            <a
              href=""
              className="flex w-fit items-center gap-2 bg-blue-500 px-4 py-2"
            >
              Tweet <TwitterLogo />
            </a>
            <a
              href=""
              className="flex w-fit items-center gap-2 bg-green-500 px-4 py-2"
            >
              Share <WhatsappLogo />
            </a>
            <a
              href=""
              className="flex w-fit items-center gap-2 bg-blue-800 px-4 py-2"
            >
              Share <FacebookLogo />
            </a>
            <a
              href=""
              className="flex w-fit items-center gap-2 bg-blue-700 px-4 py-2"
            >
              Share <LinkedinLogo />
            </a>
          </div>
          <p className="mb-8 mt-8 text-neutral-400">
            You have referred
            <span className="font-bold text-white">
              {" "}
              {data?.referrers.length ?? 0} friends
            </span>
          </p>
          <a>
            <Button className="px-4 py-2">
              {" "}
              Back to {data?.entry.waitlist.name}
            </Button>
          </a>
        </div>
      )}
    </>
  );
};
