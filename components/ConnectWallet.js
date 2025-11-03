import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function ConnectWallet() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window !== "undefined" && window.ethereum) {
      setIsMetaMaskInstalled(true);

      // Get current account if already connected
      checkIfWalletIsConnected();

      // Listen for account changes
      window.ethereum.on("accountsChanged", handleAccountsChanged);

      // Listen for chain changes
      window.ethereum.on("chainChanged", handleChainChanged);

      // Cleanup listeners on unmount
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
          window.ethereum.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, []);

  // Check if wallet is already connected
  const checkIfWalletIsConnected = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();

      if (accounts.length > 0) {
        setAccount(accounts[0].address);
        const network = await provider.getNetwork();
        setChainId(network.chainId.toString());
      }
    } catch (err) {
      console.error("Error checking wallet connection:", err);
    }
  };

  // Handle account changes
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      setAccount(null);
      setError("Wallet disconnected");
    } else {
      // User switched accounts
      setAccount(accounts[0]);
      setError(null);
    }
  };

  // Handle chain changes
  const handleChainChanged = (chainId) => {
    // Convert hex chainId to decimal
    const decimalChainId = parseInt(chainId, 16).toString();
    setChainId(decimalChainId);
    // Reload the page as recommended by MetaMask
    window.location.reload();
  };

  // Connect wallet function
  const connectWallet = async () => {
    if (!isMetaMaskInstalled) {
      setError("MetaMask is not installed");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      // Get the signer and account
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Get network info
      const network = await provider.getNetwork();

      setAccount(address);
      setChainId(network.chainId.toString());
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  // Format address for display (show first 6 and last 4 characters)
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Get network name from chainId
  const getNetworkName = (chainId) => {
    const networks = {
      1: "Ethereum Mainnet",
      5: "Goerli Testnet",
      11155111: "Sepolia Testnet",
      137: "Polygon Mainnet",
      80001: "Mumbai Testnet",
    };
    return networks[chainId] || `Chain ID: ${chainId}`;
  };

  // If MetaMask is not installed
  if (!isMetaMaskInstalled) {
    return (
      <div className="card border-warning mb-4">
        <div className="card-body">
          <h5 className="card-title">
            <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
            MetaMask Not Detected
          </h5>
          <p className="card-text">
            MetaMask is required to connect your wallet. Please install MetaMask
            to continue.
          </p>
          <a
            href="https://metamask.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-warning"
          >
            Install MetaMask
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Wallet Connection</h5>

        {!account ? (
          <div>
            <p className="card-text text-muted">
              Connect your MetaMask wallet to get started
            </p>
            <button
              className="btn btn-primary"
              onClick={connectWallet}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Connecting...
                </>
              ) : (
                "Connect Wallet"
              )}
            </button>
          </div>
        ) : (
          <div>
            <div className="d-flex align-items-center mb-3">
              <span className="badge bg-success me-2">Connected</span>
              <small className="text-muted">{getNetworkName(chainId)}</small>
            </div>

            <div className="mb-2">
              <strong>Address:</strong>
              <div className="wallet-address mt-1" title={account}>
                <span className="d-none d-md-inline">{account}</span>
                <span className="d-md-none">{formatAddress(account)}</span>
              </div>
            </div>

            <button
              className="btn btn-sm btn-outline-secondary mt-2"
              onClick={async () => {
                await window.ethereum.request({
                  method: "wallet_requestPermissions",
                  params: [{ eth_accounts: {} }],
                });
                setAccount(null);
                setChainId(null);
              }}
            >
              Disconnect
            </button>
          </div>
        )}

        {error && (
          <div className="alert alert-danger mt-3 mb-0" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
