"use client";

import { Check, Copy } from "@phosphor-icons/react";
import { useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { env } from "~/env";
import { useWaitlists } from "~/lib/use-waitlists";
import { api } from "~/trpc/react";

const CopyableInput = ({ defaultValue }: { defaultValue: string }) => {
  const [value, copy] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    await copy(defaultValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="relative max-w-xl">
      <Input defaultValue={defaultValue} disabled />
      <Button
        variant="secondary"
        className="absolute right-0 top-0 h-full"
        size="icon"
        onClick={handleCopyToClipboard}
      >
        {copied ? <Check size={20} /> : <Copy size={20} />}
      </Button>
    </div>
  );
};

export const Content = () => {
  const { selectedWaitlist } = useWaitlists();

  const upsertWaitlistForm = api.admin.upsertWaitlistForm.useMutation();

  return (
    <div className="h-[100dvh] overflow-auto pl-60 pt-5 font-sans">
      <h1 className="mb-5 font-serif text-3xl font-bold">Integrations</h1>
      <p className="text-neutral-300">
        Your embed key is{" "}
        <span className="font-bold text-white">{selectedWaitlist?.refId}</span>
      </p>
      <Label className="my-5 block text-neutral-400">
        Step 1. Copy and paste the below code in the {"<head/>"} section
        Weitlist
      </Label>
      <CopyableInput defaultValue='<script src="https://weitlist.me/js/embed.js" defer></script>' />
      <Label className="my-5 block text-neutral-400">
        Step 2. Paste the following code anywhere on your page where you want to
        display the form
      </Label>
      <CopyableInput
        defaultValue={`<div class="weitlist-embed" data-key-id="${selectedWaitlist?.refId}"></div>`}
      />
      <h2 className="mb-2 mt-8 font-sans">Preview</h2>
      <Textarea
        className=" max-w-xs"
        defaultValue={`{
          buttonStyle: {},
          inputStyle: {},
          label: "Join our waitlist",
          placeholder: "Enter your email",
          buttonText: "Join"
        }`}
        rows={7}
      />
      <Button
        className="mb-5 mt-3"
        onClick={async () => {
          if (selectedWaitlist?.id)
            await upsertWaitlistForm.mutateAsync({
              buttonStyle: {},
              inputStyle: {},
              label: "Join our waitlist",
              placeholder: "Enter your email",
              buttonText: "Join",
              waitlistId: selectedWaitlist?.id,
              id: undefined,
            });
        }}
      >
        Save
      </Button>
      <div className="hash-gray absolute right-0 top-0 mt-3 max-w-sm bg-neutral-900 p-4">
        <iframe
          src={`${env.NEXT_PUBLIC_FRONTEND_URL}/w/${selectedWaitlist?.refId}`}
          width="100%"
        ></iframe>
      </div>
    </div>
  );
};
