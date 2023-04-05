// UserContext.tsx
import { useLocalStorage } from '@solana/wallet-adapter-react';
import { createContext, useContext, useState } from 'react';

interface UserContextValue {
  bitcoinAddress: string | null;
  setBitcoinAddress: (address: string | null) => void;
  isNFTOwner: boolean;
  setIsNFTOwner: (owner: boolean) => void;
}

const UserContext = createContext<UserContextValue>({
  bitcoinAddress: null,
  setBitcoinAddress: () => {},
  isNFTOwner: false,
  setIsNFTOwner: () => {},
});

export const useUserContext = () => useContext(UserContext);

export const UserProvider: React.FC = ({ children }: any) => {
  const [bitcoinAddress, setBitcoinAddress] = useState<string | null>(null)
  const [isNFTOwner, setIsNFTOwner] = useState<boolean>(false)
  return (
    <UserContext.Provider value={{ bitcoinAddress, setBitcoinAddress, isNFTOwner, setIsNFTOwner }}>
      {children}
    </UserContext.Provider>
  );
};
