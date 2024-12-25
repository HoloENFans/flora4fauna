import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BaseModal } from './base-modal';
import { CountUp } from 'countup.js';
import Stats from '../stats.ts';

@customElement('mobile-nav')
export class MobileNav extends LitElement {
	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}

	render() {
		return html`
			<div
				class="fixed bottom-0 flex w-screen items-center justify-center md:hidden"
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
				class="thingy absolute bottom-0 z-20 w-screen translate-y-full bg-black/60 md:hidden"
				id="mobile-nav-drawer"
			>
				<button
					class="bordered-text absolute right-4 top-2 font-bold"
					id="mobile-nav-close-bar"
				>
					<p class="text-xl">×</p>
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
		// Duplicating the same from front-ui since can't have same ids as the buttons defined there
		// And I don't know how to handle that properly
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

		const mobileNavOpenBtn = document.getElementById(
			'mobile-nav-open-bar',
		)!;
		const mobileNavCloseBtn = document.getElementById(
			'mobile-nav-close-bar',
		)!;
		const mobileNavDrawer = document.getElementById('mobile-nav-drawer')!;
		mobileNavDrawer.classList.add('transition-transform', 'duration-300');
		mobileNavOpenBtn.addEventListener('click', () => {
			mobileNavDrawer.classList.remove('translate-y-full');
			mobileNavOpenBtn.classList.add('hidden');
		});
		mobileNavCloseBtn.addEventListener('click', () => {
			mobileNavDrawer.classList.add('translate-y-full');
			mobileNavOpenBtn.classList.remove('hidden');
		});

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
