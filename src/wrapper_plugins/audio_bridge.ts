import Janus, { PluginHandle, Controllers } from "../interfaces/janus";
import { JanusPlugin, JanusPlugins } from "../janus_plugin";
import { JanusSession } from "../janus_session";

export class JanusAudioBridgePlugin extends JanusPlugin {
  static identifier: string = JanusPlugins.AUDIO_BRIDGE;
  constructor(instance: Janus, session: JanusSession, handle: PluginHandle, controllers: Controllers) {
    super(instance, session, handle, controllers);
  }

  boomCall() {}
}
