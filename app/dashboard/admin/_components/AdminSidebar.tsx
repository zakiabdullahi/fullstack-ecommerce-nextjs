import React from "react";
import SidebarRoutes from "./SidebarRoutes";
import Image from "next/image";

const AdminSidebar = () => {
  return (
    <div className=" h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-6">
        <Image width={50} height={50} src="/logo.svg" alt="logo" />
      </div>

      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};

export default AdminSidebar;
