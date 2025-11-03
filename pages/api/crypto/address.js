/**
 * API Route: GET /api/crypto/address
 * Returns the recipient wallet address from environment variables
 * This ensures the wallet address is only exposed through the API and not in client code
 */

export default function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Read the recipient wallet address from environment variables
  const recipientWallet = process.env.RECIPIENT_WALLET;

  // Validate that the environment variable is set
  if (!recipientWallet) {
    return res.status(500).json({ 
      error: 'RECIPIENT_WALLET not configured',
      message: 'Please set RECIPIENT_WALLET in your .env.local file'
    });
  }

  // Basic validation: Check if it looks like an Ethereum address
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!ethAddressRegex.test(recipientWallet)) {
    return res.status(500).json({ 
      error: 'Invalid RECIPIENT_WALLET format',
      message: 'RECIPIENT_WALLET must be a valid Ethereum address (0x followed by 40 hex characters)'
    });
  }

  // Return the wallet address
  return res.status(200).json({ 
    address: recipientWallet 
  });
}
