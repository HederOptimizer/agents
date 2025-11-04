"use strict";
/**
 * Shared constants for Agent0 SDK
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULTS = exports.TIMEOUTS = exports.IPFS_GATEWAYS = void 0;
/**
 * IPFS gateway URLs for fallback retrieval
 */
exports.IPFS_GATEWAYS = [
    'https://gateway.pinata.cloud/ipfs/',
    'https://ipfs.io/ipfs/',
    'https://dweb.link/ipfs/',
];
/**
 * Timeout values in milliseconds
 */
exports.TIMEOUTS = {
    IPFS_GATEWAY: 10000, // 10 seconds
    PINATA_UPLOAD: 80000, // 80 seconds
    TRANSACTION_WAIT: 30000, // 30 seconds
    ENDPOINT_CRAWLER_DEFAULT: 5000, // 5 seconds
};
/**
 * Default values
 */
exports.DEFAULTS = {
    FEEDBACK_EXPIRY_HOURS: 24,
    SEARCH_PAGE_SIZE: 50,
};
