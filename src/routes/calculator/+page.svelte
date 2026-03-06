<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { profileStore } from '$lib/stores/profile';
	import { conditionsStore } from '$lib/stores/conditions';
	import PaceAdjustmentPanel from '$lib/components/PaceAdjustmentPanel.svelte';
	import {
		calculateWorkoutPaces,
		convertPaces,
		formatPace,
		calculatePaceAdjustment,
		adjustPace,
		getDefaultConditions,
		type ConditionAdjustments
	} from '$lib/utils/pace';

	onMount(() => {
		profileStore.load();
	});

	let showAdjusted = $state(true);

	let profile = $derived($profileStore);
	let conditions = $derived($conditionsStore);
	let basePaces = $derived(
		profile ? calculateWorkoutPaces(profile.prDistanceKm, profile.prTimeSeconds) : null
	);
	let paces = $derived(basePaces ? convertPaces(basePaces, profile?.pacePreference ?? 'km') : null);
	let paceUnit = $derived(profile?.pacePreference ?? 'km');
	let totalAdjustment = $derived(calculatePaceAdjustment(conditions));

	function handleConditionsChange(newConditions: ConditionAdjustments) {
		conditionsStore.set(newConditions);
	}

	function handleToggleChange(value: boolean) {
		showAdjusted = value;
	}

	function getDisplayPace(basePace: { minutes: number; seconds: number }) {
		if (showAdjusted) {
			return formatPace(adjustPace(basePace, totalAdjustment));
		}
		return formatPace(basePace);
	}
</script>

<svelte:head>
	<title>Pace Calculator - Sweet Spot</title>
</svelte:head>

<div class="container mx-auto max-w-2xl px-4 py-8">
	<header class="mb-8">
		<h1 class="text-2xl font-bold tracking-tight">Pace Calculator</h1>
		<p class="text-muted-foreground">Adjust your paces for conditions</p>
	</header>

	{#if !profile}
		<Card.Root>
			<Card.Content class="py-8 text-center">
				<p class="mb-4">Set up your profile first to calculate paces</p>
				<Button href="/profile">Set Up Profile</Button>
			</Card.Content>
		</Card.Root>
	{:else if paces}
		<!-- Conditions Panel -->
		<Card.Root class="mb-6">
			<Card.Header>
				<Card.Title>Conditions</Card.Title>
				<Card.Description>Adjust for today's run</Card.Description>
			</Card.Header>
			<Card.Content>
				<PaceAdjustmentPanel
					basePace={paces.sweetSpot7min}
					{paceUnit}
					{conditions}
					{showAdjusted}
					onConditionsChange={handleConditionsChange}
					onToggleChange={handleToggleChange}
					compact={false}
				/>
			</Card.Content>
		</Card.Root>

		<!-- All Paces Display -->
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center justify-between">
					<span>Your Paces</span>
					{#if showAdjusted && totalAdjustment !== 0}
						<span class="text-sm font-normal text-orange-600">
							{totalAdjustment > 0 ? '+' : ''}{totalAdjustment}s/{paceUnit}
						</span>
					{/if}
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="space-y-4">
					<!-- Sweet Spot 3min -->
					<div class="flex items-center justify-between border-b border-border pb-4">
						<div>
							<p class="font-medium">10x3' Intervals</p>
							<p class="text-sm text-muted-foreground">~15K pace</p>
						</div>
						<div class="text-right">
							<p class="text-xl font-bold">
								{getDisplayPace(paces.sweetSpot3min)}
								<span class="text-sm font-normal text-muted-foreground">/{paceUnit}</span>
							</p>
							{#if showAdjusted && totalAdjustment !== 0}
								<p class="text-xs text-muted-foreground">
									Base: {formatPace(paces.sweetSpot3min)}/{paceUnit}
								</p>
							{/if}
						</div>
					</div>

					<!-- Sweet Spot 7min -->
					<div class="flex items-center justify-between border-b border-border pb-4">
						<div>
							<p class="font-medium">5x7' Intervals</p>
							<p class="text-sm text-muted-foreground">~Half Marathon pace</p>
						</div>
						<div class="text-right">
							<p class="text-xl font-bold">
								{getDisplayPace(paces.sweetSpot7min)}
								<span class="text-sm font-normal text-muted-foreground">/{paceUnit}</span>
							</p>
							{#if showAdjusted && totalAdjustment !== 0}
								<p class="text-xs text-muted-foreground">
									Base: {formatPace(paces.sweetSpot7min)}/{paceUnit}
								</p>
							{/if}
						</div>
					</div>

					<!-- Sweet Spot 10min -->
					<div class="flex items-center justify-between border-b border-border pb-4">
						<div>
							<p class="font-medium">3x10' Intervals</p>
							<p class="text-sm text-muted-foreground">~25-30K pace</p>
						</div>
						<div class="text-right">
							<p class="text-xl font-bold">
								{getDisplayPace(paces.sweetSpot10min)}
								<span class="text-sm font-normal text-muted-foreground">/{paceUnit}</span>
							</p>
							{#if showAdjusted && totalAdjustment !== 0}
								<p class="text-xs text-muted-foreground">
									Base: {formatPace(paces.sweetSpot10min)}/{paceUnit}
								</p>
							{/if}
						</div>
					</div>

					<!-- Easy Pace -->
					<div class="flex items-center justify-between pt-2">
						<div>
							<p class="font-medium">Easy / Long Run</p>
							<p class="text-sm text-muted-foreground">Recovery pace range</p>
						</div>
						<div class="text-right">
							<p class="text-xl font-bold">
								{getDisplayPace(paces.easyPaceLow)} - {getDisplayPace(paces.easyPaceHigh)}
								<span class="text-sm font-normal text-muted-foreground">/{paceUnit}</span>
							</p>
							{#if showAdjusted && totalAdjustment !== 0}
								<p class="text-xs text-muted-foreground">
									Base: {formatPace(paces.easyPaceLow)} - {formatPace(paces.easyPaceHigh)}/{paceUnit}
								</p>
							{/if}
						</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	{/if}

	<!-- Back Link -->
	<p class="mt-6 text-center text-sm text-muted-foreground">
		<a href="/" class="underline hover:text-foreground">Back to Home</a>
	</p>
</div>
