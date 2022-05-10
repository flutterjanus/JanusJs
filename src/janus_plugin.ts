import Janus, {
  AnswerParams,
  DetachOptions,
  JSEP,
  Message,
  OfferParams,
  PluginHandle,
  PluginMessage,
  WebRTCInfo,
} from "./interfaces/janus";
export class JanusPlugin implements PluginHandle {
  constructor(instance: Janus) {
    this.instance = instance;
  }
  protected instance: Janus;
  protected handle: PluginHandle;
  plugin: string;
  id: string;
  token?: string;
  detached: boolean;
  webrtcStuff: WebRTCInfo;
  consentDialog?: (on: boolean) => void;
  webrtcState?: (isConnected: boolean) => void;
  iceState?: (
    state: "connected" | "failed" | "disconnected" | "closed"
  ) => void;
  mediaState?: (
    medium: "audio" | "video",
    receiving: boolean,
    mid?: number
  ) => void;
  onerror: (error: string) => void;
  ondataopen: () => void;
  slowLink?: (uplink: boolean, lost: number, mid: string) => void;
  onmessage?: (message: Message, jsep?: JSEP) => void;
  onlocaltrack?: (track: MediaStreamTrack, on: boolean) => void;
  onremotetrack?: (track: MediaStreamTrack, mid: string, on: boolean) => void;
  ondata?: (data: any) => void;
  oncleanup: () => void;
  ondetached: () => void;

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
