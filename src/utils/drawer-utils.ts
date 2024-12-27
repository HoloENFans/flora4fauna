export function setupDrawer(
	openButtonId: string,
	closeButtonId: string,
	drawerId: string,
) {
	const openButton = document.getElementById(openButtonId);
	const closeButton = document.getElementById(closeButtonId);
	const drawer = document.getElementById(drawerId);

	if (drawer && openButton && closeButton) {
		drawer.classList.add('transition-transform', 'duration-300');
		// Hide the drawer by default
		drawer.classList.add('translate-y-full');

		openButton.addEventListener('click', () => {
			drawer.classList.remove('translate-y-full');
			openButton.classList.add('hidden');
		});

		closeButton.addEventListener('click', () => {
			drawer.classList.add('translate-y-full');
			openButton.classList.remove('hidden');
		});
	}
}
