import React from "react";

import logo from "../../../assets/logo-1.png";
import { Link } from "react-router";

const Logo = () => {
  return (
    <Link to="/" className="hover:underline">
      <div className="flex items-end">
        <img src={logo} alt="" className="w-12 h-10" />
        <h3 className="text-black text-3xl font-bold">
          <span className="text-indigo-600">Tex</span>
          <span className="text-purple-600">Flow</span>
        </h3>
      </div>
    </Link>
  );
};

export default Logo;
