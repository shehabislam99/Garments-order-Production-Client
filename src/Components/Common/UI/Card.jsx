const Card = ({ children, className = "", padding = "medium" }) => {
  const paddingClasses = {
    none: "p-0",
    small: "p-4",
    medium: "p-6",
    large: "p-8",
  };

  return (
    <div
      className={`
        custom-bg  rounded-4xl shadow-md border border-gray-200
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
