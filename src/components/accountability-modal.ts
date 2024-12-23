import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './base-modal.ts';

@customElement('accountability-modal')
export class AccountabilityModal extends LitElement {
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
				<h2>Accountability Modal</h2>
				<p>This is the content for the Accountability Modal.</p>
			</base-modal>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'accountability-modal': AccountabilityModal;
	}
}
