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
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const editWaitlistSchema = z.object({
  id: z.string(),
  name: z.string(),
  websiteURL: z.string().refine((url) => {
    return url?.match(/^(https):\/\/[^ "]+$/) ? true : false;
  }, "Please enter a valid URL"),
});

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

  const form = useForm<z.infer<typeof editWaitlistSchema>>({
    resolver: zodResolver(editWaitlistSchema),
    mode: "onChange",
    defaultValues: {
      id: selectedWaitlist?.id ?? "",
      name: selectedWaitlist?.name ?? "",
      websiteURL: selectedWaitlist?.websiteURL ?? undefined,
    },
  });

  return (
    <div className="w-full pl-5 pr-5 pt-20 md:pl-56 md:pt-10">
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

            <Form {...form}>
              <form
                className="flex flex-col gap-5"
                onSubmit={form.handleSubmit((data) =>
                  editWaitlist.mutate(data),
                )}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="websiteURL"
                  rules={{
                    pattern: {
                      value: /^(https):\/\/[^ "]+$/,
                      message: "Please enter a valid website URL",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your website url"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={editWaitlist.isLoading || !form.formState.isValid}
                >
                  Save
                </Button>
              </form>
            </Form>
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
