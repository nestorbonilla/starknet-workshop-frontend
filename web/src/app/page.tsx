'use client';
import { FC } from 'react';
import dynamic from 'next/dynamic';
const WalletBar = dynamic(() => import('../components/WalletBar'), { ssr: false })
const Page: FC = () => {

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col">
      <h1 className="text-3xl font-bold text-center mb-6">Starknet Frontend Workshop</h1>

      <div className="flex flex-wrap justify-center gap-4">

        <div className="w-full max-w-md space-y-4">
          <div className="bg-white p-4 border-black border">
            <h2 className="text-xl font-bold mb-2">Wallet Connection</h2>
            <WalletBar />
          </div>
        </div>

        <div className="w-full max-w-md space-y-4">
        </div>
      </div>
    </div >
  );
};

export default Page;