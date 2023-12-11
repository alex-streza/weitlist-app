"use client";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function Integrations() {
  return (
    <div className="pl-40 pt-5">
      <h1 className="mb-5 text-3xl font-bold">Integrations</h1>
      <p className="text-neutral-500">Your embed key is 2rTlzW</p>
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
        value='<div class="weitlist-embed" data-key-id="2rTlzW" data-height="180px"></div>'
        disabled
      />
    </div>
  );
}
