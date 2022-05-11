import Janus from "../janus-gateway/npm/janus";
import adapter from "webrtc-adapter";
import { ConstructorOptions, InitOptions } from "./interfaces/janus";
import { JanusSession } from "./janus_session";

export class JanusJs {
  protected instance: Janus;
  protected options: ConstructorOptions;
  static helpers = Janus;
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
    await new Promise<void>((resolve, reject) => {
      Janus.init({
        ...params,
        callback: () => {
          resolve();
        },
      });
    });
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
