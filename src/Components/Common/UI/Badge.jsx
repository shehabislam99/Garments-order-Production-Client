const Badge = ({ children, color = "blue", className = "" }) => {
  const colorMap = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${colorMap[color]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
