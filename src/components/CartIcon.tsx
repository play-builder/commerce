import React from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface Props {
  cartItems: number;
}

export default function CartIcon({ cartItems }: Props) {
  return (
    <Link
      className="bg-amber-500 w-7 h-7 lg:w-8 lg:h-8 p-2 rounded-full relative flex items-center justify-center"
      href="/cart"
    >
      <ShoppingCartIcon className="w-4 h-4" />
      <div className="absolute bg-gray-700 text-white lg:text-xs text-[9px] -top-2 -right-1 w-4 h-4 lg:w-6 lg:h-6 flex items-center justify-center rounded-full">
        {cartItems}
      </div>
    </Link>
  );
}
