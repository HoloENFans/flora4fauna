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

		// Unmute if the slider is moved while muted
		if (this.isMuted && volume > 0) {
			this.isMuted = false;
		}
	}

	private toggleMute() {
		if (this.isMuted) {
			// Unmute: Restore the previous volume
			if (this.backgroundMusic) {
				this.backgroundMusic.volume = this.previousVolume;
			}
			this.isMuted = false;
		} else {
			// Mute: Set volume to 0 and remember the previous volume
			if (this.backgroundMusic) {
				this.previousVolume = this.backgroundMusic.volume;
				this.backgroundMusic.volume = 0;
			}
			this.isMuted = true;
		}
	}

	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}

	render() {
		return html`
			<div class="volume-container">
				<div class="volume-icon" @click="${() => this.toggleMute()}">
					${this.isMuted ? '🔇' : '🔊'}
				</div>
				<input
					class="volume-slider"
					type="range"
					min="0"
					max="100"
					value="${this.isMuted ? 0
					: this.backgroundMusic ? this.backgroundMusic.volume * 100
					: 50}"
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
