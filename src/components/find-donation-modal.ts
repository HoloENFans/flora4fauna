import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './base-modal.ts';
import { RxDatabase } from 'rxdb';
import Database from '../database.ts';
import { Donation } from '../donationPopup.ts';

enum ErrorType {
	EmptySearch,
	NoDonationFound,
}

@customElement('find-donation-modal')
export class FindDonationModal extends LitElement {
	@property({ type: Boolean, reflect: true })
	isOpen = false;

	@state()
	searchText = '';

	@state()
	currentError: ErrorType | null = null;

	@state()
	db: RxDatabase | undefined = undefined;

	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}

	handleModalClosed() {
		this.isOpen = false;
	}

	private updateText(event: InputEvent) {
		this.currentError = null;

		const target = event.target;

		if (target == null) {
			return;
		}

		this.searchText = (target as HTMLInputElement).value;
	}

	private async searchName() {
		if (this.searchText.length == 0) {
			this.currentError = ErrorType.EmptySearch;
		} else {
			this.currentError = null;

			if (this.db === undefined) {
				this.db = await Database();
			}

			const donations = (await this.db.donations
				.find({
					selector: {
						username: { $eq: this.searchText },
					},
				})
				.exec()) as Donation[];

			if (donations.length > 0) {
				// Just do last donation (by update time) wins.
				//
				// TODO: How should we handle anonymous donations?
				donations.sort((a, b) => {
					// Assuming update dates are ISO 8601 dates...
					if (a.updated < b.updated) return -1;
					else if (a.updated > b.updated) return 1;
					else return 0;
				});

				const lastDonation = donations[donations.length - 1];
			} else {
				// TODO: Return a message saying that there was no result found.
				this.currentError = ErrorType.NoDonationFound;
			}
		}
	}

	render() {
		const isError = this.currentError !== null;

		let errorText = undefined;
		if (this.currentError === ErrorType.EmptySearch) {
			errorText = 'Enter a username';
		} else if (this.currentError === ErrorType.NoDonationFound) {
			errorText = 'No donations found for that username';
		}

		return html`
			<base-modal
				.isOpen=${this.isOpen}
				@modal-closed=${() => this.handleModalClosed()}
			>
				<h1 slot="header">Find Donation</h1>
				<div class="separator" slot="separator"></div>

				<div slot="content" class="flex flex-col gap-4">
					<p class="text-lg">
						Search for your donation by entering your sapling name!
					</p>
					<input
						type="text"
						id="sapling-name"
						name="sapling-name"
						placeholder="Your Sapling Name..."
						required
						class="${isError ? 'text-input-error' : (
							'text-input'
						)} text-lg"
						@input="${(event: InputEvent) =>
							this.updateText(event)}"
						@keydown="${async (event: KeyboardEvent) => {
							if (event.key == 'Enter') {
								await this.searchName();
							}
						}}"
					/>
					${errorText !== undefined ?
						html`<p class="-mt-3 text-lg text-red-500">
							${errorText}
						</p>`
					:	html``}
					<button
						id="find-donation"
						class="btn btn-grass text-xl"
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
