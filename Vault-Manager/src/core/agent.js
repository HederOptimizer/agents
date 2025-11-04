"use strict";
/**
 * Agent class for managing individual agents
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.Agent = void 0;
var ethers_1 = require("ethers");
var enums_1 = require("../models/enums");
var endpoint_crawler_1 = require("./endpoint-crawler");
var id_format_1 = require("../utils/id-format");
var constants_1 = require("../utils/constants");
/**
 * Agent class for managing individual agents
 */
var Agent = /** @class */ (function () {
    function Agent(sdk, registrationFile) {
        this.sdk = sdk;
        this._dirtyMetadata = new Set();
        this.registrationFile = registrationFile;
        this._endpointCrawler = new endpoint_crawler_1.EndpointCrawler(5000);
    }
    Object.defineProperty(Agent.prototype, "agentId", {
        // Read-only properties
        get: function () {
            return this.registrationFile.agentId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Agent.prototype, "agentURI", {
        get: function () {
            return this.registrationFile.agentURI;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Agent.prototype, "name", {
        get: function () {
            return this.registrationFile.name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Agent.prototype, "description", {
        get: function () {
            return this.registrationFile.description;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Agent.prototype, "image", {
        get: function () {
            return this.registrationFile.image;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Agent.prototype, "mcpEndpoint", {
        get: function () {
            var ep = this.registrationFile.endpoints.find(function (e) { return e.type === enums_1.EndpointType.MCP; });
            return ep === null || ep === void 0 ? void 0 : ep.value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Agent.prototype, "a2aEndpoint", {
        get: function () {
            var ep = this.registrationFile.endpoints.find(function (e) { return e.type === enums_1.EndpointType.A2A; });
            return ep === null || ep === void 0 ? void 0 : ep.value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Agent.prototype, "ensEndpoint", {
        get: function () {
            var ep = this.registrationFile.endpoints.find(function (e) { return e.type === enums_1.EndpointType.ENS; });
            return ep === null || ep === void 0 ? void 0 : ep.value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Agent.prototype, "walletAddress", {
        get: function () {
            return this.registrationFile.walletAddress;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Agent.prototype, "mcpTools", {
        get: function () {
            var _a;
            var ep = this.registrationFile.endpoints.find(function (e) { return e.type === enums_1.EndpointType.MCP; });
            return (_a = ep === null || ep === void 0 ? void 0 : ep.meta) === null || _a === void 0 ? void 0 : _a.mcpTools;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Agent.prototype, "mcpPrompts", {
        get: function () {
            var _a;
            var ep = this.registrationFile.endpoints.find(function (e) { return e.type === enums_1.EndpointType.MCP; });
            return (_a = ep === null || ep === void 0 ? void 0 : ep.meta) === null || _a === void 0 ? void 0 : _a.mcpPrompts;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Agent.prototype, "mcpResources", {
        get: function () {
            var _a;
            var ep = this.registrationFile.endpoints.find(function (e) { return e.type === enums_1.EndpointType.MCP; });
            return (_a = ep === null || ep === void 0 ? void 0 : ep.meta) === null || _a === void 0 ? void 0 : _a.mcpResources;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Agent.prototype, "a2aSkills", {
        get: function () {
            var _a;
            var ep = this.registrationFile.endpoints.find(function (e) { return e.type === enums_1.EndpointType.A2A; });
            return (_a = ep === null || ep === void 0 ? void 0 : ep.meta) === null || _a === void 0 ? void 0 : _a.a2aSkills;
        },
        enumerable: false,
        configurable: true
    });
    // Endpoint management
    Agent.prototype.setMCP = function (endpoint_1) {
        return __awaiter(this, arguments, void 0, function (endpoint, version, autoFetch) {
            var meta, capabilities, error_1, mcpEndpoint;
            if (version === void 0) { version = '2025-06-18'; }
            if (autoFetch === void 0) { autoFetch = true; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Remove existing MCP endpoint if any
                        this.registrationFile.endpoints = this.registrationFile.endpoints.filter(function (ep) { return ep.type !== enums_1.EndpointType.MCP; });
                        meta = { version: version };
                        if (!autoFetch) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._endpointCrawler.fetchMcpCapabilities(endpoint)];
                    case 2:
                        capabilities = _a.sent();
                        if (capabilities) {
                            if (capabilities.mcpTools)
                                meta.mcpTools = capabilities.mcpTools;
                            if (capabilities.mcpPrompts)
                                meta.mcpPrompts = capabilities.mcpPrompts;
                            if (capabilities.mcpResources)
                                meta.mcpResources = capabilities.mcpResources;
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        mcpEndpoint = {
                            type: enums_1.EndpointType.MCP,
                            value: endpoint,
                            meta: meta,
                        };
                        this.registrationFile.endpoints.push(mcpEndpoint);
                        this.registrationFile.updatedAt = Math.floor(Date.now() / 1000);
                        return [2 /*return*/, this];
                }
            });
        });
    };
    Agent.prototype.setA2A = function (agentcard_1) {
        return __awaiter(this, arguments, void 0, function (agentcard, version, autoFetch) {
            var meta, capabilities, error_2, a2aEndpoint;
            if (version === void 0) { version = '0.30'; }
            if (autoFetch === void 0) { autoFetch = true; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Remove existing A2A endpoint if any
                        this.registrationFile.endpoints = this.registrationFile.endpoints.filter(function (ep) { return ep.type !== enums_1.EndpointType.A2A; });
                        meta = { version: version };
                        if (!autoFetch) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._endpointCrawler.fetchA2aCapabilities(agentcard)];
                    case 2:
                        capabilities = _a.sent();
                        if (capabilities === null || capabilities === void 0 ? void 0 : capabilities.a2aSkills) {
                            meta.a2aSkills = capabilities.a2aSkills;
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        a2aEndpoint = {
                            type: enums_1.EndpointType.A2A,
                            value: agentcard,
                            meta: meta,
                        };
                        this.registrationFile.endpoints.push(a2aEndpoint);
                        this.registrationFile.updatedAt = Math.floor(Date.now() / 1000);
                        return [2 /*return*/, this];
                }
            });
        });
    };
    Agent.prototype.setENS = function (name, version) {
        if (version === void 0) { version = '1.0'; }
        // Remove existing ENS endpoints
        this.registrationFile.endpoints = this.registrationFile.endpoints.filter(function (ep) { return ep.type !== enums_1.EndpointType.ENS; });
        // Check if ENS changed
        if (name !== this._lastRegisteredEns) {
            this._dirtyMetadata.add('agentName');
        }
        // Add new ENS endpoint
        var ensEndpoint = {
            type: enums_1.EndpointType.ENS,
            value: name,
            meta: { version: version },
        };
        this.registrationFile.endpoints.push(ensEndpoint);
        this.registrationFile.updatedAt = Math.floor(Date.now() / 1000);
        return this;
    };
    Agent.prototype.setAgentWallet = function (address, chainId) {
        this.registrationFile.walletAddress = address;
        this.registrationFile.walletChainId = chainId;
        // Check if wallet changed
        if (address !== this._lastRegisteredWallet) {
            this._dirtyMetadata.add('agentWallet');
        }
        this.registrationFile.updatedAt = Math.floor(Date.now() / 1000);
        return this;
    };
    Agent.prototype.setActive = function (active) {
        this.registrationFile.active = active;
        this.registrationFile.updatedAt = Math.floor(Date.now() / 1000);
        return this;
    };
    Agent.prototype.setX402Support = function (x402Support) {
        this.registrationFile.x402support = x402Support;
        this.registrationFile.updatedAt = Math.floor(Date.now() / 1000);
        return this;
    };
    Agent.prototype.setTrust = function (reputation, cryptoEconomic, teeAttestation) {
        if (reputation === void 0) { reputation = false; }
        if (cryptoEconomic === void 0) { cryptoEconomic = false; }
        if (teeAttestation === void 0) { teeAttestation = false; }
        var trustModels = [];
        if (reputation)
            trustModels.push(enums_1.TrustModel.REPUTATION);
        if (cryptoEconomic)
            trustModels.push(enums_1.TrustModel.CRYPTO_ECONOMIC);
        if (teeAttestation)
            trustModels.push(enums_1.TrustModel.TEE_ATTESTATION);
        this.registrationFile.trustModels = trustModels;
        this.registrationFile.updatedAt = Math.floor(Date.now() / 1000);
        return this;
    };
    Agent.prototype.setMetadata = function (kv) {
        // Mark all provided keys as dirty
        for (var _i = 0, _a = Object.keys(kv); _i < _a.length; _i++) {
            var key = _a[_i];
            this._dirtyMetadata.add(key);
        }
        Object.assign(this.registrationFile.metadata, kv);
        this.registrationFile.updatedAt = Math.floor(Date.now() / 1000);
        return this;
    };
    Agent.prototype.getMetadata = function () {
        return __assign({}, this.registrationFile.metadata);
    };
    Agent.prototype.delMetadata = function (key) {
        if (key in this.registrationFile.metadata) {
            delete this.registrationFile.metadata[key];
            this._dirtyMetadata.delete(key);
            this.registrationFile.updatedAt = Math.floor(Date.now() / 1000);
        }
        return this;
    };
    Agent.prototype.getRegistrationFile = function () {
        return this.registrationFile;
    };
    /**
     * Update basic agent information
     */
    Agent.prototype.updateInfo = function (name, description, image) {
        if (name !== undefined) {
            this.registrationFile.name = name;
        }
        if (description !== undefined) {
            this.registrationFile.description = description;
        }
        if (image !== undefined) {
            this.registrationFile.image = image;
        }
        this.registrationFile.updatedAt = Math.floor(Date.now() / 1000);
        return this;
    };
    /**
     * Register agent on-chain with IPFS flow
     */
    Agent.prototype.registerIPFS = function () {
        return __awaiter(this, void 0, void 0, function () {
            var chainId, identityRegistryAddress, ipfsCid, error_3, tokenId, txHash, error_4, chainId, identityRegistryAddress, ipfsCid, tokenId, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Validate basic info
                        if (!this.registrationFile.name || !this.registrationFile.description) {
                            throw new Error('Agent must have name and description before registration');
                        }
                        if (!this.registrationFile.agentId) return [3 /*break*/, 13];
                        return [4 /*yield*/, this.sdk.chainId()];
                    case 1:
                        chainId = _a.sent();
                        return [4 /*yield*/, this.sdk.getIdentityRegistry().getAddress()];
                    case 2:
                        identityRegistryAddress = _a.sent();
                        return [4 /*yield*/, this.sdk.ipfsClient.addRegistrationFile(this.registrationFile, chainId, identityRegistryAddress)];
                    case 3:
                        ipfsCid = _a.sent();
                        if (!(this._dirtyMetadata.size > 0)) return [3 /*break*/, 7];
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, this._updateMetadataOnChain()];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        error_3 = _a.sent();
                        return [3 /*break*/, 7];
                    case 7:
                        tokenId = (0, id_format_1.parseAgentId)(this.registrationFile.agentId).tokenId;
                        return [4 /*yield*/, this.sdk.web3Client.transactContract(this.sdk.getIdentityRegistry(), 'setAgentUri', {}, BigInt(tokenId), "ipfs://".concat(ipfsCid))];
                    case 8:
                        txHash = _a.sent();
                        _a.label = 9;
                    case 9:
                        _a.trys.push([9, 11, , 12]);
                        return [4 /*yield*/, this.sdk.web3Client.waitForTransaction(txHash, constants_1.TIMEOUTS.TRANSACTION_WAIT)];
                    case 10:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 11:
                        error_4 = _a.sent();
                        return [3 /*break*/, 12];
                    case 12:
                        // Clear dirty flags
                        this._lastRegisteredWallet = this.walletAddress;
                        this._lastRegisteredEns = this.ensEndpoint;
                        this._dirtyMetadata.clear();
                        this.registrationFile.agentURI = "ipfs://".concat(ipfsCid);
                        return [2 /*return*/, this.registrationFile];
                    case 13: 
                    // First time registration
                    // Step 1: Register on-chain without URI
                    return [4 /*yield*/, this._registerWithoutUri()];
                    case 14:
                        // First time registration
                        // Step 1: Register on-chain without URI
                        _a.sent();
                        return [4 /*yield*/, this.sdk.chainId()];
                    case 15:
                        chainId = _a.sent();
                        return [4 /*yield*/, this.sdk.getIdentityRegistry().getAddress()];
                    case 16:
                        identityRegistryAddress = _a.sent();
                        return [4 /*yield*/, this.sdk.ipfsClient.addRegistrationFile(this.registrationFile, chainId, identityRegistryAddress)];
                    case 17:
                        ipfsCid = _a.sent();
                        tokenId = (0, id_format_1.parseAgentId)(this.registrationFile.agentId).tokenId;
                        return [4 /*yield*/, this.sdk.web3Client.transactContract(this.sdk.getIdentityRegistry(), 'setAgentUri', {}, BigInt(tokenId), "ipfs://".concat(ipfsCid))];
                    case 18:
                        txHash = _a.sent();
                        // Wait for transaction to be confirmed
                        return [4 /*yield*/, this.sdk.web3Client.waitForTransaction(txHash)];
                    case 19:
                        // Wait for transaction to be confirmed
                        _a.sent();
                        // Clear dirty flags
                        this._lastRegisteredWallet = this.walletAddress;
                        this._lastRegisteredEns = this.ensEndpoint;
                        this._dirtyMetadata.clear();
                        this.registrationFile.agentURI = "ipfs://".concat(ipfsCid);
                        return [2 /*return*/, this.registrationFile];
                }
            });
        });
    };
    /**
     * Register agent on-chain with HTTP URI
     */
    Agent.prototype.registerHTTP = function (agentUri) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Validate basic info
                        if (!this.registrationFile.name || !this.registrationFile.description) {
                            throw new Error('Agent must have name and description before registration');
                        }
                        if (!this.registrationFile.agentId) return [3 /*break*/, 2];
                        // Agent already registered - update agent URI
                        return [4 /*yield*/, this.setAgentUri(agentUri)];
                    case 1:
                        // Agent already registered - update agent URI
                        _a.sent();
                        return [2 /*return*/, this.registrationFile];
                    case 2: return [4 /*yield*/, this._registerWithUri(agentUri)];
                    case 3: 
                    // First time registration
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Set agent URI (for updates)
     */
    Agent.prototype.setAgentUri = function (agentUri) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.registrationFile.agentId) {
                            throw new Error('Agent must be registered before setting URI');
                        }
                        tokenId = (0, id_format_1.parseAgentId)(this.registrationFile.agentId).tokenId;
                        return [4 /*yield*/, this.sdk.web3Client.transactContract(this.sdk.getIdentityRegistry(), 'setAgentUri', {}, BigInt(tokenId), agentUri)];
                    case 1:
                        _a.sent();
                        this.registrationFile.agentURI = agentUri;
                        this.registrationFile.updatedAt = Math.floor(Date.now() / 1000);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Transfer agent ownership
     */
    Agent.prototype.transfer = function (newOwner) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenId, currentOwner, normalizedAddress, checksumAddress, identityRegistry, txHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.registrationFile.agentId) {
                            throw new Error('Agent must be registered before transfer');
                        }
                        tokenId = (0, id_format_1.parseAgentId)(this.registrationFile.agentId).tokenId;
                        currentOwner = this.sdk.web3Client.address;
                        if (!currentOwner) {
                            throw new Error('No signer available');
                        }
                        normalizedAddress = newOwner.toLowerCase();
                        if (!this.sdk.web3Client.isAddress(normalizedAddress)) {
                            throw new Error("Invalid address: ".concat(newOwner));
                        }
                        // Validate not zero address (check before expensive operations)
                        if (normalizedAddress === '0x0000000000000000000000000000000000000000') {
                            throw new Error('Cannot transfer agent to zero address');
                        }
                        checksumAddress = this.sdk.web3Client.toChecksumAddress(normalizedAddress);
                        // Validate not transferring to self
                        if (checksumAddress.toLowerCase() === currentOwner.toLowerCase()) {
                            throw new Error('Cannot transfer agent to yourself');
                        }
                        identityRegistry = this.sdk.getIdentityRegistry();
                        return [4 /*yield*/, this.sdk.web3Client.transactContract(identityRegistry, 'transferFrom', {}, currentOwner, checksumAddress, BigInt(tokenId))];
                    case 1:
                        txHash = _a.sent();
                        return [2 /*return*/, {
                                txHash: txHash,
                                from: currentOwner,
                                to: checksumAddress,
                                agentId: this.registrationFile.agentId,
                            }];
                }
            });
        });
    };
    /**
     * Private helper methods
     */
    Agent.prototype._registerWithoutUri = function () {
        return __awaiter(this, void 0, void 0, function () {
            var metadataEntries, identityRegistry, txHash, receipt, agentId, chainId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        metadataEntries = this._collectMetadataForRegistration();
                        identityRegistry = this.sdk.getIdentityRegistry();
                        if (!(metadataEntries.length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.sdk.web3Client.transactContract(identityRegistry, 'register', {}, // Transaction options
                            '', // Empty tokenUri
                            metadataEntries)];
                    case 1:
                        txHash = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.sdk.web3Client.transactContract(identityRegistry, 'register', {} // Transaction options
                        // No arguments - calls register()
                        )];
                    case 3:
                        txHash = _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.sdk.web3Client.waitForTransaction(txHash)];
                    case 5:
                        receipt = _a.sent();
                        agentId = this._extractAgentIdFromReceipt(receipt);
                        return [4 /*yield*/, this.sdk.chainId()];
                    case 6:
                        chainId = _a.sent();
                        this.registrationFile.agentId = "".concat(chainId, ":").concat(agentId);
                        this.registrationFile.updatedAt = Math.floor(Date.now() / 1000);
                        return [2 /*return*/];
                }
            });
        });
    };
    Agent.prototype._registerWithUri = function (agentUri) {
        return __awaiter(this, void 0, void 0, function () {
            var metadataEntries, identityRegistry, txHash, receipt, agentId, chainId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        metadataEntries = this._collectMetadataForRegistration();
                        identityRegistry = this.sdk.getIdentityRegistry();
                        return [4 /*yield*/, this.sdk.web3Client.transactContract(identityRegistry, 'register', {}, agentUri, metadataEntries)];
                    case 1:
                        txHash = _a.sent();
                        return [4 /*yield*/, this.sdk.web3Client.waitForTransaction(txHash)];
                    case 2:
                        receipt = _a.sent();
                        agentId = this._extractAgentIdFromReceipt(receipt);
                        return [4 /*yield*/, this.sdk.chainId()];
                    case 3:
                        chainId = _a.sent();
                        this.registrationFile.agentId = "".concat(chainId, ":").concat(agentId);
                        this.registrationFile.agentURI = agentUri;
                        this.registrationFile.updatedAt = Math.floor(Date.now() / 1000);
                        return [2 /*return*/, this.registrationFile];
                }
            });
        });
    };
    Agent.prototype._updateMetadataOnChain = function () {
        return __awaiter(this, void 0, void 0, function () {
            var metadataEntries, tokenId, identityRegistry, _i, metadataEntries_1, entry, txHash, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        metadataEntries = this._collectMetadataForRegistration();
                        tokenId = (0, id_format_1.parseAgentId)(this.registrationFile.agentId).tokenId;
                        identityRegistry = this.sdk.getIdentityRegistry();
                        _i = 0, metadataEntries_1 = metadataEntries;
                        _a.label = 1;
                    case 1:
                        if (!(_i < metadataEntries_1.length)) return [3 /*break*/, 7];
                        entry = metadataEntries_1[_i];
                        if (!this._dirtyMetadata.has(entry.key)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.sdk.web3Client.transactContract(identityRegistry, 'setMetadata', {}, BigInt(tokenId), entry.key, entry.value)];
                    case 2:
                        txHash = _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.sdk.web3Client.waitForTransaction(txHash, constants_1.TIMEOUTS.TRANSACTION_WAIT)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_5 = _a.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Agent.prototype._collectMetadataForRegistration = function () {
        var entries = [];
        // Collect wallet address if set
        if (this.registrationFile.walletAddress && this.registrationFile.walletChainId) {
            var walletValue = "eip155:".concat(this.registrationFile.walletChainId, ":").concat(this.registrationFile.walletAddress);
            entries.push({
                key: 'agentWallet',
                value: new TextEncoder().encode(walletValue),
            });
        }
        // Collect custom metadata
        for (var _i = 0, _a = Object.entries(this.registrationFile.metadata); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            var valueBytes = void 0;
            if (typeof value === 'string') {
                valueBytes = new TextEncoder().encode(value);
            }
            else if (typeof value === 'number') {
                valueBytes = new TextEncoder().encode(value.toString());
            }
            else {
                valueBytes = new TextEncoder().encode(JSON.stringify(value));
            }
            entries.push({ key: key, value: valueBytes });
        }
        return entries;
    };
    Agent.prototype._extractAgentIdFromReceipt = function (receipt) {
        // Parse events from receipt to find Registered event
        var identityRegistry = this.sdk.getIdentityRegistry();
        var transferEventTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'; // Transfer(address,address,uint256)
        // Find the event in the logs
        for (var _i = 0, _a = receipt.logs || []; _i < _a.length; _i++) {
            var log = _a[_i];
            try {
                // Try parsing as Registered event
                var parsed = identityRegistry.interface.parseLog({
                    topics: Array.isArray(log.topics) ? log.topics.map(function (t) { return typeof t === 'string' ? t : ethers_1.ethers.hexlify(t); }) : log.topics || [],
                    data: typeof log.data === 'string' ? log.data : ethers_1.ethers.hexlify(log.data || '0x'),
                });
                if (parsed && parsed.name === 'Registered') {
                    return BigInt(parsed.args.agentId.toString());
                }
            }
            catch (_b) {
                // Not a Registered event, try Transfer event MP (ERC-721)
                try {
                    var topics = Array.isArray(log.topics) ? log.topics : [];
                    // Transfer event has topic[0] = Transfer signature, topic[3] = tokenId (if 4 topics)
                    if (topics.length >= 4) {
                        var topic0 = typeof topics[0] === 'string' ? topics[0] : topics[0].toString();
                        if (topic0 === transferEventTopic || topic0.toLowerCase() === transferEventTopic.toLowerCase()) {
                            // Extract tokenId from topic[3]
                            var tokenIdHex = typeof topics[3] === 'string' ? topics[3] : topics[3].toString();
                            // Remove 0x prefix if present and convert
                            var tokenIdStr = tokenIdHex.startsWith('0x') ? tokenIdHex.slice(2) : tokenIdHex;
                            return BigInt('0x' + tokenIdStr);
                        }
                    }
                }
                catch (_c) {
                    // Continue searching
                }
            }
        }
        // Fallback: try to get total supply and use latest token ID
        // Note: This is async but we're in a sync method, so we'll try to call but it might not work
        // Better to throw error and let caller handle
        throw new Error('Could not extract agent ID from transaction receipt - no Registered or Transfer event found');
    };
    return Agent;
}());
exports.Agent = Agent;
