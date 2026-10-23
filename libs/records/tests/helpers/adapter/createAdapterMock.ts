import { join } from 'node:path';

import type { ArtContentSource } from '@art-md/primitives';

export type AdapterMockFile = {
	filename: string;
	basePath: string;
	path: string;
	content?: string;
	error?: Error;
};

export type AdapterMock = {
	readonly basePath: string;
	discoverRecordFiles(): Promise<AdapterMockFile[]>;
	createContentSource(file: AdapterMockFile): ArtContentSource;
	getFileContent(path: string): string | undefined;
};

export type AdapterMockOptions = {
	basePath: string;
	files: Record<string, string>;
};

/**
 * Builds an in-memory stand-in for the filesystem records adapter.
 *
 * `files` maps a path relative to `basePath` to its content. Discovery returns
 * the `.art` files under `_records/`, matching the contract the records tests
 * rely on without depending on the filesystem adapter package.
 */
export function createAdapterMock(options: AdapterMockOptions): AdapterMock {
	const { basePath, files } = options;

	function toRecordFile(path: string): AdapterMockFile {
		return {
			filename: join(basePath, path),
			basePath,
			path,
			content: files[path],
		};
	}

	async function discoverRecordFiles(): Promise<AdapterMockFile[]> {
		const paths = Object.keys(files)
			.filter(path => path.startsWith('_records/'))
			.filter(path => path.endsWith('.art'))
			.sort();

		return paths.map(toRecordFile);
	}

	function createContentSource(file: AdapterMockFile): ArtContentSource {
		function getContent(): string {
			const content = files[file.path];

			if (content === undefined) {
				throw new Error(`No content for ${file.path}`);
			}

			return content;
		}

		return {
			type: 'mock',
			uri: file.filename,
			maybeContent: files[file.path],
			async readContent() {
				return getContent();
			},
			async writeContent(content: string) {
				files[file.path] = content;
			},
		};
	}

	return {
		basePath,
		discoverRecordFiles,
		createContentSource,
		getFileContent(path: string) {
			return files[path];
		},
	};
}
