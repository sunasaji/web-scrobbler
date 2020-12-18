import { Storage as BrowserStorage } from 'webextension-polyfill-ts';

import { Storage } from '@/background/storage2/Storage';

/**
 * Storage implementation that wraps `chrome.storage.StorageArea`.
 *
 * This storage supports namespaces.
 */
export class NamespaceStorage<T> implements Storage<T> {
	private storage: BrowserStorage.StorageArea;
	private namespace: string;

	/**
	 * @param storage StorageArea object
	 * @param namespace Storage namespace
	 */
	constructor(storage: BrowserStorage.StorageArea, namespace: string) {
		this.storage = storage;
		this.namespace = namespace;
	}

	async get(): Promise<T> {
		const data = await this.storage.get();
		if (data && this.namespace in data) {
			return data[this.namespace] as T;
		}

		return {} as T;
	}

	async set(data: T): Promise<void> {
		const dataToSave = {};
		dataToSave[this.namespace] = data;

		await this.storage.set(dataToSave);
	}

	async update(data: Partial<T>): Promise<void> {
		const storageData = await this.get();
		const dataToSave = Object.assign(storageData, data);

		await this.set(dataToSave);
	}

	async clear(): Promise<void> {
		await this.storage.remove(this.namespace);
	}
}
