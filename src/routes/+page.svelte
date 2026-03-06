<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { getTodaySchedule, WEEKLY_SCHEDULE } from '$lib/utils/schedule';
	import {
		calculateWorkoutPaces,
		formatPace,
		convertPaces,
		adjustPace,
		calculatePaceAdjustment,
		getDefaultConditions,
		type PaceUnit,
		type ConditionAdjustments
	} from '$lib/utils/pace';
	import { profileStore } from '$lib/stores/profile';
	import { conditionsStore } from '$lib/stores/conditions';
	import PaceAdjustmentPanel from '$lib/components/PaceAdjustmentPanel.svelte';

	onMount(() => {
		profileStore.load();
	});

	const today = getTodaySchedule();

	let adjustmentPanelOpen = $state(false);
	let showAdjusted = $state(false);

	let profile = $derived($profileStore);
	let conditions = $derived($conditionsStore);
	let basePaces = $derived(
		profile ? calculateWorkoutPaces(profile.prDistanceKm, profile.prTimeSeconds) : null
	);
	let paces = $derived(basePaces ? convertPaces(basePaces, profile?.pacePreference ?? 'km') : null);
	let paceUnit = $derived(profile?.pacePreference ?? 'km');
	let totalAdjustment = $derived(calculatePaceAdjustment(conditions));

	function getWorkoutPace(type: string) {
		if (!paces) return '-';
		let pace;
		if (type === 'quality') {
			pace = paces.sweetSpot7min;
			if (showAdjusted) {
				pace = adjustPace(pace, totalAdjustment);
			}
			return formatPace(pace);
		}
		if (type === 'long' || type === 'easy') {
			let lowPace = paces.easyPaceLow;
			let highPace = paces.easyPaceHigh;
			if (showAdjusted) {
				lowPace = adjustPace(lowPace, totalAdjustment);
				highPace = adjustPace(highPace, totalAdjustment);
			}
			return `${formatPace(lowPace)} - ${formatPace(highPace)}`;
		}
		return '-';
	}

	function handleConditionsChange(newConditions: ConditionAdjustments) {
		conditionsStore.set(newConditions);
	}

	function handleToggleChange(value: boolean) {
		showAdjusted = value;
	}
</script>

<svelte:head>
	<title>Sweet Spot - NSA Running</title>
</svelte:head>

<div class="container mx-auto max-w-2xl px-4 py-8">
	<header class="mb-8 text-center">
		<h1 class="text-3xl font-bold tracking-tight">
			{#if profile}
				Hey, {profile.name}
			{:else}
				Sweet Spot
			{/if}
		</h1>
		<p class="text-muted-foreground">Norwegian Singles Approach</p>
	</header>

	{#if !profile}
		<!-- Profile Setup CTA -->
		<Card.Root class="mb-6">
			<Card.Header>
				<Card.Title>Welcome to Sweet Spot</Card.Title>
				<Card.Description>
					Set up your profile to get personalized training paces based on your recent race
				</Card.Description>
			</Card.Header>
			<Card.Footer>
				<Button href="/profile" class="w-full">Set Up Profile</Button>
			</Card.Footer>
		</Card.Root>
	{:else}
		<!-- Today's Workout Card -->
		<Card.Root class="mb-6">
			<Card.Header>
				<Card.Title class="flex items-center justify-between">
					<span>Today's Workout</span>
					<span class="text-sm font-normal text-muted-foreground">{today.day}</span>
				</Card.Title>
				<Card.Description>{today.description}</Card.Description>
			</Card.Header>
			<Card.Content>
				{#if today.type === 'rest'}
					<p class="text-lg">Rest and recover!</p>
				{:else}
					<div class="space-y-4">
						{#if today.workout}
							<div>
								<p class="text-sm text-muted-foreground">Workout</p>
								<p class="text-lg font-medium">{today.workout}</p>
							</div>
						{/if}
						<div>
							<p class="text-sm text-muted-foreground">Target Pace</p>
							<p class="text-2xl font-bold">
								{getWorkoutPace(today.type)}
								<span class="text-base font-normal text-muted-foreground">
									/{paceUnit}
								</span>
							</p>
						</div>
					</div>
				{/if}
			</Card.Content>
			{#if today.type !== 'rest'}
				<Card.Footer>
					<Button class="w-full">Start Workout</Button>
				</Card.Footer>
			{/if}
		</Card.Root>

		<!-- Pace Adjustments Panel -->
		<Collapsible.Root bind:open={adjustmentPanelOpen}>
			<Card.Root class="mb-6">
				<Collapsible.Trigger class="w-full text-left">
					<Card.Header class="cursor-pointer">
						<Card.Title class="flex items-center justify-between">
							<span>Pace Adjustments</span>
							<span class="text-sm font-normal {showAdjusted && totalAdjustment !== 0 ? 'text-orange-600' : 'text-muted-foreground'}">
								{#if showAdjusted && totalAdjustment !== 0}
									{totalAdjustment > 0 ? '+' : ''}{totalAdjustment}s/{paceUnit}
								{:else}
									Baseline
								{/if}
							</span>
						</Card.Title>
						<Card.Description>
							{adjustmentPanelOpen ? 'Adjust for conditions' : 'Tap to adjust for conditions'}
						</Card.Description>
					</Card.Header>
				</Collapsible.Trigger>
				<Collapsible.Content>
					<Card.Content>
						{#if paces}
							<PaceAdjustmentPanel
								basePace={paces.sweetSpot7min}
								{paceUnit}
								{conditions}
								{showAdjusted}
								onConditionsChange={handleConditionsChange}
								onToggleChange={handleToggleChange}
								compact={true}
							/>
						{/if}
					</Card.Content>
				</Collapsible.Content>
			</Card.Root>
		</Collapsible.Root>
	{/if}

	<!-- Week Overview -->
	<Card.Root>
		<Card.Header>
			<Card.Title>This Week</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="space-y-2">
				{#each WEEKLY_SCHEDULE as day}
					{@const isToday = day.day === today.day}
					<div
						class="flex items-center justify-between rounded-lg p-2 {isToday
							? 'bg-primary/10'
							: ''}"
					>
						<div class="flex items-center gap-3">
							<span
								class="w-8 text-center text-sm font-medium {isToday ? 'text-primary' : 'text-muted-foreground'}"
							>
								{day.day.slice(0, 3)}
							</span>
							<span class={isToday ? 'font-medium' : ''}>{day.description}</span>
						</div>
						<span
							class="rounded-full px-2 py-1 text-xs {day.type === 'quality'
								? 'bg-orange-500/20 text-orange-600'
								: day.type === 'long'
									? 'bg-blue-500/20 text-blue-600'
									: day.type === 'rest'
										? 'bg-gray-500/20 text-gray-600'
										: 'bg-green-500/20 text-green-600'}"
						>
							{day.type}
						</span>
					</div>
				{/each}
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Navigation Links -->
	{#if profile}
		<p class="mt-6 text-center text-sm text-muted-foreground">
			<a href="/calculator" class="underline hover:text-foreground">Pace Calculator</a>
			<span class="mx-2">|</span>
			<a href="/profile" class="underline hover:text-foreground">Edit Profile</a>
		</p>
	{/if}
</div>
