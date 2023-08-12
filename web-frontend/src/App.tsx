import { ExplainerLayout } from './components/Layout'
import { useListen } from './hooks/useListen'
import { type MetaMaskInpageProvider } from '@metamask/providers'
import { MetaMaskProvider, useMetaMask } from './hooks/useMetaMask'
import { SdkLayout } from './components/SdkProvider'
import { SiEthereum } from 'react-icons/si'
import { formatAddress, formatChainAsNum } from './utils'
import { config, isSupportedNetwork } from './lib/config'
import SwitchNetwork from './SwitchNetwork/SwitchNetwork'
import './App.css'
import { useState, useEffect, createContext, PropsWithChildren, useContext, useCallback } from 'react'

export default function App() {
  return (
    <MetaMaskProvider>
      <SdkLayout>
        <Explainer />
      </SdkLayout>
    </MetaMaskProvider>
  )
}

function Explainer() {

  interface WalletState {
    accounts: any[],
    balance: string,
    chainId: string,
    address: string
  }

 

  const {
    dispatch,
    state: { status, isMetaMaskInstalled, wallet,balance,chainId,walletContainer },
  } = useMetaMask()
  const listen = useListen()

  console.log('hello')
  // we can use this to conditionally render the UI
  const showInstallMetaMask = status !== 'pageNotLoaded' && !isMetaMaskInstalled

  // we can use this to conditionally render the UI
  const showConnectButton =
    status !== 'pageNotLoaded' && isMetaMaskInstalled && !wallet

  // we can use this to conditionally render the UI
  const isConnected = status !== 'pageNotLoaded' && typeof wallet === 'string'

  // can be passed to an onclick handler
  const handleConnect = async () => {

    dispatch({ type: 'loading' })
    const accounts = (await window.ethereum.request({
      method: 'eth_requestAccounts',
    })) as string[]
    console.log(accounts);
    if (accounts.length > 0) {
      const balance = (await window.ethereum!.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      })) as string
      const chainId: string = await window.ethereum?.request({
        method: 'eth_chainId',
      }) as string

      const address: string = accounts[0]

      const connectedState: WalletState = { accounts: accounts, balance: balance, chainId: chainId, address: address }
 
      dispatch({ type: 'connect', wallet: accounts[0], balance, chainId,walletContainer:connectedState })

      // we can register an event listener for changes to the users wallet
      listen()
    }
  }

  
  

  // can be passed to an onclick handler
  const handleDisconnect = () => {
    dispatch({ type: 'disconnect' })
  }


  const networkId = import.meta.env.VITE_PUBLIC_NETWORK_ID
  const walletChainSupported = isSupportedNetwork(chainId)

  

  const getAccounts = async () => {

  const accounts = (await window.ethereum.request({
    method: 'eth_requestAccounts',
  }))

  return accounts;
  }
  // now chainInfo is strongly typed or fallback to linea if not a valid chain
  const chainInfo = isSupportedNetwork(networkId) ? config[networkId] : config['0xe704']

  return (
    <ExplainerLayout
      title=""
      caption={
        <>
        Kazi Krypto
        </>
      }
    >
      <p>
        
      {showConnectButton && (
        <button onClick={handleConnect}>Connect to MetaMask</button>
      )}

      {isConnected && (
        <div>
          <p>Connected Wallet: {wallet}</p>
          <p>Balance: {balance} ETH</p>
          <p>Chain ID: {chainId}</p>
          <button onClick={handleDisconnect}>Disconnect</button>
        </div>
      )}


{isConnected && (
  <div>
    {isConnected ? "MOBILE" : "EXTENSION"}
    {walletContainer.accounts.length > 0 && !isSupportedNetwork(walletContainer.chainId) && <SwitchNetwork />}
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
        <div>{walletContainer.balance} ETH</div>
      </>
    )}
  </div>
)}



      </p>

    </ExplainerLayout>
  )
}
