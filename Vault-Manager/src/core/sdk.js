"use strict";
/**
 * Main SDK class for Agent0
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
exports.SDK = void 0;
var enums_1 = require("../models/enums");
var id_format_1 = require("../utils/id-format");
var constants_1 = require("../utils/constants");
var web3_client_1 = require("./web3-client");
var ipfs_client_1 = require("./ipfs-client");
var subgraph_client_1 = require("./subgraph-client");
var feedback_manager_1 = require("./feedback-manager");
var indexer_1 = require("./indexer");
var agent_1 = require("./agent");
var contracts_1 = require("./contracts");
/**
 * Main SDK class for Agent0
 */
var SDK = /** @class */ (function () {
    function SDK(config) {
        this._subgraphUrls = {};
        this._chainId = config.chainId;
        // Initialize Web3 client
        this._web3Client = new web3_client_1.Web3Client(config.rpcUrl, config.signer);
        // Note: chainId will be fetched asynchronously on first use
        // Resolve registry addresses
        var registryOverrides = config.registryOverrides || {};
        var defaultRegistries = contracts_1.DEFAULT_REGISTRIES[config.chainId] || {};
        this._registries = __assign(__assign({}, defaultRegistries), (registryOverrides[config.chainId] || {}));
        // Resolve subgraph URL
        if (config.subgraphOverrides) {
            Object.assign(this._subgraphUrls, config.subgraphOverrides);
        }
        var resolvedSubgraphUrl;
        if (config.chainId in this._subgraphUrls) {
            resolvedSubgraphUrl = this._subgraphUrls[config.chainId];
        }
        else if (config.chainId in contracts_1.DEFAULT_SUBGRAPH_URLS) {
            resolvedSubgraphUrl = contracts_1.DEFAULT_SUBGRAPH_URLS[config.chainId];
        }
        else if (config.subgraphUrl) {
            resolvedSubgraphUrl = config.subgraphUrl;
        }
        // Initialize subgraph client if URL available
        if (resolvedSubgraphUrl) {
            this._subgraphClient = new subgraph_client_1.SubgraphClient(resolvedSubgraphUrl);
        }
        // Initialize indexer
        this._indexer = new indexer_1.AgentIndexer(this._web3Client, this._subgraphClient);
        // Initialize IPFS client
        if (config.ipfs) {
            this._ipfsClient = this._initializeIpfsClient(config);
        }
        // Initialize feedback manager (will set registries after they're created)
        this._feedbackManager = new feedback_manager_1.FeedbackManager(this._web3Client, this._ipfsClient, undefined, // reputationRegistry - will be set lazily
        undefined, // identityRegistry - will be set lazily
        this._subgraphClient);
    }
    /**
     * Initialize IPFS client based on configuration
     */
    SDK.prototype._initializeIpfsClient = function (config) {
        if (!config.ipfs) {
            throw new Error('IPFS provider not specified');
        }
        var ipfsConfig = {};
        if (config.ipfs === 'node') {
            if (!config.ipfsNodeUrl) {
                throw new Error("ipfsNodeUrl is required when ipfs='node'");
            }
            ipfsConfig.url = config.ipfsNodeUrl;
        }
        else if (config.ipfs === 'filecoinPin') {
            if (!config.filecoinPrivateKey) {
                throw new Error("filecoinPrivateKey is required when ipfs='filecoinPin'");
            }
            ipfsConfig.filecoinPinEnabled = true;
            ipfsConfig.filecoinPrivateKey = config.filecoinPrivateKey;
        }
        else if (config.ipfs === 'pinata') {
            if (!config.pinataJwt) {
                throw new Error("pinataJwt is required when ipfs='pinata'");
            }
            ipfsConfig.pinataEnabled = true;
            ipfsConfig.pinataJwt = config.pinataJwt;
        }
        else {
            throw new Error("Invalid ipfs value: ".concat(config.ipfs, ". Must be 'node', 'filecoinPin', or 'pinata'"));
        }
        return new ipfs_client_1.IPFSClient(ipfsConfig);
    };
    /**
     * Get current chain ID
     */
    SDK.prototype.chainId = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._web3Client.chainId === 0n)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._web3Client.initialize()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, Number(this._web3Client.chainId)];
                }
            });
        });
    };
    /**
     * Get resolved registry addresses for current chain
     */
    SDK.prototype.registries = function () {
        return __assign({}, this._registries);
    };
    /**
     * Get identity registry contract
     */
    SDK.prototype.getIdentityRegistry = function () {
        if (!this._identityRegistry) {
            var address = this._registries.IDENTITY;
            if (!address) {
                throw new Error("No identity registry address for chain ".concat(this._chainId));
            }
            this._identityRegistry = this._web3Client.getContract(address, contracts_1.IDENTITY_REGISTRY_ABI);
        }
        return this._identityRegistry;
    };
    /**
     * Get reputation registry contract
     */
    SDK.prototype.getReputationRegistry = function () {
        if (!this._reputationRegistry) {
            var address = this._registries.REPUTATION;
            if (!address) {
                throw new Error("No reputation registry address for chain ".concat(this._chainId));
            }
            this._reputationRegistry = this._web3Client.getContract(address, contracts_1.REPUTATION_REGISTRY_ABI);
            // Update feedback manager
            this._feedbackManager.setReputationRegistry(this._reputationRegistry);
        }
        return this._reputationRegistry;
    };
    /**
     * Get validation registry contract
     */
    SDK.prototype.getValidationRegistry = function () {
        if (!this._validationRegistry) {
            var address = this._registries.VALIDATION;
            if (!address) {
                throw new Error("No validation registry address for chain ".concat(this._chainId));
            }
            this._validationRegistry = this._web3Client.getContract(address, contracts_1.VALIDATION_REGISTRY_ABI);
        }
        return this._validationRegistry;
    };
    Object.defineProperty(SDK.prototype, "isReadOnly", {
        /**
         * Check if SDK is in read-only mode (no signer)
         */
        get: function () {
            return !this._web3Client.address;
        },
        enumerable: false,
        configurable: true
    });
    // Agent lifecycle methods
    /**
     * Create a new agent (off-chain object in memory)
     */
    SDK.prototype.createAgent = function (name, description, image) {
        var registrationFile = {
            name: name,
            description: description,
            image: image,
            endpoints: [],
            trustModels: [],
            owners: [],
            operators: [],
            active: false,
            x402support: false,
            metadata: {},
            updatedAt: Math.floor(Date.now() / 1000),
        };
        return new agent_1.Agent(this, registrationFile);
    };
    /**
     * Load an existing agent (hydrates from registration file if registered)
     */
    SDK.prototype.loadAgent = function (agentId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, chainId, tokenId, currentChainId, tokenUri, identityRegistry, error_1, errorMessage, registrationFile;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = (0, id_format_1.parseAgentId)(agentId), chainId = _a.chainId, tokenId = _a.tokenId;
                        return [4 /*yield*/, this.chainId()];
                    case 1:
                        currentChainId = _b.sent();
                        if (chainId !== currentChainId) {
                            throw new Error("Agent ".concat(agentId, " is not on current chain ").concat(currentChainId));
                        }
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        identityRegistry = this.getIdentityRegistry();
                        return [4 /*yield*/, this._web3Client.callContract(identityRegistry, 'tokenURI', BigInt(tokenId))];
                    case 3:
                        tokenUri = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _b.sent();
                        errorMessage = error_1 instanceof Error ? error_1.message : String(error_1);
                        throw new Error("Failed to load agent ".concat(agentId, ": ").concat(errorMessage));
                    case 5:
                        if (!(!tokenUri || tokenUri === '')) return [3 /*break*/, 6];
                        // Agent registered but no URI set yet - create empty registration file
                        registrationFile = this._createEmptyRegistrationFile();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this._loadRegistrationFile(tokenUri)];
                    case 7:
                        registrationFile = _b.sent();
                        _b.label = 8;
                    case 8:
                        registrationFile.agentId = agentId;
                        registrationFile.agentURI = tokenUri || undefined;
                        return [2 /*return*/, new agent_1.Agent(this, registrationFile)];
                }
            });
        });
    };
    /**
     * Get agent summary from subgraph (read-only)
     */
    SDK.prototype.getAgent = function (agentId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this._subgraphClient) {
                    throw new Error('Subgraph client required for getAgent');
                }
                return [2 /*return*/, this._subgraphClient.getAgentById(agentId)];
            });
        });
    };
    /**
     * Search agents with filters
     */
    SDK.prototype.searchAgents = function (params_1, sort_1) {
        return __awaiter(this, arguments, void 0, function (params, sort, pageSize, cursor) {
            var searchParams;
            if (pageSize === void 0) { pageSize = 50; }
            return __generator(this, function (_a) {
                searchParams = params || {};
                return [2 /*return*/, this._indexer.searchAgents(searchParams, pageSize, cursor)];
            });
        });
    };
    /**
     * Search agents by reputation
     */
    SDK.prototype.searchAgentsByReputation = function (agents_1, tags_1, reviewers_1, capabilities_1, skills_1, tasks_1, names_1, minAverageScore_1) {
        return __awaiter(this, arguments, void 0, function (agents, tags, reviewers, capabilities, skills, tasks, names, minAverageScore, includeRevoked, pageSize, cursor, sort) {
            var skip;
            if (includeRevoked === void 0) { includeRevoked = false; }
            if (pageSize === void 0) { pageSize = 50; }
            return __generator(this, function (_a) {
                skip = 0;
                if (cursor) {
                    try {
                        skip = parseInt(cursor, 10);
                    }
                    catch (_b) {
                        skip = 0;
                    }
                }
                // Default sort
                if (!sort) {
                    sort = ['createdAt:desc'];
                }
                return [2 /*return*/, this._indexer.searchAgentsByReputation(agents, tags, reviewers, capabilities, skills, tasks, names, minAverageScore, includeRevoked, pageSize, skip, sort)];
            });
        });
    };
    /**
     * Transfer agent ownership
     */
    SDK.prototype.transferAgent = function (agentId, newOwner) {
        return __awaiter(this, void 0, void 0, function () {
            var agent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadAgent(agentId)];
                    case 1:
                        agent = _a.sent();
                        return [2 /*return*/, agent.transfer(newOwner)];
                }
            });
        });
    };
    /**
     * Check if address is agent owner
     */
    SDK.prototype.isAgentOwner = function (agentId, address) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenId, identityRegistry, owner;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenId = (0, id_format_1.parseAgentId)(agentId).tokenId;
                        identityRegistry = this.getIdentityRegistry();
                        return [4 /*yield*/, this._web3Client.callContract(identityRegistry, 'ownerOf', BigInt(tokenId))];
                    case 1:
                        owner = _a.sent();
                        return [2 /*return*/, owner.toLowerCase() === address.toLowerCase()];
                }
            });
        });
    };
    /**
     * Get agent owner
     */
    SDK.prototype.getAgentOwner = function (agentId) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenId, identityRegistry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tokenId = (0, id_format_1.parseAgentId)(agentId).tokenId;
                        identityRegistry = this.getIdentityRegistry();
                        return [4 /*yield*/, this._web3Client.callContract(identityRegistry, 'ownerOf', BigInt(tokenId))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Feedback methods
    /**
     * Sign feedback authorization for a client
     */
    SDK.prototype.signFeedbackAuth = function (agentId_1, clientAddress_1, indexLimit_1) {
        return __awaiter(this, arguments, void 0, function (agentId, clientAddress, indexLimit, expiryHours) {
            if (expiryHours === void 0) { expiryHours = 24; }
            return __generator(this, function (_a) {
                // Update feedback manager with registries
                this._feedbackManager.setReputationRegistry(this.getReputationRegistry());
                this._feedbackManager.setIdentityRegistry(this.getIdentityRegistry());
                return [2 /*return*/, this._feedbackManager.signFeedbackAuth(agentId, clientAddress, indexLimit, expiryHours)];
            });
        });
    };
    /**
     * Prepare feedback file
     */
    SDK.prototype.prepareFeedback = function (agentId, score, tags, text, capability, name, skill, task, context, proofOfPayment, extra) {
        return this._feedbackManager.prepareFeedback(agentId, score, tags, text, capability, name, skill, task, context, proofOfPayment, extra);
    };
    /**
     * Give feedback
     */
    SDK.prototype.giveFeedback = function (agentId, feedbackFile, feedbackAuth) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Update feedback manager with registries
                this._feedbackManager.setReputationRegistry(this.getReputationRegistry());
                this._feedbackManager.setIdentityRegistry(this.getIdentityRegistry());
                return [2 /*return*/, this._feedbackManager.giveFeedback(agentId, feedbackFile, undefined, feedbackAuth)];
            });
        });
    };
    /**
     * Read feedback
     */
    SDK.prototype.getFeedback = function (agentId, clientAddress, feedbackIndex) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this._feedbackManager.getFeedback(agentId, clientAddress, feedbackIndex)];
            });
        });
    };
    /**
     * Search feedback
     */
    SDK.prototype.searchFeedback = function (agentId, tags, capabilities, skills, minScore, maxScore) {
        return __awaiter(this, void 0, void 0, function () {
            var params;
            return __generator(this, function (_a) {
                params = {
                    agents: [agentId],
                    tags: tags,
                    capabilities: capabilities,
                    skills: skills,
                    minScore: minScore,
                    maxScore: maxScore,
                };
                return [2 /*return*/, this._feedbackManager.searchFeedback(params)];
            });
        });
    };
    /**
     * Append response to feedback
     */
    SDK.prototype.appendResponse = function (agentId, clientAddress, feedbackIndex, response) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Update feedback manager with registries
                this._feedbackManager.setReputationRegistry(this.getReputationRegistry());
                return [2 /*return*/, this._feedbackManager.appendResponse(agentId, clientAddress, feedbackIndex, response.uri, response.hash)];
            });
        });
    };
    /**
     * Revoke feedback
     */
    SDK.prototype.revokeFeedback = function (agentId, feedbackIndex) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Update feedback manager with registries
                this._feedbackManager.setReputationRegistry(this.getReputationRegistry());
                return [2 /*return*/, this._feedbackManager.revokeFeedback(agentId, feedbackIndex)];
            });
        });
    };
    /**
     * Get reputation summary
     */
    SDK.prototype.getReputationSummary = function (agentId, tag1, tag2) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Update feedback manager with registries
                this._feedbackManager.setReputationRegistry(this.getReputationRegistry());
                return [2 /*return*/, this._feedbackManager.getReputationSummary(agentId, tag1, tag2)];
            });
        });
    };
    /**
     * Create an empty registration file structure
     */
    SDK.prototype._createEmptyRegistrationFile = function () {
        return {
            name: '',
            description: '',
            endpoints: [],
            trustModels: [],
            owners: [],
            operators: [],
            active: false,
            x402support: false,
            metadata: {},
            updatedAt: Math.floor(Date.now() / 1000),
        };
    };
    /**
     * Private helper methods
     */
    SDK.prototype._loadRegistrationFile = function (tokenUri) {
        return __awaiter(this, void 0, void 0, function () {
            var rawData, cid_1, gateways, fetched, _i, gateways_1, gateway, response, _a, response, error_2, errorMessage;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 17, , 18]);
                        rawData = void 0;
                        if (!tokenUri.startsWith('ipfs://')) return [3 /*break*/, 12];
                        cid_1 = tokenUri.slice(7);
                        if (!this._ipfsClient) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._ipfsClient.getJson(cid_1)];
                    case 1:
                        // Use IPFS client if available
                        rawData = _b.sent();
                        return [3 /*break*/, 11];
                    case 2:
                        gateways = constants_1.IPFS_GATEWAYS.map(function (gateway) { return "".concat(gateway).concat(cid_1); });
                        fetched = false;
                        _i = 0, gateways_1 = gateways;
                        _b.label = 3;
                    case 3:
                        if (!(_i < gateways_1.length)) return [3 /*break*/, 10];
                        gateway = gateways_1[_i];
                        _b.label = 4;
                    case 4:
                        _b.trys.push([4, 8, , 9]);
                        return [4 /*yield*/, fetch(gateway, {
                                signal: AbortSignal.timeout(constants_1.TIMEOUTS.IPFS_GATEWAY),
                            })];
                    case 5:
                        response = _b.sent();
                        if (!response.ok) return [3 /*break*/, 7];
                        return [4 /*yield*/, response.json()];
                    case 6:
                        rawData = _b.sent();
                        fetched = true;
                        return [3 /*break*/, 10];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        _a = _b.sent();
                        return [3 /*break*/, 9];
                    case 9:
                        _i++;
                        return [3 /*break*/, 3];
                    case 10:
                        if (!fetched) {
                            throw new Error('Failed to retrieve data from all IPFS gateways');
                        }
                        _b.label = 11;
                    case 11: return [3 /*break*/, 16];
                    case 12:
                        if (!(tokenUri.startsWith('http://') || tokenUri.startsWith('https://'))) return [3 /*break*/, 15];
                        return [4 /*yield*/, fetch(tokenUri)];
                    case 13:
                        response = _b.sent();
                        if (!response.ok) {
                            throw new Error("Failed to fetch registration file: HTTP ".concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 14:
                        rawData = _b.sent();
                        return [3 /*break*/, 16];
                    case 15:
                        if (tokenUri.startsWith('data:')) {
                            // Data URIs are not supported
                            throw new Error("Data URIs are not supported. Expected HTTP(S) or IPFS URI, got: ".concat(tokenUri));
                        }
                        else if (!tokenUri || tokenUri.trim() === '') {
                            // Empty URI - return empty registration file (agent registered without URI)
                            return [2 /*return*/, this._createEmptyRegistrationFile()];
                        }
                        else {
                            throw new Error("Unsupported URI scheme: ".concat(tokenUri));
                        }
                        _b.label = 16;
                    case 16:
                        // Validate rawData is an object before transformation
                        if (typeof rawData !== 'object' || rawData === null || Array.isArray(rawData)) {
                            throw new Error('Invalid registration file format: expected an object');
                        }
                        // Transform IPFS/HTTP file format to RegistrationFile format
                        return [2 /*return*/, this._transformRegistrationFile(rawData)];
                    case 17:
                        error_2 = _b.sent();
                        errorMessage = error_2 instanceof Error ? error_2.message : String(error_2);
                        throw new Error("Failed to load registration file: ".concat(errorMessage));
                    case 18: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Transform raw registration file (from IPFS/HTTP) to RegistrationFile format
     * Accepts raw JSON data which may have legacy format or new format
     */
    SDK.prototype._transformRegistrationFile = function (rawData) {
        var endpoints = this._transformEndpoints(rawData);
        var _a = this._extractWalletInfo(rawData), walletAddress = _a.walletAddress, walletChainId = _a.walletChainId;
        // Extract trust models with proper type checking
        var trustModels = Array.isArray(rawData.supportedTrust)
            ? rawData.supportedTrust
            : Array.isArray(rawData.trustModels)
                ? rawData.trustModels
                : [];
        return {
            name: typeof rawData.name === 'string' ? rawData.name : '',
            description: typeof rawData.description === 'string' ? rawData.description : '',
            image: typeof rawData.image === 'string' ? rawData.image : undefined,
            endpoints: endpoints,
            trustModels: trustModels,
            owners: Array.isArray(rawData.owners) ? rawData.owners.filter(function (o) { return typeof o === 'string'; }) : [],
            operators: Array.isArray(rawData.operators) ? rawData.operators.filter(function (o) { return typeof o === 'string'; }) : [],
            active: typeof rawData.active === 'boolean' ? rawData.active : false,
            x402support: typeof rawData.x402support === 'boolean' ? rawData.x402support : false,
            metadata: typeof rawData.metadata === 'object' && rawData.metadata !== null && !Array.isArray(rawData.metadata)
                ? rawData.metadata
                : {},
            updatedAt: typeof rawData.updatedAt === 'number' ? rawData.updatedAt : Math.floor(Date.now() / 1000),
            walletAddress: walletAddress,
            walletChainId: walletChainId,
        };
    };
    /**
     * Transform endpoints from old format { name, endpoint, version } to new format { type, value, meta }
     */
    SDK.prototype._transformEndpoints = function (rawData) {
        var endpoints = [];
        if (!rawData.endpoints || !Array.isArray(rawData.endpoints)) {
            return endpoints;
        }
        for (var _i = 0, _a = rawData.endpoints; _i < _a.length; _i++) {
            var ep = _a[_i];
            // Check if it's already in the new format
            if (ep.type && ep.value !== undefined) {
                endpoints.push({
                    type: ep.type,
                    value: ep.value,
                    meta: ep.meta,
                });
            }
            else {
                // Transform from old format
                var transformed = this._transformEndpointLegacy(ep, rawData);
                if (transformed) {
                    endpoints.push(transformed);
                }
            }
        }
        return endpoints;
    };
    /**
     * Transform a single endpoint from legacy format
     */
    SDK.prototype._transformEndpointLegacy = function (ep, rawData) {
        var name = typeof ep.name === 'string' ? ep.name : '';
        var value = typeof ep.endpoint === 'string' ? ep.endpoint : '';
        var version = typeof ep.version === 'string' ? ep.version : undefined;
        // Map endpoint names to types using case-insensitive lookup
        var nameLower = name.toLowerCase();
        var ENDPOINT_TYPE_MAP = {
            'mcp': enums_1.EndpointType.MCP,
            'a2a': enums_1.EndpointType.A2A,
            'ens': enums_1.EndpointType.ENS,
            'did': enums_1.EndpointType.DID,
            'agentwallet': enums_1.EndpointType.WALLET,
            'wallet': enums_1.EndpointType.WALLET,
        };
        var type;
        if (ENDPOINT_TYPE_MAP[nameLower]) {
            type = ENDPOINT_TYPE_MAP[nameLower];
            // Special handling for wallet endpoints - parse eip155 format
            if (type === enums_1.EndpointType.WALLET) {
                var walletMatch = value.match(/eip155:(\d+):(0x[a-fA-F0-9]{40})/);
                if (walletMatch) {
                    rawData._walletAddress = walletMatch[2];
                    rawData._walletChainId = parseInt(walletMatch[1], 10);
                }
            }
        }
        else {
            type = name; // Fallback to name as type
        }
        return {
            type: type,
            value: value,
            meta: version ? { version: version } : undefined,
        };
    };
    /**
     * Extract wallet address and chain ID from raw data
     */
    SDK.prototype._extractWalletInfo = function (rawData) {
        // Priority: extracted from endpoints > direct fields
        if (typeof rawData._walletAddress === 'string' && typeof rawData._walletChainId === 'number') {
            return {
                walletAddress: rawData._walletAddress,
                walletChainId: rawData._walletChainId,
            };
        }
        if (typeof rawData.walletAddress === 'string' && typeof rawData.walletChainId === 'number') {
            return {
                walletAddress: rawData.walletAddress,
                walletChainId: rawData.walletChainId,
            };
        }
        return {};
    };
    Object.defineProperty(SDK.prototype, "web3Client", {
        // Expose clients for advanced usage
        get: function () {
            return this._web3Client;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SDK.prototype, "ipfsClient", {
        get: function () {
            return this._ipfsClient;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SDK.prototype, "subgraphClient", {
        get: function () {
            return this._subgraphClient;
        },
        enumerable: false,
        configurable: true
    });
    return SDK;
}());
exports.SDK = SDK;
