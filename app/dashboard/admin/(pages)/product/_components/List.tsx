"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API } from "@/lib/config";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "../column";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const List = () => {
  const router = useRouter();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["product"],
    queryFn: () => axios.get(`${API}/admin/product`).then((res) => res.data),
    staleTime: 1000 * 60,
    retry: 3,
  });

  if (isLoading) return <h1>...loadingProducts</h1>;

  console.log("Product data", data);
  return (
    <div className="my-4 space-y-4  sm:p-6  lg:p-2">
      <div className="flex justify-end">
        <Button
          onClick={() => router.push("/dashboard/admin/product/new")}
          variant={"outline"}
        >
          Create New Product
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default List;
