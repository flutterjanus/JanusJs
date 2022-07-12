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
import { JanusPlugin } from "../janus_plugin";
var JanusAudioBridgePlugin = /** @class */ (function (_super) {
    __extends(JanusAudioBridgePlugin, _super);
    function JanusAudioBridgePlugin(instance, session, handle, controllers) {
        return _super.call(this, instance, session, handle, controllers) || this;
    }
    JanusAudioBridgePlugin.prototype.boomCall = function () { };
    return JanusAudioBridgePlugin;
}(JanusPlugin));
export { JanusAudioBridgePlugin };
