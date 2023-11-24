import { categorySchema } from "../../../validationSchema/categorySchema";
import { NextRequest, NextResponse } from "next/server";

import prisma from "../../../../prisma/client";

import { S3Client } from "@aws-sdk/client-s3";
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

export async function POST(request: NextRequest) {
  console.log("Start endpoint");
  // // register new category

  const formData = await request.formData();
  const fields: FieldValue = {};

  const base64 = [];

  for (const [key, value] of formData) {
    // console.log("key", key, value);

    if (key.startsWith("newImages") && typeof value === "string") {
      base64.push(value);

      // todo
    } else if (typeof value === "string") {
      fields[key] = value;
    }
  }

  console.log("fields", fields);
  // console.log("base64", base64);

  console.log("formData", formData);

  const newImageUrls = await Promise.all(
    base64.map(async (base64Image) => {
      const buffer = Buffer.from(base64Image.split(",")[1], "base64");

      const fileName = `${uuidv4()}.jpeg`;

      return await uploadFile(buffer, fileName);
    })
  );

  try {
    const newProduct = await prisma?.product.create({
      data: {
        name: fields.name,
        categoryId: fields.categoryId,
        thumbnail: newImageUrls[0] || "", // Assuming first image as thumbnail
        gallery: newImageUrls,
        price: parseFloat(fields.price),
        description: fields.description,
        stockQuantity: parseInt(fields.stockQuantity, 10),
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Error registering product files" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // get all categories
  // return NextResponse.json("erroor", { status: 500 })
  const products = await prisma.product.findMany({
    orderBy: {
      created: "desc",
    },
  });
  return NextResponse.json(products, { status: 200 });
}
