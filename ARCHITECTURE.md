# Project Architecture

## System Overview

This Next.js application implements a crypto payment portal with MetaMask integration. The architecture follows a client-server pattern with clear separation of concerns.

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React Frontend (Client)                  │  │
│  │                                                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │  │
│  │  │ ConnectWallet│  │EthPriceToggle│  │ Index Page │ │  │
│  │  │  Component   │  │  Component   │  │            │ │  │
│  │  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘ │  │
│  │         │                 │                 │         │  │
│  │         │                 │                 │         │  │
│  │         ▼                 ▼                 ▼         │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │         ethers.js Library (v6)               │   │  │
│  │  └──────────────┬───────────────────────────────┘   │  │
│  │                 │                                     │  │
│  └─────────────────┼─────────────────────────────────────┘  │
│                    │                                         │
│         ┌──────────┼──────────┐                             │
│         │          │          │                             │
│         ▼          ▼          ▼                             │
│  ┌──────────┐ ┌────────┐ ┌──────────────┐                 │
│  │ MetaMask │ │CoinGecko│ │Next.js API   │                 │
│  │Extension │ │  API    │ │   Routes     │                 │
│  └──────────┘ └────────┘ └──────┬───────┘                 │
│                                  │                          │
│                                  ▼                          │
│                         ┌────────────────┐                 │
│                         │  .env.local    │                 │
│                         │ (Server-side)  │                 │
│                         └────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components

#### 1. ConnectWallet Component
**File:** `components/ConnectWallet.js`

**Responsibilities:**
- Detect MetaMask installation
- Request wallet connection
- Display connected account
- Listen for account changes
- Listen for network changes
- Show connection status

**State Management:**
```javascript
- account: string | null          // Connected wallet address
- chainId: string | null          // Current network chain ID
- isMetaMaskInstalled: boolean    // MetaMask detection flag
- isConnecting: boolean           // Connection loading state
- error: string | null            // Error messages
```

**Key Functions:**
- `checkIfWalletIsConnected()` - Check existing connection
- `connectWallet()` - Initiate connection
- `handleAccountsChanged()` - React to account switch
- `handleChainChanged()` - React to network switch
- `formatAddress()` - Format address for display

#### 2. EthPriceToggle Component
**File:** `components/EthPriceToggle.js`

**Responsibilities:**
- Fetch ETH price from CoinGecko
- Display price in USD
- Handle loading states
- Show errors gracefully
- Auto-dismiss notifications

**State Management:**
```javascript
- price: number | null            // Current ETH price
- loading: boolean                // Fetch loading state
- error: string | null            // Error messages
- showToast: boolean              // Toast visibility
```

**Key Functions:**
- `fetchEthPrice()` - Call CoinGecko API
- Price formatting with 2 decimals
- Auto-dismiss timer (5 seconds)

#### 3. Main Page
**File:** `pages/index.js`

**Responsibilities:**
- Layout and composition
- Fetch recipient address from API
- Clipboard copy functionality
- Display instructions
- Coordinate components

**State Management:**
```javascript
- recipientAddress: string | null // Recipient wallet address
- loading: boolean                // API loading state
- error: string | null            // Error messages
- copied: boolean                 // Copy confirmation
```

### Backend API Routes

#### API: /api/crypto/address
**File:** `pages/api/crypto/address.js`

**Purpose:** Securely provide recipient wallet address

**Flow:**
```
1. Client requests GET /api/crypto/address
2. Server reads process.env.RECIPIENT_WALLET
3. Validates environment variable exists
4. Validates Ethereum address format
5. Returns JSON response with address
```

**Validation:**
- Environment variable presence check
- Ethereum address format validation (regex)
- Error handling with descriptive messages

**Security:**
- Server-side only access to .env.local
- No client-side exposure of environment variables
- Input validation before response

## Data Flow

### Wallet Connection Flow

```
User Click "Connect Wallet"
         │
         ▼
Check MetaMask Installation
         │
    ┌────┴────┐
    │         │
   Yes       No
    │         │
    │         └──> Show Install Message
    │
    ▼
Request eth_requestAccounts
    │
    ▼
MetaMask Popup
    │
┌───┴───┐
│       │
Approve Reject
│       │
│       └──> Show Error
│
▼
Get Account & Network
│
▼
Update UI State
│
▼
Listen for Changes
```

### ETH Price Fetch Flow

```
User Click "Today's ETH Price"
         │
         ▼
Set Loading State
         │
         ▼
Fetch CoinGecko API
         │
    ┌────┴────┐
    │         │
 Success    Error
    │         │
    │         └──> Show Error Alert
    │
    ▼
Parse JSON Response
    │
    ▼
Extract ethereum.usd
    │
    ▼
Format to 2 Decimals
    │
    ▼
Display in Alert
    │
    ▼
Auto-dismiss (5s)
```

### Recipient Address Flow

