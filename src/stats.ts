import pb from './pocketbase.ts';
import Database from './database.ts';
import { RxDatabase } from 'rxdb';

type EventType = 'totalRaised' | 'totalTipAmount' | 'donationCount';

interface IStats {
	amount: number;
	tipAmount: number;
	count: number;
}

class Stats {
	static #instance: Stats;

	private eventTarget: EventTarget;
	private db: RxDatabase | undefined;

	public totalRaised = 0;
	public totalTipAmount = 0;
	public donationCount = 0;

	constructor() {
		this.eventTarget = new EventTarget();
		void this.updateStats();

		setInterval(() => {
			void this.updateStats();
		}, 30_000);
		void this.setupFeed();
	}

	static get instance() {
		if (!this.#instance) {
			this.#instance = new Stats();
		}

		return this.#instance;
	}

	public on(
		eventName: EventType,
		listener: EventListenerOrEventListenerObject,
	) {
		return this.eventTarget.addEventListener(eventName, listener);
	}

	public off(
		eventName: EventType,
		listener: EventListenerOrEventListenerObject,
	) {
		return this.eventTarget.removeEventListener(eventName, listener);
	}

	private emit(eventName: EventType, value: number) {
		this.eventTarget.dispatchEvent(
			new CustomEvent(eventName, {
				detail: value,
			}),
		);
	}

	private async updateStats() {
		const overview = await pb
			.collection<IStats>('overview')
			.getOne('overview');
		if (overview.amount !== this.totalRaised) {
			this.totalRaised = overview.amount;
			this.emit('totalRaised', overview.amount);
		}
		if (overview.tipAmount !== this.totalTipAmount) {
			this.totalTipAmount = overview.tipAmount;
			this.emit('totalTipAmount', overview.tipAmount);
		}
		if (overview.count !== this.donationCount) {
			this.donationCount = overview.count;
			this.emit('donationCount', overview.count);
		}
	}

	private async setupFeed() {
		if (!this.db) {
			this.db = await Database();
		}

		this.db.donations.$.subscribe(() => {
			void this.updateStats();
		});
	}
}

export default Stats.instance;
