import { Sound } from '@pixi/sound';
import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('volume-control')
export class VolumeControl extends LitElement {
	@property({ type: Object })
	backgroundMusic: Sound | null = null;

	@state()
	private isMuted = false;

	@state()
	private previousVolume = 0.5;

	private handleVolumeChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const volume = parseFloat(target.value) / 100;

		this.previousVolume = volume;

		if (this.backgroundMusic) {
			this.backgroundMusic.volume = volume;
		}

		localStorage.setItem('storedVolume', volume.toString());

		// Unmute if the slider is moved while muted
		if (this.isMuted && volume > 0) {
			this.isMuted = false;
		} else if (!this.isMuted && volume == 0) {
			// Mute if the slider is moved to 0
			this.isMuted = true;
		}
	}

	private toggleMute() {
		if (this.isMuted) {
			// Unmute: Restore the previous volume
			if (this.backgroundMusic) {
				this.backgroundMusic.volume = this.previousVolume;
			}
			this.isMuted = false;
			localStorage.setItem(
				'storedVolume',
				this.previousVolume.toString(),
			);
		} else {
			// Mute: Set volume to 0 and remember the previous volume
			if (this.backgroundMusic) {
				this.previousVolume = this.backgroundMusic.volume;
				this.backgroundMusic.volume = 0;
			}
			this.isMuted = true;
			localStorage.setItem('storedVolume', '0');
		}
	}

	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}

	render() {
		const value =
			this.isMuted ? 0
			: this.backgroundMusic ? this.backgroundMusic.volume * 100
			: 50;

		const showMuteIcon =
			this.isMuted ||
			(this.backgroundMusic && this.backgroundMusic.volume == 0);

		return html`
			<div class="volume-container">
				<div class="volume-icon" @click="${() => this.toggleMute()}">
					${showMuteIcon ? '🔇' : '🔊'}
				</div>
				<input
					class="volume-slider"
					type="range"
					min="0"
					max="100"
					.value="${value}"
					@input="${(event: Event) => this.handleVolumeChange(event)}"
				/>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'volume-control': VolumeControl;
	}
}
