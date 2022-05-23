import Janus, {
  AnswerParams,
  Controllers,
  DataParams,
  DetachOptions,
  JSEP,
  OfferParams,
  PluginHandle,
  PluginMessage,
  WebRTCInfo,
} from "./interfaces/janus";
import { JanusSession } from "./janus_session";
export class JanusPlugin implements PluginHandle {
  constructor(
    instance: Janus,
    session: JanusSession,
    handle: PluginHandle,
    controllers: Controllers
  ) {
    this.instance = instance;
    this.session = session;
    this.controllers = controllers;
    this.handle = handle;
    this.statsReportHookTimer = this.handleStatsHook(
      this.handle,
      controllers,
      null
    );
  }
  protected statsReportHookTimer: any;
  protected controllers: Controllers;
  protected instance: Janus;
  protected handle: PluginHandle;
  protected session: JanusSession;
  plugin: string;
  id: string;
  token?: string;
  detached: boolean;
  webrtcStuff: WebRTCInfo;

  protected handleStatsHook(
    plugin: PluginHandle,
    controllers: Controllers,
    mediaStreamTrack: MediaStreamTrack = null
  ) {
    return setInterval(async () => {
      if (!plugin.webrtcStuff.pc) {
        return;
      }
      const results: any[] = [];
      const reports = await plugin.webrtcStuff.pc.getStats(mediaStreamTrack);
      reports.forEach((report) => {
        if (report.jitter) {
          const info = {
            jitter: report.jitter,
            packetsLost: report.packetsLost,
            roundTripTime: report.roundTripTime,
            type: report.type,
          };
          results.push(info);
        }
      });
      controllers.onStatReportsController.next(results);
    }, 5000);
  }
  get onStatReports() {
    return this.controllers.onStatReportsController.asObservable();
  }
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
  get onMediaState() {
    return this.controllers.onMediaStateController.asObservable();
  }
  get onSlowLink() {
    return this.controllers.onSlowLinkController.asObservable();
  }
  get onWebRTCState() {
    return this.controllers.onWebRTCStateController.asObservable();
  }
  get onIceState() {
    return this.controllers.onIceStateController.asObservable();
  }
  get onDataOpen() {
    return this.controllers.onDataOpenController.asObservable();
  }
  get onDetached() {
    return this.controllers.onDetachedController.asObservable();
  }
  get onCleanup() {
    return this.controllers.onCleanupController.asObservable();
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
  data(params: DataParams): Promise<void> {
    return new Promise((resolve, reject) => {
      this.handle.data({
        ...params,
        success() {
          resolve();
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
  stopCollectingStats() {
    clearInterval(this.statsReportHookTimer);
  }
}
