import pb from './pocketbase.ts';

export interface Setting {
	id: string;
	value: string;
}

class Settings {
	static #instance: Settings;

	private target: EventTarget;
	public prev: Record<string, string>;
	public current: Record<string, string>;

	constructor() {
		this.target = new EventTarget();
		this.prev = {};
		this.current = {};

		void (async () => {
			const settings = await pb
				.collection<Setting>('settings')
				.getList(1, 100);
			settings.items.forEach((setting) => {
				this.current[setting.id] = setting.value;
				this.emit(setting);
			});

			await pb.collection<Setting>('settings').subscribe('*', (e) => {
				this.prev[e.record.id] = this.current[e.record.id];
				this.current[e.record.id] = e.record.value;
				this.emit(e.record);
			});
		})();
	}

	static get instance() {
		if (!this.#instance) {
			this.#instance = new Settings();
		}

		return this.#instance;
	}

	public on(eventName: string, listener: EventListenerOrEventListenerObject) {
		return this.target.addEventListener(eventName, listener);
	}

	public once(
		eventName: string,
		listener: EventListenerOrEventListenerObject,
	) {
		return this.target.addEventListener(eventName, listener, {
			once: true,
		});
	}

	public off(
		eventName: string,
		listener: EventListenerOrEventListenerObject,
	) {
		return this.target.removeEventListener(eventName, listener);
	}

	private emit(setting: Setting) {
		return this.target.dispatchEvent(
			new CustomEvent<string>(setting.id, { detail: setting.value }),
		);
	}
}

export default Settings.instance;
