'use client';
import { FC } from 'react';
import dynamic from 'next/dynamic';
import { useBlockNumber } from '@starknet-react/core';
import { BlockNumber } from 'starknet';
const WalletBar = dynamic(() => import('../components/WalletBar'), { ssr: false })
const Page: FC = () => {

  // Step 1 --> Read the latest block -- Start
  const { data: blockNumberData, isLoading: blockNumberIsLoading, isError: blockNumberIsError } = useBlockNumber({
    blockIdentifier: 'latest' as BlockNumber
  });
  const workshopEnds = 180000;
  // Step 1 --> Read the latest block -- End

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col">
      <h1 className="text-3xl font-bold text-center mb-6">Starknet Frontend Workshop</h1>

      <div className="flex flex-wrap justify-center gap-4">

        <div className="w-full max-w-md space-y-4">
          <div className="bg-white p-4 border-black border">
            <h2 className="text-xl font-bold mb-2">Wallet Connection</h2>
            <WalletBar />
          </div>

          {/* Step 1 --> Read the latest block -- Start */}
          {!blockNumberIsLoading && !blockNumberIsError && (
            <div className={`p-4 border-black border ${blockNumberData! < workshopEnds ? "bg-green-500" : "bg-red-500"}`}>
              <h3 className="text-lg font-bold mb-2">Read the Blockchain</h3>
              <p>Current Block: {blockNumberData}</p>
              <p>{blockNumberData! < workshopEnds ? "Workshop is live" : "Workshop has ended"}</p>
            </div>
          )}
          {/* <div className={`p-4 border-black border`}>
            <h3 className="text-lg font-bold mb-2">Read the Blockchain</h3>
            <p>Current Block: 0</p>
          </div> */}
          {/* Step 1 --> Read the latest block -- End */}
        </div>

        <div className="w-full max-w-md space-y-4">
        </div>
      </div>
    </div >
  );
};

export default Page;