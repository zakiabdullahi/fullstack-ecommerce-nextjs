"use client";
import React, { useState, useEffect, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { API } from "@/lib/config";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { Category, Product } from "@prisma/client";
import { CameraIcon, Loader2, XIcon } from "lucide-react";
import { productSchema } from "@/app/validationSchema/productSchema";
import ProductIdSelect from "./ProductIdSelect";
import { useDropzone } from "react-dropzone";

import { Textarea } from "@/components/ui/textarea";
import { deleteFromS3 } from "@/app/actions/deleteFromS3";

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result as string);

    reader.onerror = (error) => reject(error);
  });

interface FilePreview extends File {
  preview: string;
}
const ProductForm = ({ product }: { product?: Product }) => {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name,
      price: product?.price,
      categoryId: product?.categoryId,
      gallery: product?.gallery,
      stockQuantity: product?.stockQuantity,
      description: product?.description,
    },
  });

  const router = useRouter();

  const queryClient = useQueryClient();

  const [files, setFiles] = useState<FilePreview[]>([]);

  const [existingImages, setExistingImages] = useState<string[]>(
    product ? product?.gallery : []
  );
  const [loading, setLoading] = useState(false);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*" as any,
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);

      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        )
      );
    },
  });
  const removeFile = (index: number) => {
    console.log("remove");
    setFiles(files.filter((_, i) => i !== index));
  };
  // Cleanup previews
  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const removeExistingImage = async (url: string, productId?: string) => {
    if (!confirm("are you sure to delete this Image")) return;
    setLoading(true);

    console.log("started");

    setExistingImages((exist) => exist.filter((image) => image !== url));
    const removeFromS3 = await deleteFromS3(url, existingImages, productId);

    // if ("err" in removeFromS3) {
    //   if (removeFromS3.err) {
    //     toast.error("Something went wrong");
    //   } else {
    //     toast.success("Image deleted successfully");
    //   }
    // }
    //@ts-ignore
    if (removeFromS3.error) {
      toast.error("Something went wrong");
      setLoading(false);
    } else {
      toast.success("Image deleted successfully");
      setLoading(false);
    }

    console.log("RemoveS3", removeFromS3);
  };

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    console.log(values);

    try {
      const formData = new FormData();

      console.log(formData);

      Object.keys(values).forEach((key) => {
        if (key !== "gallery") {
          const value = values[key as keyof typeof values];
          if (value !== undefined) {
            formData.append(key, value.toString());
          }
        }
      });

      for (const file of files) {
        const base64 = await toBase64(file);

        formData.append(`newImages`, base64);
      }

      existingImages.forEach((url) => formData.append("existingImages", url));

      if (product) {
        setLoading(true);
        await axios.patch(`${API}/admin/product/${product.id}`, formData);
        setLoading(false);
      } else {
        await axios.post(`${API}/admin/product`, formData);
      }
      toast.success(
        `successfully ${product ? "updated" : "registered"} product`
      );
      queryClient.invalidateQueries({ queryKey: ["product"] });
      router.push("/dashboard/admin/product");
    } catch (error) {
      console.log(error);
      toast.error("Oops something went wrong");
    }
  };

  return (
    <Card className="max-w-xl mx-auto my-10">
      <CardHeader>
        <CardTitle>
          {product ? "Update Category" : "Register New Product"}
        </CardTitle>
        <CardDescription>
          {product ? "Update  Product" : "Register New Product"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Product Name" {...field} />
                  </FormControl>
                  {/* <FormDescription>Enter Product Name</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                // <FormItem>
                //   <FormLabel>Username</FormLabel>
                //   <FormControl>
                //     <Input placeholder="Enter Product Name" {...field} />
                //   </FormControl>
                //   {/* <FormDescription>Enter Product Name</FormDescription> */}
                //   <FormMessage />
                // </FormItem>
                <ProductIdSelect control={form.control} />
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Product Price"
                      {...field}
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  {/* <FormDescription>Enter Product Name</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stockQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>stockQuantity</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Product stockQuantity"
                      {...field}
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  {/* <FormDescription>Enter Product Name</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter Product description"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>Enter Product Name</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gallery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product gallery</FormLabel>
                  <FormControl>
                    <div {...getRootProps()} className="dropzone">
                      <input {...getInputProps} />
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                          <CameraIcon className="h-10 w-10 text-gray-900/25" />
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*  uploaded images */}
            <div className="flex flex-wrap mt-4 space-x-2 ">
              {files.map((file, index) => (
                <div key={index} className="relative m-2">
                  <img
                    className="w-24 h-24 object-cover rounded-md"
                    src={file.preview}
                    alt={file.name}
                  />
                  <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
                    <XIcon
                      onClick={() => removeFile(index)}
                      className="text-white w-5 h-5"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/*  existing images */}
            <div className="flex flex-wrap mt-4 space-x-2 ">
              {existingImages.map((url, index) => (
                <div key={index} className="relative m-2">
                  <img
                    className="w-24 h-24 object-cover rounded-md"
                    src={url}
                    alt={url}
                  />
                  <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
                    <XIcon
                      onClick={() => removeExistingImage(url, product?.id)}
                      className="text-white w-5 h-5"
                    />
                  </div>
                </div>
              ))}
            </div>

            <SubmitButtonWithContent
              loading={form.formState.isSubmitting || loading}
              isUpdate={!!product}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
const SubmitButtonWithContent = ({
  loading,
  isUpdate,
}: {
  loading: boolean;
  isUpdate: boolean;
}) => {
  if (loading) {
    return (
      <Button>
        {isUpdate ? "Updating ..." : "Registering ..."}
        <Loader2 className="animate-spin ml-2 w-5 h-5 " />
      </Button>
    );
  } else {
    return <Button type="submit">{isUpdate ? "Update" : "Submit"}</Button>;
  }
};
