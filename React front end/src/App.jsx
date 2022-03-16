import React, { useEffect, useState } from 'react';
import './styles/App.css';
import { ethers } from "ethers";
import twitterLogo from './assets/twitter-logo.svg';
import myEpicNft from './utils/MyEpicNFT.json'
import ReactLoading from 'react-loading';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;


const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");
  
  const checkIfWalletIsConnected = async () => {

    const { ethereum } = window;

    if(!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({method: 'eth_accounts'});

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      let chainId = await ethereum.request({ method: 'eth_chainId'});
        console.log("Connected to chain " + chainId);
        const rinkebyChainId = "0x4";
        if (chainId !== rinkebyChainId){
          alert("You are not connected to the Rinkeby Test Network!");
        }
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  }

    const connectWallet = async () => {
      try {
        const { ethereum } = window;

        if(!ethereum){
          alert("Get MetaMask!");
          return;
        } 

        const accounts = await ethereum.request({method: "eth_requestAccounts"});

        let chainId = await ethereum.request({ method: 'eth_chainId'});
        console.log("Connected to chain " + chainId);
        const rinkebyChainId = "0x4";
        if (chainId !== rinkebyChainId){
          alert("You are not connected to the Rinkeby Test Network!");
        } else {
        console.log("Connected", accounts[0]);
        setCurrentAccount(accounts[0]);
        }
      } catch (error) {
        console.log(error);
      }
    }

    const askContractToMintNft = async () => {
      const CONTRACT_ADDRESS = "0x569ceF2f5e65944818cB164BC5c1082373a29C69";

      try {
        const {ethereum} = window;

        if(ethereum){
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

          connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
            console.log(from, tokenId.toNumber());
            alert(`Hey there! We've minted your NFT. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: <https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}>`);
          })
          console.log("Going to pop wallet now to pay gas...")
          let nftTxn = await connectedContract.makeAnEpicNFT();
          //minting = true;
          console.log("Mining...please wait");
          await nftTxn.wait();
          //minting = false;

          console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);


        } else {
          conosle.log("Ethereum object doesn't exist!");
        }
      }catch (error) {
        console.log(error);
        }
      }

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderMintingContainer = () => {
    <div>
    <span class="sub-text">Let's build together!</span>
    <ReactLoading type="cubes" color="white" height={'20%'} width={'20%'} />
    </div>
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Alec's NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          { currentAccount === "" && (
            renderNotConnectedContainer()
          )}
          
          { currentAccount !== "" && (
            <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">Mint NFT </button>
          )}
        </div>
        <div className="footer-container">
          <span class="footer-text">Let's build together!</span>
        </div>
      </div>
    </div>
  );
};

export default App;