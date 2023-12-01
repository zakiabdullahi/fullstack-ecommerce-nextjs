import { Product } from "@prisma/client";
import { notFound } from "next/navigation";
import React from "react";
import ProductInfo from "./_component/ProductInfo";

const ProductInfoPage = async ({ params }: { params: { id: string } }) => {
  let productInfo = null;
  try {
    productInfo = await prisma?.product.findUnique({
      where: {
        id: params.id,
      },
    });
  } catch (error) {
    productInfo = null;
    console.log("ERRo", error);
    return notFound();
  }

  if (!productInfo) return notFound();
  return (
    <div>
      <ProductInfo productInfo={productInfo} />
    </div>
  );
};

export default ProductInfoPage;
