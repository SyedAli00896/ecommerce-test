# Project Structure

## Complete File Tree

```
crypto-payments/
│
├── 📄 Configuration Files
│   ├── package.json                 # Dependencies and scripts
│   ├── next.config.js              # Next.js configuration
│   ├── .env.local.example          # Environment variables template
│   └── .gitignore                  # Git ignore rules
│
├── 📁 components/                   # React Components
│   ├── ConnectWallet.js            # MetaMask wallet connection
│   └── EthPriceToggle.js           # ETH price fetcher
│
├── 📁 lib/                          # Utility Libraries
│   └── ethers.js                   # ethers.js helper functions
│
├── 📁 pages/                        # Next.js Pages & API Routes
│   ├── _app.js                     # App wrapper (Bootstrap import)
│   ├── index.js                    # Main landing page
│   └── api/                        # API Routes
│       └── crypto/
│           └── address.js          # GET /api/crypto/address
│
├── 📁 public/                       # Static Assets
│   └── favicon.ico                 # Site favicon
│
├── 📁 styles/                       # CSS Styles
│   └── globals.css                 # Global styles
│
└── 📚 Documentation
    ├── README.md                   # Main documentation
    ├── GET_STARTED.md              # Quick 3-step guide
    ├── QUICKSTART.md               # Quick start instructions
    ├── SETUP_INSTRUCTIONS.md       # Detailed setup guide
    ├── ARCHITECTURE.md             # System architecture
    ├── PROJECT_SUMMARY.md          # Project overview
    ├── CHECKLIST.md                # Completion checklist
    └── PROJECT_STRUCTURE.md        # This file
```

## File Descriptions

### Configuration Files

#### `package.json`
- **Purpose:** Defines project dependencies and npm scripts
- **Key Dependencies:**
  - `next`: ^14.0.4
  - `react`: ^18.2.0
  - `ethers`: ^6.9.0
  - `bootstrap`: ^5.3.2
  - `axios`: ^1.6.2
- **Scripts:**
  - `npm run dev` - Start development server
  - `npm run build` - Build for production
  - `npm start` - Start production server

#### `next.config.js`
- **Purpose:** Next.js framework configuration
- **Content:** Default configuration with React strict mode

#### `.env.local.example`
- **Purpose:** Template for environment variables
- **Variables:**
  - `RECIPIENT_WALLET` - Ethereum address for receiving payments

#### `.gitignore`
- **Purpose:** Specifies files to exclude from Git
- **Key Exclusions:**
  - `node_modules/`
  - `.env*.local`
  - `.next/`
  - Build artifacts

---

### Components

#### `components/ConnectWallet.js`
- **Purpose:** MetaMask wallet connection component
- **Features:**
  - Detects MetaMask installation
  - Connects to user's wallet
  - Displays connected address
  - Listens for account changes
  - Listens for network changes
  - Shows install prompt if needed
- **State:**
  - `account` - Connected wallet address
  - `chainId` - Current network
  - `isMetaMaskInstalled` - Detection flag
  - `isConnecting` - Loading state
  - `error` - Error messages
- **Lines of Code:** ~200

#### `components/EthPriceToggle.js`
- **Purpose:** Fetch and display ETH price
- **Features:**
  - Calls CoinGecko API
  - Displays price in Bootstrap alert
  - Loading states
  - Error handling
  - Auto-dismiss notification
- **State:**
  - `price` - Current ETH price
  - `loading` - Fetch state
  - `error` - Error messages
  - `showToast` - Alert visibility
- **Lines of Code:** ~90

---

### Library

#### `lib/ethers.js`
- **Purpose:** Shared ethers.js utility functions
- **Functions:**
  - `isMetaMaskInstalled()` - Check MetaMask
  - `getProvider()` - Get ethers provider
  - `formatAddress()` - Format address for display
  - `isValidEthereumAddress()` - Validate address
  - `getNetworkName()` - Get network name from chain ID
  - `weiToEther()` - Convert Wei to Ether
  - `etherToWei()` - Convert Ether to Wei
- **Lines of Code:** ~80

---

### Pages

#### `pages/_app.js`
- **Purpose:** Next.js app wrapper
- **Features:**
  - Imports Bootstrap CSS
  - Imports global CSS
  - Wraps all pages
- **Lines of Code:** ~8

#### `pages/index.js`
- **Purpose:** Main landing page
- **Features:**
  - Renders ConnectWallet component
  - Renders EthPriceToggle component
  - Fetches recipient address from API
  - Copy to clipboard functionality
  - Instructions section
  - Responsive layout
- **State:**
  - `recipientAddress` - Recipient wallet
  - `loading` - API loading state
  - `error` - Error messages
  - `copied` - Copy confirmation
