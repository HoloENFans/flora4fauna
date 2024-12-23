import { BaseModal } from './components';

const addClickListener = (query: string) => {
	const modalButton = document.querySelector(`#open-${query}`);
	const modal: BaseModal | null = document.querySelector(query);
	modalButton?.addEventListener('click', () => {
		if (modal) {
			modal.isOpen = true;
		}
	});
};

addClickListener('accountability-modal');
addClickListener('about-modal');
addClickListener('donate-modal');
