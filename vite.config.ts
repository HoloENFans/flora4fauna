import { defineConfig, type Plugin, type ResolvedConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import { AssetPack } from '@assetpack/core';
import { pixiPipes } from '@assetpack/core/pixi';

function assetpackPlugin(): Plugin {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const apConfig: any = {
		entry: './assets',
		output: './public/assets',
		pipes: [
			...pixiPipes({
				cacheBust: true,
				resolutions: { default: 1, low: 0.5 },
				compression: { jpg: true, png: true, webp: true },
				texturePacker: {
					texturePacker: {
						removeFileExtension: true,
					},
				},
				audio: {},
				manifest: { createShortcuts: true, trimExtensions: true },
			}),
		],
	};

	let mode: ResolvedConfig['command'];
	let ap: AssetPack | undefined;

	return {
		name: 'vite-plugin-assetpack',
		configResolved(resolvedConfig) {
			mode = resolvedConfig.command;
		},
		buildStart: async () => {
			if (mode === 'serve') {
				if (ap) return;
				ap = new AssetPack(apConfig);
				void ap.watch();
			} else {
				await new AssetPack(apConfig).run();
			}
		},
		buildEnd: async () => {
			if (ap) {
				await ap.stop();
				ap = undefined;
			}
		},
	};
}

export default defineConfig({
	plugins: [assetpackPlugin()],
	css: {
		postcss: {
			plugins: [tailwindcss],
		},
	},
});
