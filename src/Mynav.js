import React from 'react'
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import faucetContract from "./ethereum/faucet";



function Mynav() {

    const [walletAddress, setWalletAddress] = useState("");
    const [, setSigner] = useState();
    const [, setFcContract] = useState();
    
    useEffect(() => {
      getCurrentWalletConnected();
      addWalletListener();
    }, [walletAddress]);
    
    const connectWallet = async () => {
      if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
        try {
          /* get provider */
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          /* get accounts */
          const accounts = await provider.send("eth_requestAccounts", []);
          /* get signer */
          setSigner(provider.getSigner());
          /* local contract instance */
          setFcContract(faucetContract(provider));
          /* set active wallet address */
          setWalletAddress(accounts[0]);
        } catch (err) {
          console.error(err.message);
        }
      } else {
        /* MetaMask is not installed */
        console.log("Please install MetaMask");
      }
    };
    
    const getCurrentWalletConnected = async () => {
      if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
        try {
          /* get provider */
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          /* get accounts */
          const accounts = await provider.send("eth_accounts", []);
          if (accounts.length > 0) {
            /* get signer */
            setSigner(provider.getSigner());
            /* local contract instance */
            setFcContract(faucetContract(provider));
            /* set active wallet address */
            setWalletAddress(accounts[0]);
          } else {
            console.log("Connect to MetaMask using the Connect Wallet button");
          }
        } catch (err) {
          console.error(err.message);
        }
      } else {
        /* MetaMask is not installed */
        console.log("Please install MetaMask");
      }
    };
    
    const addWalletListener = async () => {
      if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
        window.ethereum.on("accountsChanged", (accounts) => {
          setWalletAddress(accounts[0]);
        });
      } else {
        /* MetaMask is not installed */
        setWalletAddress("");
        console.log("Please install MetaMask");
      }
    };

    return (
        <nav className='mynavbar bg_darkblue navshadow'>
            <div className='brand-title'><h1 className="fw-400">Levy Test Token (LTT)</h1></div>
            <div className='navbar-button'>
            <button
                className="button is-link is-normal mt-2 mb-2"
                onClick={connectWallet}
              >
                <span className="is-link">
                  {walletAddress && walletAddress.length > 0
                    ? `Connected: ${walletAddress.substring(
                      0,
                      6
                    )}...${walletAddress.substring(38)}`
                    : "Connect Wallet"}
                </span>
              </button>
            </div>
        </nav>
    )
}

export default Mynav