import { addRxPlugin, createRxDatabase, RxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';

export interface LeafInfo {
	x: number;
	y: number;
	tint: number;
}

class LeafDatabase {
	static #instance: RxDatabase;

	public static get instance() {
		return async () => {
			if (!this.#instance) {
				if (import.meta.env.DEV) {
					addRxPlugin(RxDBDevModePlugin);
				}

				this.#instance = await createRxDatabase({
					name: 'f4f-branch-db',
					storage: getRxStorageMemory(),
				});

				if (!this.#instance.branches) {
					await this.#instance.addCollections({
						leaves: {
							schema: {
								version: 0,
								primaryKey: 'id',
								type: 'object',
								properties: {
									id: { type: 'string', maxLength: 15 },
									x: { type: 'number' },
									y: { type: 'number' },
									tint: { type: 'number' },
								},
							},
						},
					});
				}
			}

			return this.#instance;
		};
	}
}

export default LeafDatabase.instance;
