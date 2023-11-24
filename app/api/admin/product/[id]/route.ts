import { NextRequest, NextResponse } from "next/server";

import prisma from "../../../../../prisma/client";

import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuidv4 } from "uuid";

interface FieldValue {
  [key: string]: string;
}

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION_NAME as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
});

const uploadFile = async (file: Buffer, fileName: string): Promise<string> => {
  const backetName = process.env.AWS_BUCKET_NAME as string;

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: backetName,
      Key: fileName,
      Body: file,
    },
  });

  upload.on("httpUploadProgress", (progress) => {
    if (progress.loaded !== undefined && progress.total !== undefined) {
      console.log(`progress: ${progress.loaded / progress.total}`);
    }
  });

  await upload.done();

  return `https://${backetName}.s3.amazonaws.com/${fileName}`;
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("Start endpoint");
  // // register new category

  const formData = await request.formData();
  const fields: FieldValue = {};

  const base64 = [];
  const existingImages = [];

  for (const [key, value] of formData) {
    // console.log("key", key, value);

    if (key.startsWith("newImages") && typeof value === "string") {
      base64.push(value);

      // todo
    } else if (key.startsWith("existingImages") && typeof value === "string") {
      existingImages.push(value);
    } else if (typeof value === "string") {
      fields[key] = value;
    }
  }

  console.log("fields", fields);
  // console.log("base64", base64);

  const newImageUrls = await Promise.all(
    base64.map(async (base64Image) => {
      const buffer = Buffer.from(base64Image.split(",")[1], "base64");

      const fileName = `${uuidv4()}.jpeg`;

      return await uploadFile(buffer, fileName);
    })
  );

  const combinedGalleryUrls = [...existingImages, ...newImageUrls];

  try {
    const updatedProduct = await prisma?.product.update({
      where: {
        id: params.id,
      },
      data: {
        name: fields.name,
        categoryId: fields.categoryId,
        thumbnail: combinedGalleryUrls[0] || "",
        gallery: combinedGalleryUrls,
        price: parseFloat(fields.price),
        description: fields.description,
        stockQuantity: parseInt(fields.stockQuantity, 10),
      },
    });

    return NextResponse.json(updatedProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Error registering product files" },
      { status: 500 }
    );
  }
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await prisma.product.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!product) {
    return NextResponse.json("Unknown Product", { status: 404 });
  }

  try {
    for (const image of product.gallery) {
      const key = image.split("/").pop();

      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME as string,
          Key: key,
        })
      );
    }
  } catch (error) {
    console.error("error deleting product image from s3", error);
    return NextResponse.json("unmown error", { status: 500 });
  }

  try {
    const deletedProduct = await prisma.product.delete({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json(deletedProduct, { status: 200 });
  } catch (error) {
    return NextResponse.json("error deleting product From Prisma", {
      status: 400,
    });
  }
}

export async function GET(request: NextRequest) {
  // get all categories
  // return NextResponse.json("erroor", { status: 500 })
  const categories = await prisma.product.findMany({
    orderBy: {
      created: "desc",
    },
  });
  return NextResponse.json(categories, { status: 200 });
}
