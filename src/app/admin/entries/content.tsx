/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { selectedWaitlistAtom } from "~/lib/store";
import { api } from "~/trpc/react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useDebounce } from "usehooks-ts";

export const Content = () => {
  const [filters, setFilters] = useState({
    search: "",
    type: "JOINED",
  });

  const debouncedFilters = useDebounce(filters, 500);

  const selectedWaitlist = useAtomValue(selectedWaitlistAtom);

  const { data, isLoading, isFetched } = api.admin.getWaitlistEntries.useQuery({
    id: selectedWaitlist?.id,
    pagination: {
      page: 0,
      perPage: 10,
    },
    ...debouncedFilters,
  });

  console.log("isLoading", isLoading);

  const handleSearch = (search: string) => {
    setFilters({
      ...filters,
      search,
    });
  };

  return (
    <div className="w-full pl-56 pr-5 pt-10">
      <h1 className="mb-10 text-3xl font-bold">Entries - Morrow</h1>
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
          {!isLoading && isFetched && (
            <DataTable columns={columns} data={data} onSearch={handleSearch} />
          )}
        </TabsContent>
        {/* <TabsContent value="invited">
          <Input placeholder="Filter by e-mail address, source, invite code or any other field" />
        </TabsContent> */}
      </Tabs>
    </div>
  );
};
