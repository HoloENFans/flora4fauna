import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './base-modal.ts';

@customElement('stats-modal')
export class StatsModal extends LitElement {
	@property({ type: Boolean, reflect: true })
	isOpen = false;

	@property({ type: Number })
	donations = 0;

	@property({ type: Number })
	totalAmount = 0;

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
				<h1 slot="header">Contributions</h1>
				<div class="separator" slot="separator"></div>

				<div
					slot="content"
					class="flex flex-col gap-4 md:min-w-[500px]"
				>
					<h2
						class="flex items-center justify-between gap-10 md:gap-0"
					>
						<span class="underline underline-offset-4"
							>Number of donations:</span
						>
						<span class="bordered-text"
							>${this.donations.toLocaleString('en-US')}</span
						>
					</h2>

					<h2 class="flex items-center justify-between">
						<span class="underline underline-offset-4"
							>Total amount raised:</span
						>
						<span class="bordered-text"
							>${this.totalAmount.toLocaleString('en-US', {
								style: 'currency',
								currency: 'USD',
								minimumFractionDigits: 0,
							})}
						</span>
					</h2>
				</div>
			</base-modal>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'stats-modal': StatsModal;
	}
}
