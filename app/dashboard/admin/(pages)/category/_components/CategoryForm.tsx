"use client";
import { categorySchema } from "@/app/validationSchema/categorySchema";
import React from "react";
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
import { Category } from "@prisma/client";
import { Loader2 } from "lucide-react";

const CategoryForm = ({ category }: { category?: Category }) => {
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name,
    },
  });

  const router = useRouter();

  const queryClient = useQueryClient();

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    console.log(values);

    try {
      if (category) {
        await axios.patch(`${API}/admin/category/${category.id}`, values);
      } else {
        await axios.post(`${API}/admin/category`, values);
      }

      toast.success(
        `successfully ${category ? "updated" : "registered"} category`
      );

      queryClient.invalidateQueries({ queryKey: ["category"] });
      router.push("/dashboard/admin/category");
    } catch (error) {
      console.log(error);
      toast.error("Category created successfully");
    }
  };

  return (
    <Card className="max-w-xl mx-auto my-10">
      <CardHeader>
        <CardTitle>
          {category ? "Update Category" : "Register New Category"}
        </CardTitle>
        <CardDescription>
          {category ? "Update  Category" : "Register New Category"}
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
                    <Input placeholder="Enter Category Name" {...field} />
                  </FormControl>
                  {/* <FormDescription>Enter Category Name</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <SubmitButtonWithContent
              loading={form.formState.isSubmitting}
              isUpdate={!!category}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CategoryForm;

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
