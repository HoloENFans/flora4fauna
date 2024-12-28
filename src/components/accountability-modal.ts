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
				<h1 slot="header">Donation Accountability</h1>
				<div class="separator" slot="separator"></div>
				<div slot="content">
					<h2>Preface</h2>
					<p>
						All donations are direct to the Arbor Day Foundation
						with a payment portal from makemydonation through a hard
						coded widget (link). This website and volunteer team
						<strong>does not receive nor seek</strong> any of the
						proceeds.
					</p>
					<br />
					<p>
						Our team does not collect, store, or handle the payment
						process or financial information. Our team only handles
						the optional messages as received from the
						makemydonation API. Our volunteer team will not ask you
						and will not reach out for any financial or personal
						information. Information on impact reports for trees
						planted from donations will be communicated with the
						Arbor Day Foundation.
					</p>
				</div>
			</base-modal>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'accountability-modal': AccountabilityModal;
	}
}
