import {
	addRxPlugin,
	createRxDatabase,
	RxDatabase,
	RxReplicationPullStreamItem,
} from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { Subject } from 'rxjs';
import { replicateRxCollection } from 'rxdb/plugins/replication';
import type { RecordListOptions } from 'pocketbase';
import type { Donation } from './donationPopup.ts';
import pb from './pocketbase.ts';

class Database {
	static #instance: RxDatabase;

	public static get instance() {
		return async () => {
			if (!this.#instance) {
				if (import.meta.env.DEV) {
					addRxPlugin(RxDBDevModePlugin);
				}

				this.#instance = await createRxDatabase({
					name: 'flora4fauna',
					storage: getRxStorageDexie(),
				});

				if (!this.#instance.donations) {
					await this.#instance.addCollections({
						donations: {
							schema: {
								version: 0,
								primaryKey: 'id',
								type: 'object',
								properties: {
									id: { type: 'string', maxLength: 15 },
									username: { type: 'string' },
									message: { type: 'string' },
									amount: { type: 'number' },
									created: { type: 'string' },
									updated: { type: 'string' },
								},
								required: [
									'id',
									'username',
									'message',
									'amount',
									'created',
									'updated',
								],
							},
						},
					});
				}

				const pullStream$ = new Subject<
					RxReplicationPullStreamItem<Donation, { updated: string }>
				>();

				const unsubscribe = await pb
					.collection('donations')
					.subscribe<Donation>('*', (e) => {
						pullStream$.next({
							documents: [{ ...e.record, _deleted: false }],
							checkpoint: { updated: e.record.updated },
						});
					});

				addEventListener('beforeunload', () => {
					void unsubscribe();
				});

				replicateRxCollection<
					Donation,
					{ updated: string } | undefined
				>({
					collection: this.#instance.donations,
					replicationIdentifier: 'cms-donations-replication',
					pull: {
						async handler(checkpoint, batchSize) {
							const options: RecordListOptions = {
								sort: '-updated',
							};

							if (checkpoint) {
								options.filter = `(updated>'${checkpoint.updated}')`;
							}

							const result = await pb
								.collection('donations')
								.getList<Donation>(1, batchSize, options);

							return {
								documents: result.items.map((donation) => ({
									...donation,
									_deleted: false,
								})),
								checkpoint:
									result.items.length > 0 ?
										{ updated: result.items[0].updated }
									:	checkpoint,
							};
						},
						stream$: pullStream$,
					},
				});
			}

			return this.#instance;
		};
	}
}

export default Database.instance;
