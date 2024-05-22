'use client';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import {
  useBlockNumber,
  useAccount,
  useBalance,
} from "@starknet-react/core";
import { BlockNumber } from "starknet";

const WalletBar = dynamic(() => import('../components/WalletBar'), { ssr: false })
const Page: React.FC = () => {

  // Step 1 --> Read the latest block -- Start
  const { data: blockNumberData, isLoading: blockNumberIsLoading, isError: blockNumberIsError } = useBlockNumber({
    blockIdentifier: 'latest' as BlockNumber
  });
  const workshopEnds = 68224;
  // Step 1 --> Read the latest block -- End

  // Step 2 --> Read your balance -- Start
  const { address: userAddress } = useAccount();
  const { isLoading: balanceIsLoading, isError: balanceIsError, error: balanceError, data: balanceData } = useBalance({
    address: userAddress,
    watch: true
  });
  // Step 2 --> Read your balance -- End

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Head>
        <title>Frontend Workshop</title>
      </Head>
      <div className="flex flex-row mb-4">
        <WalletBar />
      </div>

      {/* Step 1 --> Read the latest block -- Start */}
      {!blockNumberIsLoading && !blockNumberIsError && (
        <div
          className={`p-4 w-full max-w-md m-4 border-black border ${blockNumberData! < workshopEnds ? "bg-green-500" : "bg-red-500"}`}
        >
          <h3 className="text-2xl font-bold mb-2">Read the Blockchain</h3>
          <p>Current Block Number: {blockNumberData}</p>
          {blockNumberData! < workshopEnds ? "We're live on Workshop" : "Workshop has ended"}
        </div>
      )}
      {/* <div
        className={`p-4 w-full max-w-md m-4 border-black border bg-white`}
      >
        <h3 className="text-2xl font-bold mb-2">Read the Blockchain</h3>
        <p>Current Block Number: xyz</p>
        Are we live?
      </div> */}
      {/* Step 1 --> Read the latest block -- End */}

      {/* Step 2 --> Read your balance -- Start */}
      {!balanceIsLoading && !balanceIsError && (
        <div
          className={`p-4 w-full max-w-md m-4 bg-white border-black border`}
        >
          <h3 className="text-2xl font-bold mb-2">Read your Balance</h3>
          <p>Symbol: {balanceData?.symbol}</p>
          <p>Balance: {Number(balanceData?.formatted).toFixed(4)}</p>
        </div>
      )}
      {/* <div
        className={`p-4 w-full max-w-md m-4 bg-white border-black border`}
      >
        <h3 className="text-2xl font-bold mb-2">Read your Balance</h3>
        <p>Symbol: Ticker</p>
        <p>Balance: xyz</p>
      </div> */}
      {/* Step 2 --> Read your balance -- End */}

    </div>
  );
};

export default Page;
