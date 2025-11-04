"use strict";
/**
 * IPFS client for decentralized storage with support for multiple providers:
 * - Local IPFS nodes (via ipfs-http-client)
 * - Pinata IPFS pinning service
 * - Filecoin Pin service
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPFSClient = void 0;
var constants_1 = require("../utils/constants");
/**
 * Client for IPFS operations supporting multiple providers
 */
var IPFSClient = /** @class */ (function () {
    function IPFSClient(config) {
        this.config = config;
        // Determine provider
        if (config.pinataEnabled) {
            this.provider = 'pinata';
            this._verifyPinataJwt();
        }
        else if (config.filecoinPinEnabled) {
            this.provider = 'filecoinPin';
            // Note: Filecoin Pin in TypeScript requires external CLI or API
            // We'll use HTTP API if available, otherwise throw error
        }
        else if (config.url) {
            this.provider = 'node';
            // Lazy initialization - client will be created on first use
        }
        else {
            throw new Error('No IPFS provider configured. Specify url, pinataEnabled, or filecoinPinEnabled.');
        }
    }
    /**
     * Initialize IPFS HTTP client (lazy, only when needed)
     */
    IPFSClient.prototype._ensureClient = function () {
        return __awaiter(this, void 0, void 0, function () {
            var create;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.provider === 'node' && !this.client && this.config.url)) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('ipfs-http-client'); })];
                    case 1:
                        create = (_a.sent()).create;
                        this.client = create({ url: this.config.url });
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    IPFSClient.prototype._verifyPinataJwt = function () {
        if (!this.config.pinataJwt) {
            throw new Error('pinataJwt is required when pinataEnabled=true');
        }
    };
    /**
     * Pin data to Pinata using v3 API
     */
    IPFSClient.prototype._pinToPinata = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var url, headers, blob, formData, controller_1, timeoutId, response, errorText, result, cid, error_1, errorMessage;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        url = 'https://uploads.pinata.cloud/v3/files';
                        headers = {
                            Authorization: "Bearer ".concat(this.config.pinataJwt),
                        };
                        blob = new Blob([data], { type: 'application/json' });
                        formData = new FormData();
                        formData.append('file', blob, 'registration.json');
                        formData.append('network', 'public');
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        controller_1 = new AbortController();
                        timeoutId = setTimeout(function () { return controller_1.abort(); }, constants_1.TIMEOUTS.PINATA_UPLOAD);
                        return [4 /*yield*/, fetch(url, {
                                method: 'POST',
                                headers: headers,
                                body: formData,
                                signal: controller_1.signal,
                            })];
                    case 2:
                        response = _b.sent();
                        clearTimeout(timeoutId);
                        if (!!response.ok) return [3 /*break*/, 4];
                        return [4 /*yield*/, response.text()];
                    case 3:
                        errorText = _b.sent();
                        throw new Error("Failed to pin to Pinata: HTTP ".concat(response.status, " - ").concat(errorText));
                    case 4: return [4 /*yield*/, response.json()];
                    case 5:
                        result = _b.sent();
                        cid = ((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.cid) || (result === null || result === void 0 ? void 0 : result.cid) || (result === null || result === void 0 ? void 0 : result.IpfsHash);
                        if (!cid) {
                            throw new Error("No CID returned from Pinata. Response: ".concat(JSON.stringify(result)));
                        }
                        return [2 /*return*/, cid];
                    case 6:
                        error_1 = _b.sent();
                        if (error_1 instanceof Error && error_1.name === 'AbortError') {
                            throw new Error("Pinata upload timed out after ".concat(constants_1.TIMEOUTS.PINATA_UPLOAD / 1000, " seconds"));
                        }
                        errorMessage = error_1 instanceof Error ? error_1.message : String(error_1);
                        throw new Error("Failed to pin to Pinata: ".concat(errorMessage));
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Pin data to Filecoin Pin
     * Note: This requires the Filecoin Pin API or CLI to be available
     * For now, we'll throw an error directing users to use the CLI
     */
    IPFSClient.prototype._pinToFilecoin = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Filecoin Pin typically requires CLI or API access
                // This is a placeholder - in production, you'd call the Filecoin Pin API
                throw new Error('Filecoin Pin via TypeScript SDK not yet fully implemented. ' +
                    'Please use the filecoin-pin CLI or implement the Filecoin Pin API integration.');
            });
        });
    };
    /**
     * Pin data to local IPFS node
     */
    IPFSClient.prototype._pinToLocalIpfs = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._ensureClient()];
                    case 1:
                        _a.sent();
                        if (!this.client) {
                            throw new Error('No IPFS client available');
                        }
                        return [4 /*yield*/, this.client.add(data)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result.cid.toString()];
                }
            });
        });
    };
    /**
     * Add data to IPFS and return CID
     */
    IPFSClient.prototype.add = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        if (!(this.provider === 'pinata')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._pinToPinata(data)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        if (!(this.provider === 'filecoinPin')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._pinToFilecoin(data)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [4 /*yield*/, this._pinToLocalIpfs(data)];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_2 = _a.sent();
                        throw error_2;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Add file to IPFS and return CID
     * Note: This method works in Node.js environments. For browser, use add() with file content directly.
     */
    IPFSClient.prototype.addFile = function (filepath) {
        return __awaiter(this, void 0, void 0, function () {
            var fs, data, fileContent, result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // Check if we're in Node.js environment
                        if (typeof process === 'undefined' || !((_a = process.versions) === null || _a === void 0 ? void 0 : _a.node)) {
                            throw new Error('addFile() is only available in Node.js environments. ' +
                                'For browser environments, use add() with file content directly.');
                        }
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('fs'); })];
                    case 1:
                        fs = _b.sent();
                        data = fs.readFileSync(filepath, 'utf-8');
                        if (!(this.provider === 'pinata')) return [3 /*break*/, 2];
                        return [2 /*return*/, this._pinToPinata(data)];
                    case 2:
                        if (!(this.provider === 'filecoinPin')) return [3 /*break*/, 3];
                        return [2 /*return*/, this._pinToFilecoin(filepath)];
                    case 3: return [4 /*yield*/, this._ensureClient()];
                    case 4:
                        _b.sent();
                        if (!this.client) {
                            throw new Error('No IPFS client available');
                        }
                        fileContent = fs.readFileSync(filepath);
                        return [4 /*yield*/, this.client.add(fileContent)];
                    case 5:
                        result = _b.sent();
                        return [2 /*return*/, result.cid.toString()];
                }
            });
        });
    };
    /**
     * Get data from IPFS by CID
     */
    IPFSClient.prototype.get = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            var gateways, promises, results, _i, results_1, result, chunks, _a, _b, _c, chunk, e_1_1, totalLength, result, offset, _d, chunks_1, chunk;
            var _this = this;
            var _e, e_1, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        // Extract CID from IPFS URL if needed
                        if (cid.startsWith('ipfs://')) {
                            cid = cid.slice(7); // Remove "ipfs://" prefix
                        }
                        if (!(this.provider === 'pinata' || this.provider === 'filecoinPin')) return [3 /*break*/, 2];
                        gateways = constants_1.IPFS_GATEWAYS.map(function (gateway) { return "".concat(gateway).concat(cid); });
                        promises = gateways.map(function (gateway) { return __awaiter(_this, void 0, void 0, function () {
                            var response, error_3;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 4, , 5]);
                                        return [4 /*yield*/, fetch(gateway, {
                                                signal: AbortSignal.timeout(constants_1.TIMEOUTS.IPFS_GATEWAY),
                                            })];
                                    case 1:
                                        response = _a.sent();
                                        if (!response.ok) return [3 /*break*/, 3];
                                        return [4 /*yield*/, response.text()];
                                    case 2: return [2 /*return*/, _a.sent()];
                                    case 3: throw new Error("HTTP ".concat(response.status));
                                    case 4:
                                        error_3 = _a.sent();
                                        throw error_3;
                                    case 5: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.allSettled(promises)];
                    case 1:
                        results = _h.sent();
                        for (_i = 0, results_1 = results; _i < results_1.length; _i++) {
                            result = results_1[_i];
                            if (result.status === 'fulfilled') {
                                return [2 /*return*/, result.value];
                            }
                        }
                        throw new Error('Failed to retrieve data from all IPFS gateways');
                    case 2: return [4 /*yield*/, this._ensureClient()];
                    case 3:
                        _h.sent();
                        if (!this.client) {
                            throw new Error('No IPFS client available');
                        }
                        chunks = [];
                        _h.label = 4;
                    case 4:
                        _h.trys.push([4, 9, 10, 15]);
                        _a = true, _b = __asyncValues(this.client.cat(cid));
                        _h.label = 5;
                    case 5: return [4 /*yield*/, _b.next()];
                    case 6:
                        if (!(_c = _h.sent(), _e = _c.done, !_e)) return [3 /*break*/, 8];
                        _g = _c.value;
                        _a = false;
                        chunk = _g;
                        chunks.push(chunk);
                        _h.label = 7;
                    case 7:
                        _a = true;
                        return [3 /*break*/, 5];
                    case 8: return [3 /*break*/, 15];
                    case 9:
                        e_1_1 = _h.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 15];
                    case 10:
                        _h.trys.push([10, , 13, 14]);
                        if (!(!_a && !_e && (_f = _b.return))) return [3 /*break*/, 12];
                        return [4 /*yield*/, _f.call(_b)];
                    case 11:
                        _h.sent();
                        _h.label = 12;
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 14: return [7 /*endfinally*/];
                    case 15:
                        totalLength = chunks.reduce(function (acc, chunk) { return acc + chunk.length; }, 0);
                        result = new Uint8Array(totalLength);
                        offset = 0;
                        for (_d = 0, chunks_1 = chunks; _d < chunks_1.length; _d++) {
                            chunk = chunks_1[_d];
                            result.set(chunk, offset);
                            offset += chunk.length;
                        }
                        return [2 /*return*/, new TextDecoder().decode(result)];
                }
            });
        });
    };
    /**
     * Get JSON data from IPFS by CID
     */
    IPFSClient.prototype.getJson = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get(cid)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, JSON.parse(data)];
                }
            });
        });
    };
    /**
     * Pin a CID to local node
     */
    IPFSClient.prototype.pin = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.provider === 'filecoinPin')) return [3 /*break*/, 1];
                        // Filecoin Pin automatically pins data, so this is a no-op
                        return [2 /*return*/, { pinned: [cid] }];
                    case 1: return [4 /*yield*/, this._ensureClient()];
                    case 2:
                        _a.sent();
                        if (!this.client) {
                            throw new Error('No IPFS client available');
                        }
                        return [4 /*yield*/, this.client.pin.add(cid)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { pinned: [cid] }];
                }
            });
        });
    };
    /**
     * Unpin a CID from local node
     */
    IPFSClient.prototype.unpin = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.provider === 'filecoinPin')) return [3 /*break*/, 1];
                        // Filecoin Pin doesn't support unpinning in the same way
                        return [2 /*return*/, { unpinned: [cid] }];
                    case 1: return [4 /*yield*/, this._ensureClient()];
                    case 2:
                        _a.sent();
                        if (!this.client) {
                            throw new Error('No IPFS client available');
                        }
                        return [4 /*yield*/, this.client.pin.rm(cid)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { unpinned: [cid] }];
                }
            });
        });
    };
    /**
     * Add JSON data to IPFS and return CID
     */
    IPFSClient.prototype.addJson = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var jsonStr;
            return __generator(this, function (_a) {
                jsonStr = JSON.stringify(data, null, 2);
                return [2 /*return*/, this.add(jsonStr)];
            });
        });
    };
    /**
     * Add registration file to IPFS and return CID
     */
    IPFSClient.prototype.addRegistrationFile = function (registrationFile, chainId, identityRegistryAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoints, _i, _a, ep, endpointDict, walletChainId, registrations, _b, tokenId, agentRegistry, data;
            return __generator(this, function (_c) {
                endpoints = [];
                for (_i = 0, _a = registrationFile.endpoints; _i < _a.length; _i++) {
                    ep = _a[_i];
                    endpointDict = {
                        name: ep.type, // EndpointType enum value (e.g., "MCP", "A2A")
                        endpoint: ep.value,
                    };
                    // Spread meta fields (version, mcpTools, mcpPrompts, etc.) into the endpoint dict
                    if (ep.meta) {
                        Object.assign(endpointDict, ep.meta);
                    }
                    endpoints.push(endpointDict);
                }
                // Add walletAddress as an endpoint if present
                if (registrationFile.walletAddress) {
                    walletChainId = registrationFile.walletChainId || chainId || 1;
                    endpoints.push({
                        name: 'agentWallet',
                        endpoint: "eip155:".concat(walletChainId, ":").concat(registrationFile.walletAddress),
                    });
                }
                registrations = [];
                if (registrationFile.agentId) {
                    _b = registrationFile.agentId.split(':'), tokenId = _b[2];
                    agentRegistry = chainId && identityRegistryAddress
                        ? "eip155:".concat(chainId, ":").concat(identityRegistryAddress)
                        : "eip155:1:{identityRegistry}";
                    registrations.push({
                        agentId: parseInt(tokenId, 10),
                        agentRegistry: agentRegistry,
                    });
                }
                data = __assign(__assign(__assign(__assign(__assign({ type: 'https://eips.ethereum.org/EIPS/eip-8004#registration-v1', name: registrationFile.name, description: registrationFile.description }, (registrationFile.image && { image: registrationFile.image })), { endpoints: endpoints }), (registrations.length > 0 && { registrations: registrations })), (registrationFile.trustModels.length > 0 && {
                    supportedTrusts: registrationFile.trustModels,
                })), { active: registrationFile.active, x402support: registrationFile.x402support });
                return [2 /*return*/, this.addJson(data)];
            });
        });
    };
    /**
     * Get registration file from IPFS by CID
     */
    IPFSClient.prototype.getRegistrationFile = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getJson(cid)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    /**
     * Close IPFS client connection
     */
    IPFSClient.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.client) {
                    // IPFS HTTP client doesn't have a close method in the same way
                    // But we can clear the reference
                    this.client = undefined;
                }
                return [2 /*return*/];
            });
        });
    };
    return IPFSClient;
}());
exports.IPFSClient = IPFSClient;
