import React from "react";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  return (
    <div className="p-4  border-b  h-full  item-center shadow-sm">
      <MobileMenu />
    </div>
  );
};

export default Navbar;
