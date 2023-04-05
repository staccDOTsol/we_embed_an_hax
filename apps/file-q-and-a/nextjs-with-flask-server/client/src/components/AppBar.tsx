
import dynamic from 'next/dynamic';
import React, { useState } from "react";
import { WalletConnectButton, WalletDisconnectButton, WalletModalButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

const MintURL = process.env.MINT_URL;

const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export const AppBar: React.FC = () => {
  const {connected } = useWallet()
  return (
  
        <div className="navbar-end">
          <div className="hidden md:inline-flex align-items-center justify-items gap-6">
          <WalletMultiButtonDynamic className="btn-ghost btn-sm rounded-btn bg-black text-lg mr-6 " />
          
        </div>
      
      </div>
  );
};
