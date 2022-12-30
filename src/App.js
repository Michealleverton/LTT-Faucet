import { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import faucetContract from "./ethereum/faucet";
import Mynav from './Mynav'
// import Drip from './Drip'

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState();
  const [fcContract, setFcContract] = useState();
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [transactionData, setTransactionData] = useState("");

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

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

  const getLTTHandler = async () => {
    setWithdrawError("");
    setWithdrawSuccess("");
    try {
      const fcContractWithSigner = fcContract.connect(signer);
      const resp = await fcContractWithSigner.requestTokens();
      setWithdrawSuccess("Token Request Complete - enjoy your tokens!");
      setTransactionData(resp.hash);
    } catch (err) {
      setWithdrawError("Operation Failed - You have to wait 24 hours since your last request");
    }
  };

  return (
    <div className="background">
      <Mynav />

      <section className="hero is-fullheight">
        <div className="faucet-hero-body">
          {/* <div className="realfaucet"></div> */}
          <div className="container has-text-centered main-content">

            <h1 className="title is-1">LTT Faucet</h1>
            <p>Limit Of 2000 LTT Every 24Hr</p>
            <div className="mt-5">
              {withdrawError && (
                <div className="withdraw-error">{withdrawError}</div>
              )}
              {withdrawSuccess && (
                <div className="withdraw-success">{withdrawSuccess}</div>
              )}{" "}
            </div>
            <div className="address-box">
              <div className="columns">
                <div className="column is-four-fifths">
                  <input
                    className="input is-normal textblue"
                    type="text"
                    placeholder="Enter your wallet address (0x...)"
                    defaultValue={walletAddress}
                  />
                </div>
                <div className="column">
                  <button
                    className="button is-link is-normal"
                    onClick={getLTTHandler}
                    disabled={walletAddress ? false : true}
                  >
                    REQUEST TOKENS
                  </button>
                </div>
              </div>
              <article className="panel is-grey-darker">
                <p className="panel-heading fw-600">Transaction Data</p>
                <div className="panel-block textblue">
                  <p>
                    {transactionData
                      ? `Transaction hash: ${transactionData}`
                      : "... Awaiting Request For LTT"}
                  </p>
                </div>
              </article>
            </div>
          </div>
          {/* <Drip /> */}
        </div>
      </section>
    </div>
  );
}

export default App;
