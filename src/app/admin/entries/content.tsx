/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";
import { useState } from "react";
import { useDebounce } from "usehooks-ts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useWaitlists } from "~/lib/use-waitlists";
import { api } from "~/trpc/react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Pen } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

export const Content = () => {
  const [filters, setFilters] = useState<{
    search: string;
    type: "JOINED" | "INVITED";
  }>({
    search: "",
    type: "JOINED",
  });

  const debouncedFilters = useDebounce(filters, 500);

  const { selectedWaitlist } = useWaitlists();

  const { data, refetch, isLoading } = api.admin.getWaitlistEntries.useQuery({
    id: selectedWaitlist?.id ?? "",
    pagination: {
      page: 0,
      perPage: 10,
    },
    ...debouncedFilters,
  });

  const editWaitlist = api.admin.editWaitlist.useMutation();

  const handleSearch = (search: string) => {
    setFilters({
      ...filters,
      search,
    });
  };

  return (
    <div className="w-full pl-56 pr-5 pt-10">
      <h1 className="mb-10 flex items-center gap-3 text-3xl font-bold">
        Entries - {selectedWaitlist?.name}
        <Dialog>
          <DialogTrigger>
            <Pen weight="bold" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit - {selectedWaitlist?.name}</DialogTitle>
              <DialogDescription>
                Edit the name and website URL of your waitlist.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-5">
              <Label className="flex flex-col gap-2">
                <span>Name</span>
                <Input placeholder="Name" />
              </Label>
              <Label className="flex flex-col gap-2">
                <span>Website URL</span>
                <Input placeholder="Website URL" />
              </Label>
              <Button
                onClick={() =>
                  editWaitlist.mutate({
                    id: selectedWaitlist?.id ?? "",
                    name: "test",
                    websiteURL: "test",
                  })
                }
                disabled={editWaitlist.isLoading}
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </h1>
      <Tabs defaultValue="joined" className="w-full">
        <TabsList>
          <TabsTrigger
            value="joined"
            onClick={() =>
              setFilters({
                ...filters,
                type: "JOINED",
              })
            }
          >
            Joined
          </TabsTrigger>
          {/* <TabsTrigger
            value="invited"
            onClick={() =>
              setFilters({
                ...filters,
                type: "INVITED",
              })
            }
          >
            Invited
          </TabsTrigger> */}
        </TabsList>
        <TabsContent value="joined">
          <DataTable
            columns={columns}
            data={data}
            onSearch={handleSearch}
            isLoading={isLoading}
            refetch={refetch}
          />
        </TabsContent>
        {/* <TabsContent value="invited">
          <Input placeholder="Filter by e-mail address, source, invite code or any other field" />
        </TabsContent> */}
      </Tabs>
    </div>
  );
};
