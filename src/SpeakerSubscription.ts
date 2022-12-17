import {
	AudioPlayer,
	AudioPlayerError,
	AudioPlayerState,
	AudioPlayerStatus,
	AudioResource,
	entersState,
	PlayerSubscription,
	VoiceConnection,
	VoiceConnectionDisconnectReason,
	VoiceConnectionState,
	VoiceConnectionStatus,
} from "@discordjs/voice";

export class SpeakerSubscription extends PlayerSubscription {
	public queue: AudioResource[];
	public queueLock = false;
	public readyLock = false;

	public constructor(connection: VoiceConnection, player: AudioPlayer) {
		super(connection, player);
		this.queue = [];

		this.connection.on("stateChange", async (oldState: VoiceConnectionState, newState: VoiceConnectionState) => {
			if (newState.status === VoiceConnectionStatus.Disconnected) {
				if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
					try {
						await entersState(this.connection, VoiceConnectionStatus.Connecting, 5_000);
					} catch {
						this.connection.destroy();
					}
				} else if (this.connection.rejoinAttempts < 5) {
					await new Promise(resolve => setTimeout(resolve, (this.connection.rejoinAttempts + 1) * 5_000));
					this.connection.rejoin();
				} else {
					this.connection.destroy();
				}
			} else if (newState.status === VoiceConnectionStatus.Destroyed) {
				this.stop();
			} else if (!this.readyLock && (newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling)) {
				this.readyLock = true;
				try {
					await entersState(this.connection, VoiceConnectionStatus.Ready, 20_000);
				} catch {
					if (this.connection.state.status !== VoiceConnectionStatus.Destroyed) this.connection.destroy();
				} finally {
					this.readyLock = false;
				}
			}
		});

		this.player.on("stateChange", (oldState: AudioPlayerState, newState: AudioPlayerState) => {
			if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
				void this.processQueue();
			}
		});

		this.player.on("error", (error: AudioPlayerError) => console.warn(error));
		this.connection.subscribe(this.player);
	}

	/**
	 * Adds a resource to the queue.
	 *
	 * @param resource The resource to add to the queue
	 */
	public enqueue(resource: AudioResource): void {
		this.queue.push(resource);
		void this.processQueue();
	}

	/**
	 * Stops resource playback and empties the queue.
	 */
	public stop(): void {
		this.queueLock = true;
		this.queue = [];
		this.player.stop(true);
	}

	/**
	 * Attempts to play a resource from the queue.
	 */
	private async processQueue(): Promise<void> {
		if (this.queueLock || this.player.state.status !== AudioPlayerStatus.Idle || this.queue.length === 0) {
			return;
		}
		this.queueLock = true;
		const nextResource = this.queue.shift();
		try {
			this.player.play(nextResource);
			this.queueLock = false;
		} catch (error) {
			console.warn(error);
			this.queueLock = false;
			return this.processQueue();
		}
	}
}