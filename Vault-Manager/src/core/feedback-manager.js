"use strict";
/**
 * Feedback management system for Agent0 SDK
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackManager = void 0;
var ethers_1 = require("ethers");
var id_format_1 = require("../utils/id-format");
var constants_1 = require("../utils/constants");
/**
 * Manages feedback operations for the Agent0 SDK
 */
var FeedbackManager = /** @class */ (function () {
    function FeedbackManager(web3Client, ipfsClient, reputationRegistry, identityRegistry, subgraphClient) {
        this.web3Client = web3Client;
        this.ipfsClient = ipfsClient;
        this.reputationRegistry = reputationRegistry;
        this.identityRegistry = identityRegistry;
        this.subgraphClient = subgraphClient;
    }
    /**
     * Set reputation registry contract (for lazy initialization)
     */
    FeedbackManager.prototype.setReputationRegistry = function (registry) {
        this.reputationRegistry = registry;
    };
    /**
     * Set identity registry contract (for lazy initialization)
     */
    FeedbackManager.prototype.setIdentityRegistry = function (registry) {
        this.identityRegistry = registry;
    };
    /**
     * Sign feedback authorization for a client
     */
    FeedbackManager.prototype.signFeedbackAuth = function (agentId_1, clientAddress_1, indexLimit_1) {
        return __awaiter(this, arguments, void 0, function (agentId, clientAddress, indexLimit, expiryHours) {
            var tokenId, indexLimitValue, lastIndex, _a, expiry, chainId, identityRegistryAddress, _b, signerAddress, authData, messageHash, signature, authDataNoPrefix, sigNoPrefix;
            if (expiryHours === void 0) { expiryHours = constants_1.DEFAULTS.FEEDBACK_EXPIRY_HOURS; }
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        tokenId = (0, id_format_1.parseAgentId)(agentId).tokenId;
                        indexLimitValue = indexLimit;
                        if (!(indexLimitValue === undefined && this.reputationRegistry)) return [3 /*break*/, 5];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.web3Client.callContract(this.reputationRegistry, 'getLastIndex', BigInt(tokenId), clientAddress)];
                    case 2:
                        lastIndex = _c.sent();
                        indexLimitValue = Number(lastIndex) + 1;
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _c.sent();
                        // If we can't get the index, default to 1 (for first feedback)
                        indexLimitValue = 1;
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        if (indexLimitValue === undefined) {
                            indexLimitValue = 1;
                        }
                        _c.label = 6;
                    case 6:
                        expiry = BigInt(Math.floor(Date.now() / 1000) + expiryHours * 3600);
                        if (!(this.web3Client.chainId === 0n)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.web3Client.initialize()];
                    case 7:
                        _c.sent();
                        chainId = this.web3Client.chainId;
                        return [3 /*break*/, 9];
                    case 8:
                        chainId = this.web3Client.chainId;
                        _c.label = 9;
                    case 9:
                        if (!this.identityRegistry) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.identityRegistry.getAddress()];
                    case 10:
                        _b = _c.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        _b = '0x0';
                        _c.label = 12;
                    case 12:
                        identityRegistryAddress = _b;
                        signerAddress = this.web3Client.address || '0x0';
                        if (!signerAddress || signerAddress === '0x0') {
                            throw new Error('No signer available for feedback authorization');
                        }
                        authData = this.web3Client.encodeFeedbackAuth(BigInt(tokenId), clientAddress, BigInt(indexLimitValue), expiry, chainId, identityRegistryAddress, signerAddress);
                        messageHash = ethers_1.ethers.keccak256(ethers_1.ethers.getBytes(authData));
                        return [4 /*yield*/, this.web3Client.signMessage(ethers_1.ethers.getBytes(messageHash))];
                    case 13:
                        signature = _c.sent();
                        authDataNoPrefix = authData.startsWith('0x') ? authData.slice(2) : authData;
                        sigNoPrefix = signature.startsWith('0x') ? signature.slice(2) : signature;
                        return [2 /*return*/, '0x' + authDataNoPrefix + sigNoPrefix];
                }
            });
        });
    };
    /**
     * Prepare feedback file (local file/object) according to spec
     */
    FeedbackManager.prototype.prepareFeedback = function (agentId, score, // 0-100
    tags, text, capability, name, skill, task, context, proofOfPayment, extra) {
        var tagsArray = tags || [];
        // Parse agent ID to get token ID
        var tokenId = (0, id_format_1.parseAgentId)(agentId).tokenId;
        // Get current timestamp in ISO format
        var createdAt = new Date().toISOString();
        // Determine chain ID and registry address
        var chainId = this.web3Client.chainId;
        var identityRegistryAddress = this.identityRegistry
            ? this.identityRegistry.target
            : '0x0';
        var clientAddress = this.web3Client.address || '0x0';
        // Build feedback data according to spec
        var feedbackData = {
            // MUST FIELDS
            agentRegistry: "eip155:".concat(chainId, ":").concat(identityRegistryAddress),
            agentId: tokenId,
            clientAddress: "eip155:".concat(chainId, ":").concat(clientAddress),
            createdAt: createdAt,
            feedbackAuth: '', // Will be filled when giving feedback
            score: score !== undefined ? Math.round(score) : 0, // Score as integer (0-100)
            // MAY FIELDS
            tag1: tagsArray[0] || undefined,
            tag2: tagsArray.length > 1 ? tagsArray[1] : undefined,
            skill: skill,
            context: context,
            task: task,
            capability: capability,
            name: name,
            proofOfPayment: proofOfPayment,
        };
        // Remove undefined values to keep the structure clean
        var cleaned = {};
        for (var _i = 0, _a = Object.entries(feedbackData); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (value !== undefined && value !== null) {
                cleaned[key] = value;
            }
        }
        if (extra) {
            Object.assign(cleaned, extra);
        }
        return cleaned;
    };
    /**
     * Give feedback (maps 8004 endpoint)
     */
    FeedbackManager.prototype.giveFeedback = function (agentId, feedbackFile, idem, feedbackAuth) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenId, clientAddress, feedbackIndex, lastIndex, error_1, errorMessage, authBytes, authHex, score, tag1Str, tag2Str, tag1, tag2, feedbackUri, feedbackHash, cid, sortedJson, error_2, txHash, error_3, errorMessage, parsedId, tag1Value, tag2Value, textValue, contextValue, proofOfPaymentValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenId = (0, id_format_1.parseAgentId)(agentId).tokenId;
                        clientAddress = this.web3Client.address;
                        if (!clientAddress) {
                            throw new Error('No signer available. Cannot give feedback without a wallet.');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        if (!this.reputationRegistry) {
                            throw new Error('Reputation registry not available');
                        }
                        return [4 /*yield*/, this.web3Client.callContract(this.reputationRegistry, 'getLastIndex', BigInt(tokenId), clientAddress)];
                    case 2:
                        lastIndex = _a.sent();
                        feedbackIndex = Number(lastIndex) + 1;
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        errorMessage = error_1 instanceof Error ? error_1.message : String(error_1);
                        throw new Error("Failed to get feedback index: ".concat(errorMessage));
                    case 4:
                        if (!feedbackAuth) return [3 /*break*/, 5];
                        authBytes = feedbackAuth;
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.signFeedbackAuth(agentId, clientAddress, feedbackIndex, 24)];
                    case 6:
                        authHex = _a.sent();
                        authBytes = authHex;
                        _a.label = 7;
                    case 7:
                        // Update feedback file with auth
                        feedbackFile.feedbackAuth = authBytes.startsWith('0x') ? authBytes : '0x' + authBytes;
                        score = feedbackFile.score !== undefined ? Number(feedbackFile.score) : 0;
                        tag1Str = typeof feedbackFile.tag1 === 'string' ? feedbackFile.tag1 : '';
                        tag2Str = typeof feedbackFile.tag2 === 'string' ? feedbackFile.tag2 : '';
                        tag1 = this._stringToBytes32(tag1Str);
                        tag2 = this._stringToBytes32(tag2Str);
                        feedbackUri = '';
                        feedbackHash = '0x' + '00'.repeat(32);
                        if (!this.ipfsClient) return [3 /*break*/, 12];
                        _a.label = 8;
                    case 8:
                        _a.trys.push([8, 10, , 11]);
                        return [4 /*yield*/, this.ipfsClient.addJson(feedbackFile)];
                    case 9:
                        cid = _a.sent();
                        feedbackUri = "ipfs://".concat(cid);
                        sortedJson = JSON.stringify(feedbackFile, Object.keys(feedbackFile).sort());
                        feedbackHash = this.web3Client.keccak256(sortedJson);
                        return [3 /*break*/, 11];
                    case 10:
                        error_2 = _a.sent();
                        return [3 /*break*/, 11];
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        if (feedbackFile.context || feedbackFile.capability || feedbackFile.name) {
                            // If we have rich data but no IPFS, we need to store it somewhere
                            throw new Error('Rich feedback data requires IPFS client for storage');
                        }
                        _a.label = 13;
                    case 13:
                        // Submit to blockchain
                        if (!this.reputationRegistry) {
                            throw new Error('Reputation registry not available');
                        }
                        _a.label = 14;
                    case 14:
                        _a.trys.push([14, 17, , 18]);
                        return [4 /*yield*/, this.web3Client.transactContract(this.reputationRegistry, 'giveFeedback', {}, BigInt(tokenId), score, tag1, tag2, feedbackUri, feedbackHash, ethers_1.ethers.getBytes(authBytes.startsWith('0x') ? authBytes : '0x' + authBytes))];
                    case 15:
                        txHash = _a.sent();
                        // Wait for transaction confirmation
                        return [4 /*yield*/, this.web3Client.waitForTransaction(txHash)];
                    case 16:
                        // Wait for transaction confirmation
                        _a.sent();
                        return [3 /*break*/, 18];
                    case 17:
                        error_3 = _a.sent();
                        errorMessage = error_3 instanceof Error ? error_3.message : String(error_3);
                        throw new Error("Failed to submit feedback to blockchain: ".concat(errorMessage));
                    case 18:
                        parsedId = (0, id_format_1.parseFeedbackId)((0, id_format_1.formatFeedbackId)(agentId, clientAddress, feedbackIndex));
                        tag1Value = typeof feedbackFile.tag1 === 'string' ? feedbackFile.tag1 : undefined;
                        tag2Value = typeof feedbackFile.tag2 === 'string' ? feedbackFile.tag2 : undefined;
                        textValue = typeof feedbackFile.text === 'string' ? feedbackFile.text : undefined;
                        contextValue = feedbackFile.context && typeof feedbackFile.context === 'object' && !Array.isArray(feedbackFile.context)
                            ? feedbackFile.context
                            : undefined;
                        proofOfPaymentValue = feedbackFile.proofOfPayment && typeof feedbackFile.proofOfPayment === 'object' && !Array.isArray(feedbackFile.proofOfPayment)
                            ? feedbackFile.proofOfPayment
                            : undefined;
                        return [2 /*return*/, {
                                id: [parsedId.agentId, parsedId.clientAddress, parsedId.feedbackIndex],
                                agentId: agentId,
                                reviewer: clientAddress,
                                score: score > 0 ? score : undefined,
                                tags: [tag1Value, tag2Value].filter(Boolean),
                                text: textValue,
                                context: contextValue,
                                proofOfPayment: proofOfPaymentValue,
                                fileURI: feedbackUri || undefined,
                                createdAt: Math.floor(Date.now() / 1000),
                                answers: [],
                                isRevoked: false,
                                // Off-chain only fields
                                capability: typeof feedbackFile.capability === 'string' ? feedbackFile.capability : undefined,
                                name: typeof feedbackFile.name === 'string' ? feedbackFile.name : undefined,
                                skill: typeof feedbackFile.skill === 'string' ? feedbackFile.skill : undefined,
                                task: typeof feedbackFile.task === 'string' ? feedbackFile.task : undefined,
                            }];
                }
            });
        });
    };
    /**
     * Get single feedback with responses
     * Currently only supports blockchain query - subgraph support coming soon
     */
    FeedbackManager.prototype.getFeedback = function (agentId, clientAddress, feedbackIndex) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._getFeedbackFromBlockchain(agentId, clientAddress, feedbackIndex)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get feedback from blockchain
     */
    FeedbackManager.prototype._getFeedbackFromBlockchain = function (agentId, clientAddress, feedbackIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenId, _a, score, tag1Bytes, tag2Bytes, isRevoked, tags, error_4, errorMessage;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.reputationRegistry) {
                            throw new Error('Reputation registry not available');
                        }
                        tokenId = (0, id_format_1.parseAgentId)(agentId).tokenId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.web3Client.callContract(this.reputationRegistry, 'readFeedback', BigInt(tokenId), clientAddress, BigInt(feedbackIndex))];
                    case 2:
                        _a = _b.sent(), score = _a[0], tag1Bytes = _a[1], tag2Bytes = _a[2], isRevoked = _a[3];
                        tags = this._bytes32ToTags(tag1Bytes, tag2Bytes);
                        return [2 /*return*/, {
                                id: [agentId, clientAddress.toLowerCase(), feedbackIndex],
                                agentId: agentId,
                                reviewer: clientAddress,
                                score: Number(score),
                                tags: tags,
                                createdAt: Math.floor(Date.now() / 1000), // Approximate, could be improved
                                answers: [],
                                isRevoked: Boolean(isRevoked),
                            }];
                    case 3:
                        error_4 = _b.sent();
                        errorMessage = error_4 instanceof Error ? error_4.message : String(error_4);
                        throw new Error("Failed to read feedback from blockchain: ".concat(errorMessage));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Search feedback with filters
     * Uses subgraph if available, otherwise returns empty array
     */
    FeedbackManager.prototype.searchFeedback = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var feedbacksData, feedbacks, _i, feedbacksData_1, fbData, feedbackId, parts, agentIdStr, clientAddr, feedbackIdx, feedback;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.subgraphClient) {
                            // Fallback not implemented (would require blockchain queries)
                            // For now, return empty if subgraph unavailable
                            return [2 /*return*/, []];
                        }
                        return [4 /*yield*/, this.subgraphClient.searchFeedback({
                                agents: params.agents,
                                reviewers: params.reviewers,
                                tags: params.tags,
                                capabilities: params.capabilities,
                                skills: params.skills,
                                tasks: params.tasks,
                                names: params.names,
                                minScore: params.minScore,
                                maxScore: params.maxScore,
                                includeRevoked: params.includeRevoked || false,
                            }, 100, // first
                            0, // skip
                            'createdAt', 'desc')];
                    case 1:
                        feedbacksData = _a.sent();
                        feedbacks = [];
                        for (_i = 0, feedbacksData_1 = feedbacksData; _i < feedbacksData_1.length; _i++) {
                            fbData = feedbacksData_1[_i];
                            feedbackId = fbData.id;
                            parts = feedbackId.split(':');
                            agentIdStr = void 0;
                            clientAddr = void 0;
                            feedbackIdx = void 0;
                            if (parts.length >= 2) {
                                agentIdStr = "".concat(parts[0], ":").concat(parts[1]);
                                clientAddr = parts.length > 2 ? parts[2] : '';
                                feedbackIdx = parts.length > 3 ? parseInt(parts[3], 10) : 1;
                            }
                            else {
                                agentIdStr = feedbackId;
                                clientAddr = '';
                                feedbackIdx = 1;
                            }
                            feedback = this._mapSubgraphFeedbackToModel(fbData, agentIdStr, clientAddr, feedbackIdx);
                            feedbacks.push(feedback);
                        }
                        return [2 /*return*/, feedbacks];
                }
            });
        });
    };
    /**
     * Map subgraph feedback data to Feedback model
     */
    FeedbackManager.prototype._mapSubgraphFeedbackToModel = function (feedbackData, agentId, clientAddress, feedbackIndex) {
        var feedbackFile = feedbackData.feedbackFile || {};
        // Map responses
        var responsesData = feedbackData.responses || [];
        var answers = responsesData.map(function (resp) { return ({
            responder: resp.responder,
            responseUri: resp.responseUri,
            responseHash: resp.responseHash,
            createdAt: resp.createdAt ? parseInt(resp.createdAt, 10) : undefined,
        }); });
        // Map tags - check if they're hex bytes32 or plain strings
        var tags = [];
        var tag1 = feedbackData.tag1 || feedbackFile.tag1;
        var tag2 = feedbackData.tag2 || feedbackFile.tag2;
        // Convert hex bytes32 to readable tags
        if (tag1 || tag2) {
            tags.push.apply(tags, this._hexBytes32ToTags(tag1 || '', tag2 || ''));
        }
        // Build proof of payment object if available
        var proofOfPayment;
        if (feedbackFile.proofOfPaymentFromAddress) {
            proofOfPayment = {
                fromAddress: feedbackFile.proofOfPaymentFromAddress,
                toAddress: feedbackFile.proofOfPaymentToAddress,
                chainId: feedbackFile.proofOfPaymentChainId,
                txHash: feedbackFile.proofOfPaymentTxHash,
            };
        }
        // Build context object if available
        var context;
        if (feedbackFile.context) {
            try {
                context = typeof feedbackFile.context === 'string'
                    ? JSON.parse(feedbackFile.context)
                    : feedbackFile.context;
            }
            catch (_a) {
                context = { raw: feedbackFile.context };
            }
        }
        var id = [agentId, clientAddress, feedbackIndex];
        return {
            id: id,
            agentId: agentId,
            reviewer: clientAddress,
            score: feedbackData.score !== undefined && feedbackData.score !== null ? Number(feedbackData.score) : undefined,
            tags: tags,
            text: feedbackFile.text || undefined,
            context: context,
            proofOfPayment: proofOfPayment,
            fileURI: feedbackData.feedbackUri || undefined,
            createdAt: feedbackData.createdAt ? parseInt(feedbackData.createdAt, 10) : Math.floor(Date.now() / 1000),
            answers: answers,
            isRevoked: feedbackData.isRevoked || false,
            capability: feedbackFile.capability || undefined,
            name: feedbackFile.name || undefined,
            skill: feedbackFile.skill || undefined,
            task: feedbackFile.task || undefined,
        };
    };
    /**
     * Convert hex bytes32 tags back to strings, or return plain strings as-is
     * The subgraph now stores tags as human-readable strings (not hex),
     * so this method handles both formats for backwards compatibility
     */
    FeedbackManager.prototype._hexBytes32ToTags = function (tag1, tag2) {
        var tags = [];
        if (tag1 && tag1 !== '0x' + '00'.repeat(32)) {
            // If it's already a plain string (from subgraph), use it directly
            if (!tag1.startsWith('0x')) {
                if (tag1) {
                    tags.push(tag1);
                }
            }
            else {
                // Try to convert from hex bytes32 (on-chain format)
                try {
                    var hexBytes = ethers_1.ethers.getBytes(tag1);
                    var tag1Str = new TextDecoder('utf-8', { fatal: false }).decode(hexBytes.filter(function (b) { return b !== 0; }));
                    if (tag1Str) {
                        tags.push(tag1Str);
                    }
                }
                catch (_a) {
                    // Ignore invalid hex strings
                }
            }
        }
        if (tag2 && tag2 !== '0x' + '00'.repeat(32)) {
            // If it's already a plain string (from subgraph), use it directly
            if (!tag2.startsWith('0x')) {
                if (tag2) {
                    tags.push(tag2);
                }
            }
            else {
                // Try to convert from hex bytes32 (on-chain format)
                try {
                    var hexBytes = ethers_1.ethers.getBytes(tag2);
                    var tag2Str = new TextDecoder('utf-8', { fatal: false }).decode(hexBytes.filter(function (b) { return b !== 0; }));
                    if (tag2Str) {
                        tags.push(tag2Str);
                    }
                }
                catch (_b) {
                    // Ignore invalid hex strings
                }
            }
        }
        return tags;
    };
    /**
     * Append response to feedback
     */
    FeedbackManager.prototype.appendResponse = function (agentId, clientAddress, feedbackIndex, responseUri, responseHash) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenId, txHash, error_5, errorMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.reputationRegistry) {
                            throw new Error('Reputation registry not available');
                        }
                        tokenId = (0, id_format_1.parseAgentId)(agentId).tokenId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.web3Client.transactContract(this.reputationRegistry, 'appendResponse', {}, BigInt(tokenId), clientAddress, BigInt(feedbackIndex), responseUri, responseHash)];
                    case 2:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                    case 3:
                        error_5 = _a.sent();
                        errorMessage = error_5 instanceof Error ? error_5.message : String(error_5);
                        throw new Error("Failed to append response: ".concat(errorMessage));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Revoke feedback
     */
    FeedbackManager.prototype.revokeFeedback = function (agentId, feedbackIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenId, clientAddress, txHash, error_6, errorMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.reputationRegistry) {
                            throw new Error('Reputation registry not available');
                        }
                        tokenId = (0, id_format_1.parseAgentId)(agentId).tokenId;
                        clientAddress = this.web3Client.address;
                        if (!clientAddress) {
                            throw new Error('No signer available');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.web3Client.transactContract(this.reputationRegistry, 'revokeFeedback', {}, BigInt(tokenId), BigInt(feedbackIndex))];
                    case 2:
                        txHash = _a.sent();
                        return [2 /*return*/, txHash];
                    case 3:
                        error_6 = _a.sent();
                        errorMessage = error_6 instanceof Error ? error_6.message : String(error_6);
                        throw new Error("Failed to revoke feedback: ".concat(errorMessage));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Convert string to bytes32 for blockchain storage
     */
    FeedbackManager.prototype._stringToBytes32 = function (text) {
        if (!text) {
            return '0x' + '00'.repeat(32);
        }
        // Encode as UTF-8 and pad/truncate to 32 bytes
        var encoder = new TextEncoder();
        var encoded = encoder.encode(text);
        var padded = new Uint8Array(32);
        var length = Math.min(encoded.length, 32);
        padded.set(encoded.slice(0, length), 0);
        return ethers_1.ethers.hexlify(padded);
    };
    /**
     * Convert bytes32 tags back to strings
     */
    FeedbackManager.prototype._bytes32ToTags = function (tag1Bytes, tag2Bytes) {
        var tags = [];
        if (tag1Bytes && tag1Bytes !== '0x' + '00'.repeat(32)) {
            try {
                var tag1 = ethers_1.ethers.toUtf8String(tag1Bytes).replace(/\0/g, '').trim();
                if (tag1) {
                    tags.push(tag1);
                }
            }
            catch (_a) {
                // If UTF-8 decode fails, skip this tag
            }
        }
        if (tag2Bytes && tag2Bytes !== '0x' + '00'.repeat(32)) {
            try {
                var tag2 = ethers_1.ethers.toUtf8String(tag2Bytes).replace(/\0/g, '').trim();
                if (tag2) {
                    tags.push(tag2);
                }
            }
            catch (_b) {
                // If UTF-8 decode fails, skip this tag
            }
        }
        return tags;
    };
    /**
     * Get reputation summary
     */
    FeedbackManager.prototype.getReputationSummary = function (agentId, tag1, tag2) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenId, tag1Bytes, tag2Bytes, clients, _a, count, averageScore, error_7, errorMessage;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.reputationRegistry) {
                            throw new Error('Reputation registry not available');
                        }
                        tokenId = (0, id_format_1.parseAgentId)(agentId).tokenId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        tag1Bytes = tag1 ? this._stringToBytes32(tag1) : '0x' + '00'.repeat(32);
                        tag2Bytes = tag2 ? this._stringToBytes32(tag2) : '0x' + '00'.repeat(32);
                        return [4 /*yield*/, this.web3Client.callContract(this.reputationRegistry, 'getClients', BigInt(tokenId))];
                    case 2:
                        clients = _b.sent();
                        if (!Array.isArray(clients) || clients.length === 0) {
                            return [2 /*return*/, { count: 0, averageScore: 0 }];
                        }
                        return [4 /*yield*/, this.web3Client.callContract(this.reputationRegistry, 'getSummary', BigInt(tokenId), clients, tag1Bytes, tag2Bytes)];
                    case 3:
                        _a = _b.sent(), count = _a[0], averageScore = _a[1];
                        return [2 /*return*/, {
                                count: Number(count),
                                averageScore: Number(averageScore),
                            }];
                    case 4:
                        error_7 = _b.sent();
                        errorMessage = error_7 instanceof Error ? error_7.message : String(error_7);
                        throw new Error("Failed to get reputation summary: ".concat(errorMessage));
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return FeedbackManager;
}());
exports.FeedbackManager = FeedbackManager;
