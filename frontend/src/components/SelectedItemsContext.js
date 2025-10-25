import React, { createContext, useContext, useState } from "react";

const SelectedItemsContext = createContext();

export const SelectedItemsProvider = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [donation, setDonation] = useState(0); 
    const [coupon, setCoupon] = useState(null);// ✅ donation added here

  return (
    <SelectedItemsContext.Provider
      value={{ selectedItems, setSelectedItems, donation, setDonation,coupon,
        setCoupon }}
    >
      {children}
    </SelectedItemsContext.Provider>
  );
};

export const useSelectedItems = () => useContext(SelectedItemsContext);
