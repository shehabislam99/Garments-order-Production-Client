import React from "react";
import { NavLink } from "react-router-dom";
import { TiDeleteOutline } from "react-icons/ti";

const MenuSideBar = ({ links, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="dropdown-overlay fixed inset-0 z-50 lg:hidden"
      onClick={onClose}
    >
      <div
        className="dropdown-content fixed left-0 top-0 h-full w-64 backdrop-blur-xl shadow-lg z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-red-700 hover:text-amber-300 text-2xl"
          >
            <TiDeleteOutline className="h-7 w-7 " />
          </button>

          <ul className="mt-8 space-y-4 font-semibold">
            {links.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `block py-3 px-4 rounded-lg transition-all duration-200 ${
                      isActive
                        ? " hover:text-amber-500 "
                        : " hover:text-amber-500 hover:underline"
                    }`
                  }
                  onClick={onClose}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MenuSideBar;
