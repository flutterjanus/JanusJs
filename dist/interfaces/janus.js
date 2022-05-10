export var DebugLevel;
(function (DebugLevel) {
    DebugLevel["Trace"] = "trace";
    DebugLevel["Debug"] = "debug";
    DebugLevel["Log"] = "log";
    DebugLevel["Warning"] = "warn";
    DebugLevel["Error"] = "error";
})(DebugLevel || (DebugLevel = {}));
export var MessageType;
(function (MessageType) {
    MessageType["Recording"] = "recording";
    MessageType["Starting"] = "starting";
    MessageType["Started"] = "started";
    MessageType["Stopped"] = "stopped";
    MessageType["SlowLink"] = "slow_link";
    MessageType["Preparing"] = "preparing";
    MessageType["Refreshing"] = "refreshing";
})(MessageType || (MessageType = {}));
export default JanusJS.Janus;
export { JanusJS };
