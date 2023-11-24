"use client";

import { API } from "@/lib/config";
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import SearchLoading from "../loading";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Categories = () => {
  const { data, isError, isLoading } = useQuery<Category[]>({
    queryKey: ["category"],
    queryFn: () => axios.get(`${API}/admin/category`).then((res) => res.data),
    staleTime: 1000 * 60,
    retry: 3,
  });

  const searchParams = useSearchParams();
  console.log(searchParams);
  const sortParams = searchParams.get("sort");
  console.log(sortParams);

  if (isLoading) return <SearchLoading />;
  return (
    <div className="bg-gray-800 text-white">
      <div className="mb-4">Shop By Collection</div>
      <ul>
        {data?.map((category) => {
          const categoryPath = category.name == "All" ? "" : `/${category.id}`;
          return (
            <li key={category.id} className="py-2">
              <Link
                href={{
                  pathname: `/search/${categoryPath}`,
                  query: sortParams ? { sort: sortParams } : {},
                }}
              >
                <span className="text-white hover:text-gray-300">
                  {category.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Categories;
