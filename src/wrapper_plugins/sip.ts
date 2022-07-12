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

  boomSip() {}
}
