"use server";
import {
  DeleteBucketCommand,
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { NextResponse } from "next/server";

import prisma from "@/prisma/client";
import { boolean } from "zod";
const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION_NAME as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
});

export const deleteFromS3 = async (
  url: string,
  gallery: string[],
  productId?: string
) => {
  try {
    if (!productId)
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );

    const key = url.split("/").pop();

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME as string,
        Key: key,
      })
    );

    console.log("productId", productId);
    gallery = gallery.filter((image) => image !== url);

    console.log(gallery);

    await prisma?.product.update({
      where: {
        id: productId,
      },
      data: {
        gallery: gallery,
        thumbnail: gallery[0],
      },
    });

    console.log("updated gallery");
    return { error: false };
  } catch (error) {
    console.log("Something won't wrong", error);
    return { Error: true };
  }
};
