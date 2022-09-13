import { BehaviorSubject, ReplaySubject, Subject } from "rxjs";

export interface Dependencies {
  adapter: any;
  WebSocket: (server: string, protocol: string) => WebSocket;
  isArray: (array: any) => array is Array<any>;
  extension: () => boolean;
  httpAPICall: (url: string, options: any) => void;
}
export interface CreateRecordingController {
  blob: Blob;
  chunkNumber: number;
}
export interface CreateRecordingResult {
  mediaRecorder: MediaRecorder;
  controller: Subject<CreateRecordingController>;
}
export interface DataParams {
  text: any;
}
export interface DependenciesResult {
  adapter: any;
  newWebSocket: (server: string, protocol: string) => WebSocket;
  isArray: (array: any) => array is Array<any>;
  extension: () => boolean;
  httpAPICall: (url: string, options: any) => void;
}

export enum DebugLevel {
  Trace = "trace",
  Debug = "debug",
  Log = "log",
  Warning = "warn",
  Error = "error",
}

export interface JSEP {
  ee2e?: boolean;
  sdp?: string;
  type?: string;
  rid_order?: "hml" | "lmh";
  force_relay?: boolean;
}

export interface InitOptions {
  debug?: boolean | "all" | DebugLevel[];
  callback?: Function;
  dependencies?: DependenciesResult;
}

export interface ReconnectOptions {
  success?: Function;
  error?: (error: string) => void;
}

export interface DestroyOptions {
  cleanupHandles?: boolean;
  notifyDestroyed?: boolean;
  unload?: boolean;
  success?: () => void;
  error?: (error: string) => void;
}

export interface GetInfoOptions {
  success?: (info: any) => void;
  error?: (error: string) => void;
}

export enum MessageType {
  Recording = "recording",
  Starting = "starting",
  Started = "started",
  Stopped = "stopped",
  SlowLink = "slow_link",
  Preparing = "preparing",
  Refreshing = "refreshing",
}

export interface Message {
  result?: {
    status: MessageType;
    id?: string;
    uplink?: number;
  };
  error?: string;
  [key: string]: any;
}
export interface MessageCallback extends Object {
  result: Result;
}

export interface Result extends Object {
  event: string;
}

export interface PluginCallbacks {
  dataChannelOptions?: RTCDataChannelInit;
  success?: (handle: PluginHandle) => void;
  error?: (error: string) => void;
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
  slowLink?: (uplink: boolean, lost: number, mid: string) => void;
  onmessage?: (message: any, jsep?: JSEP) => void;
  onlocaltrack?: (track: MediaStreamTrack, on: boolean) => void;
  onremotetrack?: (track: MediaStreamTrack, mid: string, on: boolean) => void;
  ondataopen?: Function;
  ondata?: Function;
  oncleanup?: Function;
  ondetached?: Function;
}

export interface PluginOptions extends PluginCallbacks {
  plugin: string;
  opaqueId?: string;
}
export interface AnswerParams {
  media?: {
    audioSend?: boolean;
    addAudio?: boolean;
    addVideo?: boolean;
    addData?: boolean;
    audioRecv?: boolean;
    videoSend?: boolean;
    removeAudio?: boolean;
    removeVideo?: boolean;
    replaceAudio?: boolean;
    replaceVideo?: boolean;
    videoRecv?: boolean;
    audio?: boolean | { deviceId: string };
    video?:
      | boolean
      | { deviceId: string }
      | "lowres"
      | "lowres-16:9"
      | "stdres"
      | "stdres-16:9"
      | "hires"
      | "hires-16:9";
    data?: boolean;
    failIfNoAudio?: boolean;
    failIfNoVideo?: boolean;
    screenshareFrameRate?: number;
  };
  jsep: any;
}
export interface OfferParams {
  media?: {
    tracks?: { type: string; capture: boolean; recv: boolean }[];
    audioSend?: boolean;
    addAudio?: boolean;
    addVideo?: boolean;
    addData?: boolean;
    audioRecv?: boolean;
    videoSend?: boolean;
    removeAudio?: boolean;
    removeVideo?: boolean;
    replaceAudio?: boolean;
    replaceVideo?: boolean;
    videoRecv?: boolean;
    audio?: boolean | { deviceId: string };
    video?:
      | boolean
      | { deviceId: string }
      | "lowres"
      | "lowres-16:9"
      | "stdres"
      | "stdres-16:9"
      | "hires"
      | "hires-16:9";
    data?: boolean;
    failIfNoAudio?: boolean;
    failIfNoVideo?: boolean;
    screenshareFrameRate?: number;
  };
  trickle?: boolean;
  stream?: MediaStream;
  success: Function;
  error: (error: any) => void;
}

