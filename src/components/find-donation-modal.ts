import { html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './base-modal.ts';
import { RxDatabase } from 'rxdb';
import BranchDatabase, { DonationLeafInfo } from '../branchDatabase.ts';
import { Viewport } from 'pixi-viewport';

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
	branchDb: RxDatabase | undefined = undefined;

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

	private snapAndZoom(x: number, y: number) {
		this.handleModalClosed();

		if (this.viewport !== undefined) {
			this.viewport.zoomPercent(1, true);

			this.viewport.snap(x, y, {
				removeOnComplete: true,
				removeOnInterrupt: true,
			});

			this.viewport.snapZoom({
				width: 1,
				removeOnComplete: true,
				removeOnInterrupt: true,
			});
		}
	}

	private async searchName() {
		if (this.searchText.length == 0) {
			this.currentError = ErrorType.EmptySearch;
		} else {
			this.currentError = null;

			if (this.branchDb === undefined) {
				this.branchDb = await BranchDatabase();
			}

			// TODO: How should we handle anonymous donation usernames?
			const donations = (await this.branchDb.branches
				.find({
					selector: {
						username: { $eq: this.searchText },
					},
					sort: [{ updated: 'desc' }],
				})
				.exec()) as DonationLeafInfo[];

			if (donations.length > 0) {
				// Just do last (by update time) donation wins for now.
				const lastDonation = donations[0];

				this.snapAndZoom(lastDonation.x, lastDonation.y);
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
