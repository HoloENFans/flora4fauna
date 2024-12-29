import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './base-modal.ts';

@customElement('find-donation-modal')
export class FindDonationModal extends LitElement {
	@property({ type: Boolean, reflect: true })
	isOpen = false;

	@state()
	searchText = '';

	@state()
	flashError = false;

	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}

	handleModalClosed() {
		this.isOpen = false;
	}

	private updateText(event: InputEvent) {
		this.flashError = false;

		const target = event.target;

		if (target == null) {
			return;
		}

		this.searchText = (target as HTMLInputElement).value;
	}

	private searchName() {
		if (this.searchText.length == 0) {
			this.flashError = true;
		} else {
			this.flashError = false;
			console.log(`Searching ${this.searchText}`);
		}
	}

	render() {
		return html`
			<base-modal
				.isOpen=${this.isOpen}
				@modal-closed=${() => this.handleModalClosed()}
			>
				<h1 slot="header">Find Donation</h1>
				<div class="separator" slot="separator"></div>

				<div slot="content" class="flex flex-col gap-4">
					<p>
						Search for your donation by entering your sapling name!
					</p>
					<input
						type="text"
						id="sapling-name"
						name="sapling-name"
						placeholder="Your Sapling Name..."
						required
						class="${this.flashError ? 'text-input-error' : (
							'text-input'
						)}"
						@input="${(event: InputEvent) =>
							this.updateText(event)}"
						@keydown="${(event: KeyboardEvent) => {
							if (event.key == 'Enter') {
								this.searchName();
							}
						}}"
					/>
					<button
						id="find-donation"
						class="btn btn-grass"
						@click="${() => this.searchName()}"
					>
						Find Donation
					</button>
				</div>
			</base-modal>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'find-donation-modal': FindDonationModal;
	}
}
