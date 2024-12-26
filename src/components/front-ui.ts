import { CountUp } from 'countup.js';
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import Stats from '../stats.ts';
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
				<div
					class="fixed bottom-0 z-10 hidden w-screen items-center justify-evenly bg-black/65 md:flex"
				>
					<button id="open-about-modal" class="front-button">
						About
					</button>
					<button id="open-accountability-modal" class="front-button">
						Accountability
					</button>
					<button
						class="front-button donate-label"
						id="open-donate-modal"
					>
						Donate
					</button>
					<div
						id="open-stats-modal"
						class="front-button flex flex-col items-center"
					>
						<span class="text-xl">Raised</span>
						<span id="navbar-total-raised"></span>
					</div>
					<button id="open-find-donation-modal" class="front-button">
						Find Donation
					</button>
				</div>

				<!-- Mobile Nav -->
				<mobile-nav></mobile-nav>

				<!-- Modals -->
				<accountability-modal></accountability-modal>
				<about-modal></about-modal>
				<donate-modal></donate-modal>
				<find-donation-modal></find-donation-modal>
				<stats-modal></stats-modal>
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
		addClickListener('stats-modal');

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

		const countUp = new CountUp('navbar-total-raised', Stats.totalRaised, {
			prefix: '$',
		});
		countUp.start();

		Stats.on('totalRaised', (e) => {
			const value = (e as CustomEvent<number>).detail;
			countUp.update(value);
		});
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'front-ui': FrontUi;
	}
}
