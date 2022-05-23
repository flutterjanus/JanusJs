import Janus from "../janus-gateway/npm/janus";
import adapter from "webrtc-adapter";
import { ConstructorOptions, InitOptions } from "./interfaces/janus";
import { JanusSession } from "./janus_session";

export class JanusJs {
  protected instance: Janus;
  protected options: ConstructorOptions;
  static isWebrtcSupported(): boolean {
    return Janus.isWebrtcSupported();
  }
  static debug(...args: any[]): void {
    Janus.debug(args);
  }
  static log(...args: any[]): void {
    Janus.log(args);
  }
  static warn(...args: any[]): void {
    Janus.warn(args);
  }
  static error(...args: any[]): void {
    Janus.error(args);
  }
  static randomString(length: number): string {
    return Janus.randomString(length);
  }
  static attachMediaStream(
    element: HTMLMediaElement,
    stream: MediaStream
  ): void {
    Janus.attachMediaStream(element, stream);
  }
  static reattachMediaStream(
    to: HTMLMediaElement,
    from: HTMLMediaElement
  ): void {
    Janus.reattachMediaStream(to, from);
  }
  static stopAllTracks(stream: MediaStream): void {
    Janus.stopAllTracks(stream);
  }

  constructor(
    options: Omit<ConstructorOptions, "success" | "error" | "destroyed">
  ) {
    console.log("JanusJs loaded");
    this.options = options;
  }
  onDestroyed: () => void;
  async init(
    params: Omit<InitOptions, "callback"> = {
      debug: "all",
      dependencies: Janus.useDefaultDependencies({ adapter: adapter }),
    }
  ): Promise<void> {
    if (!params.dependencies) {
      params.dependencies = Janus.useDefaultDependencies({ adapter: adapter });
    }
    await new Promise<void>((resolve, reject) => {
      Janus.init({
        ...params,
        callback: () => {
          resolve();
        },
      });
    });
  }
  static mix(audioContext: AudioContext, streams: MediaStream[]) {
    const dest: any = audioContext.createMediaStreamDestination();
    streams.forEach((stream) => {
      dest.context.createMediaStreamSource(stream).connect(dest);
    });
    return dest.stream.getTracks()[0];
  }
  static playMediaStream(mediaStream: MediaStream) {
    window.AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    try {
      const audioContext = new window.AudioContext();
      const audio = new Audio();
      audio.srcObject = mediaStream;
      const sourceNode = audioContext.createMediaStreamSource(audio.srcObject);
      sourceNode.connect(audioContext.destination);
      return audioContext;
    } catch (err) {
      JanusJs.error("failed to play media stream", err);
      throw err;
    }
  }
  async createSession(): Promise<JanusSession> {
    this.options.destroyed = () => {
      this.onDestroyed();
    };
    await new Promise<void>((resolve, reject) => {
      this.options.success = () => {
        resolve();
      };
      this.options.error = (error: any) => {
        reject(error);
      };
      this.instance = new Janus(this.options);
    });
    return new JanusSession(this.instance);
  }
}
