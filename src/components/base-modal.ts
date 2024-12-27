import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from '../style.css?inline';

@customElement('base-modal')
export class BaseModal extends LitElement {
	@property({ type: Boolean, reflect: true })
	isOpen = false;

	@property({ type: Boolean, reflect: true })
	isDonateModal = false;

	// When the `isOpen` property changes, show or hide the dialog
	updated(changedProperties: Map<string | number | symbol, unknown>) {
		if (changedProperties.has('isOpen')) {
			const dialog = this.shadowRoot?.querySelector('dialog');
			const backdrop = this.shadowRoot?.querySelector('.backdrop');
			if (this.isOpen) {
				dialog?.showModal();
				backdrop?.classList.add('open');
			} else {
				dialog?.close();
				backdrop?.classList.remove('open');
			}
		}
	}

	firstUpdated() {
		const dialog = this.shadowRoot?.querySelector('dialog');
		if (dialog) {
			// Listen for the `close` event and emit a custom event
			// Doing this to sync isOpen from derived components
			dialog.addEventListener('close', () => {
				this.isOpen = false;
				this.dispatchEvent(
					new CustomEvent('modal-closed', {
						bubbles: true,
						composed: true,
					}),
				);
			});

			// Close the modal when clicking outside of it
			dialog.addEventListener('click', (event) => {
				const rect = dialog.getBoundingClientRect();
				const isInDialog =
					rect.top <= event.clientY &&
					event.clientY <= rect.top + rect.height &&
					rect.left <= event.clientX &&
					event.clientX <= rect.left + rect.width;
				if (!isInDialog) {
					this.isOpen = false;
				}
			});
		}
	}

	render() {
		return html`
			<div class="backdrop"></div>
			<dialog class="modal ${!this.isDonateModal && 'wood'}">
				<button
					class="absolute right-4 top-2 z-10 p-1 text-lg"
					value="cancel"
					@click=${() => (this.isOpen = false)}
				>
					&times
				</button>
				<slot name="header"></slot>
				<slot name="separator"></slot>
				<div class="modal-content">
					<slot name="content"></slot>
				</div>
			</dialog>
		`;
	}

	static get styles() {
		return unsafeCSS(styles);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'base-modal': BaseModal;
	}
}
