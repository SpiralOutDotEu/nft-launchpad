import { useState } from "react";
import { ethers } from "ethers";
import contract from '../contracts/NFTCollection.json'

const contractAddress = "0x12C5ef89Fb24a569A37D703790c804774697fD7a";
const abi = contract.abi;
const price = "0.00001"

function UserWallet() {
    const [address, setAddress] = useState();
    const getWallet = async () => {
        
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // use specific network
        const chainId = '0x13881' // Polygon Mumbai in hex format

        if (window.ethereum.networkVersion !== chainId) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: chainId }]
                });
            } catch (err) {
                // This error code indicates that the chain has not been added to MetaMask
                if (err.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainName: 'Mumbai',
                                chainId: chainId,
                                nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
                                rpcUrls: ['https://rpc-mumbai.maticvigil.com/']
                            }
                        ]
                    });
                }
            }
        }
        //
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAddress(address);
        // TODO: awfull implementation
        var logdiv = document.getElementById('log');
        logdiv.innerHTML += "</br>" + "connected with address: " + address
    };

    async function mintNFT() {
        var logdiv = document.getElementById('log');
        try {
          const { ethereum } = window;
    
          if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const nftContract = new ethers.Contract(contractAddress, abi, signer);
            
            logdiv.innerHTML += "</br>" + "Initialize payment" 
            let nftTxn = await nftContract.mintNFTs(1, { value: ethers.utils.parseEther(price) });
            
            logdiv.innerHTML += "</br>" + "Mining... please wait"
            await nftTxn.wait();
    
            logdiv.innerHTML += "</br>" + "Mined, see transaction: https://mumbai.polygonscan.com/tx/" + nftTxn.hash 
            logdiv.innerHTML += "</br>" + "Go and trade your NFT in  OpenSea. Check the collection in <a href=\"https://testnets.opensea.io/collection/fishes-ac2cay6lcp\">" + "OpenSea </a>"
            // console.log(`Mined, see transaction: https://mumbai.polygonscan.com/tx/${nftTxn.hash}`); // https://testnets.opensea.io/collection/fishes-ac2cay6lcp
    
          } else {
            console.log("Ethereum object does not exist");
          }
    
        } catch (err) {
          console.log(err);
        }
      }

    return (
        <div className="card">
            <div>
                <button onClick={() => getWallet()}> Connect</button>
                <button onClick={() => mintNFT()}> Mint</button>
            </div>
            <div id="log"></div>
        </div>
    );
};

export default UserWallet;