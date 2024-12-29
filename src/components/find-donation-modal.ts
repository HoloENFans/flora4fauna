import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './base-modal.ts';

@customElement('find-donation-modal')
export class FindDonationModal extends LitElement {
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
				<h1 slot="header">Find Donation</h1>
				<div class="separator" slot="separator"></div>

				<div slot="content" class="flex flex-col gap-4">
					<p>
						Search for your donation by entering your sapling name!
					</p>
					<input
						type="text"
						id="sapling-name"
						name="sapling-name"
						placeholder="Your Sapling Name..."
						required
						class="text-input"
					/>
					<button id="find-donation" class="btn btn-grass">
						Find Donation
					</button>
				</div>
			</base-modal>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'find-donation-modal': FindDonationModal;
	}
}
