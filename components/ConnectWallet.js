import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

export default function ConnectWallet() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Named handlers so we can remove them later
  const handleAccountsChanged = useCallback((accounts) => {
    // accounts is an array of address strings
    if (!accounts || accounts.length === 0) {
      setAccount(null);
      setError("Wallet disconnected");
    } else {
      setAccount(accounts[0]);
      setError(null);
    }
  }, []);

  const handleChainChanged = useCallback((rawChainId) => {
    // rawChainId may be hex (e.g. "0x1") or decimal string
    try {
      const decimal =
        typeof rawChainId === "string" && rawChainId.startsWith("0x")
          ? parseInt(rawChainId, 16)
          : parseInt(rawChainId, 10);
      if (!Number.isNaN(decimal)) {
        setChainId(decimal.toString());
      } else {
        setChainId(String(rawChainId));
      }
    } catch {
      setChainId(String(rawChainId));
    }
    // Do not force a full reload. Let the app react to chainId changes.
  }, []);

  // Check if wallet is already connected
  const checkIfWalletIsConnected = useCallback(async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts(); // returns array of JsonRpcSigner objects
      if (accounts && accounts.length > 0) {
        // Extract address from the signer object
        const address = await accounts[0].getAddress();
        setAccount(address);
        const network = await provider.getNetwork();
        setChainId(network.chainId?.toString?.() ?? String(network.chainId));
        // optional: persist a flag so you can auto-open UI on reload
        try {
          localStorage.setItem("walletConnected", "1");
        } catch {}
      } else {
        // nothing connected
        setAccount(null);
        setChainId(null);
      }
    } catch (err) {
      console.error("Error checking wallet connection:", err);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const eth = window.ethereum;
    if (!eth) return;

    setIsMetaMaskInstalled(true);

    // Attach event listeners
    eth.on && eth.on("accountsChanged", handleAccountsChanged);
    eth.on && eth.on("chainChanged", handleChainChanged);

    // Read initial connection state
    checkIfWalletIsConnected();

    // Cleanup on unmount
    return () => {
      if (eth && eth.removeListener) {
        try {
          eth.removeListener("accountsChanged", handleAccountsChanged);
          eth.removeListener("chainChanged", handleChainChanged);
        } catch (e) {
          // ignore errors during cleanup
        }
      }
    };
  }, [handleAccountsChanged, handleChainChanged, checkIfWalletIsConnected]);

  // Connect wallet function
  const connectWallet = async () => {
    if (!isMetaMaskInstalled) {
      setError("MetaMask is not installed");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const network = await provider.getNetwork();

      setAccount(address);
      setChainId(network.chainId.toString());

      try {
        localStorage.setItem("walletConnected", "1");
      } catch {}
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError(err?.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet: revoke permissions if supported and clear local state.
  const disconnectWallet = async () => {
    const eth = window.ethereum;

    // Attempt to revoke permissions. Not all wallets support this.
    if (eth && eth.request) {
      try {
        await eth.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }],
        });
      } catch (err) {
        // If revoke not supported, ignore and continue clearing local state.
        console.warn("wallet_revokePermissions failed or not supported", err);
      }
    }

    // Clear UI state and any persisted flags
    setAccount(null);
    setChainId(null);
    setError(null);
    try {
      localStorage.removeItem("walletConnected");
    } catch (e) {}
  };

  // Format address for display (show first 6 and last 4 characters)
  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Get network name from chainId
  const getNetworkName = (id) => {
    if (!id) return "Unknown Network";
    // Convert to number for lookup
    const numId = typeof id === "string" ? parseInt(id, 10) : id;
    const networks = {
      1: "Ethereum Mainnet",
      5: "Goerli Testnet",
      11155111: "Sepolia Testnet",
      137: "Polygon Mainnet",
      80001: "Mumbai Testnet",
    };
    return networks[numId] || `Chain ID: ${id}`;
  };

  // UI when MetaMask not installed
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
              onClick={disconnectWallet}
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
