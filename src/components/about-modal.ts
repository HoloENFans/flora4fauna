import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './base-modal.ts';

@customElement('about-modal')
export class AboutModal extends LitElement {
	@property({ type: Boolean, reflect: true })
	isOpen = false;

	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}

	handleModalClosed() {
		this.isOpen = false;
	}

	render() {
		return html`
			<base-modal
				.isOpen=${this.isOpen}
				@modal-closed=${() => this.handleModalClosed()}
			>
				<h2>About Modal</h2>
				<p>This is the content for the About Modal.</p>
			</base-modal>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'about-modal': AboutModal;
	}
}
