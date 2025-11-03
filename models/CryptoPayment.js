// models/CryptoPayment.js
const mongoose = require("mongoose");

const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

const CryptoPaymentSchema = new mongoose.Schema(
  {
    // Link to your order or invoice
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      index: true,
      required: true,
    },

    // Reference to payer (optional)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },

    // Amounts
    amountEth: { type: String, required: true }, // store as string to avoid float issues (e.g. "0.12345")
    amountUsd: { type: Number, required: false }, // optional snapshot of USD value at time of payment
    usdRateAtPayment: { type: Number, required: false }, // ETH -> USD rate used

    // Currency and network
    currency: { type: String, enum: ["ETH"], default: "ETH" },
    network: {
      type: String,
      enum: ["mainnet", "ropsten", "rinkeby", "goerli", "kovan", "other"],
      default: "mainnet",
    },

    // On-chain transaction details
    txHash: { type: String, unique: true, sparse: true, index: true },
    fromAddress: {
      type: String,
      validate: {
        validator: (v) => !v || ETH_ADDRESS_REGEX.test(v),
        message: "Invalid ETH address",
      },
    },
    toAddress: {
      type: String,
      required: true,
      validate: {
        validator: (v) => ETH_ADDRESS_REGEX.test(v),
        message: "Invalid recipient ETH address",
      },
    },

    // Status lifecycle
    status: {
      type: String,
      enum: [
        "created",
        "pending",
        "confirmed",
        "failed",
        "reverted",
        "cancelled",
      ],
      default: "created",
      index: true,
    },
    confirmations: { type: Number, default: 0 }, // number of confirmations observed
    requiredConfirmations: { type: Number, default: 3 }, // business-configurable

    // Gas details (optional)
    gasUsed: { type: String },
    gasPriceGwei: { type: String },
    gasFeeEth: { type: String },

    // Block details
    blockNumber: { type: Number },
    blockTimestamp: { type: Date },

    // Metadata and audit
    metadata: { type: mongoose.Schema.Types.Mixed }, // e.g. { note, cartSnapshot, sellerId }
    provider: {
      type: String,
      enum: ["metamask", "walletconnect", "other"],
      default: "metamask",
    },

    // Server-side flags
    serverReceipt: { type: mongoose.Schema.Types.Mixed }, // raw receipt returned by provider node or ethers.js
    error: { type: String }, // last error message for failed attempts

    // Optional payment intent id if you implement an internal flow
    paymentIntentId: { type: String, index: true },

    // Timestamps
  },
  { timestamps: true }
);

// Compound indexes for query patterns
CryptoPaymentSchema.index({ orderId: 1, status: 1 });
CryptoPaymentSchema.index({ createdAt: -1 });

// Instance helper: mark confirmed
CryptoPaymentSchema.methods.markConfirmed = function (
  txHash,
  blockNumber,
  blockTimestamp,
  confirmations = 1
) {
  this.txHash = txHash || this.txHash;
  this.blockNumber = blockNumber || this.blockNumber;
  if (blockTimestamp) this.blockTimestamp = new Date(blockTimestamp);
  this.status = "confirmed";
  this.confirmations = confirmations;
  return this.save();
};

// Static helper: validate ETH address quickly
CryptoPaymentSchema.statics.isValidEthAddress = function (addr) {
  return ETH_ADDRESS_REGEX.test(addr);
};

module.exports =
  mongoose.models.CryptoPayment ||
  mongoose.model("CryptoPayment", CryptoPaymentSchema);
