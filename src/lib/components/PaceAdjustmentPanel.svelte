<script lang="ts">
	import { Slider } from '$lib/components/ui/slider';
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label';
	import {
		calculatePaceAdjustment,
		adjustPace,
		formatPace,
		HILL_ADJUSTMENTS,
		type ConditionAdjustments,
		type PaceTime,
		type PaceUnit,
		type HillType
	} from '$lib/utils/pace';

	interface Props {
		basePace: PaceTime;
		paceUnit: PaceUnit;
		conditions: ConditionAdjustments;
		showAdjusted: boolean;
		onConditionsChange: (conditions: ConditionAdjustments) => void;
		onToggleChange: (showAdjusted: boolean) => void;
		compact?: boolean;
	}

	let {
		basePace,
		paceUnit,
		conditions,
		showAdjusted,
		onConditionsChange,
		onToggleChange,
		compact = false
	}: Props = $props();

	const WIND_OPTIONS = [
		{ label: 'Calm', value: 0 },
		{ label: 'Light', value: 10 },
		{ label: 'Moderate', value: 20 },
		{ label: 'Strong', value: 30 }
	];

	const HILL_OPTIONS: { label: string; value: HillType }[] = [
		{ label: 'Flat', value: 'flat' },
		{ label: 'Rolling', value: 'rolling' },
		{ label: 'Hilly', value: 'hilly' },
		{ label: 'Steep', value: 'steep' }
	];

	const SURFACE_OPTIONS: { label: string; value: 'track' | 'road' | 'trail' }[] = [
		{ label: 'Track', value: 'track' },
		{ label: 'Road', value: 'road' },
		{ label: 'Trail', value: 'trail' }
	];

	// Local slider value for temperature
	let tempSliderValue = $derived([conditions.temperature]);

	function updateCondition<K extends keyof ConditionAdjustments>(
		key: K,
		value: ConditionAdjustments[K]
	) {
		onConditionsChange({ ...conditions, [key]: value });
	}

	function handleTempChange(value: number[]) {
		tempSliderValue = value;
		updateCondition('temperature', value[0]);
	}

	// Derived values
	let totalAdjustment = $derived(calculatePaceAdjustment(conditions));
	let displayPace = $derived(showAdjusted ? adjustPace(basePace, totalAdjustment) : basePace);
</script>

