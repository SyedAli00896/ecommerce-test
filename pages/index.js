import { useState, useEffect } from 'react';
import Head from 'next/head';
import ConnectWallet from '../components/ConnectWallet';
import EthPriceToggle from '../components/EthPriceToggle';

export default function Home() {
  const [recipientAddress, setRecipientAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Fetch recipient address from API on component mount
  useEffect(() => {
    fetchRecipientAddress();
  }, []);

  const fetchRecipientAddress = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/crypto/address');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch recipient address');
      }

      setRecipientAddress(data.address);
    } catch (err) {
      console.error('Error fetching recipient address:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Copy address to clipboard
  const copyToClipboard = async () => {
    if (!recipientAddress) return;

    try {
      await navigator.clipboard.writeText(recipientAddress);
      setCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  return (
    <div>
      <Head>
        <title>Crypto Payment - MetaMask Integration</title>
        <meta name="description" content="Send crypto payments via MetaMask" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css" />
      </Head>

      <main>
        <div className="container py-5">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="display-4 mb-3">
              <i className="bi bi-wallet2 me-3"></i>
              Crypto Payment Portal
            </h1>
            <p className="lead text-muted">
              Connect your MetaMask wallet and send ETH payments
            </p>
          </div>

          <div className="row">
            <div className="col-lg-8 mx-auto">
              {/* Connect Wallet Component */}
              <ConnectWallet />

              {/* ETH Price Toggle Component */}
              <EthPriceToggle />

              {/* Recipient Address Section */}
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Payment Recipient</h5>
                  
                  {loading ? (
                    <div className="text-center py-3">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="text-muted mt-2">Loading recipient address...</p>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger" role="alert">
                      <strong>Error:</strong> {error}
                      <br />
                      <small className="text-muted">
                        Make sure you have created a .env.local file with RECIPIENT_WALLET set.
                      </small>
                    </div>
                  ) : (
                    <div>
                      <p className="card-text mb-3">
                        Send ETH to this address:
                      </p>
                      
                      <div className="d-flex align-items-start">
                        <code className="wallet-address flex-grow-1 me-2">
                          {recipientAddress}
                        </code>
                        <button 
                          className="btn btn-sm btn-outline-primary copy-button"
                          onClick={copyToClipboard}
                          title="Copy to clipboard"
                        >
                          {copied ? (
                            <>
                              <i className="bi bi-check-lg me-1"></i>
                              Copied!
                            </>
                          ) : (
                            <>
                              <i className="bi bi-clipboard me-1"></i>
                              Copy
                            </>
                          )}
                        </button>
                      </div>

                      <div className="alert alert-info mt-3 mb-0" role="alert">
                        <i className="bi bi-info-circle me-2"></i>
                        <strong>Note:</strong> Make sure you're connected to the correct network before sending any transactions.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions Card */}
              <div className="card bg-light">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-lightbulb me-2"></i>
                    How to Use
                  </h5>
                  <ol className="mb-0">
                    <li className="mb-2">
                      <strong>Connect Wallet:</strong> Click the "Connect Wallet" button and approve the connection in MetaMask.
                    </li>
                    <li className="mb-2">
                      <strong>Check ETH Price:</strong> Click "Today's ETH Price" to see the current Ethereum price in USD.
                    </li>
                    <li className="mb-2">
                      <strong>Send Payment:</strong> Copy the recipient address and use MetaMask to send ETH to that address.
                    </li>
                    <li>
                      <strong>Network:</strong> Ensure you're on the correct Ethereum network (Mainnet, Testnet, etc.).
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-dark text-white text-center py-4 mt-5">
        <div className="container">
          <p className="mb-0">
            <i className="bi bi-shield-check me-2"></i>
            Powered by MetaMask & ethers.js
          </p>
        </div>
      </footer>
    </div>
  );
}
