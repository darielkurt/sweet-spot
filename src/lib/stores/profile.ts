import { writable, get } from 'svelte/store';
import type { PaceUnit } from '$lib/utils/pace';

export interface LocalProfile {
	name: string;
	prDistanceKm: number;
	prTimeSeconds: number;
	prDate: string;
	maxHr: number | null;
	pacePreference: PaceUnit;
}

const STORAGE_KEY = 'sweet-spot-profile';

function createProfileStore() {
	const { subscribe, set, update } = writable<LocalProfile | null>(null);

	return {
		subscribe,
		load: () => {
			if (typeof window === 'undefined') return;
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				try {
					set(JSON.parse(stored));
				} catch {
					localStorage.removeItem(STORAGE_KEY);
				}
			}
		},
		save: (profile: LocalProfile) => {
			set(profile);
			if (typeof window !== 'undefined') {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
			}
		},
		clear: () => {
			set(null);
			if (typeof window !== 'undefined') {
				localStorage.removeItem(STORAGE_KEY);
			}
		}
	};
}

export const profileStore = createProfileStore();
