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
			<base-modal
				.isOpen=${this.isOpen}
				@modal-closed=${() => this.handleModalClosed()}
				.isDonateModal=${true}
			>
				<div slot="content">
					<div
						id="mmd_widget_iframe_div"
						data-dedication-label="Your username"
						data-dedication-value="Anonymous Sapling"
						data-topic="tree_planting"
						data-dedication-max-length="24"
						data-message-max-length="321"
						data-disable-configuration="true"
						class="min-w-72"
					></div>
					<p class="mt-4 w-72 text-center text-xs text-black">
						If you get any errors, try disabling any ad or tracking
						blockers you might have. Those can interfere with the
						payment portal correctly working.
					</p>
				</div>
			</base-modal>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'donate-modal': DonateModal;
	}
}
