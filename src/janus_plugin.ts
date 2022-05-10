import Janus, {
  AnswerParams,
  Controllers,
  DetachOptions,
  JSEP,
  Message,
  OfferParams,
  PluginHandle,
  PluginMessage,
  WebRTCInfo,
} from "./interfaces/janus";
const noop = () => {};
import { Observable, Subject } from "rxjs";
export class JanusPlugin implements PluginHandle {
  constructor(instance: Janus, controllers: Controllers) {
    this.instance = instance;
    this.controllers = controllers;
  }
  protected controllers: Controllers;
  protected instance: Janus;
  protected handle: PluginHandle;
  plugin: string;
  id: string;
  token?: string;
  detached: boolean;
  webrtcStuff: WebRTCInfo;

  get onMessage() {
    return this.controllers.onMessageController.asObservable();
  }
  get onLocalTrack() {
    return this.controllers.onLocalTrackController.asObservable();
  }
  get onData() {
    return this.controllers.onDataController.asObservable();
  }
  get onError() {
    return this.controllers.onErrorController.asObservable();
  }
  get onRemoteTrack() {
    return this.controllers.onRemoteTrackController.asObservable();
  }
  consentDialog?: (on: boolean) => void = noop;
  webrtcState?: (isConnected: boolean) => void = noop;
  iceState?: (
    state: "connected" | "failed" | "disconnected" | "closed"
  ) => void = noop;
  mediaState?: (
    medium: "audio" | "video",
    receiving: boolean,
    mid?: number
  ) => void = noop;
  onerror?: (error: string) => void = noop;
  ondataopen?: () => void = noop;
  slowLink?: (uplink: boolean, lost: number, mid: string) => void;
  ondata?: (data: any) => void;
  oncleanup?: () => void;
  ondetached?: () => void;

  setNativeHandle(nativePluginHandle: PluginHandle): void {
    this.handle = nativePluginHandle;
  }
  getId(): string {
    throw new Error("Method not implemented.");
  }
  getPlugin(): string {
    throw new Error("Method not implemented.");
  }
  async send(message: Omit<PluginMessage, "success" | "error">): Promise<any> {
    return new Promise((resolve, reject) => {
      this.handle.send({
        ...message,
        success(data) {
          resolve(data);
        },
        error(error) {
          reject(error);
        },
      });
    });
  }
  createOffer(
    params: Omit<OfferParams, "success" | "error">
  ): Promise<RTCSessionDescription> {
    return new Promise<RTCSessionDescription>((resolve, reject) => {
      this.handle.createOffer({
        ...params,
        success(offer: RTCSessionDescription) {
          resolve(offer);
        },
        error(error) {
          reject(error);
        },
      });
    });
  }
  createAnswer(
    params: Omit<AnswerParams, "success" | "error">
  ): Promise<RTCSessionDescription> {
    return new Promise<RTCSessionDescription>((resolve, reject) => {
      this.handle.createAnswer({
        ...params,
        success(offer: RTCSessionDescription) {
          resolve(offer);
        },
        error(error: any) {
          reject(error);
        },
      });
    });
  }
  handleRemoteJsep(params: { jsep: JSEP }): void {
    throw new Error("Method not implemented.");
  }
  dtmf(params: any): void {
    throw new Error("Method not implemented.");
  }
  data(params: any): void {
    throw new Error("Method not implemented.");
  }
  isAudioMuted(): boolean {
    throw new Error("Method not implemented.");
  }
  muteAudio(): void {
    throw new Error("Method not implemented.");
  }
  unmuteAudio(): void {
    throw new Error("Method not implemented.");
  }
  isVideoMuted(): boolean {
    throw new Error("Method not implemented.");
  }
  muteVideo(): void {
    throw new Error("Method not implemented.");
  }
  unmuteVideo(): void {
    throw new Error("Method not implemented.");
  }
  getBitrate(): string {
    throw new Error("Method not implemented.");
  }
  hangup(sendRequest?: boolean): void {
    throw new Error("Method not implemented.");
  }
  detach(params?: DetachOptions): void {
    throw new Error("Method not implemented.");
  }
}
