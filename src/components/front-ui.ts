import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseModal } from './base-modal';

@customElement('front-ui')
export class FrontUi extends LitElement {
	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}
	render() {
		return html`
			<div>
				<!-- Navbar -->
				<div>
					<div
						class="fixed bottom-0 z-10 flex w-screen items-center justify-evenly bg-[#E0E5DC]"
					>
						<button id="open-about-modal" class="front-button">
							About
						</button>
						<button
							id="open-accountability-modal"
							class="front-button"
						>
							Accountability
						</button>
						<button
							class="front-button donate-label"
							id="open-donate-modal"
						>
							Donate
						</button>
						<div
							id="total-donation"
							class="front-label flex flex-col items-center"
						>
							<span class="text-2xl">Total Raised</span>
							<span id="total-donation-value"></span>
						</div>
						<button
							id="open-find-donation-modal"
							class="front-button"
						>
							Find Donation
						</button>
					</div>
				</div>

				<!-- Modals -->
				<accountability-modal></accountability-modal>
				<about-modal></about-modal>
				<donate-modal></donate-modal>
				<find-donation-modal></find-donation-modal>
			</div>
		`;
	}
	firstUpdated() {
		const addClickListener = (query: string) => {
			const modalButton = document.querySelector('#open-' + query);
			const modal: BaseModal | null = document.querySelector(query);
			modalButton?.addEventListener('click', () => {
				if (modal) {
					modal.isOpen = true;
				}
			});
		};
		addClickListener('accountability-modal');
		addClickListener('about-modal');
		addClickListener('donate-modal');
		addClickListener('find-donation-modal');

		// Check if user has entered page for first time
		// If so, open the about modal
		const hasVisited = localStorage.getItem('hasVisited');
		if (hasVisited !== 'true') {
			const aboutModal = document.querySelector('about-modal');
			if (aboutModal) {
				aboutModal.isOpen = true;
			}
			localStorage.setItem('hasVisited', 'true');
		}

		// Set total donation value, formatted as currency
		// Ex: 1000000 -> $1,000,000
		const totalDonationValue = document.querySelector(
			'#total-donation-value',
		);
		if (totalDonationValue) {
			// Temporary placeholder value
			const totalDonation = 1000000;
			totalDonationValue.textContent = totalDonation.toLocaleString(
				'en-US',
				{
					style: 'currency',
					currency: 'USD',
					minimumFractionDigits: 0,
				},
			);
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'front-ui': FrontUi;
	}
}
