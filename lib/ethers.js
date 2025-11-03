/**
 * Shared ethers.js helper functions
 * This file contains utility functions for working with Ethereum and ethers.js
 */

import { ethers } from 'ethers';

/**
 * Check if MetaMask is installed
 * @returns {boolean} True if MetaMask is available
 */
export const isMetaMaskInstalled = () => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

/**
 * Get the current provider
 * @returns {ethers.BrowserProvider|null} The provider or null if not available
 */
export const getProvider = () => {
  if (!isMetaMaskInstalled()) {
    return null;
  }
  return new ethers.BrowserProvider(window.ethereum);
};

/**
 * Format an Ethereum address for display
 * @param {string} address - The full Ethereum address
 * @param {number} startChars - Number of characters to show at start (default: 6)
 * @param {number} endChars - Number of characters to show at end (default: 4)
 * @returns {string} Formatted address
 */
export const formatAddress = (address, startChars = 6, endChars = 4) => {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
};

/**
 * Validate if a string is a valid Ethereum address
 * @param {string} address - The address to validate
 * @returns {boolean} True if valid Ethereum address
 */
export const isValidEthereumAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Get network name from chain ID
 * @param {string|number} chainId - The chain ID
 * @returns {string} Network name
 */
export const getNetworkName = (chainId) => {
  const networks = {
    '1': 'Ethereum Mainnet',
    '5': 'Goerli Testnet',
    '11155111': 'Sepolia Testnet',
    '137': 'Polygon Mainnet',
    '80001': 'Mumbai Testnet',
    '42161': 'Arbitrum One',
    '10': 'Optimism',
    '56': 'BNB Smart Chain',
  };
  return networks[chainId.toString()] || `Chain ID: ${chainId}`;
};

/**
 * Convert Wei to Ether
 * @param {string|bigint} wei - Amount in Wei
 * @returns {string} Amount in Ether
 */
export const weiToEther = (wei) => {
  return ethers.formatEther(wei);
};

/**
 * Convert Ether to Wei
 * @param {string} ether - Amount in Ether
 * @returns {bigint} Amount in Wei
 */
export const etherToWei = (ether) => {
  return ethers.parseEther(ether);
};
