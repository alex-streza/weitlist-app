/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { Button } from "~/components/ui/button";

import {
  Check,
  Copy,
  Envelope,
  MagnifyingGlass,
  Spinner,
} from "@phosphor-icons/react";
import { useCopyToClipboard } from "usehooks-ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useWaitlists } from "~/lib/use-waitlists";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onSearch: (search: string) => void;
  refetch: () => Promise<unknown>;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onSearch,
  refetch,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [copied, setCopied] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    debugTable: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      rowSelection,
      columnFilters,
    },
  });

  const { selectedWaitlist } = useWaitlists();

  const [value, copy] = useCopyToClipboard();

  const deleteEntries = api.admin.deleteEntries.useMutation({
    onSuccess: () => void refetch(),
  });

  const handleCopyToClipboard = async () => {
    await copy(`weitlist.me/w/${selectedWaitlist?.refId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const selectedRows = !isLoading
    ? table.getRowModel().rows.filter((row) => row.getIsSelected())
    : [];

  return (
    <div>
      <div className="mb-5 flex w-full flex-wrap justify-between gap-3 md:gap-10">
        <div className="relative w-full min-w-[200px] max-w-[500px]">
          <Input
            placeholder="Filter by e-mail address, source, invite code or any other field"
            className="w-full"
            onChange={(ev) => onSearch(ev.target.value)}
          />
          <MagnifyingGlass className="absolute right-4 top-3 text-neutral-500" />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="destructive"
            onClick={async () => {
              await deleteEntries.mutateAsync({
                ids: selectedRows.map((row) => row.original.id),
              });
              table.setRowSelection({});
            }}
            disabled={selectedRows.length === 0}
          >
            {!deleteEntries.isLoading &&
              `Delete ${selectedRows.length} entries`}
            {deleteEntries.isLoading && (
              <Spinner className="animate-spin" width={16} height={16} />
            )}
          </Button>
          <Button variant="secondary" onClick={handleCopyToClipboard}>
            {copied ? "Copied" : "Copy"} waitlist link
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </Button>
          <Button
            variant="secondary"
            disabled={selectedRows.length === 0}
            className="hidden"
          >
            Invite {selectedRows.length} entries <Envelope size={20} />
          </Button>
        </div>
      </div>
      {!isLoading && (
        <div className="border border-border font-sans">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="h-12"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    no entries found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      {isLoading && (
        <div className="flex flex-col gap-2">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-[40px] w-full" />
          ))}
        </div>
      )}
      {!isLoading &&
        table.getRowModel().rows?.length >
          table.getState().pagination.pageSize && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {">"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded border p-1"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </Button>
            <span className="flex items-center gap-1 font-sans text-sm">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
            <span className="flex items-center gap-1 font-sans text-sm">
              | Go to page:
              <Input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="w-16"
                disabled={table.getCanNextPage() || table.getCanPreviousPage()}
              />
            </span>
            <Select
              value={table.getState().pagination.pageSize + ""}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize + ""}>
                    Show {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
    </div>
  );
}
