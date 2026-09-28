import React from "react";

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
};
const sizes = {
  sm: "px-3 py-1.5 min-h-[38px]",
  md: "px-4 py-2 min-h-[44px]",
  lg: "px-6 py-3 min-h-[52px]",
};
const CustomButon = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles = "btn";
  const variantStyles = variants[variant];
  const sizeStyles = sizes[size];
  return (
    <button className={`${baseStyles} ${variantStyles} ${sizeStyles}`}>
      {isLoading && (
        <span className="mr-2 animate-spin border-2 border-current border-t-transparent rounded-full w-4 height-4" />
      )}
      {!isLoading && icon && <span className="inline-flex mr-2">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default CustomButon;
