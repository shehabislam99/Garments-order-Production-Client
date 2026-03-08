import { useState } from "react";

const Dropdown = ({ label, items = [] }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="px-3 py-2 border app-border rounded-4xl app-surface"
      >
        {label}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 min-w-[10rem] rounded-4xl border app-border app-surface shadow-lg z-40">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
