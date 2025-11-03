# Quick Start Guide

Get your crypto payment app running in 3 simple steps!

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, React, ethers.js, and Bootstrap.

## Step 2: Configure Environment

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Ethereum wallet address:

```
RECIPIENT_WALLET=0xYourActualEthereumAddressHere
```

**Example with a real address:**
```
RECIPIENT_WALLET=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

## Step 3: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Verify It's Working

1. ✅ You should see the "Crypto Payment Portal" page
2. ✅ Click "Connect Wallet" - MetaMask should prompt you
3. ✅ Click "Today's ETH Price" - Price should display
4. ✅ Recipient address should be visible at the bottom

## Need Help?

- **MetaMask not installed?** Visit [https://metamask.io/](https://metamask.io/)
- **Port 3000 in use?** Stop other services or change the port
- **Environment variable error?** Make sure `.env.local` exists with valid address
- **More details?** Check the main [README.md](README.md)

## Common Issues

### "RECIPIENT_WALLET not configured"
- Make sure you created `.env.local` (not just `.env.local.example`)
- Restart the dev server after creating `.env.local`

### "MetaMask Not Detected"
- Install MetaMask browser extension
- Refresh the page after installation

### Page won't load
- Make sure you're on `http://localhost:3000` (not https)
- Check if another app is using port 3000
- Try `npm run dev` again

---

**That's it! You're ready to accept crypto payments! 🚀**
