import Janus, { PluginHandle, Controllers } from '../interfaces/janus'
import { StreamingListResponse } from '../interfaces/plugins/streaming'
import { JanusPlugin, JanusPlugins } from '../janus_plugin'
import { JanusSession } from '../janus_session'

export class JanusStreamingPlugin extends JanusPlugin {
    static identifier: string = JanusPlugins.STREAMING
    constructor(
        instance: Janus,
        session: JanusSession,
        handle: PluginHandle,
        controllers: Controllers
    ) {
        super(instance, session, handle, controllers)
    }

    async list(): Promise<StreamingListResponse[]> {
        return this.send({
            message: {
                request: 'list',
            },
        })
    }

    async info(
        id: number | string,
        secret: string | undefined = undefined
    ): Promise<any> {
        return this.send({
            message: {
                request: 'info',
                id: id,
                secret: secret,
            },
        })
    }
}
