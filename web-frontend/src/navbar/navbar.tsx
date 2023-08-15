import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppShell,
  Anchor,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Title,
  NavLink,
  Burger,
  useMantineTheme,
  Button,
  Paper,
} from "@mantine/core";
import { useMetaMask } from "../hooks/useMetaMask"; // Replace with the actual path to your MetaMask hook
import { formatAddress, formatChainAsNum } from "../utils"; // Replace with the actual paths to your formatting functions
import SwitchNetwork from "../SwitchNetwork/SwitchNetwork"; // Replace with the actual path to the SwitchNetwork component
import { config, isSupportedNetwork } from "../lib/config"; // Replace with the actual paths to your config and network utility files
import "./navbar.css";
import { useListen } from "../hooks/useListen";
import PostClientJobComponent from "../components/forms/AddClientJob";
import { formatBalance } from "~/utils";

const CustomNavbar: React.FC = () => {
  const navigate = useNavigate();
  interface WalletState {
    accounts: any[];
    balance: string;
    chainId: string;
    address: string;
  }
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

  const [isOpen, setIsOpen] = useState(false);
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const handleToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const listen = useListen();

  const showConnectButton = status !== "pageNotLoaded" && !isMetaMaskInstalled;
  const isConnected = status !== "pageNotLoaded" && typeof wallet === "string";
  const walletChainSupported = isSupportedNetwork(chainId);

  const networkId = import.meta.env.VITE_PUBLIC_NETWORK_ID;

  const chainInfo = isSupportedNetwork(networkId)
    ? config[networkId]
    : config["0x539"];

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

  const formatedBalance = formatBalance(balance);

  return (
    <header>
      <Header height={{ base: 50, md: 70 }} p="md">
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="sm"
              color={theme.colors.gray[6]}
              mr="xl"
            />
          </MediaQuery>

          <Title order={4}>Kazi Krypto</Title>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "90%",
            }}
          >
            <Anchor
              onClick={() => {
                navigate("/");
              }}
              sx={{ padding: 10 }}
              target="_blank"
            >
              Home
            </Anchor>
            <Anchor
              onClick={() => {
                navigate("/jobs");
              }}
              sx={{ padding: 10 }}
              target="_blank"
            >
              Jobs
            </Anchor>
            <Anchor component="button" sx={{ padding: 10 }}>
              <PostClientJobComponent />
            </Anchor>

            <Anchor component="button" type="button">
              {!isConnected ? (
                <Button onClick={handleConnect} color="dark" radius="md">
                  Connect Wallet
                </Button>
              ) : (
                <Button
                  color="dark"
                  onClick={() => {
                    navigate("/profile");
                  }}
                  radius="md"
                >
                  Profile
                </Button>
              )}
              {/* {isConnected && (
                <div className="wallet-info ">
                  {isConnected ? "MOBILE" : "EXTENSION"} |{" "}
                  <Anchor>{formatedBalance} ETH</Anchor> |
                  {walletContainer.accounts.length > 0 &&
                    !isSupportedNetwork(chainId) && <SwitchNetwork />}
                  {walletChainSupported && (
                    <>
                      <Anchor
                        href={`${chainInfo?.blockExplorer}/address/${chainInfo?.contractAddress}`}
                        target="_blank"
                        title="Open in Block Explorer"
                      >
                        {chainInfo.name}:
                        {formatChainAsNum(walletContainer.chainId)}
                      </Anchor>
                      &nbsp;|&nbsp;
                      <Anchor
                        href={`https://etherscan.io/address/${wallet}`}
                        target="_blank"
                        title="Open in Block Explorer"
                      >
                        {formatAddress(walletContainer.address)}
                      </Anchor>
                      <>
                        <button onClick={handleDisconnect}> Disconnect</button>
                      </>
                    </>
                  )}
                </div>
                  )}*/}
            </Anchor>
          </div>
        </div>
      </Header>
      {/* <div className="navbar">
        <div className="logo">
          <Link to="/">Kazi Krypto</Link>
        </div>
        <ul className="links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/portfolio">Portfolio</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
        <p className="action_btn">
          {showConnectButton && (
            <button onClick={handleConnect} className="connect-button">
              Connect to MetaMask
            </button>
          )}

          {isConnected && (
            <div className="wallet-info ">
              {isConnected ? "MOBILE" : "EXTENSION"} |{" "}
              <div>{formatedBalance} ETH</div> |
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
        <div className="toggle_btn" onClick={handleToggleClick}>
          <i
            className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}`}
            aria-hidden="true"
          ></i>
        </div>
      </div>
      <div className={`dropdown_menu ${isOpen ? "open" : ""}`}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/portfolio">Portfolio</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <p className="action_btn">
            {showConnectButton && (
              <button onClick={handleConnect} className="connect-button">
                Connect to MetaMask
              </button>
            )}

            {isConnected && (
              <div className="wallet-info ">
                {isConnected ? "MOBILE" : "EXTENSION"} |{" "}
                <div>{formatedBalance} ETH</div> |
                {walletContainer.accounts.length > 0 &&
                  !isSupportedNetwork(chainId) && <SwitchNetwork />}
                {walletChainSupported && (
                  <>
                    <a
                      href={`${chainInfo?.blockExplorer}/address/${chainInfo?.contractAddress}`}
                      target="_blank"
                      title="Open in Block Explorer"
                    >
                      {chainInfo.name}:
                      {formatChainAsNum(walletContainer.chainId)}
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
        </li>
      </div> */}
    </header>
  );
};

export default CustomNavbar;
