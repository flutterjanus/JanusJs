import Janus from "../janus-gateway/npm/janus";
import _ from "lodash";
import {
  Controllers,
  DestroyOptions,
  JSEP,
  Message,
  PluginHandle,
  PluginOptions,
} from "./interfaces/janus";
import { JanusPlugin } from "./janus_plugin";
import { Subject } from "rxjs";

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
  private getObservableControllers(
    options: Pick<PluginOptions, "plugin" | "opaqueId">
  ) {
    const finalOptions: PluginOptions = { ...options };
    const controllers: Controllers = {
      onMessageController: new Subject(),
      onLocalTrackController: new Subject(),
      onRemoteTrackController: new Subject(),
      onDataController: new Subject(),
      onErrorController: new Subject(),
      onMediaStateController: new Subject(),
      onIceStateController: new Subject(),
      onSlowLinkController: new Subject(),
      onWebRTCStateController: new Subject(),
      onCleanupController: new Subject(),
      onDataOpenController: new Subject(),
      onDetachedController: new Subject(),
    };
    finalOptions.onmessage = (message: any, jsep: JSEP) => {
      controllers.onMessageController.next({ message, jsep });
    };
    finalOptions.onlocaltrack = (track, on) => {
      controllers.onLocalTrackController.next({ on, track });
    };
    finalOptions.onremotetrack = (track, mid, on) => {
      controllers.onRemoteTrackController.next({ on, track, mid });
    };
    finalOptions.ondata = (data: any) => {
      controllers.onDataController.next(data);
    };
    finalOptions.error = (error) => {
      controllers.onErrorController.next(error);
    };
    finalOptions.mediaState = (medium, recieving, mid) => {
      controllers.onMediaStateController.next({ medium, recieving, mid });
    };
    finalOptions.slowLink = (uplink, lost, mid) => {
      controllers.onSlowLinkController.next({ uplink, lost, mid });
    };
    finalOptions.webrtcState = (isConnected) => {
      controllers.onWebRTCStateController.next(isConnected);
    };
    finalOptions.iceState = (state) => {
      controllers.onIceStateController.next(state);
    };
    finalOptions.ondataopen = () => {
      controllers.onDataOpenController.next();
    };
    finalOptions.ondetached = () => {
      controllers.onDetachedController.next();
    };
    finalOptions.oncleanup = () => {
      controllers.onCleanupController.next();
    };
    return { finalOptions, controllers };
  }
  attach(
    options: Pick<PluginOptions, "plugin" | "opaqueId">
  ): Promise<JanusPlugin> {
    const { controllers, finalOptions } =
      this.getObservableControllers(options);
    const pluginHandle = new JanusPlugin(this.instance, controllers);
    return new Promise<JanusPlugin>((resolve, reject) => {
      finalOptions.success = (plugin: PluginHandle) => {
        pluginHandle.setNativeHandle(plugin);
        _.assign(
          pluginHandle,
          _.omit(plugin, ["data", "send", "createAnswer", "createOffer"])
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
