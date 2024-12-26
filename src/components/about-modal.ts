import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import './base-modal.ts';

@customElement('about-modal')
export class AboutModal extends LitElement {
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
				<h1 slot="header">About Modal</h1>

				<div class="separator" slot="separator"></div>

				<!-- Audio volume controller -->

				<div class="mt-6 flex flex-col gap-4" slot="content">
					<div>
						<h2>Overview</h2>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Sed ullamcorper, sapien nec tincidunt
							tincidunt, nunc nulla ultricies purus, ut fermentum
							nunc libero in purus. Integer ac odio scelerisque,
							fermentum ipsum nec, tincidunt odio. Donec
							consectetur, nunc nec vehicula ultricies, nunc nunc
							ultricies
						</p>
					</div>
				</div>
			</base-modal>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'about-modal': AboutModal;
	}
}
