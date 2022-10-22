import { useState } from "react";
import { ethers } from "ethers";

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

    return (
        <div className="card">
            <div>
                <button onClick={() => getWallet()}> Connect</button>
                <button onClick={() => getWallet()}> Mint</button>
            </div>
            <div id="log"></div>
        </div>
    );
};

export default UserWallet;