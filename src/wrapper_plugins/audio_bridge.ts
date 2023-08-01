import Janus, { PluginHandle, Controllers } from '../interfaces/janus'
import { AudioBridgeCreateOptions } from '../interfaces/plugins/audio_bridge'
import { JanusPlugin, JanusPlugins } from '../janus_plugin'
import { JanusSession } from '../janus_session'

export class JanusAudioBridgePlugin extends JanusPlugin {
    static identifier: string = JanusPlugins.AUDIO_BRIDGE
    constructor(
        instance: Janus,
        session: JanusSession,
        handle: PluginHandle,
        controllers: Controllers
    ) {
        super(instance, session, handle, controllers)
    }

    async createRoom(room: string | number, options: AudioBridgeCreateOptions) {
        const payload = {
            request: 'create',
            room: room,
            ...options,
        }
        return this.send({ message: payload })
    }

    async editRoom(room: string | number, options: AudioBridgeCreateOptions) {
        const payload = {
            request: 'edit',
            room: room,
            ...options,
        }
        return this.send({ message: payload })
    }

    async joinRoom(
        room: string | number,
        {
            id,
            group,
            pin,
            display,
            token,
            muted,
            codec,
            preBuffer,
            bitrate,
            quality,
            expectedLoss,
            volume,
            spatialPosition,
            secret,
            audioLevelAverage,
            audioActivePackets,
            record,
            filename,
        }: {
            id?: string | number
            group?: string
            pin?: string
            display?: string
            token?: string
            muted?: boolean
            codec?: string
            preBuffer?: any
            bitrate?: number
            quality?: number
            expectedLoss?: number
            volume?: number
            spatialPosition?: number
            secret?: string
            audioLevelAverage?: number
            audioActivePackets?: number
            record?: boolean
            filename?: string
        } = {}
    ): Promise<any> {
        const payload = {
            request: 'join',
            room: room,
            id: id,
            group: group,
            pin: pin,
            display: display,
            token: token,
            muted: muted,
            codec: codec,
            prebuffer: preBuffer,
            bitrate: bitrate,
            quality: quality,
            expected_loss: expectedLoss,
            volume: volume,
            spatial_position: spatialPosition,
            secret: secret,
            audio_level_average: audioLevelAverage,
            audio_active_packets: audioActivePackets,
            record: record,
            filename: filename,
        }
        return this.send({ message: payload })
    }

    async configure({
        muted,
        offer,
        display,
        preBuffer,
        bitrate,
        quality,
        expectedLoss,
        volume,
        spatialPosition,
        record,
        filename,
        group,
    }: {
        offer?: RTCSessionDescription
        muted?: boolean
        display?: string
        preBuffer?: number
        bitrate?: number
        quality?: number
        expectedLoss?: number
        volume?: number
        spatialPosition?: number
        record?: boolean
        filename?: string
        group?: string
    }): Promise<any> {
        const payload = {
            request: 'configure',
            muted: muted,
            display: display,
            prebuffer: preBuffer,
            bitrate: bitrate,
            quality: quality,
            expected_loss: expectedLoss,
            volume: volume,
            spatial_position: spatialPosition,
            record: record,
            filename: filename,
            group: group,
        }
        return this.send({ message: payload, jsep: offer })
    }
}