export interface PluginMessage {
  message: {
    request: string;
    [otherProps: string]: any;
  };
  jsep?: JSEP;
  success?: (data?: any) => void;
  error?: (error: string) => void;
}

export interface WebRTCInfo {
  bitrate: {
    bsbefore: string | null;
    bsnow: string | null;
    timer: string | null;
    tsbefore: string | null;
    tsnow: string | null;
    value: string | null;
  };
  dataChannel: Array<RTCDataChannel>;
  dataChannelOptions: RTCDataChannelInit;

  dtmfSender: string | null;
  iceDone: boolean;
  mediaConstraints: any;
  mySdp: {
    sdp: string;
    type: string;
  };
  myStream: MediaStream;
  pc: RTCPeerConnection;
  receiverTransforms: {
    audio: TransformStream;
    video: TransformStream;
  };
  remoteSdp: string;
  remoteStream: MediaStream;
  senderTransforms: {
    audio: TransformStream;
    video: TransformStream;
  };
  started: boolean;
  streamExternal: boolean;
  trickle: boolean;
  volume: {
    value: number;
    timer: number;
  };
}
export interface DetachOptions {
  success?: () => void;
  error?: (error: string) => void;
  noRequest?: boolean;
}
export interface PluginHandle {
  plugin: string;
  id: string;
  token?: string;
  detached: boolean;
  webrtcStuff: WebRTCInfo;
  getId(): string;
  getPlugin(): string;
  send(message: PluginMessage): void;
  createOffer(params: OfferParams): void;
  createAnswer(params: any): void;
  handleRemoteJsep(params: { jsep: JSEP }): void;
  dtmf(params: any): void;
  data(params: any): void;
  isAudioMuted(mid: string): boolean;
  muteAudio(mid: string): void;
  unmuteAudio(mid: string): void;
  isVideoMuted(mid: string): boolean;
  muteVideo(mid: string): void;
  unmuteVideo(mid: string): void;
  getBitrate(mid: string): string;
  hangup(sendRequest?: boolean): void;
  detach(params?: DetachOptions): void;
}
declare namespace JanusJS {
  class Janus {
    static webRTCAdapter: any;
    static safariVp8: boolean;
    static useDefaultDependencies(
      deps: Partial<Dependencies>
    ): DependenciesResult;
    static useOldDependencies(deps: Partial<Dependencies>): DependenciesResult;
    static init(options: InitOptions): void;
    static isWebrtcSupported(): boolean;
    static debug(...args: any[]): void;
    static log(...args: any[]): void;
    static warn(...args: any[]): void;
    static error(...args: any[]): void;
    static randomString(length: number): string;
    static attachMediaStream(
      element: HTMLMediaElement,
      stream: MediaStream
    ): void;
    static reattachMediaStream(
      to: HTMLMediaElement,
      from: HTMLMediaElement
    ): void;

    static stopAllTracks(stream: MediaStream): void;

    constructor(options: ConstructorOptions);

    attach(options: PluginOptions): void;
    getServer(): string;
    isConnected(): boolean;
    reconnect(callbacks: ReconnectOptions): void;
    getSessionId(): number;
    getInfo(callbacks: GetInfoOptions): void;
    destroy(callbacks: DestroyOptions): void;
  }
}

export default JanusJS.Janus;
export { JanusJS };
export interface ConstructorOptions {
  server: string | string[];
  iceServers?: RTCIceServer[];
  ipv6?: boolean;
  withCredentials?: boolean;
  max_poll_events?: number;
  destroyOnUnload?: boolean;
  token?: string;
  apisecret?: string;
  success?: Function;
  error?: (error: any) => void;
  destroyed?: Function;
}

export interface Controllers {
  onMessageController: Subject<{
    message: MessageCallback | any;
    jsep: JSEP;
  }>;
  onLocalTrackController: BehaviorSubject<{
    track: MediaStreamTrack;
    on: boolean;
  }>;
  onRemoteTrackController: Subject<{
    track: MediaStreamTrack;
    on: boolean;
    mid: string;
  }>;
  onRecordingDataController: Subject<{
    blob: Blob;
    chunkNumber: number;
  }>;
  onStatReportsController: Subject<any[]>;
  onDataController: BehaviorSubject<any>;
  onErrorController: BehaviorSubject<any>;
  onMediaStateController: BehaviorSubject<{
    medium: "audio" | "video";
    recieving: boolean;
    mid: number;
  }>;
  onSlowLinkController: BehaviorSubject<{
    uplink: boolean;
    lost: number;
    mid: string;
  }>;
  onWebRTCStateController: BehaviorSubject<boolean>;
  onIceStateController: BehaviorSubject<
    "connected" | "failed" | "disconnected" | "closed"
  >;
  onDataOpenController: BehaviorSubject<void>;
  onDetachedController: BehaviorSubject<void>;
  onCleanupController: BehaviorSubject<void>;
}
