'use client';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAccount, useBalance, useBlockNumber, useContract, useReadContract, useSendTransaction, useTransactionReceipt } from '@starknet-react/core';
import { BlockNumber, Contract, RpcProvider } from "starknet";
import { ABI } from "../abis/abi";
import { type Abi } from "starknet";
import { formatAmount, shortenAddress } from '@/lib/utils';
const WalletBar = dynamic(() => import('../components/WalletBar'), { ssr: false })
const Page: FC = () => {

  // Step 1 --> Read the latest block -- Start
  const { data: blockNumberData, isLoading: blockNumberIsLoading, isError: blockNumberIsError } = useBlockNumber({
    blockIdentifier: 'latest' as BlockNumber
  });
  const workshopEnds = 180000;
  // Step 1 --> Read the latest block -- End

  // Step 2 --> Read your balance -- Start
  const { address: userAddress } = useAccount();
  const { isLoading: balanceIsLoading, isError: balanceIsError, error: balanceError, data: balanceData } = useBalance({
    address: userAddress,
    watch: true
  });
  // Step 2 --> Read your balance -- End

  // Step 3 --> Read from a contract -- Start
  const contractAddress = "0x1c758616421a10f9df071a5d985c72e3907cf98d553204cf8dee354647c736";
  const { data: readData, refetch: dataRefetch, isError: readIsError, isLoading: readIsLoading, error: readError } = useReadContract({
    functionName: "get_balance",
    args: [],
    abi: ABI as Abi,
    address: contractAddress,
    watch: true,
    refetchInterval: 1000
  });
  // Step 3 --> Read from a contract -- End

  // Step 4 --> Write to a contract -- Start
  const [amount, setAmount] = useState<number | ''>(0);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted with amount ", amount);
    writeAsync();
  };
  const typedABI = ABI as Abi;
  const { contract } = useContract({
    abi: typedABI,
    address: contractAddress,
  });
  const calls = useMemo(() => {
    if (!userAddress || !contract) return [];
    const safeAmount = amount || 0;
    return [contract.populate("increase_balance", [safeAmount])];
  }, [contract, userAddress, amount]);
  const {
    send: writeAsync,
    data: writeData,
    isPending: writeIsPending,
  } = useSendTransaction({
    calls,
  });
  const {
    data: waitData,
    status: waitStatus,
    isLoading: waitIsLoading,
    isError: waitIsError,
    error: waitError
  } = useTransactionReceipt({ hash: writeData?.transaction_hash, watch: true })
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAmount(value === '' ? '' : Number(value));
  };
  const LoadingState = ({ message }: { message: string }) => (
    <div className="flex items-center space-x-2">
      <div className="animate-spin">
        <svg className="h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <span>{message}</span>
    </div>
  );
  const buttonContent = () => {
    if (writeIsPending) {
      return <LoadingState message="Send..." />;
    }

    if (waitIsLoading) {
      return <LoadingState message="Waiting for confirmation..." />;
    }

    if (waitStatus === "error") {
      return <LoadingState message="Transaction rejected..." />;
    }

    if (waitStatus === "success") {
      return "Transaction confirmed";
    }

    return "Send";
  };
  // Step 4 --> Write to a contract -- End

  // Step 5 --> Reset balance -- Start
  const resetBalanceCall = useMemo(() => {
    if (!contract) return undefined;
    try {
      return contract.populate("reset_balance");
    } catch (error) {
      console.error("Error populating reset_balance call:", error);
      return undefined;
    }
  }, [contract]);
  const {
    send: resetBalance,
    isPending: resetIsPending,
    data: resetData,
  } = useSendTransaction({
    calls: resetBalanceCall ? [resetBalanceCall] : [],
  });
  // Step 5 --> Reset balance -- End

  // Step 6 --> Get events from a contract -- Start
  type ContractEvent = {
    from_address: string;
    keys: string[];
    data: string[];
  };
  const provider = useMemo(() => new RpcProvider({ nodeUrl: process.env.NEXT_PUBLIC_RPC_URL }), []);
  const [events, setEvents] = useState<ContractEvent[]>([]);
  const lastCheckedBlockRef = useRef(0);
  const { data: blockNumber } = useBlockNumber({ refetchInterval: 3000 });
  const checkForEvents = useCallback(async (contract: Contract, currentBlockNumber: number) => {
    if (currentBlockNumber <= lastCheckedBlockRef.current) {
      return; // No new blocks, skip checking for events
    }
    try {
      // Fetch events only for the new blocks
      const fromBlock = lastCheckedBlockRef.current + 1;
      const fetchedEvents = await provider.getEvents({
        address: contract.address,
        from_block: { block_number: fromBlock },
        to_block: { block_number: currentBlockNumber },
        chunk_size: 500,
      });

      if (fetchedEvents && fetchedEvents.events) {
        setEvents(prevEvents => [...prevEvents, ...fetchedEvents.events]);
      }

      lastCheckedBlockRef.current = currentBlockNumber;
    } catch (error) {
      console.error('Error checking for events:', error);
    }
  }, [provider]);

  useEffect(() => {
    if (contract && blockNumber) {
      checkForEvents(contract, blockNumber);
    }
  }, [contract, blockNumber, checkForEvents]);
  const lastFiveEvents = useMemo(() => {
    return [...events].reverse().slice(0, 5);
  }, [events]);
  // Step 6 --> Get events from a contract -- End

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

          {/* Step 2 --> Read your balance -- Start */}
          {!balanceIsLoading && !balanceIsError && userAddress && (
            <div className="p-4 bg-white border-black border">
              <h3 className="text-lg font-bold mb-2">Your Balance</h3>
              <p>Symbol: {balanceData?.symbol}</p>
              <p>Balance: {Number(balanceData?.formatted).toFixed(4)}</p>
            </div>
          )}
          {/* <div className="p-4 bg-white border-black border">
            <h3 className="text-lg font-bold mb-2">Your Balance</h3>
            <p>Symbol: XYZ</p>
            <p>Balance: 100</p>
          </div> */}
          {/* Step 2 --> Read your balance -- End */}

          {/* Step 5 --> Reset balance by owner only -- Start */}
          <div className="p-4 bg-white border-black border">
            <h3 className="text-lg font-bold mb-2">Reset Balance</h3>
            <button
              onClick={() => resetBalance()}
              disabled={resetIsPending || !resetBalanceCall || !userAddress}
              className="mt-2 border border-black text-black font-regular py-2 px-4 bg-yellow-300 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {resetIsPending ? <LoadingState message="Resetting..." /> : "Reset Balance"}
            </button>
            {resetData?.transaction_hash && (
              <p className="mt-2 text-sm">
                Transaction sent: {resetData.transaction_hash}
              </p>
            )}
          </div>
          {/* <div className="p-4 bg-white border-black border">
            <h3 className="text-lg font-bold mb-2">Reset Balance</h3>
            <button
              onClick={() => console.log("Resetting...")}
              disabled={false}
              className="mt-2 border border-black text-black font-regular py-2 px-4 bg-yellow-300 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Reset Balance
            </button>
            <p className="mt-2 text-sm">
              Transaction sent: url
            </p>
          </div> */}
          {/* Step 5 --> Reset balance by owner only -- End */}
        </div>

        <div className="w-full max-w-md space-y-4">

          {/* Step 3 --> Read from a contract -- Start */}
          <div className="p-4 bg-white border-black border">
            <h3 className="text-lg font-bold mb-2">Contract Balance</h3>
            <p>Balance: {readData?.toString()}</p>
            <button
              onClick={() => dataRefetch()}
              className="mt-2 border border-black text-black font-regular py-1 px-3 bg-yellow-300 hover:bg-yellow-500"
            >
              Refresh
            </button>
          </div>
          {/* <div className="p-4 bg-white border-black border">
            <h3 className="text-lg font-bold mb-2">Contract Balance</h3>
            <p>Balance: 0</p>
            <button
              onClick={() => console.log("Refreshing...")}
              className="mt-2 border border-black text-black font-regular py-1 px-3 bg-yellow-300 hover:bg-yellow-500"
            >
              Refresh
            </button>
          </div> */}
          {/* Step 3 --> Read from a contract -- End */}

          {/* Step 4 --> Write to a contract -- Start */}
          <form onSubmit={handleSubmit} className="bg-white p-4 border-black border">
            <h3 className="text-lg font-bold mb-2">Write to Contract</h3>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount:</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              className="block w-full px-3 py-2 text-sm leading-6 border-black focus:outline-none focus:border-yellow-300 black-border-p"
            />
            <button
              type="submit"
              className="mt-3 border border-black text-black font-regular py-2 px-4 bg-yellow-300 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!userAddress || writeIsPending}
            >
              {buttonContent()}
            </button>
            {writeData?.transaction_hash && (
              <a
                href={`https://sepolia.voyager.online/tx/${writeData?.transaction_hash}`}
                target="_blank"
                className="block mt-2 text-blue-500 hover:text-blue-700 underline"
                rel="noreferrer"
              >
                Check TX on Sepolia
              </a>
            )}
          </form>
          {/* <form className="bg-white p-4 border-black border">
            <h3 className="text-lg font-bold mb-2">Write to Contract</h3>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount:</label>
            <input
              type="number"
              id="amount"
              className="block w-full px-3 py-2 text-sm leading-6 border-black focus:outline-none focus:border-yellow-300 black-border-p"
            />
            <button
              type="submit"
              className="mt-3 border border-black text-black font-regular py-2 px-4 bg-yellow-300 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Send
            </button>
            <a
              href={`https://sepolia.voyager.online/tx/`}
              target="_blank"
              className="block mt-2 text-blue-500 hover:text-blue-700 underline"
              rel="noreferrer"
            >
              Check TX on Sepolia
            </a>
          </form> */}
          {/* Step 4 --> Write to a contract -- End */}

          {/* Step 6 --> Get events from a contract -- Start */}
          <div className="p-4 bg-white border-black border">
            <h3 className="text-lg font-bold mb-2">
              Contract Events ({events.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-gray-300 text-left p-2 font-semibold">Sender</th>
                    <th className="border-b border-gray-300 text-right p-2 font-semibold">Added</th>
                    <th className="border-b border-gray-300 text-right p-2 font-semibold">New Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {lastFiveEvents.map((event, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="border-b border-gray-200 p-2">{shortenAddress(event.keys[1])}</td>
                      <td className="border-b border-gray-200 p-2 text-right">{formatAmount(event.data[0])}</td>
                      <td className="border-b border-gray-200 p-2 text-right">{formatAmount(event.data[2])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* <div className="p-4 bg-white border-black border">
            <h3 className="text-lg font-bold mb-2">
              Contract Events (X)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-gray-300 text-left p-2 font-semibold">Sender</th>
                    <th className="border-b border-gray-300 text-right p-2 font-semibold">Added</th>
                    <th className="border-b border-gray-300 text-right p-2 font-semibold">New Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={0}>
                    <td className="border-b border-gray-200 p-2">0xNestor</td>
                    <td className="border-b border-gray-200 p-2 text-right">1</td>
                    <td className="border-b border-gray-200 p-2 text-right">1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div> */}
          {/* Step 6 --> Get events from a contract -- End */}
        </div>
      </div>
    </div >
  );
};

export default Page;