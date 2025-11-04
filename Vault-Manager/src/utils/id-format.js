"use strict";
/**
 * Utility functions for parsing and formatting Agent IDs and Feedback IDs
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAgentId = parseAgentId;
exports.formatAgentId = formatAgentId;
exports.parseFeedbackId = parseFeedbackId;
exports.formatFeedbackId = formatFeedbackId;
var validation_1 = require("./validation");
/**
 * Parse an AgentId string into chainId and tokenId
 * Format: "chainId:tokenId" or just "tokenId" (when chain is implicit)
 */
function parseAgentId(agentId) {
    if (!agentId || typeof agentId !== 'string') {
        throw new Error("Invalid AgentId: ".concat(agentId, ". Expected a non-empty string in format \"chainId:tokenId\""));
    }
    if (agentId.includes(':')) {
        var _a = agentId.split(':'), chainId = _a[0], tokenId = _a[1];
        var parsedChainId = parseInt(chainId, 10);
        var parsedTokenId = parseInt(tokenId, 10);
        if (isNaN(parsedChainId) || isNaN(parsedTokenId)) {
            throw new Error("Invalid AgentId format: ".concat(agentId, ". ChainId and tokenId must be valid numbers"));
        }
        return {
            chainId: parsedChainId,
            tokenId: parsedTokenId,
        };
    }
    throw new Error("Invalid AgentId format: ".concat(agentId, ". Expected \"chainId:tokenId\""));
}
/**
 * Format chainId and tokenId into AgentId string
 */
function formatAgentId(chainId, tokenId) {
    return "".concat(chainId, ":").concat(tokenId);
}
/**
 * Parse a FeedbackId string into its components
 * Format: "agentId:clientAddress:feedbackIndex"
 * Note: agentId may contain colons (e.g., "11155111:123"), so we split from the right
 */
function parseFeedbackId(feedbackId) {
    var lastColonIndex = feedbackId.lastIndexOf(':');
    var secondLastColonIndex = feedbackId.lastIndexOf(':', lastColonIndex - 1);
    if (lastColonIndex === -1 || secondLastColonIndex === -1) {
        throw new Error("Invalid feedback ID format: ".concat(feedbackId));
    }
    var agentId = feedbackId.slice(0, secondLastColonIndex);
    var clientAddress = feedbackId.slice(secondLastColonIndex + 1, lastColonIndex);
    var feedbackIndexStr = feedbackId.slice(lastColonIndex + 1);
    var feedbackIndex = parseInt(feedbackIndexStr, 10);
    if (isNaN(feedbackIndex)) {
        throw new Error("Invalid feedback index: ".concat(feedbackIndexStr));
    }
    // Normalize address to lowercase for consistency
    var normalizedAddress = (0, validation_1.normalizeAddress)(clientAddress);
    return {
        agentId: agentId,
        clientAddress: normalizedAddress,
        feedbackIndex: feedbackIndex,
    };
}
/**
 * Format feedback ID components into FeedbackId string
 */
function formatFeedbackId(agentId, clientAddress, feedbackIndex) {
    // Normalize address to lowercase
    var normalizedAddress = (0, validation_1.normalizeAddress)(clientAddress);
    return "".concat(agentId, ":").concat(normalizedAddress, ":").concat(feedbackIndex);
}
