import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './base-modal.ts';
import { RxDatabase } from 'rxdb';
import LeafDatabase, { LeafInfo } from '../leafDatabase.ts';
import Database from '../database.ts';
import { Viewport } from 'pixi-viewport';
import DonationPopup, { Donation } from '../donationPopup.ts';

enum ErrorType {
	EmptySearch,
	NoDonationFound,
}

@customElement('find-donation-modal')
export class FindDonationModal extends LitElement {
	@property({ type: Boolean, reflect: true })
	isOpen = false;

	@property({ type: Viewport })
	viewport: Viewport | undefined = undefined;

	@state()
	searchText = '';

	@state()
	currentError: ErrorType | null = null;

	@state()
	donationDb: RxDatabase | undefined = undefined;

	@state()
	leafDb: RxDatabase | undefined = undefined;

	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}

	handleModalClosed() {
		this.isOpen = false;

		// Reset some state.
		this.searchText = '';
		this.currentError = null;
	}

	private updateText(event: InputEvent) {
		this.currentError = null;

		const target = event.target;

		if (target == null) {
			return;
		}

		this.searchText = (target as HTMLInputElement).value;
	}

	private moveToLeaf(leafInfo: LeafInfo, donation: Donation) {
		this.handleModalClosed();

		if (this.viewport !== undefined) {
			this.viewport.zoomPercent(1, true);

			this.viewport.snap(leafInfo.x, leafInfo.y, {
				removeOnComplete: true,
				removeOnInterrupt: true,
			});

			this.viewport.snapZoom({
				width: 1, // Don't set this to 0 or things break horribly.
				removeOnComplete: true,
				removeOnInterrupt: true,
			});
		}

		DonationPopup.setDonation(donation, leafInfo.tint);
	}

	private async findDonationsForUser() {
		if (this.donationDb === undefined) {
			this.donationDb = await Database();
		}

		const docs = await this.donationDb.donations
			.find({
				selector: {
					// TODO: How should we handle anonymous donation usernames?
					username: { $eq: this.searchText },
				},
				sort: [{ updated: 'desc' }],
			})
			.exec();

		return docs as (Donation & { id: string })[];
	}

	private async findLeafForId(id: string) {
		if (this.leafDb === undefined) {
			this.leafDb = await LeafDatabase();
		}

		return (await this.leafDb.leaves
			.findOne({
				selector: {
					id: { $eq: id },
				},
			})
			.exec()) as LeafInfo;
	}

	private async searchName() {
		if (this.searchText.length == 0) {
			this.currentError = ErrorType.EmptySearch;
		} else {
			this.currentError = null;

			const donations = await this.findDonationsForUser();

			if (donations.length > 0) {
				// Just do last (by update time) donation wins for now.
				const lastDonation = donations[0];
				const leafInfo = await this.findLeafForId(lastDonation.id);

				this.moveToLeaf(leafInfo, lastDonation as Donation);
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
					<p>
						Search for your donation by entering your sapling name!
					</p>
					<input
						type="text"
						id="sapling-name"
						name="sapling-name"
						placeholder="Your Sapling Name..."
						required
						autofocus
						class="${isError ? 'text-input-error' : (
							'text-input'
						)} text-lg"
						@input="${(event: InputEvent) =>
							this.updateText(event)}"
						.value="${this.searchText}"
						@keydown="${async (event: KeyboardEvent) => {
							if (event.key == 'Enter') {
								await this.searchName();
							}
						}}"
					/>
					${errorText !== undefined ?
						html`<p class="-mt-3 font-bold text-red-500">
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
