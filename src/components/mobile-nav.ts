import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseModal } from './base-modal';
import { CountUp } from 'countup.js';
import Stats from '../stats.ts';
import { setupDrawer } from '../utils/drawer-utils';

@customElement('mobile-nav')
export class MobileNav extends LitElement {
	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}

	render() {
		return html`
			<div
				class="fixed bottom-0 flex w-screen items-center justify-center transition-opacity hover:opacity-70 md:hidden"
			>
				<button
					class="bordered-text flex flex-col items-center justify-center text-3xl font-bold drop-shadow-lg"
					id="mobile-nav-open-bar"
				>
					<span class="open-arrow">▲</span>
					<span class="-mt-2 mb-4">Tap for more info</span>
				</button>
			</div>
			<div
				class="grass absolute bottom-0 z-20 w-screen translate-y-full pt-10 md:hidden"
				id="mobile-nav-drawer"
			>
				<button
					class="bordered-text absolute right-4 top-16 font-bold hover:opacity-70"
					id="mobile-nav-close-bar"
				>
					<p class="text-2xl">×</p>
				</button>

				<button
					id="open-mobile-stats-modal"
					class="bordered-text mx-auto mt-4 flex flex-col items-center justify-center font-bold"
				>
					<span>Total Raised</span>
					<span class="text-4xl" id="mobile-total-raised"></span>
				</button>

				<div class="grid grid-cols-2 justify-center gap-2 px-8 py-4">
					<button class="btn" id="open-mobile-donate-modal">
						Donate
					</button>
					<button class="btn" id="open-mobile-about-modal">
						About
					</button>
					<button class="btn" id="open-mobile-accountability-modal">
						Accountability
					</button>
					<button class="btn" id="open-mobile-find-donation-modal">
						Find Donation
					</button>
				</div>
			</div>
		`;
	}

	firstUpdated() {
		// Set up modals
		const addClickListener = (query: string) => {
			const modalButton = document.querySelector('#open-mobile-' + query);
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

		// Set up drawer
		setupDrawer(
			'mobile-nav-open-bar',
			'mobile-nav-close-bar',
			'mobile-nav-drawer',
		);

		// CountUp for "Total Raised"
		const countUp = new CountUp('mobile-total-raised', Stats.totalRaised, {
			prefix: '$',
		});
		countUp.start();

		Stats.on('totalRaised', (e) => {
			countUp.update((e as CustomEvent<number>).detail);
		});
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'mobile-nav': MobileNav;
	}
}
