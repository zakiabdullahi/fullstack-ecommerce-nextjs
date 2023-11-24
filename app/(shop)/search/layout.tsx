import React, { ReactNode } from "react";
import Categories from "./_components/Categories";
import SortingOptions from "./_components/SortingOptions";

const ShopLayOut = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen ">
      <div className="flex flex-grow">
        {/* left side */}

        <aside className="w-1/6 bg-gray-800 text-white p-4">
          <Categories />
        </aside>
        {/* products */}
        <main className="w-4/6 ">
          <div className="mt-6 ">{children}</div>
        </main>

        {/* left sidebar */}
        <aside className="w-1/6 bg-gray-800 text-white p-4">
          {/* sorting options  */}
          <SortingOptions />
        </aside>
      </div>
    </div>
  );
};

export default ShopLayOut;
