"use client";

import spacetime from "spacetime";
import { ArrowsDownUp } from "@phosphor-icons/react";
import type { ColumnDef } from "@tanstack/react-table";
import { HTMLProps, useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Entry = {
  id: number;
  source: string;
  email: string;
  referralCode: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  referees: {
    id: number;
    email: string;
  }[];
};

const IndeterminateCheckbox = ({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) => {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <Checkbox
      {...rest}
      onCheckedChange={(checked) => rest.onChange?.({ target: { checked } })}
      className={cn(className, "cursor-pointer")}
      ref={ref}
    />
  );
};

export const columns: ColumnDef<Entry>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div>
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div>
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowsDownUp className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ cell }) => (
      <a href={cell.getValue<string>()}>{cell.getValue<string>()}</a>
    ),
  },
  {
    accessorKey: "referralCode",
    header: "Referral Code",
  },
  {
    accessorKey: "referees",
    header: "Referred users",
    cell: ({ cell }) => {
      const referees = cell.getValue<{ id: number; email: string }[]>();

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div
                className={cn(referees.length > 0 ? "bg-neutral-800 p-1" : "")}
              >
                {referees.length === 0 ? "-" : referees.length + " referred"}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col gap-1">
                {referees.map((referee) => (
                  <a
                    key={referee.id}
                    href={`mailto:${referee.email}`}
                    className="underline"
                  >
                    {referee.email}
                  </a>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined at",
    cell: ({ cell }) => (
      <span>{spacetime(new Date()).since(cell.getValue<Date>()).rounded}</span>
    ),
  },
];
