import { Layout } from "./components/Layout";
import { useListen } from "./hooks/useListen";
import { type MetaMaskInpageProvider } from "@metamask/providers";
import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import { MetaMaskProvider, useMetaMask } from "./hooks/useMetaMask";
import { SdkLayout } from "./components/SdkProvider";
import { SiEthereum } from "react-icons/si";
import { formatAddress, formatChainAsNum } from "./utils";
import { config, isSupportedNetwork } from "./lib/config";
import SwitchNetwork from "./SwitchNetwork/SwitchNetwork";
import KaziKrypto from "../../contract/build/contracts/KaziKrypto.json";
import "./App.css";
import { ethers } from "ethers";
import AddFreelancerComponent from "./components/forms/AddFreeLancer";
import GetFreelancerComponent from "./components/display/DisplayFreelancer";
import AddPortfolioComponent from "./components/forms/AddPortfolio";
import GetPortfolioComponent from "./components/display/DisplayPortfolio";
import PostClientJobComponent from "./components/forms/AddClientJob";
import ViewClientJobsComponent from "./components/display/DisplayJobs";
import Navbar from "./navbar/navbar";
import {
  useState,
  useEffect,
  createContext,
  PropsWithChildren,
  useContext,
  useCallback,
} from "react";

export default function App() {
  return (
    <Router>
      <MetaMaskProvider>
        <Navbar />
        <SdkLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Add more routes for other pages */}
          </Routes>
        </SdkLayout>
      </MetaMaskProvider>
    </Router>
  );
}

function Home() {
  interface WalletState {
    accounts: any[];
    balance: string;
    chainId: string;
    address: string;
  }

  const freelancerAddress = "0xea538CD7F3F3813C978D8407370C8D2669548914";
  const portfolioIndex = 0;

  const {
    dispatch,
    state: {
      status,
      isMetaMaskInstalled,
      wallet,
      balance,
      chainId,
      walletContainer,
    },
  } = useMetaMask();
  const listen = useListen();

  console.log("hello");
  // we can use this to conditionally render the UI
  const showInstallMetaMask =
    status !== "pageNotLoaded" && !isMetaMaskInstalled;

  // we can use this to conditionally render the UI
  const showConnectButton =
    status !== "pageNotLoaded" && isMetaMaskInstalled && !wallet;

  // we can use this to conditionally render the UI
  const isConnected = status !== "pageNotLoaded" && typeof wallet === "string";

  // can be passed to an onclick handler
  const handleConnect = async () => {
    dispatch({ type: "loading" });
    const accounts = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];
    console.log(accounts);
    if (accounts.length > 0) {
      const balance = (await window.ethereum!.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })) as string;
      const chainId: string = (await window.ethereum?.request({
        method: "eth_chainId",
      })) as string;

      const address: string = accounts[0];

      const connectedState: WalletState = {
        accounts: accounts,
        balance: balance,
        chainId: chainId,
        address: address,
      };

      dispatch({
        type: "connect",
        wallet: accounts[0],
        balance,
        chainId,
        walletContainer: connectedState,
      });

      // we can register an event listener for changes to the users wallet
      listen();
    }
  };

  // can be passed to an onclick handler
  const handleDisconnect = () => {
    dispatch({ type: "disconnect" });
  };

  const networkId = import.meta.env.VITE_PUBLIC_NETWORK_ID;
  const walletChainSupported = isSupportedNetwork(chainId);

if (isMetaMaskInstalled) {
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(
      window.ethereum as unknown as ethers.providers.ExternalProvider
    );

    const contractInstance = new ethers.Contract(
      config["0x539"].contractAddress,
      KaziKrypto.abi,
      provider
    );

    async function callViewFunction() {
      try {
        const result = await contractInstance.getClientJob();
        console.log("View function result:", result);
      } catch (error) {
        console.error("Error calling view function:", error);
      }
    }

    callViewFunction();
  }, []); // Empty dependency array means this effect runs once after initial render
}

  // Call the function whenever needed


  const getAccounts = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    return accounts;
  };
  // now chainInfo is strongly typed or fallback to linea if not a valid chain
  const chainInfo = isSupportedNetwork(networkId)
    ? config[networkId]
    : config["0x539"];

  console.log("this looks for in app", !isMetaMaskInstalled);

  return (
    <Layout title="" caption={<>Kazi Krypto</>}>
      <p>
        {showConnectButton && (
          <button onClick={handleConnect}>Connect to MetaMask</button>
        )}

        {isConnected && (
          <div>
            {isConnected ? "MOBILE" : "EXTENSION"} | <div>{balance} ETH</div> |
            {walletContainer.accounts.length > 0 &&
              !isSupportedNetwork(chainId) && <SwitchNetwork />}
            {walletChainSupported && (
              <>
                <a
                  href={`${chainInfo?.blockExplorer}/address/${chainInfo?.contractAddress}`}
                  target="_blank"
                  title="Open in Block Explorer"
                >
                  {chainInfo.name}:{formatChainAsNum(walletContainer.chainId)}
                </a>
                &nbsp;|&nbsp;
                <a
                  href={`https://etherscan.io/address/${wallet}`}
                  target="_blank"
                  title="Open in Block Explorer"
                >
                  {formatAddress(walletContainer.address)}
                </a>
                <>
                  <button onClick={handleDisconnect}> Disconnect</button>
                </>
              </>
            )}
          </div>
        )}
      </p>
      {/* <AddFreelancerComponent /> */}
      {/* <GetFreelancerComponent freelancerAddress={freelancerAddress} /> */}
      {/* <AddPortfolioComponent /> */}
      {/* <GetPortfolioComponent
        freelancerAddress={freelancerAddress}
        index={portfolioIndex}
      /> */}
      {/* <PostClientJobComponent /> */}
      <ViewClientJobsComponent />
    </Layout>
  );
}
