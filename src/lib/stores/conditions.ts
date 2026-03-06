import { writable } from 'svelte/store';
import { getDefaultConditions, type ConditionAdjustments } from '$lib/utils/pace';

function createConditionsStore() {
	const { subscribe, set, update } = writable<ConditionAdjustments>(getDefaultConditions());

	return {
		subscribe,
		update: (partial: Partial<ConditionAdjustments>) => {
			update((current) => ({ ...current, ...partial }));
		},
		reset: () => set(getDefaultConditions()),
		set
	};
}

export const conditionsStore = createConditionsStore();
