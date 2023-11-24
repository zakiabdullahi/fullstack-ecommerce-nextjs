/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import AlertDailog from "../../_components/AlertDailog";

type Category = {
  id: string;
  name: number;
  createdAt: string;
};

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "created",
    header: () => <div className="text-right">Created</div>,
    cell: ({ row }) => {
      const formattedDate = new Date(row.getValue("created")).toDateString();

      return <div className="text-right font-medium">{formattedDate}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const categoryInfo = row.original;

      const router = useRouter();

      return (
        <div className="space-x-2">
          <Button
            onClick={() =>
              router.push(`/dashboard/admin/category/${categoryInfo.id}`)
            }
            variant={"outline"}
          >
            Update
          </Button>
          <AlertDailog id={categoryInfo.id} schema="category" />
        </div>
      );
    },
  },
];
