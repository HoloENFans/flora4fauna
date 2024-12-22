import { AboutModal } from './components/about-modal.js';
import { AccountabilityModal } from './components/accountability-modal.js';

const openAboutModalButton = document.getElementById('open-about-modal');
const aboutModal: AboutModal | null = document.querySelector('about-modal');

openAboutModalButton?.addEventListener('click', () => {
	if (aboutModal) {
		aboutModal.openModal();
	}
});

const openAccountabilityModalButton = document.getElementById(
	'open-accountability-modal',
);
const accountabilityModal: AccountabilityModal | null = document.querySelector(
	'accountability-modal',
);

openAccountabilityModalButton?.addEventListener('click', () => {
	if (accountabilityModal) {
		accountabilityModal.openModal();
	}
});
