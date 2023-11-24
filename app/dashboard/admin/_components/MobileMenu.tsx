import React from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger className="justify-center md:hidden pr-4 hover:opacity-80 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="right" className="p-0 bg-white">
        <AdminSidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
