import { CountUp } from 'countup.js';
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import Stats from '../stats.ts';
import { BaseModal } from './base-modal';
import { setupDrawer } from '../utils/drawer-utils';

@customElement('front-ui')
export class FrontUi extends LitElement {
	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}

	render() {
		return html`
			<div>
				<div class="absolute left-6 top-4">
					<volume-control></volume-control>
				</div>
				<div
					class="fixed bottom-0 left-1/2 hidden -translate-x-1/2 transition-opacity hover:opacity-70 md:block"
				>
					<button
						class="bordered-text flex flex-col items-center justify-center text-3xl font-bold drop-shadow-lg"
						id="nav-open-bar"
					>
						<span class="open-arrow">▲</span>
						<span class="-mt-2 mb-4">Tap for more info</span>
					</button>
				</div>
				<!-- Navbar -->
				<div
					class="grass fixed bottom-0 z-10 hidden w-screen items-center justify-evenly pt-10 md:flex"
					id="nav-drawer"
				>
					<button
						class="bordered-text absolute right-4 top-10 font-bold hover:opacity-70"
						id="nav-close-bar"
					>
						<p class="text-2xl">×</p>
					</button>
					<button id="open-about-modal" class="front-button">
						About
					</button>
					<button id="open-accountability-modal" class="front-button">
						Accountability
					</button>
					<button
						class="donate-label btn-donate btn-wood mb-1"
						id="open-donate-modal"
						style="padding: 1rem 2rem;"
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

		setupDrawer('nav-open-bar', 'nav-close-bar', 'nav-drawer');

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
