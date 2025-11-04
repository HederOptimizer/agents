"use strict";
/**
 * Enums for Agent0 SDK
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrustModel = exports.EndpointType = void 0;
/**
 * Types of endpoints that agents can advertise
 */
var EndpointType;
(function (EndpointType) {
    EndpointType["MCP"] = "MCP";
    EndpointType["A2A"] = "A2A";
    EndpointType["ENS"] = "ENS";
    EndpointType["DID"] = "DID";
    EndpointType["WALLET"] = "wallet";
})(EndpointType || (exports.EndpointType = EndpointType = {}));
/**
 * Trust models supported by the SDK
 */
var TrustModel;
(function (TrustModel) {
    TrustModel["REPUTATION"] = "reputation";
    TrustModel["CRYPTO_ECONOMIC"] = "crypto-economic";
    TrustModel["TEE_ATTESTATION"] = "tee-attestation";
})(TrustModel || (exports.TrustModel = TrustModel = {}));