- **Lines of Code:** ~170

#### `pages/api/crypto/address.js`
- **Purpose:** API endpoint for recipient address
- **Method:** GET
- **Features:**
  - Reads `RECIPIENT_WALLET` from environment
  - Validates environment variable exists
  - Validates Ethereum address format
  - Returns JSON response
- **Responses:**
  - 200: `{ address: "0x..." }`
  - 500: `{ error: "...", message: "..." }`
- **Lines of Code:** ~35

---

### Styles

#### `styles/globals.css`
- **Purpose:** Global CSS styles
- **Features:**
  - Reset styles
  - Custom wallet address styling
  - Copy button styles
  - Price display formatting
- **Lines of Code:** ~30

---

### Documentation

#### `README.md` (9.3 KB)
- Complete project documentation
- Installation instructions
- Configuration guide
- Testing checklist
- Troubleshooting
- API documentation

#### `GET_STARTED.md` (1.7 KB)
- Quick 3-step guide
- Minimal instructions
- Perfect for first-time users

#### `QUICKSTART.md` (1.8 KB)
- Fast setup guide
- Common issues
- Verification steps

#### `SETUP_INSTRUCTIONS.md` (5.5 KB)
- Detailed step-by-step setup
- Prerequisites check
- Verification steps
- Troubleshooting

#### `ARCHITECTURE.md` (13.1 KB)
- System architecture
- Component diagrams
- Data flow
- Technology stack
- Security architecture

#### `PROJECT_SUMMARY.md` (7.4 KB)
- Project overview
- Requirements checklist
- File structure
- Key technologies
- Success criteria

#### `CHECKLIST.md` (6.2 KB)
- Complete requirements checklist
- File inventory
- Verification commands
- Success criteria

#### `PROJECT_STRUCTURE.md` (This file)
- File tree
- File descriptions
- Line counts
- Purpose of each file

---

## Statistics

### Code Files
- **Total Files:** 8 source files
- **Total Lines:** ~613 lines of code
- **Components:** 2
- **Pages:** 2 (1 page + 1 API route)
- **Libraries:** 1

### Documentation Files
- **Total Files:** 8 documentation files
- **Total Size:** ~50 KB
- **Formats:** Markdown

### Dependencies
- **Production:** 6 packages
- **Development:** 2 packages
- **Total:** 8 packages

### Project Size
- **Source Code:** ~25 KB
- **Documentation:** ~50 KB
- **Config Files:** ~1 KB
- **Total (without node_modules):** ~76 KB
- **With node_modules:** ~200 MB

---

## Technology Breakdown

### Frontend (Client-Side)
```
React Components (2)
├── ConnectWallet.js      → MetaMask integration
└── EthPriceToggle.js     → Price fetching

Main Page (1)
└── index.js              → Layout & composition

Styling (2)
├── Bootstrap 5           → UI framework
└── globals.css           → Custom styles
```

### Backend (Server-Side)
```
API Routes (1)
└── /api/crypto/address   → Recipient address endpoint

Environment (1)
└── .env.local            → Server-side variables
```

### Libraries
```
Blockchain (1)
└── ethers.js             → Ethereum interaction

HTTP Client (1)
└── axios                 → API requests

Framework (1)
└── Next.js               → React + SSR + API routes
```

---

## Development Workflow

```
1. Edit source files
   ↓
2. Next.js hot reload
   ↓
3. Test in browser
   ↓
4. Check console
   ↓
5. Commit changes
```

---

## Build Output

When you run `npm run build`, Next.js creates:

```
.next/
├── static/               # Static assets
├── server/              # Server-side code
│   └── pages/           # Pre-rendered pages
└── cache/               # Build cache
```

---

## Environment Files

```
.env.local.example       # Template (committed to Git)
.env.local              # Actual values (ignored by Git)
```

**Important:** Never commit `.env.local` to version control!

---

## Quick Reference

### Start Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Install Dependencies
```bash
npm install
```

---

## File Sizes (Approximate)

| File | Size | Lines |
|------|------|-------|
| ConnectWallet.js | 6.5 KB | 200 |
| EthPriceToggle.js | 3.0 KB | 90 |
| index.js | 5.5 KB | 170 |
| address.js | 1.2 KB | 35 |
| ethers.js | 2.5 KB | 80 |
| _app.js | 0.2 KB | 8 |
| globals.css | 0.8 KB | 30 |
| package.json | 0.5 KB | 24 |

**Total Source Code:** ~20 KB, ~637 lines

---

**Last Updated:** November 3, 2025  
**Version:** 1.0  
**Status:** Complete ✅
