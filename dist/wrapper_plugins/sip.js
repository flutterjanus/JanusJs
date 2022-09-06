var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
import { JanusPlugin } from "../janus_plugin";
var JanusSipPlugin = /** @class */ (function (_super) {
    __extends(JanusSipPlugin, _super);
    function JanusSipPlugin(instance, session, handle, controllers) {
        return _super.call(this, instance, session, handle, controllers) || this;
    }
    JanusSipPlugin.prototype.register = function (username, server, options) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = __assign({ request: "register", username: "sip:".concat(username, "@").concat(server) }, options);
                        payload.proxy = "sip:".concat(server);
                        return [4 /*yield*/, this.send({ message: payload })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    JanusSipPlugin.prototype.call = function (uri, options, offer) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!offer) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.createOffer({
                                media: {
                                    audioRecv: true,
                                    audioSend: true,
                                    videoRecv: false,
                                    videoSend: false,
                                },
                            })];
                    case 1:
                        offer = _a.sent();
                        _a.label = 2;
                    case 2:
                        payload = __assign({ request: "call", uri: uri }, options);
                        return [4 /*yield*/, this.send({ message: payload, jsep: offer })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    JanusSipPlugin.prototype.update = function (offer) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!offer) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.createOffer({
                                media: {
                                    audioRecv: true,
                                    audioSend: true,
                                    videoRecv: false,
                                    videoSend: false,
                                },
                            })];
                    case 1:
                        offer = _a.sent();
                        _a.label = 2;
                    case 2:
                        payload = {
                            request: "update",
                        };
                        return [4 /*yield*/, this.send({ message: payload, jsep: offer.toJSON() })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    JanusSipPlugin.prototype.decline = function (code, headers) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = {
                            request: "decline",
                            code: code,
                            headers: headers,
                        };
                        return [4 /*yield*/, this.send({ message: payload })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    JanusSipPlugin.prototype.hangup = function (headers) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = {
                            request: "hangup",
                            headers: headers,
                        };
                        return [4 /*yield*/, this.send({ message: payload })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    JanusSipPlugin.prototype.accept = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = __assign({ request: "accept" }, options);
                        return [4 /*yield*/, this.send({ message: payload })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    JanusSipPlugin.prototype.hold = function (direction) {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = {
                            request: "hold",
                            direction: direction,
                        };
                        return [4 /*yield*/, this.send({ message: payload })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    JanusSipPlugin.prototype.unhold = function () {
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = {
                            request: "unhold",
                        };
                        return [4 /*yield*/, this.send({ message: payload })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    JanusSipPlugin.prototype.record = function (action, options) {
        if (options === void 0) { options = {
            peer_audio: true,
            peer_video: false,
            audio: true,
            video: false,
            filename: "recording_" + new Date().toDateString(),
        }; }
        return __awaiter(this, void 0, void 0, function () {
            var payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = __assign({ request: "recording", action: action }, options);
                        return [4 /*yield*/, this.send({ message: payload })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return JanusSipPlugin;
}(JanusPlugin));
export { JanusSipPlugin };
