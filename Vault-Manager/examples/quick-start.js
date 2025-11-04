"use strict";
/**
 * Quick Start Example
 *
 * This example demonstrates how to:
 * 1. Initialize the SDK
 * 2. Create a new agent
 * 3. Configure endpoints and metadata
 * 4. Register the agent on-chain with IPFS
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
var index_1 = require("../src/index");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var sdk, agent, registrationFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sdk = new index_1.SDK({
                        chainId: 11155111, // Ethereum Sepolia
                        rpcUrl: process.env.RPC_URL || 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID',
                        signer: process.env.PRIVATE_KEY, // Optional: private key for signing transactions
                        ipfs: 'pinata', // or 'filecoinPin' or 'node'
                        pinataJwt: process.env.PINATA_JWT, // Required if ipfs='pinata'
                    });
                    agent = sdk.createAgent('My AI Assistant', 'An intelligent assistant that helps with various tasks. Skills: data analysis, finance, coding. Pricing: $0.01 per request.', 'https://example.com/agent-image.png');
                    // Configure MCP endpoint
                    return [4 /*yield*/, agent.setMCP('https://api.example.com/mcp', '2025-06-18')];
                case 1:
                    // Configure MCP endpoint
                    _a.sent();
                    // Configure A2A endpoint
                    return [4 /*yield*/, agent.setA2A('https://api.example.com/a2a', '0.30')];
                case 2:
                    // Configure A2A endpoint
                    _a.sent();
                    // Set agent wallet
                    agent.setAgentWallet('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', 11155111);
                    // Set trust models
                    agent.setTrust(true, false);
                    // Set custom metadata
                    agent.setMetadata({
                        version: '1.0.0',
                        tags: JSON.stringify(['data_analyst', 'finance']),
                        pricing: '0.01',
                    });
                    // Set active status
                    agent.setActive(true);
                    // Register agent on-chain with IPFS
                    console.log('Registering agent...');
                    return [4 /*yield*/, agent.registerIPFS()];
                case 3:
                    registrationFile = _a.sent();
                    console.log("Agent registered with ID: ".concat(registrationFile.agentId));
                    console.log("Registration file URI: ".concat(registrationFile.agentURI));
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(console.error);
