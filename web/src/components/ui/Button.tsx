import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`border border-black text-black font-regular py-2 px-4 bg-yellow-300 hover:bg-yellow-500 ${props.className}`}
    >
      {children}
    </button>
  );
};
