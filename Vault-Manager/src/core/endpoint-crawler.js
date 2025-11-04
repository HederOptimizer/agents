"use strict";
/**
 * Endpoint Crawler for MCP and A2A Servers
 * Automatically fetches capabilities (tools, prompts, resources, skills) from endpoints
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
exports.EndpointCrawler = void 0;
/**
 * Helper to create JSON-RPC request
 */
function createJsonRpcRequest(method, params, requestId) {
    if (requestId === void 0) { requestId = 1; }
    return {
        jsonrpc: '2.0',
        method: method,
        id: requestId,
        params: params || {},
    };
}
/**
 * Crawls MCP and A2A endpoints to fetch capabilities
 */
var EndpointCrawler = /** @class */ (function () {
    function EndpointCrawler(timeout) {
        if (timeout === void 0) { timeout = 5000; }
        this.timeout = timeout;
    }
    /**
     * Fetch MCP capabilities (tools, prompts, resources) from an MCP server
     */
    EndpointCrawler.prototype.fetchMcpCapabilities = function (endpoint) {
        return __awaiter(this, void 0, void 0, function () {
            var capabilities, agentcardUrl, response, data, result, error_1;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        // Ensure endpoint is HTTP/HTTPS
                        if (!endpoint.startsWith('http://') && !endpoint.startsWith('https://')) {
                            // Invalid endpoint format - return null
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this._fetchViaJsonRpc(endpoint)];
                    case 1:
                        capabilities = _d.sent();
                        if (capabilities) {
                            return [2 /*return*/, capabilities];
                        }
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 6, , 7]);
                        agentcardUrl = "".concat(endpoint, "/agentcard.json");
                        return [4 /*yield*/, fetch(agentcardUrl, {
                                signal: AbortSignal.timeout(this.timeout),
                                redirect: 'follow',
                            })];
                    case 3:
                        response = _d.sent();
                        if (!response.ok) return [3 /*break*/, 5];
                        return [4 /*yield*/, response.json()];
                    case 4:
                        data = _d.sent();
                        result = {
                            mcpTools: this._extractList(data, 'tools'),
                            mcpPrompts: this._extractList(data, 'prompts'),
                            mcpResources: this._extractList(data, 'resources'),
                        };
                        if (((_a = result.mcpTools) === null || _a === void 0 ? void 0 : _a.length) || ((_b = result.mcpPrompts) === null || _b === void 0 ? void 0 : _b.length) || ((_c = result.mcpResources) === null || _c === void 0 ? void 0 : _c.length)) {
                            return [2 /*return*/, result];
                        }
                        _d.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _d.sent();
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * Try to fetch capabilities via JSON-RPC
     */
    EndpointCrawler.prototype._fetchViaJsonRpc = function (httpUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, tools, resources, prompts, mcpTools, mcpResources, mcpPrompts, toolsArray, _i, toolsArray_1, tool, resourcesArray, _b, resourcesArray_1, resource, promptsArray, _c, promptsArray_1, prompt_1, error_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Promise.all([
                                this._jsonRpcCall(httpUrl, 'tools/list'),
                                this._jsonRpcCall(httpUrl, 'resources/list'),
                                this._jsonRpcCall(httpUrl, 'prompts/list'),
                            ])];
                    case 1:
                        _a = _d.sent(), tools = _a[0], resources = _a[1], prompts = _a[2];
                        mcpTools = [];
                        mcpResources = [];
                        mcpPrompts = [];
                        // Extract names from tools
                        if (tools && typeof tools === 'object' && 'tools' in tools) {
                            toolsArray = tools.tools;
                            if (Array.isArray(toolsArray)) {
                                for (_i = 0, toolsArray_1 = toolsArray; _i < toolsArray_1.length; _i++) {
                                    tool = toolsArray_1[_i];
                                    if (tool && typeof tool === 'object' && 'name' in tool) {
                                        mcpTools.push(tool.name);
                                    }
                                }
                            }
                        }
                        // Extract names from resources
                        if (resources && typeof resources === 'object' && 'resources' in resources) {
                            resourcesArray = resources.resources;
                            if (Array.isArray(resourcesArray)) {
                                for (_b = 0, resourcesArray_1 = resourcesArray; _b < resourcesArray_1.length; _b++) {
                                    resource = resourcesArray_1[_b];
                                    if (resource && typeof resource === 'object' && 'name' in resource) {
                                        mcpResources.push(resource.name);
                                    }
                                }
                            }
                        }
                        // Extract names from prompts
                        if (prompts && typeof prompts === 'object' && 'prompts' in prompts) {
                            promptsArray = prompts.prompts;
                            if (Array.isArray(promptsArray)) {
                                for (_c = 0, promptsArray_1 = promptsArray; _c < promptsArray_1.length; _c++) {
                                    prompt_1 = promptsArray_1[_c];
                                    if (prompt_1 && typeof prompt_1 === 'object' && 'name' in prompt_1) {
                                        mcpPrompts.push(prompt_1.name);
                                    }
                                }
                            }
                        }
                        if (mcpTools.length || mcpResources.length || mcpPrompts.length) {
                            return [2 /*return*/, {
                                    mcpTools: mcpTools.length > 0 ? mcpTools : undefined,
                                    mcpResources: mcpResources.length > 0 ? mcpResources : undefined,
                                    mcpPrompts: mcpPrompts.length > 0 ? mcpPrompts : undefined,
                                }];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _d.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * Make a JSON-RPC call and return the result
     */
    EndpointCrawler.prototype._jsonRpcCall = function (url, method, params) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, response, contentType, text, result_1, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        payload = createJsonRpcRequest(method, params);
                        return [4 /*yield*/, fetch(url, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Accept: 'application/json, text/event-stream',
                                },
                                body: JSON.stringify(payload),
                                signal: AbortSignal.timeout(this.timeout),
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            return [2 /*return*/, null];
                        }
                        contentType = response.headers.get('content-type') || '';
                        return [4 /*yield*/, response.text()];
                    case 2:
                        text = _a.sent();
                        if (contentType.includes('text/event-stream') || text.includes('event: message')) {
                            result_1 = this._parseSseResponse(text);
                            if (result_1) {
                                return [2 /*return*/, result_1];
                            }
                        }
                        result = JSON.parse(text);
                        if (result.result !== undefined) {
                            return [2 /*return*/, result.result];
                        }
                        return [2 /*return*/, result];
                    case 3:
                        error_3 = _a.sent();
                        // JSON-RPC call failed - continue to next method
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Parse Server-Sent Events (SSE) format response
     */
    EndpointCrawler.prototype._parseSseResponse = function (sseText) {
        try {
            // Look for "data:" lines containing JSON
            var lines = sseText.split('\n');
            for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                var line = lines_1[_i];
                if (line.startsWith('data: ')) {
                    var jsonStr = line.slice(6); // Remove "data: " prefix
                    var data = JSON.parse(jsonStr);
                    if (data.result !== undefined) {
                        return data.result;
                    }
                    return data;
                }
            }
        }
        catch (error) {
            // Failed to parse SSE response - continue
        }
        return null;
    };
    /**
     * Fetch A2A capabilities (skills) from an A2A server
     */
    EndpointCrawler.prototype.fetchA2aCapabilities = function (endpoint) {
        return __awaiter(this, void 0, void 0, function () {
            var agentcardUrls, _i, agentcardUrls_1, agentcardUrl, response, data, skills, _a, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 9, , 10]);
                        // Ensure endpoint is HTTP/HTTPS
                        if (!endpoint.startsWith('http://') && !endpoint.startsWith('https://')) {
                            // Invalid endpoint format - skip
                            return [2 /*return*/, null];
                        }
                        agentcardUrls = [
                            "".concat(endpoint, "/agentcard.json"),
                            "".concat(endpoint, "/.well-known/agent.json"),
                            "".concat(endpoint.replace(/\/$/, ''), "/.well-known/agent.json"),
                        ];
                        _i = 0, agentcardUrls_1 = agentcardUrls;
                        _b.label = 1;
                    case 1:
                        if (!(_i < agentcardUrls_1.length)) return [3 /*break*/, 8];
                        agentcardUrl = agentcardUrls_1[_i];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, fetch(agentcardUrl, {
                                signal: AbortSignal.timeout(this.timeout),
                                redirect: 'follow',
                            })];
                    case 3:
                        response = _b.sent();
                        if (!response.ok) return [3 /*break*/, 5];
                        return [4 /*yield*/, response.json()];
                    case 4:
                        data = _b.sent();
                        skills = this._extractList(data, 'skills');
                        if (skills && skills.length > 0) {
                            return [2 /*return*/, { a2aSkills: skills }];
                        }
                        _b.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        _a = _b.sent();
                        // Try next URL
                        return [3 /*break*/, 7];
                    case 7:
                        _i++;
                        return [3 /*break*/, 1];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_4 = _b.sent();
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/, null];
                }
            });
        });
    };
    /**
     * Extract a list of strings from nested JSON data
     */
    EndpointCrawler.prototype._extractList = function (data, key) {
        var result = [];
        // Try top-level key
        if (key in data && Array.isArray(data[key])) {
            for (var _i = 0, _a = data[key]; _i < _a.length; _i++) {
                var item = _a[_i];
                if (typeof item === 'string') {
                    result.push(item);
                }
                else if (item && typeof item === 'object') {
                    // For objects, try to extract name/id field
                    var nameFields = ['name', 'id', 'identifier', 'title'];
                    for (var _b = 0, nameFields_1 = nameFields; _b < nameFields_1.length; _b++) {
                        var nameField = nameFields_1[_b];
                        if (nameField in item && typeof item[nameField] === 'string') {
                            result.push(item[nameField]);
                            break;
                        }
                    }
                }
            }
        }
        // Try nested in 'capabilities' or 'abilities'
        if (result.length === 0) {
            var containerKeys = ['capabilities', 'abilities', 'features'];
            for (var _c = 0, containerKeys_1 = containerKeys; _c < containerKeys_1.length; _c++) {
                var containerKey = containerKeys_1[_c];
                if (containerKey in data && data[containerKey] && typeof data[containerKey] === 'object') {
                    if (key in data[containerKey] && Array.isArray(data[containerKey][key])) {
                        for (var _d = 0, _e = data[containerKey][key]; _d < _e.length; _d++) {
                            var item = _e[_d];
                            if (typeof item === 'string') {
                                result.push(item);
                            }
                            else if (item && typeof item === 'object') {
                                var nameFields = ['name', 'id', 'identifier', 'title'];
                                for (var _f = 0, nameFields_2 = nameFields; _f < nameFields_2.length; _f++) {
                                    var nameField = nameFields_2[_f];
                                    if (nameField in item && typeof item[nameField] === 'string') {
                                        result.push(item[nameField]);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    if (result.length > 0) {
                        break;
                    }
                }
            }
        }
        return result;
    };
    return EndpointCrawler;
}());
exports.EndpointCrawler = EndpointCrawler;
