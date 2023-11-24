"use client";
import React, { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control, Controller } from "react-hook-form";
import { FormItem, FormLabel } from "@/components/ui/form";
import axios from "axios";
import { API } from "@/lib/config";
import { Category } from "@prisma/client";

interface ProductIdSelectProp {
  control: Control<any>;
}

const ProductIdSelect = ({ control }: ProductIdSelectProp) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API}/admin/category`);

        setCategories(data);
      } catch (error) {
        console.log("Something won't wrong", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Controller
      control={control}
      name="categoryId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Choose Category</FormLabel>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose Category" />
            </SelectTrigger>
            <SelectContent className="mt-10">
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};

export default ProductIdSelect;
