import { addRxPlugin, createRxDatabase, RxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';

export interface DonationLeafInfo {
	username: string;
	x: number;
	y: number;
	updated: string;
}

class BranchDatabase {
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
						branches: {
							schema: {
								version: 0,
								primaryKey: 'id',
								type: 'object',
								properties: {
									id: { type: 'string', maxLength: 15 },
									username: { type: 'string' },
									x: { type: 'number' },
									y: { type: 'number' },
									updated: { type: 'string' },
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

export default BranchDatabase.instance;
