"use strict";
/**
 * Agent indexer for discovery and search functionality
 * Simplified version focused on subgraph queries (no local ML indexing)
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
exports.AgentIndexer = void 0;
var validation_1 = require("../utils/validation");
/**
 * Simplified indexer that primarily uses subgraph for queries
 * No local indexing or ML capabilities - all queries go through subgraph
 */
var AgentIndexer = /** @class */ (function () {
    function AgentIndexer(web3Client, subgraphClient) {
        this.web3Client = web3Client;
        this.subgraphClient = subgraphClient;
    }
    /**
     * Get agent summary from index/subgraph
     */
    AgentIndexer.prototype.getAgent = function (agentId) {
        return __awaiter(this, void 0, void 0, function () {
            var agent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.subgraphClient) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.subgraphClient.getAgentById(agentId)];
                    case 1:
                        agent = _a.sent();
                        if (agent) {
                            return [2 /*return*/, agent];
                        }
                        _a.label = 2;
                    case 2: 
                    // Fallback: would need to query blockchain directly
                    // For now, throw error if not in subgraph
                    throw new Error("Agent ".concat(agentId, " not found. Subgraph required for querying."));
                }
            });
        });
    };
    /**
     * Search agents with filters
     */
    AgentIndexer.prototype.searchAgents = function () {
        return __awaiter(this, arguments, void 0, function (params, pageSize, cursor) {
            var searchParams, skip, agents, hasMore, paginatedAgents, nextCursor;
            if (params === void 0) { params = {}; }
            if (pageSize === void 0) { pageSize = 50; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.subgraphClient) {
                            throw new Error('Subgraph client required for agent search');
                        }
                        searchParams = params || {};
                        skip = cursor ? parseInt(cursor, 10) : 0;
                        return [4 /*yield*/, this.subgraphClient.searchAgents(searchParams, pageSize + 1, skip)];
                    case 1:
                        agents = _a.sent();
                        // Apply any remaining client-side filtering (for complex filters like array contains)
                        agents = this._filterAgents(agents, searchParams);
                        hasMore = agents.length > pageSize;
                        paginatedAgents = hasMore ? agents.slice(0, pageSize) : agents;
                        nextCursor = hasMore ? String(skip + pageSize) : undefined;
                        return [2 /*return*/, {
                                items: paginatedAgents,
                                nextCursor: nextCursor,
                            }];
                }
            });
        });
    };
    AgentIndexer.prototype._filterAgents = function (agents, params) {
        var name = params.name, mcp = params.mcp, a2a = params.a2a, ens = params.ens, did = params.did, walletAddress = params.walletAddress, supportedTrust = params.supportedTrust, a2aSkills = params.a2aSkills, mcpTools = params.mcpTools, mcpPrompts = params.mcpPrompts, mcpResources = params.mcpResources, active = params.active, x402support = params.x402support, chains = params.chains;
        return agents.filter(function (agent) {
            var _a;
            // Filter by name (flattened from registrationFile)
            if (name && !((_a = agent.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(name.toLowerCase()))) {
                return false;
            }
            // Filter by MCP endpoint (flattened to agent.mcp boolean)
            if (mcp !== undefined && agent.mcp !== mcp) {
                return false;
            }
            // Filter by A2A endpoint (flattened to agent.a2a boolean)
            if (a2a !== undefined && agent.a2a !== a2a) {
                return false;
            }
            // Filter by ENS (flattened from registrationFile)
            if (ens && agent.ens && (0, validation_1.normalizeAddress)(agent.ens) !== (0, validation_1.normalizeAddress)(ens)) {
                return false;
            }
            // Filter by DID (flattened from registrationFile)
            if (did && agent.did !== did) {
                return false;
            }
            // Filter by wallet address (flattened from registrationFile)
            if (walletAddress && agent.walletAddress && (0, validation_1.normalizeAddress)(agent.walletAddress) !== (0, validation_1.normalizeAddress)(walletAddress)) {
                return false;
            }
            // Filter by supported trusts (flattened from registrationFile)
            if (supportedTrust && supportedTrust.length > 0) {
                var agentTrusts_1 = agent.supportedTrusts || [];
                if (!supportedTrust.some(function (trust) { return agentTrusts_1.includes(trust); })) {
                    return false;
                }
            }
            // Filter by A2A skills (flattened from registrationFile)
            if (a2aSkills && a2aSkills.length > 0) {
                var agentSkills_1 = agent.a2aSkills || [];
                if (!a2aSkills.some(function (skill) { return agentSkills_1.includes(skill); })) {
                    return false;
                }
            }
            // Filter by MCP tools (flattened from registrationFile)
            if (mcpTools && mcpTools.length > 0) {
                var agentTools_1 = agent.mcpTools || [];
                if (!mcpTools.some(function (tool) { return agentTools_1.includes(tool); })) {
                    return false;
                }
            }
            // Filter by MCP prompts (flattened from registrationFile)
            if (mcpPrompts && mcpPrompts.length > 0) {
                var agentPrompts_1 = agent.mcpPrompts || [];
                if (!mcpPrompts.some(function (prompt) { return agentPrompts_1.includes(prompt); })) {
                    return false;
                }
            }
            // Filter by MCP resources (flattened from registrationFile)
            if (mcpResources && mcpResources.length > 0) {
                var agentResources_1 = agent.mcpResources || [];
                if (!mcpResources.some(function (resource) { return agentResources_1.includes(resource); })) {
                    return false;
                }
            }
            // Filter by active status (flattened from registrationFile)
            if (active !== undefined && agent.active !== active) {
                return false;
            }
            // Filter by x402support (flattened from registrationFile)
            if (x402support !== undefined && agent.x402support !== x402support) {
                return false;
            }
            // Filter by chain
            if (chains && chains.length > 0 && !chains.includes(agent.chainId)) {
                return false;
            }
            return true;
        });
    };
    /**
     * Search agents by reputation
     */
    AgentIndexer.prototype.searchAgentsByReputation = function (agents_1, tags_1, reviewers_1, capabilities_1, skills_1, tasks_1, names_1, minAverageScore_1) {
        return __awaiter(this, arguments, void 0, function (agents, tags, reviewers, capabilities, skills, tasks, names, minAverageScore, includeRevoked, first, skip, sort) {
            var orderBy, orderDirection, sortField, agentsData, items, nextCursor, error_1;
            if (includeRevoked === void 0) { includeRevoked = false; }
            if (first === void 0) { first = 50; }
            if (skip === void 0) { skip = 0; }
            if (sort === void 0) { sort = ['createdAt:desc']; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.subgraphClient) {
                            throw new Error('Subgraph client required for reputation search');
                        }
                        orderBy = 'createdAt';
                        orderDirection = 'desc';
                        if (sort && sort.length > 0) {
                            sortField = sort[0].split(':');
                            orderBy = sortField[0] || orderBy;
                            orderDirection = sortField[1] || orderDirection;
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.subgraphClient.searchAgentsByReputation(agents, tags, reviewers, capabilities, skills, tasks, names, minAverageScore, includeRevoked, first, skip, orderBy, orderDirection)];
                    case 2:
                        agentsData = _a.sent();
                        items = agentsData.map(function (agent) {
                            var _a, _b, _c;
                            var regFile = agent.registrationFile;
                            return {
                                chainId: parseInt(((_a = agent.chainId) === null || _a === void 0 ? void 0 : _a.toString()) || '0', 10),
                                agentId: agent.id || '',
                                name: (regFile === null || regFile === void 0 ? void 0 : regFile.name) || '',
                                image: (regFile === null || regFile === void 0 ? void 0 : regFile.image) || undefined,
                                description: (regFile === null || regFile === void 0 ? void 0 : regFile.description) || '',
                                owners: agent.owner ? [(0, validation_1.normalizeAddress)(agent.owner)] : [],
                                operators: (agent.operators || []).map(function (op) { return (0, validation_1.normalizeAddress)(op); }),
                                mcp: !!(regFile === null || regFile === void 0 ? void 0 : regFile.mcpEndpoint),
                                a2a: !!(regFile === null || regFile === void 0 ? void 0 : regFile.a2aEndpoint),
                                ens: (regFile === null || regFile === void 0 ? void 0 : regFile.ens) || undefined,
                                did: (regFile === null || regFile === void 0 ? void 0 : regFile.did) || undefined,
                                walletAddress: (regFile === null || regFile === void 0 ? void 0 : regFile.agentWallet) ? (0, validation_1.normalizeAddress)(regFile.agentWallet) : undefined,
                                supportedTrusts: (regFile === null || regFile === void 0 ? void 0 : regFile.supportedTrusts) || [],
                                a2aSkills: (regFile === null || regFile === void 0 ? void 0 : regFile.a2aSkills) || [],
                                mcpTools: (regFile === null || regFile === void 0 ? void 0 : regFile.mcpTools) || [],
                                mcpPrompts: (regFile === null || regFile === void 0 ? void 0 : regFile.mcpPrompts) || [],
                                mcpResources: (regFile === null || regFile === void 0 ? void 0 : regFile.mcpResources) || [],
                                active: (_b = regFile === null || regFile === void 0 ? void 0 : regFile.active) !== null && _b !== void 0 ? _b : false,
                                x402support: (_c = regFile === null || regFile === void 0 ? void 0 : regFile.x402support) !== null && _c !== void 0 ? _c : false,
                                extras: {
                                    averageScore: agent.averageScore !== null ? agent.averageScore : undefined,
                                },
                            };
                        });
                        nextCursor = items.length === first ? String(skip + items.length) : undefined;
                        return [2 /*return*/, {
                                items: items,
                                nextCursor: nextCursor,
                            }];
                    case 3:
                        error_1 = _a.sent();
                        throw new Error("Failed to search agents by reputation: ".concat(error_1));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return AgentIndexer;
}());
exports.AgentIndexer = AgentIndexer;
