import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('accountability-modal')
export class AccountabilityModal extends LitElement {
	@property({ type: Boolean, reflect: true })
	isOpen = false;

	// Disable Shadow DOM to use global Tailwind styles.
	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}

	// Handle opening the modal
	openModal() {
		this.isOpen = true;
		const dialog: HTMLDialogElement | null = this.querySelector(
			'#accountability-modal',
		);
		dialog?.showModal();
	}

	// Handle closing the modal
	closeModal() {
		this.isOpen = false;
		const dialog: HTMLDialogElement | null = this.querySelector(
			'#accountability-modal',
		);
		dialog?.close();
	}

	render() {
		return html`
			<dialog
				?open=${this.isOpen}
				class="modal"
				id="accountability-modal"
			>
				<button class="btn" @click=${() => this.closeModal()}>
					Close
				</button>
				<p>Accountibility modal</p>
			</dialog>
		`;
	}
}
