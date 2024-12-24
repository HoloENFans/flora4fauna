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
						class="fixed bottom-0 z-10 flex h-24 w-screen items-center gap-6 bg-[#E0E5DC] px-8"
					>
						<button class="btn" id="open-donate-modal">
							Donate
						</button>
						<button id="open-about-modal" class="btn">
							Open About Modal
						</button>
						<button id="open-accountability-modal" class="btn">
							Open Accountability Modal
						</button>
					</div>
				</div>

				<!-- Modals -->
				<accountability-modal></accountability-modal>
				<about-modal></about-modal>
				<donate-modal></donate-modal>
			</div>
		`;
	}
	updated() {
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
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'front-ui': FrontUi;
	}
}
