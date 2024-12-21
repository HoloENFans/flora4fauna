class ModalDialog extends HTMLDialogElement {
	constructor() {
		super();
		this.initialize().catch((error) =>
			console.error('Initialization failed:', error),
		);
	}

	private async initialize() {
		// Fetch the modal HTML template
		const response = await fetch(
			'/src/components/modal-about/modal-about.html',
		);
		if (!response.ok) {
			throw new Error('Failed to load modal template');
		}

		const modalTemplate = await response.text();
		this.innerHTML = modalTemplate;

		// Add close button functionality
		const closeButton = this.querySelector('.close');
		if (closeButton) {
			closeButton.addEventListener('click', () => this.close());
		}
	}
}

customElements.define('modal-about', ModalDialog, { extends: 'dialog' });
