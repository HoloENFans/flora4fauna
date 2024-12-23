import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './base-modal.ts';

@customElement('donate-modal')
export class DonateModal extends LitElement {
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
			<!-- Widget -->
			<base-modal
				.isOpen=${this.isOpen}
				@modal-closed=${() => this.handleModalClosed()}
				id="donate-dialog"
			>
				<form class="relative rounded-xl bg-white p-8" method="dialog">
					<div
						id="mmd_widget_iframe_div"
						data-dedication-value="Anonymous Sapling"
						data-topic="tree_planting"
					></div>
				</form>
			</base-modal>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'donate-modal': DonateModal;
	}
}
