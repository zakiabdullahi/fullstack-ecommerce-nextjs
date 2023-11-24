import { Metadata } from "next";
import React from "react";

import { FcGoogle } from "react-icons/fc";
export const metadata: Metadata = {
  title: "Login page",
  description: "login page description",
};

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="w-[320px ] mx-auto flex justify-center  items-center h-screen ">
      <Card>
        <CardHeader>
          <CardTitle>Login with Google</CardTitle>
          <CardDescription>Login by using your google account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="flex gap-2" variant="secondary">
            <FcGoogle />
            <span>continue with google</span>
          </Button>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
}
