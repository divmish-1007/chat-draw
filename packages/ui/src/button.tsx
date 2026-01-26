"use client"
import { ReactNode } from "react";

type btnProps = {
  variant: "primary" | "secondary"
  children: ReactNode
  size: "md" | "lg"
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function Button({ variant, size, onClick, children }: btnProps) {
  const baseClass =
    "cursor-pointer transition-all rounded-lg"

  const variantClass =
    variant === "primary"
      ? "bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl"
      : "bg-white text-gray-900 border-2 border-gray-300 hover:border-gray-900"

  const sizeClass =
    size === "lg"
      ? "px-8 py-4 text-lg font-semibold"
      : "px-6 py-2 font-medium"
  
  return (

    <button
      className={`${baseClass} ${variantClass} ${sizeClass}`}
      onClick = { onClick }
    >
      {children}
    </button>
  )
  
}

/* 
1. size = "md", variant = "primary" dark
<button className="px-6 py-2 cursor-pointer bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow-md">
  Sign Up
</button>

2. size="lg"  variant= "primary" dark
<button className="px-8 py-4 cursor-pointer bg-gray-900 text-white text-lg font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl" >
  Get Started Free
</button>

3. size="lg"  variant= "primary" dark
<button className="px-8 py-4 cursor-pointer bg-gray-900 text-white text-lg font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl">
  Sign Up Now
</button>
*/





/* 
  1. size = "md", variant = "secondary" light

<button className="px-6 py-2 cursor-pointer bg-white text-gray-900 font-medium rounded-lg border-2 border-gray-300 hover:border-gray-900 transition-colors">
   Sign In
</button>

 2. size="lg"  variant="secondary" light

<button className="px-8 py-4 cursor-pointer bg-white text-gray-900 text-lg font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-900 transition-all">
  View Demo
</button> 

3. size="lg"  variant="secondary" light

<button className="px-8 py-4 cursor-pointer bg-white text-gray-900 text-lg font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-900 transition-all">
  Sign In
</button>
*/



// interface ButtonProps {
//   children:ReactNode;
//   className?: string;
//   appName: string;
// }

// export const Button = ({ children, className, appName }: ButtonProps) => {
//   return (
//     <button
//       className={className}
//       onClick={() => alert(`Hello from your ${appName} app!`)}
//     >
//       {children}
//     </button>
//   );
// };