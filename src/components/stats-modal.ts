import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './base-modal.ts';
import { CountUp } from 'countup.js';
import Stats from '../stats.ts';

@customElement('stats-modal')
export class StatsModal extends LitElement {
	@property({ type: Boolean, reflect: true })
	isOpen = false;

	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}

	protected firstUpdated() {
		const donationCounter = new CountUp(
			'stats-modal-donation-count',
			Stats.donationCount,
		);
		const totalRaisedCounter = new CountUp(
			'stats-modal-total-raised',
			Stats.totalRaised,
			{
				prefix: '$',
			},
		);

		donationCounter.start();
		totalRaisedCounter.start();

		Stats.on('totalRaised', (e) => {
			totalRaisedCounter.update((e as CustomEvent<number>).detail);
		});

		Stats.on('donationCount', (e) => {
			donationCounter.update((e as CustomEvent<number>).detail);
		});
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
					<p
						class="flex items-center justify-between gap-20 text-xl font-bold md:gap-0"
					>
						<span class="underline underline-offset-4"
							>Number of donations:</span
						>
						<span
							class="bordered-text"
							id="stats-modal-donation-count"
						></span>
					</p>

					<p
						class="flex items-center justify-between text-xl font-bold"
					>
						<span class="underline underline-offset-4"
							>Total amount raised:</span
						>
						<span
							class="bordered-text"
							id="stats-modal-total-raised"
						>
						</span>
					</p>
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