<div class="space-y-6">
	<!-- Toggle and Summary -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<Switch checked={showAdjusted} onCheckedChange={onToggleChange} />
			<Label class="text-sm font-medium">Show adjusted pace</Label>
		</div>
		{#if showAdjusted && totalAdjustment !== 0}
			<span class="text-sm font-medium text-orange-600">
				{totalAdjustment > 0 ? '+' : ''}{totalAdjustment}s/{paceUnit}
			</span>
		{/if}
	</div>

	<!-- Adjusted Pace Display -->
	{#if showAdjusted}
		<div class="rounded-lg bg-muted/50 p-4 text-center">
			<p class="text-sm text-muted-foreground">Adjusted Target Pace</p>
			<p class="text-3xl font-bold">{formatPace(displayPace)}<span class="text-lg font-normal text-muted-foreground">/{paceUnit}</span></p>
			<p class="mt-1 text-xs text-muted-foreground">Baseline: {formatPace(basePace)}/{paceUnit}</p>
		</div>
	{/if}

	<!-- Temperature Slider -->
	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<Label class="text-sm">Temperature</Label>
			<span class="text-sm font-medium">{conditions.temperature}°C</span>
		</div>
		<Slider
			type="single"
			value={tempSliderValue[0]}
			min={-10}
			max={40}
			step={1}
			onValueChange={(v) => handleTempChange([v])}
		/>
		<div class="flex justify-between text-xs text-muted-foreground">
			<span>-10°C</span>
			<span>Optimal: 10-15°C</span>
			<span>40°C</span>
		</div>
	</div>

	<!-- Wind Selector -->
	<div class="space-y-2">
		<Label class="text-sm">Wind</Label>
		<div class="inline-flex w-full rounded-lg border border-input p-1">
			{#each WIND_OPTIONS as option}
				<button
					type="button"
					class="flex-1 rounded-md px-2 py-1.5 text-sm font-medium transition-colors {conditions.wind === option.value
						? 'bg-primary text-primary-foreground'
						: 'hover:bg-muted'}"
					onclick={() => updateCondition('wind', option.value)}
				>
					{option.label}
				</button>
			{/each}
		</div>
	</div>

	<!-- Hill Selector -->
	<div class="space-y-2">
		<Label class="text-sm">Terrain</Label>
		<div class="inline-flex w-full rounded-lg border border-input p-1">
			{#each HILL_OPTIONS as option}
				<button
					type="button"
					class="flex-1 rounded-md px-2 py-1.5 text-sm font-medium transition-colors {conditions.hill === option.value
						? 'bg-primary text-primary-foreground'
						: 'hover:bg-muted'}"
					onclick={() => updateCondition('hill', option.value)}
				>
					<span class="block">{option.label}</span>
					{#if !compact && HILL_ADJUSTMENTS[option.value] > 0}
						<span class="block text-xs opacity-70">+{HILL_ADJUSTMENTS[option.value]}s</span>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<!-- Surface Selector -->
	<div class="space-y-2">
		<Label class="text-sm">Surface</Label>
		<div class="inline-flex w-full rounded-lg border border-input p-1">
			{#each SURFACE_OPTIONS as option}
				<button
					type="button"
					class="flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors {conditions.surface === option.value
						? 'bg-primary text-primary-foreground'
						: 'hover:bg-muted'}"
					onclick={() => updateCondition('surface', option.value)}
				>
					{option.label}
				</button>
			{/each}
		</div>
	</div>

	<!-- Feeling Slider (hidden in compact mode) -->
	{#if !compact}
		<div class="space-y-3">
			<div class="flex items-center justify-between">
				<Label class="text-sm">How are you feeling?</Label>
				<span class="text-sm font-medium">
					{#if conditions.feeling <= 3}
						Heavy
					{:else if conditions.feeling <= 5}
						Okay
					{:else if conditions.feeling <= 7}
						Good
					{:else}
						Great
					{/if}
				</span>
			</div>
			<Slider
				type="single"
				value={conditions.feeling}
				min={1}
				max={10}
				step={1}
				onValueChange={(v) => updateCondition('feeling', v)}
			/>
			<div class="flex justify-between text-xs text-muted-foreground">
				<span>Heavy (1)</span>
				<span>Great (10)</span>
			</div>
		</div>
	{/if}

	<!-- Adjustment Breakdown -->
	{#if !compact && showAdjusted && totalAdjustment !== 0}
		<div class="rounded-lg border border-border p-3 text-sm">
			<p class="mb-2 font-medium">Adjustment breakdown:</p>
			<ul class="space-y-1 text-muted-foreground">
				{#if conditions.temperature > 20}
					<li>Temperature (+{Math.round((conditions.temperature - 20) * 1.5)}s)</li>
				{:else if conditions.temperature < 5}
					<li>Cold (+{Math.round((5 - conditions.temperature) * 0.5)}s)</li>
				{/if}
				{#if conditions.humidity > 70}
					<li>Humidity (+{Math.round((conditions.humidity - 70) * 0.3)}s)</li>
				{/if}
				{#if conditions.wind > 0}
					<li>Wind (+{Math.round(conditions.wind * 0.5)}s)</li>
				{/if}
				{#if conditions.surface === 'trail'}
					<li>Trail surface (+15s)</li>
				{/if}
				{#if HILL_ADJUSTMENTS[conditions.hill] > 0}
					<li>{conditions.hill.charAt(0).toUpperCase() + conditions.hill.slice(1)} terrain (+{HILL_ADJUSTMENTS[conditions.hill]}s)</li>
				{/if}
				{#if conditions.feeling !== 5}
					<li>Feeling ({conditions.feeling < 5 ? '+' : ''}{(5 - conditions.feeling) * 3}s)</li>
				{/if}
			</ul>
		</div>
	{/if}
</div>
