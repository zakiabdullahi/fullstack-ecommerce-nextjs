import React from "react";
import prisma from "@/prisma/client";
import ProductCard from "../_components/ProductCard";
import { ParsedUrlQuery } from "querystring";
import { Product } from "@prisma/client";

interface SearchParams extends ParsedUrlQuery {
  category?: "latest-desc" | "price-asc" | "price-desc" | string;
  sort?: string;
}
const Collection = async ({
  params,
  searchParams,
}: {
  searchParams: SearchParams;
  params: { collection: string };
}) => {
  const category = params.collection;
  const sort = searchParams.sort;

  let orderBy = {};
  if (sort == "price-asc") {
    orderBy = {
      price: "asc",
    };
  } else if (sort == "price-desc") {
    orderBy = {
      price: "desc",
    };
  } else if (sort == "latest-desc") {
    orderBy = {
      created: "desc",
    };
  }

  let products: Product[] = [];

  try {
    products = await prisma?.product.findMany({
      where: category
        ? {
            category: {
              id: params.collection,
            },
          }
        : {},
      orderBy: orderBy,
    });
  } catch (error) {
    products = [];
  }

  // console.log("products", products);

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 p-2">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default Collection;
