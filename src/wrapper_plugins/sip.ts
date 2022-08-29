import Janus, { PluginHandle, Controllers } from "../interfaces/janus";
import { JanusPlugin } from "../janus_plugin";
import { JanusSession } from "../janus_session";

export class JanusSipPlugin extends JanusPlugin {
  constructor(
    instance: Janus,
    session: JanusSession,
    handle: PluginHandle,
    controllers: Controllers
  ) {
    super(instance, session, handle, controllers);
  }

  async register(
    username: string,
    options: {
      type?: "guest" | "helper";
      send_register?: boolean;
      force_udp?: boolean;
      force_tcp?: boolean;
      sips?: boolean;
      rfc2543_cancel?: boolean;
      secret?: string;
      ha1_secret?: string;
      authuser?: string;
      display_name?: string;
      user_agent?: string;
      proxy?: string;
      outbound_proxy?: string;
      headers?: any;
      contact_params?: any;
      incoming_header_prefixes?: string[];
      refresh?: boolean;
      master_id?: string;
      register_ttl?: number;
    }
  ): Promise<void> {
    const payload = {
      request: "register",
      username,
      ...options,
    };
    await this.send({ message: payload });
  }

  async call(
    uri: string,
    options?: {
      call_id?: string;
      refer_id?: string;
      headers?: any;
      srtp?: string;
      srtp_profile?: string;
      autoaccept_reinvites?: boolean;
      secret?: string;
      ha1_secret?: string;
      authuser?: string;
    },
    offer?: RTCSessionDescription
  ) {
    if (!offer) {
      offer = await this.createOffer({
        media: {
          audioRecv: true,
          audioSend: true,
          videoRecv: false,
          videoSend: false,
        },
      });
    }

    const payload = {
      request: "call",
      uri,
      ...options,
    };
    await this.send({ message: payload, jsep: offer.toJSON() });
  }
  async decline(code?: number, headers?: any) {
    const payload = {
      request: "decline",
      code,
      headers,
    };
    await this.send({ message: payload });
  }
  async hangup(headers?: any) {
    const payload = {
      request: "hangup",
      headers,
    };
    await this.send({ message: payload });
  }
  async accept(options?: {
    srtp?: string;
    headers: any;
    autoaccept_reinvites: boolean;
  }) {
    const payload = {
      request: "accept",
      ...options,
    };
    await this.send({ message: payload });
  }
  async hold(direction: "sendonly" | "recvonly" | "inactive") {
    const payload = {
      request: "hold",
      direction,
    };
    await this.send({ message: payload });
  }
  async unhold() {
    const payload = {
      request: "unhold",
    };
    await this.send({ message: payload });
  }
}
