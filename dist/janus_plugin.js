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
import { JanusJs } from "./janus_js";
var JanusPlugin = /** @class */ (function () {
    function JanusPlugin(instance, session, handle, controllers) {
        this.instance = instance;
        this.session = session;
        this.controllers = controllers;
        this.handle = handle;
        this.statsReportHookTimer = this.handleStatsHook(this.handle, controllers, null);
        this.handleRecordingSetup(controllers);
    }
    JanusPlugin.prototype.handleRecordingSetup = function (controllers) {
        var _this = this;
        var data;
        this.onMessage.subscribe(function (_a) {
            var message = _a.message;
            var result = message === null || message === void 0 ? void 0 : message.result;
            if ((result === null || result === void 0 ? void 0 : result.event) === "accepted" || (result === null || result === void 0 ? void 0 : result.event) === "progress") {
                if (!data) {
                    console.info("recording initiated");
                    data = JanusJs.createRecording({
                        mediaStreams: [
                            _this.webrtcStuff.myStream,
                            _this.webrtcStuff.remoteStream,
                        ],
                        timeSlice: _this.recordingTimeSlice,
                    });
                }
                if (data) {
                    _this.mediaRecorder = data.mediaRecorder;
                    data.controller.subscribe(function (dat) {
                        controllers.onRecordingDataController.next(dat);
                    });
                }
            }
            if ((result === null || result === void 0 ? void 0 : result.event) === "hangup") {
                if (_this.mediaRecorder.state !== "inactive")
                    _this.mediaRecorder.stop();
            }
        });
    };
    JanusPlugin.prototype.handleStatsHook = function (plugin, controllers, mediaStreamTrack) {
        var _this = this;
        if (mediaStreamTrack === void 0) { mediaStreamTrack = null; }
        return setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            var results, reports;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!plugin.webrtcStuff.pc) {
                            return [2 /*return*/];
                        }
                        results = [];
                        return [4 /*yield*/, plugin.webrtcStuff.pc.getStats(mediaStreamTrack)];
                    case 1:
                        reports = _a.sent();
                        reports.forEach(function (report) {
                            if (report.jitter) {
                                var info = {
                                    jitter: report.jitter,
                                    packetsLost: report.packetsLost,
                                    roundTripTime: report.roundTripTime,
                                    type: report.type,
                                };
                                results.push(info);
                            }
                        });
                        controllers.onStatReportsController.next(results);
                        return [2 /*return*/];
                }
            });
        }); }, 5000);
    };
    Object.defineProperty(JanusPlugin.prototype, "recorder", {
        get: function () {
            return this.mediaRecorder;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JanusPlugin.prototype, "onRecordingData", {
        get: function () {
            return this.controllers.onRecordingDataController.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JanusPlugin.prototype, "onStatReports", {
        get: function () {
            return this.controllers.onStatReportsController.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JanusPlugin.prototype, "onMessage", {
        get: function () {
            return this.controllers.onMessageController.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JanusPlugin.prototype, "onLocalTrack", {
        get: function () {
            return this.controllers.onLocalTrackController.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JanusPlugin.prototype, "onData", {
        get: function () {
            return this.controllers.onDataController.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JanusPlugin.prototype, "onError", {
        get: function () {
            return this.controllers.onErrorController.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JanusPlugin.prototype, "onRemoteTrack", {
        get: function () {
            return this.controllers.onRemoteTrackController.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JanusPlugin.prototype, "onMediaState", {
        get: function () {
            return this.controllers.onMediaStateController.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JanusPlugin.prototype, "onSlowLink", {
        get: function () {
            return this.controllers.onSlowLinkController.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JanusPlugin.prototype, "onWebRTCState", {
        get: function () {
            return this.controllers.onWebRTCStateController.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JanusPlugin.prototype, "onIceState", {
        get: function () {
            return this.controllers.onIceStateController.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JanusPlugin.prototype, "onDataOpen", {
        get: function () {
            return this.controllers.onDataOpenController.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JanusPlugin.prototype, "onDetached", {
        get: function () {
            return this.controllers.onDetachedController.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(JanusPlugin.prototype, "onCleanup", {
        get: function () {
            return this.controllers.onCleanupController.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    JanusPlugin.prototype.getId = function () {
        throw new Error("Method not implemented.");
    };
    JanusPlugin.prototype.getPlugin = function () {
        throw new Error("Method not implemented.");
    };
    JanusPlugin.prototype.send = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.handle.send(__assign(__assign({}, message), { success: function (data) {
                                resolve(data);
                            }, error: function (error) {
                                reject(error);
                            } }));
                    })];
            });
        });
    };
    JanusPlugin.prototype.createOffer = function (params) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.handle.createOffer(__assign(__assign({}, params), { success: function (offer) {
                    resolve(offer);
                }, error: function (error) {
                    reject(error);
                } }));
        });
    };
    JanusPlugin.prototype.createAnswer = function (params) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.handle.createAnswer(__assign(__assign({}, params), { success: function (offer) {
                    resolve(offer);
                }, error: function (error) {
                    reject(error);
                } }));
        });
    };
    JanusPlugin.prototype.data = function (params) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.handle.data(__assign(__assign({}, params), { success: function () {
                    resolve();
                }, error: function (error) {
                    reject(error);
                } }));
        });
    };
    JanusPlugin.prototype.handleRemoteJsep = function (params) {
        throw new Error("Method not implemented.");
    };
    JanusPlugin.prototype.dtmf = function (params) {
        throw new Error("Method not implemented.");
    };
    JanusPlugin.prototype.isAudioMuted = function () {
        throw new Error("Method not implemented.");
    };
    JanusPlugin.prototype.muteAudio = function () {
        throw new Error("Method not implemented.");
    };
    JanusPlugin.prototype.unmuteAudio = function () {
        throw new Error("Method not implemented.");
    };
    JanusPlugin.prototype.isVideoMuted = function () {
        throw new Error("Method not implemented.");
    };
    JanusPlugin.prototype.muteVideo = function () {
        throw new Error("Method not implemented.");
    };
    JanusPlugin.prototype.unmuteVideo = function () {
        throw new Error("Method not implemented.");
    };
    JanusPlugin.prototype.getBitrate = function () {
        throw new Error("Method not implemented.");
    };
    JanusPlugin.prototype.hangup = function (sendRequest) {
        throw new Error("Method not implemented.");
    };
    JanusPlugin.prototype.detach = function (params) {
        throw new Error("Method not implemented.");
    };
    JanusPlugin.prototype.stopCollectingStats = function () {
        clearInterval(this.statsReportHookTimer);
    };
    return JanusPlugin;
}());
export { JanusPlugin };
var JanusPlugins = /** @class */ (function () {
    function JanusPlugins() {
    }
    JanusPlugins.VIDEO_ROOM = "janus.plugin.videoroom";
    JanusPlugins.VIDEO_CALL = "janus.plugin.videocall";
    JanusPlugins.AUDIO_BRIDGE = "janus.plugin.audiobridge";
    JanusPlugins.SIP = "janus.plugin.sip";
    JanusPlugins.STREAMING = "janus.plugin.streaming";
    JanusPlugins.ECHO_TEST = "janus.plugin.echotest";
    return JanusPlugins;
}());
export { JanusPlugins };
