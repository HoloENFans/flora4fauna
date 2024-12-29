import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './base-modal.ts';
import { RxDatabase } from 'rxdb';
import Database, { LeafInfo } from '../database.ts';
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
	db: RxDatabase | undefined = undefined;

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
		// Close the popup if already open
		DonationPopup.setDonation(null, 0);

		this.handleModalClosed();

		if (this.viewport !== undefined) {
			const sameCenters =
				Math.abs(this.viewport.center.x - leafInfo.x) <
					Number.EPSILON &&
				Math.abs(this.viewport.center.y - leafInfo.y) < Number.EPSILON;

			if (sameCenters) {
				// If they have the same coordinates just zoom in and open the donation popup.

				this.viewport.snapZoom({
					width: 1, // Don't set this to 0 or things break horribly.
					removeOnComplete: true,
					interrupt: false,
					time: 550,
					forceStart: true,
				});

				DonationPopup.setDonation(donation, leafInfo.tint);
			} else {
				// Snap, wait for it to end, then open the donation popup.

				this.viewport.addEventListener(
					'snap-end',
					() => DonationPopup.setDonation(donation, leafInfo.tint),
					{
						once: true,
					},
				);

				this.viewport.snap(leafInfo.x, leafInfo.y, {
					removeOnComplete: true,
					interrupt: false,
					time: 600,
					forceStart: true,
				});

				this.viewport.snapZoom({
					width: 1, // Don't set this to 0 or things break horribly.
					removeOnComplete: true,
					interrupt: false,
					time: 550,
					forceStart: true,
				});
			}
		} else {
			// If the viewport somehow doesn't exist then just fall back to opening
			// the donation popup without any viewport magic.
			DonationPopup.setDonation(donation, leafInfo.tint);
		}
	}

	private async findDonationsForUser() {
		if (this.db === undefined) {
			this.db = await Database();
		}

		const docs = await this.db.donations
			.find({
				selector: {
					// TODO: How should we handle anonymous donation usernames?
					username: {
						$regex: `^${this.searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
						$options: 'i',
					},
				},
				sort: [{ updated: 'desc' }],
			})
			.exec();

		return docs as (Donation & { id: string })[];
	}

	private async findLeafForId(id: string) {
		if (this.db === undefined) {
			this.db = await Database();
		}

		return (await this.db.leaves
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
			errorText = "Couldn't find any donations, please try again";
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
