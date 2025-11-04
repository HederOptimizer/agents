"use strict";
/**
 * Validation utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidAddress = isValidAddress;
exports.isValidAgentId = isValidAgentId;
exports.isValidURI = isValidURI;
exports.isValidScore = isValidScore;
exports.normalizeAddress = normalizeAddress;
/**
 * Validate Ethereum address format
 */
function isValidAddress(address) {
    if (!address || typeof address !== 'string') {
        return false;
    }
    // Ethereum address: 0x followed by 40 hex characters
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}
/**
 * Validate AgentId format
 * Format: "chainId:tokenId" where both are positive integers
 */
function isValidAgentId(agentId) {
    if (!agentId || typeof agentId !== 'string') {
        return false;
    }
    var parts = agentId.split(':');
    if (parts.length !== 2) {
        return false;
    }
    var chainId = parseInt(parts[0], 10);
    var tokenId = parseInt(parts[1], 10);
    return !isNaN(chainId) && !isNaN(tokenId) && chainId > 0 && tokenId >= 0;
}
/**
 * Validate URI format (basic validation)
 */
function isValidURI(uri) {
    if (!uri || typeof uri !== 'string') {
        return false;
    }
    try {
        var url = new URL(uri);
        return url.protocol === 'http:' || url.protocol === 'https:' || uri.startsWith('ipfs://');
    }
    catch (_a) {
        // If URL parsing fails, it might still be a valid IPFS URI
        return uri.startsWith('ipfs://') || uri.startsWith('/ipfs/');
    }
}
/**
 * Validate feedback score (0-100)
 */
function isValidScore(score) {
    return Number.isInteger(score) && score >= 0 && score <= 100;
}
/**
 * Normalize address to lowercase for consistent storage and comparison
 */
function normalizeAddress(address) {
    if (address.startsWith('0x') || address.startsWith('0X')) {
        return '0x' + address.slice(2).toLowerCase();
    }
    return address.toLowerCase();
}
