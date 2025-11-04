"use strict";
/**
 * Subgraph client for querying The Graph network
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubgraphClient = void 0;
var graphql_request_1 = require("graphql-request");
var validation_1 = require("../utils/validation");
/**
 * Client for querying the subgraph GraphQL API
 */
var SubgraphClient = /** @class */ (function () {
    function SubgraphClient(subgraphUrl) {
        this.client = new graphql_request_1.GraphQLClient(subgraphUrl, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    /**
     * Execute a GraphQL query against the subgraph
     */
    SubgraphClient.prototype.query = function (query, variables) {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.request(query, variables || {})];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                    case 2:
                        error_1 = _a.sent();
                        throw new Error("Failed to query subgraph: ".concat(error_1));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Query agents from the subgraph
     */
    SubgraphClient.prototype.getAgents = function () {
        return __awaiter(this, arguments, void 0, function (options) {
            var _a, where, _b, first, _c, skip, _d, orderBy, _e, orderDirection, _f, includeRegistrationFile, supportedWhere, whereClause, conditions, _i, _g, _h, key, value, nestedConditions, _j, _k, _l, nestedKey, nestedValue, filterKey, regFileFragment, query, variables, data, error_2;
            var _this = this;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        _a = options.where, where = _a === void 0 ? {} : _a, _b = options.first, first = _b === void 0 ? 100 : _b, _c = options.skip, skip = _c === void 0 ? 0 : _c, _d = options.orderBy, orderBy = _d === void 0 ? 'createdAt' : _d, _e = options.orderDirection, orderDirection = _e === void 0 ? 'desc' : _e, _f = options.includeRegistrationFile, includeRegistrationFile = _f === void 0 ? true : _f;
                        supportedWhere = {};
                        if (where.agentId)
                            supportedWhere.agentId = where.agentId;
                        if (where.owner)
                            supportedWhere.owner = where.owner;
                        if (where.agentURI)
                            supportedWhere.agentURI = where.agentURI;
                        if (where.registrationFile_not !== undefined)
                            supportedWhere.registrationFile_not = where.registrationFile_not;
                        // Support nested registrationFile filters (pushed to subgraph level)
                        // Note: Python SDK uses "registrationFile_" (with underscore) for nested filters
                        if (where.registrationFile) {
                            supportedWhere.registrationFile_ = where.registrationFile;
                        }
                        if (where.registrationFile_) {
                            supportedWhere.registrationFile_ = where.registrationFile_;
                        }
                        whereClause = '';
                        if (Object.keys(supportedWhere).length > 0) {
                            conditions = [];
                            for (_i = 0, _g = Object.entries(supportedWhere); _i < _g.length; _i++) {
                                _h = _g[_i], key = _h[0], value = _h[1];
                                if ((key === 'registrationFile' || key === 'registrationFile_') && typeof value === 'object') {
                                    nestedConditions = [];
                                    for (_j = 0, _k = Object.entries(value); _j < _k.length; _j++) {
                                        _l = _k[_j], nestedKey = _l[0], nestedValue = _l[1];
                                        if (typeof nestedValue === 'boolean') {
                                            nestedConditions.push("".concat(nestedKey, ": ").concat(nestedValue.toString().toLowerCase()));
                                        }
                                        else if (typeof nestedValue === 'string') {
                                            nestedConditions.push("".concat(nestedKey, ": \"").concat(nestedValue, "\""));
                                        }
                                        else if (nestedValue === null) {
                                            if (nestedKey.endsWith('_not')) {
                                                nestedConditions.push("".concat(nestedKey, ": null"));
                                            }
                                            else {
                                                nestedConditions.push("".concat(nestedKey, "_not: null"));
                                            }
                                        }
                                    }
                                    if (nestedConditions.length > 0) {
                                        conditions.push("registrationFile_: { ".concat(nestedConditions.join(', '), " }"));
                                    }
                                }
                                else if (typeof value === 'boolean') {
                                    conditions.push("".concat(key, ": ").concat(value.toString().toLowerCase()));
                                }
                                else if (typeof value === 'string') {
                                    conditions.push("".concat(key, ": \"").concat(value, "\""));
                                }
                                else if (typeof value === 'number') {
                                    conditions.push("".concat(key, ": ").concat(value));
                                }
                                else if (Array.isArray(value)) {
                                    conditions.push("".concat(key, ": ").concat(JSON.stringify(value)));
                                }
                                else if (value === null) {
                                    filterKey = key.endsWith('_not') ? key : "".concat(key, "_not");
                                    conditions.push("".concat(filterKey, ": null"));
                                }
                            }
                            if (conditions.length > 0) {
                                whereClause = "where: { ".concat(conditions.join(', '), " }");
                            }
                        }
                        regFileFragment = includeRegistrationFile
                            ? "\n          registrationFile {\n            id\n            agentId\n            name\n            description\n            image\n            active\n            x402support\n            supportedTrusts\n            mcpEndpoint\n            mcpVersion\n            a2aEndpoint\n            a2aVersion\n            ens\n            did\n            agentWallet\n            agentWalletChainId\n            mcpTools\n            mcpPrompts\n            mcpResources\n            a2aSkills\n          }\n    "
                            : '';
                        query = "\n      query GetAgents($first: Int!, $skip: Int!, $orderBy: Agent_orderBy!, $orderDirection: OrderDirection!) {\n        agents(\n          ".concat(whereClause, "\n          first: $first\n          skip: $skip\n          orderBy: $orderBy\n          orderDirection: $orderDirection\n        ) {\n          id\n          chainId\n          agentId\n          owner\n          operators\n          agentURI\n          createdAt\n          updatedAt\n          ").concat(regFileFragment, "\n        }\n      }\n    ");
                        variables = {
                            first: first,
                            skip: skip,
                            orderBy: orderBy,
                            orderDirection: orderDirection.toLowerCase(),
                        };
                        _m.label = 1;
                    case 1:
                        _m.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.query(query, variables)];
                    case 2:
                        data = _m.sent();
                        return [2 /*return*/, (data.agents || []).map(function (agent) { return _this._transformAgent(agent); })];
                    case 3:
                        error_2 = _m.sent();
                        throw new Error("Failed to get agents from subgraph: ".concat(error_2));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get a single agent by ID
     */
    SubgraphClient.prototype.getAgentById = function (agentId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, data, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n      query GetAgent($agentId: String!) {\n        agent(id: $agentId) {\n          id\n          chainId\n          agentId\n          owner\n          operators\n          agentURI\n          createdAt\n          updatedAt\n          registrationFile {\n            id\n            agentId\n            name\n            description\n            image\n            active\n            x402support\n            supportedTrusts\n            mcpEndpoint\n            mcpVersion\n            a2aEndpoint\n            a2aVersion\n            ens\n            did\n            agentWallet\n            agentWalletChainId\n            mcpTools\n            mcpPrompts\n            mcpResources\n            a2aSkills\n          }\n        }\n      }\n    ";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.query(query, { agentId: agentId })];
                    case 2:
                        data = _a.sent();
                        if (!data.agent) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, this._transformAgent(data.agent)];
                    case 3:
                        error_3 = _a.sent();
                        throw new Error("Failed to get agent from subgraph: ".concat(error_3));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Transform raw subgraph agent data to AgentSummary
     */
    SubgraphClient.prototype._transformAgent = function (agent) {
        var _a, _b, _c, _d;
        // Fields from Agent entity
        var chainId = parseInt(((_a = agent.chainId) === null || _a === void 0 ? void 0 : _a.toString()) || '0', 10);
        var agentIdStr = agent.id || "".concat(chainId, ":").concat(((_b = agent.agentId) === null || _b === void 0 ? void 0 : _b.toString()) || '0');
        // Fields from AgentRegistrationFile (registrationFile)
        var regFile = agent.registrationFile;
        // Transform operators from Bytes array to Address array
        var operators = (agent.operators || []).map(function (op) {
            return typeof op === 'string' ? (0, validation_1.normalizeAddress)(op) : op;
        });
        return {
            chainId: chainId,
            agentId: agentIdStr,
            name: (regFile === null || regFile === void 0 ? void 0 : regFile.name) || '',
            image: (regFile === null || regFile === void 0 ? void 0 : regFile.image) || undefined,
            description: (regFile === null || regFile === void 0 ? void 0 : regFile.description) || '',
            owners: agent.owner ? [(0, validation_1.normalizeAddress)(agent.owner)] : [],
            operators: operators,
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
            active: (_c = regFile === null || regFile === void 0 ? void 0 : regFile.active) !== null && _c !== void 0 ? _c : false,
            x402support: (_d = regFile === null || regFile === void 0 ? void 0 : regFile.x402support) !== null && _d !== void 0 ? _d : false,
            extras: {},
        };
    };
    /**
     * Search agents with filters (delegates to getAgents with WHERE clause)
     * @param params Search parameters
     * @param first Maximum number of results to return (default: 100)
     * @param skip Number of results to skip for pagination (default: 0)
     */
    SubgraphClient.prototype.searchAgents = function (params_1) {
        return __awaiter(this, arguments, void 0, function (params, first, skip) {
            var where, registrationFileFilters, whereWithFilters, allAgents;
            if (first === void 0) { first = 100; }
            if (skip === void 0) { skip = 0; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        where = {
                            registrationFile_not: null // Only get agents with registration files
                        };
                        if (!(params.active !== undefined || params.mcp !== undefined || params.a2a !== undefined ||
                            params.x402support !== undefined || params.ens || params.walletAddress ||
                            params.supportedTrust || params.a2aSkills || params.mcpTools || params.name)) return [3 /*break*/, 2];
                        registrationFileFilters = {};
                        if (params.active !== undefined)
                            registrationFileFilters.active = params.active;
                        if (params.x402support !== undefined)
                            registrationFileFilters.x402support = params.x402support;
                        if (params.ens)
                            registrationFileFilters.ens = params.ens.toLowerCase();
                        if (params.walletAddress)
                            registrationFileFilters.agentWallet = params.walletAddress.toLowerCase();
                        if (params.mcp !== undefined) {
                            registrationFileFilters[params.mcp ? 'mcpEndpoint_not' : 'mcpEndpoint'] = null;
                        }
                        if (params.a2a !== undefined) {
                            registrationFileFilters[params.a2a ? 'a2aEndpoint_not' : 'a2aEndpoint'] = null;
                        }
                        whereWithFilters = {};
                        if (Object.keys(registrationFileFilters).length > 0) {
                            // Python SDK uses "registrationFile_" (with underscore) for nested filters
                            whereWithFilters.registrationFile_ = registrationFileFilters;
                        }
                        return [4 /*yield*/, this.getAgents({ where: whereWithFilters, first: first, skip: skip })];
                    case 1:
                        allAgents = _a.sent();
                        // Only filter client-side for fields that can't be filtered at subgraph level
                        // Fields already filtered at subgraph level: active, x402support, mcp, a2a, ens, walletAddress
                        return [2 /*return*/, allAgents.filter(function (agent) {
                                // Name filtering (substring search - not supported at subgraph level)
                                if (params.name && !agent.name.toLowerCase().includes(params.name.toLowerCase())) {
                                    return false;
                                }
                                // Array contains filtering (supportedTrust, a2aSkills, mcpTools) - these require array contains logic
                                if (params.supportedTrust && params.supportedTrust.length > 0) {
                                    var hasAllTrusts = params.supportedTrust.every(function (trust) {
                                        return agent.supportedTrusts.includes(trust);
                                    });
                                    if (!hasAllTrusts)
                                        return false;
                                }
                                if (params.a2aSkills && params.a2aSkills.length > 0) {
                                    var hasAllSkills = params.a2aSkills.every(function (skill) {
                                        return agent.a2aSkills.includes(skill);
                                    });
                                    if (!hasAllSkills)
                                        return false;
                                }
                                if (params.mcpTools && params.mcpTools.length > 0) {
                                    var hasAllTools = params.mcpTools.every(function (tool) {
                                        return agent.mcpTools.includes(tool);
                                    });
                                    if (!hasAllTools)
                                        return false;
                                }
                                return true;
                            })];
                    case 2: return [2 /*return*/, this.getAgents({ where: where, first: first, skip: skip })];
                }
            });
        });
    };
    /**
     * Search feedback with filters
     */
    SubgraphClient.prototype.searchFeedback = function (params_1) {
        return __awaiter(this, arguments, void 0, function (params, first, skip, orderBy, orderDirection) {
            var whereConditions, agentIds, reviewers, nonTagConditions, tagFilterCondition, tagWhereItems, _i, _a, tag, allConditionsTag1, allConditionsTag2, feedbackFileFilters, capabilities, skills, tasks, names, whereClause, query, result;
            if (first === void 0) { first = 100; }
            if (skip === void 0) { skip = 0; }
            if (orderBy === void 0) { orderBy = 'createdAt'; }
            if (orderDirection === void 0) { orderDirection = 'desc'; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        whereConditions = [];
                        if (params.agents && params.agents.length > 0) {
                            agentIds = params.agents.map(function (aid) { return "\"".concat(aid, "\""); }).join(', ');
                            whereConditions.push("agent_in: [".concat(agentIds, "]"));
                        }
                        if (params.reviewers && params.reviewers.length > 0) {
                            reviewers = params.reviewers.map(function (addr) { return "\"".concat(addr, "\""); }).join(', ');
                            whereConditions.push("clientAddress_in: [".concat(reviewers, "]"));
                        }
                        if (!params.includeRevoked) {
                            whereConditions.push('isRevoked: false');
                        }
                        nonTagConditions = __spreadArray([], whereConditions, true);
                        tagFilterCondition = null;
                        if (params.tags && params.tags.length > 0) {
                            tagWhereItems = [];
                            for (_i = 0, _a = params.tags; _i < _a.length; _i++) {
                                tag = _a[_i];
                                allConditionsTag1 = __spreadArray(__spreadArray([], nonTagConditions, true), ["tag1: \"".concat(tag, "\"")], false);
                                tagWhereItems.push("{ ".concat(allConditionsTag1.join(', '), " }"));
                                allConditionsTag2 = __spreadArray(__spreadArray([], nonTagConditions, true), ["tag2: \"".concat(tag, "\"")], false);
                                tagWhereItems.push("{ ".concat(allConditionsTag2.join(', '), " }"));
                            }
                            // Join all tag alternatives
                            tagFilterCondition = tagWhereItems.join(', ');
                        }
                        if (params.minScore !== undefined) {
                            whereConditions.push("score_gte: ".concat(params.minScore));
                        }
                        if (params.maxScore !== undefined) {
                            whereConditions.push("score_lte: ".concat(params.maxScore));
                        }
                        feedbackFileFilters = [];
                        if (params.capabilities && params.capabilities.length > 0) {
                            capabilities = params.capabilities.map(function (cap) { return "\"".concat(cap, "\""); }).join(', ');
                            feedbackFileFilters.push("capability_in: [".concat(capabilities, "]"));
                        }
                        if (params.skills && params.skills.length > 0) {
                            skills = params.skills.map(function (skill) { return "\"".concat(skill, "\""); }).join(', ');
                            feedbackFileFilters.push("skill_in: [".concat(skills, "]"));
                        }
                        if (params.tasks && params.tasks.length > 0) {
                            tasks = params.tasks.map(function (task) { return "\"".concat(task, "\""); }).join(', ');
                            feedbackFileFilters.push("task_in: [".concat(tasks, "]"));
                        }
                        if (params.names && params.names.length > 0) {
                            names = params.names.map(function (name) { return "\"".concat(name, "\""); }).join(', ');
                            feedbackFileFilters.push("name_in: [".concat(names, "]"));
                        }
                        if (feedbackFileFilters.length > 0) {
                            whereConditions.push("feedbackFile_: { ".concat(feedbackFileFilters.join(', '), " }"));
                        }
                        whereClause = '';
                        if (tagFilterCondition) {
                            // tagFilterCondition already contains properly formatted items
                            whereClause = "where: { or: [".concat(tagFilterCondition, "] }");
                        }
                        else if (whereConditions.length > 0) {
                            whereClause = "where: { ".concat(whereConditions.join(', '), " }");
                        }
                        query = "\n      {\n        feedbacks(\n          ".concat(whereClause, "\n          first: ").concat(first, "\n          skip: ").concat(skip, "\n          orderBy: ").concat(orderBy, "\n          orderDirection: ").concat(orderDirection, "\n        ) {\n          id\n          agent { id agentId chainId }\n          clientAddress\n          score\n          tag1\n          tag2\n          feedbackUri\n          feedbackURIType\n          feedbackHash\n          isRevoked\n          createdAt\n          revokedAt\n          feedbackFile {\n            id\n            feedbackId\n            text\n            capability\n            name\n            skill\n            task\n            context\n            proofOfPaymentFromAddress\n            proofOfPaymentToAddress\n            proofOfPaymentChainId\n            proofOfPaymentTxHash\n            tag1\n            tag2\n            createdAt\n          }\n          responses {\n            id\n            responder\n            responseUri\n            responseHash\n            createdAt\n          }\n        }\n      }\n    ");
                        return [4 /*yield*/, this.query(query)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, result.feedbacks || []];
                }
            });
        });
    };
    /**
     * Search agents filtered by reputation criteria
     */
    SubgraphClient.prototype.searchAgentsByReputation = function (agents_1, tags_1, reviewers_1, capabilities_1, skills_1, tasks_1, names_1, minAverageScore_1) {
        return __awaiter(this, arguments, void 0, function (agents, tags, reviewers, capabilities, skills, tasks, names, minAverageScore, includeRevoked, first, skip, orderBy, orderDirection) {
            var feedbackFilters, tagFilterItems, _i, tags_2, tag, reviewersList, feedbackFileFilters, capabilitiesList, skillsList, tasksList, namesList, agentWhere, feedbackWhere, feedbackQuery, feedbackResult, feedbacksData, agentIdsSet, _a, feedbacksData_1, fb, agentId, agentIdsList, agentIdsStr, error_4, agentFilters, agentIds, feedbackWhereForAgents, query, result, agentsResult, agentsWithScores, filteredAgents, error_5;
            var _b;
            if (includeRevoked === void 0) { includeRevoked = false; }
            if (first === void 0) { first = 100; }
            if (skip === void 0) { skip = 0; }
            if (orderBy === void 0) { orderBy = 'createdAt'; }
            if (orderDirection === void 0) { orderDirection = 'desc'; }
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        feedbackFilters = [];
                        if (!includeRevoked) {
                            feedbackFilters.push('isRevoked: false');
                        }
                        if (tags && tags.length > 0) {
                            tagFilterItems = [];
                            for (_i = 0, tags_2 = tags; _i < tags_2.length; _i++) {
                                tag = tags_2[_i];
                                tagFilterItems.push("{or: [{tag1: \"".concat(tag, "\"}, {tag2: \"").concat(tag, "\"}]}"));
                            }
                            feedbackFilters.push("or: [".concat(tagFilterItems.join(', '), "]"));
                        }
                        if (reviewers && reviewers.length > 0) {
                            reviewersList = reviewers.map(function (addr) { return "\"".concat(addr, "\""); }).join(', ');
                            feedbackFilters.push("clientAddress_in: [".concat(reviewersList, "]"));
                        }
                        feedbackFileFilters = [];
                        if (capabilities && capabilities.length > 0) {
                            capabilitiesList = capabilities.map(function (cap) { return "\"".concat(cap, "\""); }).join(', ');
                            feedbackFileFilters.push("capability_in: [".concat(capabilitiesList, "]"));
                        }
                        if (skills && skills.length > 0) {
                            skillsList = skills.map(function (skill) { return "\"".concat(skill, "\""); }).join(', ');
                            feedbackFileFilters.push("skill_in: [".concat(skillsList, "]"));
                        }
                        if (tasks && tasks.length > 0) {
                            tasksList = tasks.map(function (task) { return "\"".concat(task, "\""); }).join(', ');
                            feedbackFileFilters.push("task_in: [".concat(tasksList, "]"));
                        }
                        if (names && names.length > 0) {
                            namesList = names.map(function (name) { return "\"".concat(name, "\""); }).join(', ');
                            feedbackFileFilters.push("name_in: [".concat(namesList, "]"));
                        }
                        if (feedbackFileFilters.length > 0) {
                            feedbackFilters.push("feedbackFile_: { ".concat(feedbackFileFilters.join(', '), " }"));
                        }
                        agentWhere = '';
                        if (!(tags || capabilities || skills || tasks || names || reviewers)) return [3 /*break*/, 5];
                        feedbackWhere = feedbackFilters.length > 0
                            ? "{ ".concat(feedbackFilters.join(', '), " }")
                            : '{}';
                        feedbackQuery = "\n        {\n          feedbacks(\n            where: ".concat(feedbackWhere, "\n            first: 1000\n            skip: 0\n          ) {\n            agent {\n              id\n            }\n          }\n        }\n      ");
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.query(feedbackQuery)];
                    case 2:
                        feedbackResult = _c.sent();
                        feedbacksData = feedbackResult.feedbacks || [];
                        agentIdsSet = new Set();
                        for (_a = 0, feedbacksData_1 = feedbacksData; _a < feedbacksData_1.length; _a++) {
                            fb = feedbacksData_1[_a];
                            agentId = (_b = fb.agent) === null || _b === void 0 ? void 0 : _b.id;
                            if (agentId) {
                                agentIdsSet.add(agentId);
                            }
                        }
                        if (agentIdsSet.size === 0) {
                            // No agents have matching feedback
                            return [2 /*return*/, []];
                        }
                        agentIdsList = Array.from(agentIdsSet);
                        if (agents && agents.length > 0) {
                            agentIdsList = agentIdsList.filter(function (aid) { return agents.includes(aid); });
                            if (agentIdsList.length === 0) {
                                return [2 /*return*/, []];
                            }
                        }
                        agentIdsStr = agentIdsList.map(function (aid) { return "\"".concat(aid, "\""); }).join(', ');
                        agentWhere = "where: { id_in: [".concat(agentIdsStr, "] }");
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _c.sent();
                        // If feedback query fails, return empty
                        return [2 /*return*/, []];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        agentFilters = [];
                        if (agents && agents.length > 0) {
                            agentIds = agents.map(function (aid) { return "\"".concat(aid, "\""); }).join(', ');
                            agentFilters.push("id_in: [".concat(agentIds, "]"));
                        }
                        if (agentFilters.length > 0) {
                            agentWhere = "where: { ".concat(agentFilters.join(', '), " }");
                        }
                        _c.label = 6;
                    case 6:
                        feedbackWhereForAgents = feedbackFilters.length > 0
                            ? "{ ".concat(feedbackFilters.join(', '), " }")
                            : '{}';
                        query = "\n      {\n        agents(\n          ".concat(agentWhere, "\n          first: ").concat(first, "\n          skip: ").concat(skip, "\n          orderBy: ").concat(orderBy, "\n          orderDirection: ").concat(orderDirection, "\n        ) {\n          id\n          chainId\n          agentId\n          agentURI\n          agentURIType\n          owner\n          operators\n          createdAt\n          updatedAt\n          totalFeedback\n          lastActivity\n          registrationFile {\n            id\n            name\n            description\n            image\n            active\n            x402support\n            supportedTrusts\n            mcpEndpoint\n            mcpVersion\n            a2aEndpoint\n            a2aVersion\n            ens\n            did\n            agentWallet\n            agentWalletChainId\n            mcpTools\n            mcpPrompts\n            mcpResources\n            a2aSkills\n            createdAt\n          }\n          feedback(where: ").concat(feedbackWhereForAgents, ") {\n            score\n            isRevoked\n            feedbackFile {\n              capability\n              skill\n              task\n              name\n            }\n          }\n        }\n      }\n    ");
                        _c.label = 7;
                    case 7:
                        _c.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, this.query(query)];
                    case 8:
                        result = _c.sent();
                        agentsResult = result.agents || [];
                        agentsWithScores = agentsResult.map(function (agent) {
                            var feedbacks = agent.feedback || [];
                            var averageScore = null;
                            if (feedbacks.length > 0) {
                                var scores = feedbacks
                                    .filter(function (fb) { return fb.score > 0; })
                                    .map(function (fb) { return fb.score; });
                                if (scores.length > 0) {
                                    averageScore = scores.reduce(function (sum, score) { return sum + score; }, 0) / scores.length;
                                }
                            }
                            // Remove feedback array from result (not part of QueryAgent)
                            var feedback = agent.feedback, agentData = __rest(agent, ["feedback"]);
                            return __assign(__assign({}, agentData), { averageScore: averageScore });
                        });
                        filteredAgents = agentsWithScores;
                        if (minAverageScore !== undefined) {
                            filteredAgents = agentsWithScores.filter(function (agent) { return agent.averageScore !== null && agent.averageScore >= minAverageScore; });
                        }
                        return [2 /*return*/, filteredAgents];
                    case 9:
                        error_5 = _c.sent();
                        throw new Error("Subgraph reputation search failed: ".concat(error_5));
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return SubgraphClient;
}());
exports.SubgraphClient = SubgraphClient;
