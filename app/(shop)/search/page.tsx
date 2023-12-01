import React from "react";
import prisma from "@/prisma/client";
import ProductCard from "./_components/ProductCard";
import { Product } from "@prisma/client";
import { ParsedUrlQuery } from "querystring";
// import PaginationControls from "./_components/PaginationControls ";

interface SearchParams extends ParsedUrlQuery {
  category?: string;
  sort?: string;
  q?: string;
}
const SearchPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  // const page = searchParams["page"] ?? "1";
  // const per_page = searchParams["per_page"] ?? "3";

  // const start = (Number(page) - 1) * Number(per_page); // 0, 5, 10 ...
  // const end = start + Number(per_page); // 5, 10, 15 ...

  const category = searchParams.category;
  const sort = searchParams.sort;
  const q = searchParams.q;
  // console.log("searchParams", q);

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
    //
    products = await prisma?.product.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive",
        },

        // category
        //   ? {
        //       id: category,

        //     }
        //   : {},
        category: category
          ? {
              id: category,
            }
          : {},
      },

      orderBy: orderBy,
    });
    // console.log("products", products);
  } catch (error) {
    products = [];
  }
  return (
    <>
      <div className="h-[80vh] grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 p-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <footer className="mt-20 w-full h-[10vh]  bg-blue-200 flex justify-center items-end p-2">
        {/* <PaginationControls
          hasNextPage={end > products.length}
          hasPrevPage={start > 0}
        /> */}
      </footer>
    </>
  );
};

export default SearchPage;
