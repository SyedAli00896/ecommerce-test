# Setup Instructions

Follow these step-by-step instructions to get your crypto payment portal running.

## Prerequisites Check

Before you begin, make sure you have:

- [ ] **Node.js** installed (version 16.x or higher)
  - Check: `node --version`
  - Download: https://nodejs.org/

- [ ] **npm** package manager
  - Check: `npm --version`
  - Comes with Node.js

- [ ] **MetaMask** browser extension
  - Check: Look for MetaMask icon in browser toolbar
  - Install: https://metamask.io/

- [ ] **Ethereum wallet address** for receiving payments
  - Get from MetaMask or use an existing address

## Installation Steps

### Step 1: Navigate to Project Directory

```bash
cd /Users/syedali/Documents/Projects/CascadeProjects/windsurf-project
```

### Step 2: Install Dependencies

```bash
npm install
```

**Expected output:**
- Installation of ~200MB of packages
- No error messages
- "added XXX packages" message

**If you see errors:**
- Make sure Node.js version is 16.x or higher
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again

### Step 3: Create Environment File

```bash
cp .env.local.example .env.local
```

### Step 4: Configure Your Wallet Address

Open `.env.local` in a text editor and replace the placeholder:

**Before:**
```
RECIPIENT_WALLET=0xYourRecipientEthAddressHere
```

**After (example):**
```
RECIPIENT_WALLET=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
```

**Important:**
- Use a valid Ethereum address (42 characters starting with 0x)
- This is the address where payments will be sent
- Keep this file secure and never commit it to Git

### Step 5: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
event - compiled client and server successfully
```

### Step 6: Open in Browser

Navigate to: **http://localhost:3000**

You should see the "Crypto Payment Portal" page!

## Verification Steps

### Test 1: Page Loads
- [ ] Page displays without errors
- [ ] You see "Crypto Payment Portal" heading
- [ ] Three cards are visible (Wallet, Price, Recipient)

### Test 2: MetaMask Detection
- [ ] If MetaMask installed: "Connect Wallet" button shows
- [ ] If MetaMask not installed: Warning message with install link shows

### Test 3: Wallet Connection
- [ ] Click "Connect Wallet"
- [ ] MetaMask popup appears
- [ ] After approval, your address displays
- [ ] Green "Connected" badge appears

### Test 4: Account Switching
- [ ] Open MetaMask
- [ ] Switch to different account
- [ ] UI updates automatically with new address

### Test 5: ETH Price
- [ ] Click "Today's ETH Price"
- [ ] Loading spinner appears
- [ ] Price displays in green (e.g., "$2,345.67")
- [ ] Alert auto-dismisses after 5 seconds

### Test 6: Recipient Address
- [ ] Recipient address displays in monospace font
- [ ] "Copy" button is visible
- [ ] Click copy - button changes to "Copied!"
- [ ] Address is in clipboard

## Troubleshooting

### Problem: "RECIPIENT_WALLET not configured"

**Solution:**
1. Make sure `.env.local` file exists (not just `.env.local.example`)
2. Open `.env.local` and verify it contains: `RECIPIENT_WALLET=0x...`
3. Restart the dev server: Stop with Ctrl+C, then run `npm run dev` again

### Problem: "MetaMask Not Detected"

**Solution:**
1. Install MetaMask from https://metamask.io/
2. Refresh the browser page
3. Make sure MetaMask extension is enabled

### Problem: Port 3000 already in use

**Solution:**
1. Stop other applications using port 3000
2. Or change the port: `npm run dev -- -p 3001`

### Problem: npm install fails

**Solution:**
1. Check Node.js version: `node --version` (should be 16.x or higher)
2. Clear npm cache: `npm cache clean --force`
3. Delete `node_modules` and `package-lock.json`
4. Run `npm install` again

### Problem: Page is blank or shows errors

**Solution:**
1. Check browser console (F12) for errors
2. Make sure you're on `http://localhost:3000` (not https)
3. Clear browser cache and refresh
4. Restart the dev server

### Problem: Wallet won't connect

**Solution:**
1. Make sure MetaMask is unlocked
2. Check if you approved the connection request
3. Try disconnecting and reconnecting
4. Refresh the page and try again

## Next Steps

Once everything is working:

1. **Customize the recipient address** in `.env.local`
2. **Test on different networks** (Mainnet, Sepolia, etc.)
3. **Share the app** with others (they'll need MetaMask too)
4. **Build for production** when ready: `npm run build`

## Getting Help

If you're still having issues:

1. Check the main [README.md](README.md) for detailed documentation
2. Review the [QUICKSTART.md](QUICKSTART.md) guide
3. Check browser console for error messages
4. Verify all prerequisites are met

## Production Deployment

When you're ready to deploy:

```bash
# Build the production version
npm run build

# Start production server
npm start
```

For deployment to Vercel, Netlify, or other platforms, see their respective documentation.

## Security Reminders

- ✅ Never commit `.env.local` to Git
- ✅ Keep your wallet private keys secure
- ✅ Use test networks for testing
- ✅ Verify recipient address before accepting real payments
- ✅ Always test transactions with small amounts first

---

**Ready to accept crypto payments! 🎉**

For more information, see:
- [README.md](README.md) - Full documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Project overview
