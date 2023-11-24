import React from "react";
import ProductForm from "../_components/ProductForm";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";

const UpdateCategoryPage = async ({ params }: { params: { id: string } }) => {
  let product;

  try {
    product = await prisma?.product.findUnique({ where: { id: params.id } });

    if (!product) notFound();
  } catch (err) {
    notFound();
  }

  return (
    <div>
      <ProductForm product={product} />
      UpdateCategoryPage
    </div>
  );
};

export default UpdateCategoryPage;
