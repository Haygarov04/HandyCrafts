"use client";

import { createContext, useContext } from "react";

const DiscountContext = createContext(true);

/** Whether the −10 € discount is on, as set in /manage. */
export function useDiscount() {
  return useContext(DiscountContext);
}

export const DiscountProvider = DiscountContext.Provider;
