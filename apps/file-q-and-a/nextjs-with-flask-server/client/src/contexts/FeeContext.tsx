
// @ts-nocheck
import React, { createContext, useState, useMemo } from 'react';

interface FeeContextType {
  selectedFee: any | null;
  feeConfirmed: boolean;
  totalCost: number;
  selectFee: (fee: any) => void;
  setFeeConfirmed: (confirmed: boolean) => void;
  setTotalCost: (fee: any) => void;
  updateTotalCost: (fee: any) => void;
}

export const FeeContext = createContext<FeeContextType>({
  selectedFee: null,
  totalCost: null,
  feeConfirmed: false,
  selectFee: () => {},
  setFeeConfirmed: () => {},
  setTotalCost: () => {},
  updateTotalCost: () => {},
});

interface FeeProviderProps {
  children: React.ReactNode;
}

export const FeeProvider: React.FunctionComponent<FeeProviderProps> = ({ children }) => {
  const [selectedFee, setSelectedFee] = useState<any | null>(null);
  const [totalCost, setTotalCost] = useState<any | null>(null);
  const [feeConfirmed, setFeeConfirmed] =useState(false)


  const selectFee = (fee: any) => {
    setSelectedFee(fee);
  };

  const updateFeeConfirmed = (confirmed: boolean) => {
    setFeeConfirmed(confirmed);
  };

  const updateTotalCost = (fee: number) => {
    setTotalCost(fee);
  };


  const value = useMemo(() => ({
    totalCost,
    selectedFee,
    feeConfirmed,
    selectFee,
    setFeeConfirmed: updateFeeConfirmed,
    setTotalCost: updateTotalCost,
    updateTotalCost
  }), [selectedFee, feeConfirmed, totalCost]);

  return (
    <FeeContext.Provider value={value}>
      {children}
    </FeeContext.Provider>
  );
};
