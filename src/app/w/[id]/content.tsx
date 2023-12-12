"use client";

import { Spinner } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";

export const Content = ({ id }: { id: string }) => {
  const [email, setEmail] = useState("");

  const join = api.waitlist.join.useMutation({
    onSuccess: () => setEmail(""),
  });

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <form
      className="absolute left-1/2 top-1/2 flex w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 flex-col px-5"
      onSubmit={(e) => {
        e.preventDefault();
        join.mutate({
          refId: id,
          source: "WEB",
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
  );
};
