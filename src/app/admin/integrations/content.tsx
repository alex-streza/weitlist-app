"use client";

import { useAtomValue } from "jotai";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { env } from "~/env";
import { selectedWaitlistAtom } from "~/lib/store";

export const Content = () => {
  const selectedWaitlist = useAtomValue(selectedWaitlistAtom);

  return (
    <div className="pl-60 pt-5">
      <h1 className="mb-5 text-3xl font-bold">Integrations</h1>
      <p className="text-neutral-500">
        Your embed key is {selectedWaitlist?.refId}
      </p>
      <Label className="my-5 block text-neutral-500">
        Step 1. Copy and paste the below code in the {"<head/>"} section
        Weitlist
      </Label>
      <Input
        value='<script src="https://weitlist.me/js/embed.js" defer></script>'
        disabled
      />
      <Label className="my-5 block text-neutral-500">
        Step 2. Paste the following code anywhere on your page where you want to
        display the form
      </Label>
      <Input
        value={`<div class="weitlist-embed" data-key-id="${selectedWaitlist?.refId}"></div>`}
        disabled
      />
      <h2 className="mt-8">Preview</h2>
      <div className="mt-3 max-w-xs bg-neutral-900 p-4">
        <iframe
          src={`${env.NEXT_PUBLIC_FRONTEND_URL}/w/${selectedWaitlist?.refId}`}
          width="100%"
        ></iframe>
      </div>
    </div>
  );
};
