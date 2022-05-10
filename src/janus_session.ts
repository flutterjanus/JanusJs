import Janus from "../janus-gateway/npm/janus";
import _ from "lodash";
import {
  DestroyOptions,
  JSEP,
  Message,
  PluginHandle,
  PluginOptions,
} from "./interfaces/janus";
import { JanusPlugin } from "./janus_plugin";
export class JanusSession {
  protected instance: Janus;
  constructor(instance: Janus) {
    this.instance = instance;
  }

  getServer(): string {
    return this.instance.getServer();
  }
  isConnected(): boolean {
    return this.instance.isConnected();
  }

  getSessionId(): number {
    return this.instance.getSessionId();
  }
  attach(
    options: Pick<PluginOptions, "plugin" | "opaqueId">
  ): Promise<JanusPlugin> {
    const finalOptions: PluginOptions = { ...options };
    const pluginHandle = new JanusPlugin(this.instance);
    finalOptions.onmessage = (message: Message, jsep: JSEP) => {
      pluginHandle.onmessage(message, jsep);
    };
    finalOptions.onlocaltrack = (track, on) => {
      pluginHandle.onlocaltrack(track, on);
    };
    finalOptions.onremotetrack = (track, mid, on) => {
      pluginHandle.onremotetrack(track, mid, on);
    };
    finalOptions.ondata = (data: any) => {
      pluginHandle.ondata(data);
    };
    finalOptions.error = (error) => {
      pluginHandle.onerror(error);
    };
    finalOptions.webrtcState = (isConnected) => {
      pluginHandle.webrtcState(isConnected);
    };
    finalOptions.ondataopen = () => {
      pluginHandle.ondataopen();
    };
    finalOptions.ondetached = () => {
      pluginHandle.ondetached();
    };
    finalOptions.oncleanup = () => {
      pluginHandle.oncleanup();
    };
    finalOptions.mediaState = (medium, recieving, mid) => {
      pluginHandle.mediaState(medium, recieving, mid);
    };
    finalOptions.slowLink = (uplink, lost, mid) => {
      pluginHandle.slowLink(uplink, lost, mid);
    };
    finalOptions.iceState = (state) => {
      pluginHandle.iceState(state);
    };
    return new Promise<JanusPlugin>((resolve, reject) => {
      finalOptions.success = (plugin: PluginHandle) => {
        pluginHandle.setNativeHandle(plugin);
        _.assign(
          pluginHandle,
          _.omit(plugin, ["send", "createAnswer", "createOffer"])
        );
        resolve(pluginHandle);
      };
      finalOptions.error = (error: any) => {
        reject(error);
      };
      this.instance.attach(finalOptions);
    });
  }
  async reconnect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.instance.reconnect({
        success() {
          resolve(true);
        },
        error(err: any) {
          reject(err);
        },
      });
    });
  }
  async getInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.instance.getInfo({
        success(info: any) {
          resolve(info);
        },
        error(err: any) {
          reject(err);
        },
      });
    });
  }
  async destroy(
    callbacks: Omit<DestroyOptions, "success" | "error">
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.instance.destroy({
        ...callbacks,
        success() {
          resolve();
        },
        error(err: any) {
          reject(err);
        },
      });
    });
  }
}