```
Page Load
    │
    ▼
useEffect Hook
    │
    ▼
Fetch /api/crypto/address
    │
    ▼
API Route Handler
    │
    ▼
Read process.env.RECIPIENT_WALLET
    │
┌───┴───┐
│       │
Set   Missing
│       │
│       └──> Return 500 Error
│
▼
Validate Format
│
┌───┴───┐
│       │
Valid Invalid
│       │
│       └──> Return 500 Error
│
▼
Return 200 + Address
│
▼
Update Frontend State
│
▼
Display Address
```

## Technology Stack Details

### Frontend Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 14 | React framework with SSR |
| UI Library | React 18 | Component-based UI |
| Styling | Bootstrap 5 | Responsive CSS framework |
| Blockchain | ethers.js 6 | Ethereum interaction |
| HTTP Client | Axios | API requests |

### Backend Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| API Routes | Next.js API | Serverless functions |
| Environment | dotenv | Environment variables |
| Validation | Regex | Input validation |

### External Services

| Service | Purpose | Rate Limit |
|---------|---------|------------|
| CoinGecko API | ETH price data | ~10-50/min |
| MetaMask | Wallet provider | N/A |

## File Organization

```
crypto-payments/
│
├── components/              # Reusable React components
│   ├── ConnectWallet.js    # Wallet connection logic
│   └── EthPriceToggle.js   # Price fetching logic
│
├── lib/                     # Utility libraries
│   └── ethers.js           # ethers.js helpers
│
├── pages/                   # Next.js pages & API routes
│   ├── _app.js             # App wrapper
│   ├── index.js            # Main page
│   └── api/                # API routes
│       └── crypto/
│           └── address.js  # Recipient address endpoint
│
├── public/                  # Static assets
│   └── favicon.ico         # Site icon
│
├── styles/                  # CSS files
│   └── globals.css         # Global styles
│
├── .env.local.example       # Environment template
├── .gitignore              # Git ignore rules
├── next.config.js          # Next.js configuration
└── package.json            # Dependencies
```

## Security Architecture

### Environment Variables
- Stored in `.env.local` (server-side only)
- Never exposed to client bundle
- Accessed only in API routes
- Excluded from Git via `.gitignore`

### API Security
- Input validation on all endpoints
- Error messages don't expose sensitive data
- Method validation (GET only)
- Format validation for addresses

### Client Security
- No hardcoded wallet addresses
- MetaMask handles private keys
- HTTPS required for production
- CSP headers (can be added)

## State Management

### Component-Level State
- Uses React `useState` hooks
- Local state for UI concerns
- No global state management needed

### Side Effects
- Uses React `useEffect` hooks
- Event listeners for MetaMask
- API calls on mount
- Cleanup on unmount

## Event Handling

### MetaMask Events

```javascript
// Account change
window.ethereum.on('accountsChanged', handler)

// Network change
window.ethereum.on('chainChanged', handler)

// Cleanup
window.ethereum.removeListener('accountsChanged', handler)
```

### User Events
- Button clicks (wallet connect, price fetch)
- Copy to clipboard
- Form interactions (future)

## Error Handling Strategy

### Levels of Error Handling

1. **Component Level**
   - Try-catch blocks
   - Error state variables
   - User-friendly messages

2. **API Level**
   - Validation before processing
   - Descriptive error responses
   - HTTP status codes

3. **UI Level**
   - Bootstrap alerts
   - Loading spinners
   - Disabled states

## Performance Considerations

### Optimization Techniques
- Component-level code splitting (Next.js automatic)
- Lazy loading of MetaMask connection
- Debounced API calls (can be added)
- Memoization for expensive calculations (if needed)

### Bundle Size
- Bootstrap CSS: ~25KB gzipped
- ethers.js: ~88KB gzipped
- React + Next.js: ~90KB gzipped
- Total: ~200KB initial load

## Scalability

### Current Limitations
- Single recipient address
- No transaction history
- No database
- Client-side only state

### Future Scaling Options
- Add database (MongoDB, PostgreSQL)
- Implement transaction tracking
- Add user authentication
- Support multiple payment methods
- Add webhook notifications

## Development Workflow

```
1. Edit code
   │
   ▼
2. Hot reload (Next.js)
   │
   ▼
3. Test in browser
   │
   ▼
4. Check console for errors
   │
   ▼
5. Commit changes
```

## Deployment Architecture

### Development
- Local Next.js dev server
- Port 3000
- Hot module replacement
- Source maps enabled

### Production
- Static export or Node.js server
- Optimized bundles
- Minified code
- Environment-specific configs

### Hosting Options
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Custom Node.js server

## Testing Strategy

### Manual Testing
- Component functionality
- MetaMask integration
- API endpoints
- Error scenarios

### Automated Testing (Future)
- Unit tests (Jest)
- Integration tests (React Testing Library)
- E2E tests (Playwright/Cypress)

## Monitoring & Logging

### Current Logging
- Console.log for development
- Console.error for errors
- Browser DevTools

### Production Logging (Future)
- Error tracking (Sentry)
- Analytics (Google Analytics)
- Performance monitoring (Vercel Analytics)

---

**Architecture Version:** 1.0  
**Last Updated:** November 3, 2025  
**Status:** Production Ready
