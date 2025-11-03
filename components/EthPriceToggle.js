import { useState } from "react";
import axios from "axios";

export default function EthPriceToggle() {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);

  // Fetch ETH price from CoinGecko API
  const fetchEthPrice = async () => {
    setLoading(true);
    setError(null);
    setShowToast(false);

    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );

      if (
        response.data &&
        response.data.ethereum &&
        response.data.ethereum.usd
      ) {
        const ethPrice = response.data.ethereum.usd;
        setPrice(ethPrice);
        setShowToast(true);

        // Auto-hide toast after 5 seconds
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      } else {
        throw new Error("Invalid response format from CoinGecko API");
      }
    } catch (err) {
      console.error("Error fetching ETH price:", err);
      setError(
        err.response?.data?.error || err.message || "Failed to fetch ETH price"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Ethereum Price</h5>
        <p className="card-text text-muted">
          Get the current ETH price in USD from CoinGecko
        </p>

        <button
          className="btn btn-info text-white"
          onClick={fetchEthPrice}
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Fetching...
            </>
          ) : (
            "Today's ETH Price"
          )}
        </button>

        {/* Display price in an alert when available */}
        {showToast && price && (
          <div
            className="alert alert-success mt-3 mb-0 d-flex align-items-center"
            role="alert"
          >
            <div className="flex-grow-1">
              <strong>Current ETH Price:</strong>
              <div className="price-display mt-2">
                $
                {price.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowToast(false)}
              aria-label="Close"
            ></button>
          </div>
        )}

        {/* Display error if fetch fails */}
        {error && (
          <div className="alert alert-danger mt-3 mb-0" role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Show last fetched price even after toast is dismissed */}
        {!showToast && price && !error && (
          <div className="mt-3 text-muted">
            <small>
              Last fetched: $
              {price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              at {new Date().toLocaleTimeString()}
            </small>
          </div>
        )}
      </div>
    </div>
  );
}
