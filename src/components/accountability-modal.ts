import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './base-modal.ts';

@customElement('accountability-modal')
export class AccountabilityModal extends LitElement {
	@property({ type: Boolean, reflect: true }) isOpen = false;

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
					<h2>Statement:</h2>
					<p>
						All donations are direct to the Arbor Day Foundation
						with a payment portal from Make My Donation (<a
							href="https://www.makemydonation.org/affiliate-fundraising-plugin-widget"
							rel="noreferrer"
							target="_blank"
							>Link</a
						>).
					</p>
					<p>
						<br />
						This website and volunteer team does not receive nor
						seek any of the proceeds. Our team does not collect,
						store, or handle the payment process or financial
						information. Our team only handles the donation amount
						and optional username and message.
						<br />
					</p>

					<p>
						Our volunteer team will not ask you and will not reach
						out for any financial or personal information. Any
						requests for tax information containing such personal
						information is handled by official teams at the Arbor
						Day Foundation. (<a
							href="https://www.arborday.org/contact"
							rel="noreferrer"
							target="_blank"
							>Link</a
						>)
					</p>
					<br />
					<p>
						Art of Ceres Fauna, Nemu, and music was commissioned
						specifically for this project under the Hololive
						Derivative Works Guidelines (<a
							href="https://hololivepro.com/en/terms/"
							rel="noreferrer"
							target="_blank"
							>Link</a
						>). This website was made by fans for fans. All
						donations are non-profit.
					</p>
					<h2>Charity Reports:</h2>
					<p>
						Information listed below is not for promotion or
						fundraising purposes. Links are provided for providing
						access to information for individuals to make their own
						judgements.
					</p>
					<br />
					<p>
						Arbor Day Foundation has a 4 out of 4-star rating on
						Charity Navigator (<a
							href="https://www.charitynavigator.org/ein/237169265"
							rel="noreferrer"
							target="_blank"
							>Link</a
						>)
					</p>
					<br />
					<p>
						Arbor Day Foundation has 20 out of 20 standards met for
						BBB Wise Giving ALliance (<a
							href="https://give.org/charity-reviews/Environment/National-Arbor-Day-Foundation-in-Lincoln-ne-52177"
							rel="noreferrer"
							target="_blank"
							>Link</a
						>)
					</p>
					<br />
					<p>
						Arbor Day Foundation produces an annual report. The
						2023-2024 available for viewing (<a
							href="https://www.arborday.org/annual-report"
							rel="noreferrer"
							target="_blank"
							>Link</a
						>) which contains detailed information on revenue,
						expenses, and breakdowns.
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
