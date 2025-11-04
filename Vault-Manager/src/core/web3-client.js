"use strict";
/**
 * Web3 integration layer for smart contract interactions using ethers.js
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
exports.Web3Client = void 0;
var ethers_1 = require("ethers");
/**
 * Web3 client for interacting with ERC-8004 smart contracts
 */
var Web3Client = /** @class */ (function () {
    /**
     * Initialize Web3 client
     * @param rpcUrl - RPC endpoint URL
     * @param privateKey - Optional private key for signing transactions
     */
    function Web3Client(rpcUrl, privateKey) {
        this.provider = new ethers_1.ethers.JsonRpcProvider(rpcUrl);
        if (privateKey) {
            this.signer = new ethers_1.ethers.Wallet(privateKey, this.provider);
        }
        // Get chain ID asynchronously (will be set in async initialization)
        // For now, we'll fetch it when needed
        this.chainId = 0n;
    }
    /**
     * Initialize the client (fetch chain ID)
     */
    Web3Client.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var network;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.provider.getNetwork()];
                    case 1:
                        network = _a.sent();
                        this.chainId = network.chainId;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get contract instance
     */
    Web3Client.prototype.getContract = function (address, abi) {
        var signerOrProvider = this.signer || this.provider;
        return new ethers_1.ethers.Contract(address, abi, signerOrProvider);
    };
    /**
     * Call a contract method (view/pure function)
     */
    Web3Client.prototype.callContract = function (contract, methodName) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var method;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = contract[methodName];
                        if (!method || typeof method !== 'function') {
                            throw new Error("Method ".concat(methodName, " not found on contract"));
                        }
                        return [4 /*yield*/, method.apply(void 0, args)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Execute a contract transaction
     * For overloaded functions like register(), use registerAgent() wrapper instead
     */
    Web3Client.prototype.transactContract = function (contract_1, methodName_1) {
        return __awaiter(this, arguments, void 0, function (contract, methodName, options) {
            var _i, method, txOptions, tx, txResponse;
            if (options === void 0) { options = {}; }
            var args = [];
            for (_i = 3; _i < arguments.length; _i++) {
                args[_i - 3] = arguments[_i];
            }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.signer) {
                            throw new Error('Cannot execute transaction: SDK is in read-only mode. Provide a private key to enable write operations.');
                        }
                        // Special handling for register() function with multiple overloads
                        if (methodName === 'register') {
                            return [2 /*return*/, this.registerAgent.apply(this, __spreadArray([contract, options], args, false))];
                        }
                        method = contract[methodName];
                        if (!method || typeof method !== 'function') {
                            throw new Error("Method ".concat(methodName, " not found on contract"));
                        }
                        txOptions = Object.fromEntries(Object.entries(options).filter(function (_a) {
                            var _ = _a[0], value = _a[1];
                            return value !== undefined;
                        }));
                        return [4 /*yield*/, method.apply(void 0, args)];
                    case 1:
                        tx = _a.sent();
                        return [4 /*yield*/, tx];
                    case 2:
                        txResponse = _a.sent();
                        return [2 /*return*/, txResponse.hash];
                }
            });
        });
    };
    /**
     * Router wrapper for register() function overloads
     * Intelligently selects the correct overload based on arguments:
     * - register() - no arguments
     * - register(string tokenUri) - just tokenUri
     * - register(string tokenUri, tuple[] metadata) - tokenUri + metadata
     */
    Web3Client.prototype.registerAgent = function (contract, options) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var contractInterface, functionName, callArgs, functionFragment, data, txResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.signer) {
                            throw new Error('No signer available for transaction');
                        }
                        contractInterface = contract.interface;
                        if (args.length === 0) {
                            // register() - no arguments
                            functionName = 'register()';
                            callArgs = [];
                        }
                        else if (args.length === 1 && typeof args[0] === 'string') {
                            // register(string tokenUri) - just tokenUri
                            functionName = 'register(string)';
                            callArgs = [args[0]];
                        }
                        else if (args.length === 2 && typeof args[0] === 'string' && Array.isArray(args[1])) {
                            // register(string tokenUri, tuple[] metadata) - tokenUri + metadata
                            functionName = 'register(string,(string,bytes)[])';
                            callArgs = [args[0], args[1]];
                        }
                        else {
                            throw new Error("Invalid arguments for register(). Expected: () | (string) | (string, tuple[]), got ".concat(args.length, " arguments"));
                        }
                        functionFragment = contractInterface.getFunction(functionName);
                        if (!functionFragment) {
                            throw new Error("Function ".concat(functionName, " not found in contract ABI"));
                        }
                        data = contractInterface.encodeFunctionData(functionFragment, callArgs);
                        return [4 /*yield*/, this.signer.sendTransaction({
                                to: contract.target,
                                data: data,
                            })];
                    case 1:
                        txResponse = _a.sent();
                        return [2 /*return*/, txResponse.hash];
                }
            });
        });
    };
    /**
     * Wait for transaction to be mined
     */
    Web3Client.prototype.waitForTransaction = function (txHash_1) {
        return __awaiter(this, arguments, void 0, function (txHash, timeout) {
            if (timeout === void 0) { timeout = 60000; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.provider.waitForTransaction(txHash, undefined, timeout)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    /**
     * Get contract events
     */
    Web3Client.prototype.getEvents = function (contract_1, eventName_1) {
        return __awaiter(this, arguments, void 0, function (contract, eventName, fromBlock, toBlock) {
            var filter;
            if (fromBlock === void 0) { fromBlock = 0; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filter = contract.filters[eventName]();
                        return [4 /*yield*/, contract.queryFilter(filter, fromBlock, toBlock)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Encode feedback authorization data
     */
    Web3Client.prototype.encodeFeedbackAuth = function (agentId, clientAddress, indexLimit, expiry, chainId, identityRegistry, signerAddress) {
        return ethers_1.ethers.AbiCoder.defaultAbiCoder().encode(['uint256', 'address', 'uint64', 'uint256', 'uint256', 'address', 'address'], [agentId, clientAddress, indexLimit, expiry, chainId, identityRegistry, signerAddress]);
    };
    /**
     * Sign a message with the account's private key
     */
    Web3Client.prototype.signMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.signer) {
                            throw new Error('No signer available');
                        }
                        return [4 /*yield*/, this.signer.signMessage(message)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Recover address from message and signature
     */
    Web3Client.prototype.recoverAddress = function (message, signature) {
        return ethers_1.ethers.verifyMessage(message, signature);
    };
    /**
     * Compute Keccak-256 hash
     */
    Web3Client.prototype.keccak256 = function (data) {
        if (typeof data === 'string') {
            return ethers_1.ethers.keccak256(ethers_1.ethers.toUtf8Bytes(data));
        }
        // For Uint8Array, convert to hex string first
        return ethers_1.ethers.keccak256(ethers_1.ethers.hexlify(data));
    };
    /**
     * Convert address to checksum format
     */
    Web3Client.prototype.toChecksumAddress = function (address) {
        return ethers_1.ethers.getAddress(address);
    };
    /**
     * Check if string is a valid Ethereum address
     */
    Web3Client.prototype.isAddress = function (address) {
        try {
            return ethers_1.ethers.isAddress(address);
        }
        catch (_a) {
            return false;
        }
    };
    /**
     * Get ETH balance of an address
     */
    Web3Client.prototype.getBalance = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.provider.getBalance(address)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Get transaction count (nonce) of an address
     */
    Web3Client.prototype.getTransactionCount = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.provider.getTransactionCount(address, 'pending')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Object.defineProperty(Web3Client.prototype, "address", {
        /**
         * Get the account address (if signer is available)
         */
        get: function () {
            var _a;
            return (_a = this.signer) === null || _a === void 0 ? void 0 : _a.address;
        },
        enumerable: false,
        configurable: true
    });
    return Web3Client;
}());
exports.Web3Client = Web3Client;
