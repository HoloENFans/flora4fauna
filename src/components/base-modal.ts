import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from '../style.css?inline';

@customElement('base-modal')
export class BaseModal extends LitElement {
	@property({ type: Boolean, reflect: true })
	isOpen = false;

	// When the `isOpen` property changes, show or hide the dialog
	updated(changedProperties: Map<string | number | symbol, unknown>) {
		if (changedProperties.has('isOpen')) {
			const dialog = this.shadowRoot?.querySelector('dialog');
			if (this.isOpen) {
				dialog?.showModal();
			} else {
				dialog?.close();
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
		}
	}

	render() {
		return html`
			<dialog class="modal">
				<button
					class="absolute right-4 top-2 z-10 p-1"
					value="cancel"
					@click=${() => (this.isOpen = false)}
				>
					&times
				</button>
				<slot></slot>
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
