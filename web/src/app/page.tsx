'use client';
import Head from 'next/head';
import dynamic from 'next/dynamic';
const WalletBar = dynamic(() => import('../components/WalletBar'), { ssr: false })

const Page: React.FC = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Head>
        <title>Frontend Workshop</title>
      </Head>
      <div className="flex flex-row mb-4">
        <WalletBar />
      </div>
    </div>
  );
};

export default Page;
