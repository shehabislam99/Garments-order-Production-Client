const Card = ({
  children,
  className = "",
  padding = "medium",
  hover = false,
  onClick,
}) => {
  const paddingClasses = {
    none: "p-0",
    small: "p-4",
    medium: "p-6",
    large: "p-8",
  };

  return (
    <div
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200
        ${paddingClasses[padding]}
        ${
          hover
            ? "hover:shadow-md transition-shadow duration-200 cursor-pointer"
            : ""
        }
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
