import React from "react";
import AdminSidebar from "./_components/AdminSidebar";
import Navbar from "./_components/Navbar";
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="h-[70px] md:pl-56 fixed inset-y-0  w-full z-50">
        <Navbar />
      </div>
      <div className="hidden md:flex  h-full  w-56 flex-col fixed inset-y-0 ">
        <AdminSidebar />
      </div>

      <main className="md:pl-64 h-full mt-10 container mx-auto py-10">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
