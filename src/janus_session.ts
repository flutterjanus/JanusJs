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
import { JanusPlugin, JanusPlugins } from "./janus_plugin";
import { BehaviorSubject, skip } from "rxjs";
import { JanusVideoRoomPlugin } from "./wrapper_plugins/video_room";
import { JanusAudioBridgePlugin } from "./wrapper_plugins/audio_bridge";
import { JanusSipPlugin } from "./wrapper_plugins/sip";
import { JanusVideoCallPlugin } from "./wrapper_plugins/video_call";
import { JanusStreamingPlugin } from "./wrapper_plugins/streaming";
import { JanusEchoTestPlugin } from "./wrapper_plugins/echo_test";
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
      onRecordingDataController: new BehaviorSubject(null),
      onStatReportsController: new BehaviorSubject(null),
      onMessageController: new BehaviorSubject({
        jsep: null,
        message: { result: null },
      }),
      onLocalTrackController: new BehaviorSubject(null),
      onRemoteTrackController: new Subject(),
      onDataController: new BehaviorSubject(null),
      onErrorController: new BehaviorSubject(null),
      onMediaStateController: new BehaviorSubject(null),
      onIceStateController: new BehaviorSubject(null),
      onSlowLinkController: new BehaviorSubject(null),
      onWebRTCStateController: new BehaviorSubject(null),
      onCleanupController: new BehaviorSubject(null),
      onDataOpenController: new BehaviorSubject(null),
      onDetachedController: new BehaviorSubject(null),
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

  attach<Type extends JanusPlugin>(
    classToCreate: new (...args: any) => Type,
    options: Pick<PluginOptions, "opaqueId">
  ): Promise<Type> {
    let pluginIdentifier;
    switch (classToCreate.name) {
      case JanusVideoRoomPlugin.name:
        pluginIdentifier = JanusPlugins.VIDEO_ROOM;
        break;
      case JanusAudioBridgePlugin.name:
        pluginIdentifier = JanusPlugins.AUDIO_BRIDGE;
        break;
      case JanusSipPlugin.name:
        pluginIdentifier = JanusPlugins.SIP;
        break;
      case JanusVideoCallPlugin.name:
        pluginIdentifier = JanusPlugins.VIDEO_CALL;
        break;
      case JanusStreamingPlugin.name:
        pluginIdentifier = JanusPlugins.STREAMING;
        break;
      case JanusEchoTestPlugin.name:
        pluginIdentifier = JanusPlugins.ECHO_TEST;
        break;
      default:
        throw new Error("Unknown plugin");
    }
    const opts: Pick<PluginOptions, "plugin" | "opaqueId"> = {
      ...options,
      plugin: pluginIdentifier,
    };
    const { controllers, finalOptions } = this.getObservableControllers(opts);
    return new Promise<Type>((resolve, reject) => {
      finalOptions.success = (plugin: PluginHandle) => {
        const pluginHandle = new classToCreate(
          this.instance,
          this,
          plugin,
          controllers
        );
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

  // attach(
  //   options: Pick<PluginOptions, "plugin" | "opaqueId">
  // ): Promise<JanusPlugin> {
  //   const { controllers, finalOptions } =
  //     this.getObservableControllers(options);
  //   return new Promise<JanusPlugin>((resolve, reject) => {
  //     finalOptions.success = (plugin: PluginHandle) => {
  //       const pluginHandle = new JanusPlugin(
  //         this.instance,
  //         this,
  //         plugin,
  //         controllers
  //       );
  //       _.assign(
  //         pluginHandle,
  //         _.omit(plugin, ["data", "send", "createAnswer", "createOffer"])
  //       );
  //       resolve(pluginHandle);
  //     };
  //     finalOptions.error = (error: any) => {
  //       reject(error);
  //     };
  //     this.instance.attach(finalOptions);
  //   });
  // }
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
        success: () => {
          resolve();
        },
        error: (err: any) => {
          reject(err);
        },
      });
    });
  }
}
