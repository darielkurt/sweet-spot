<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { getTodaySchedule, WEEKLY_SCHEDULE } from '$lib/utils/schedule';
	import {
		calculateWorkoutPaces,
		formatPace,
		convertPaces,
		type PaceUnit
	} from '$lib/utils/pace';
	import { profileStore } from '$lib/stores/profile';

	onMount(() => {
		profileStore.load();
	});

	const today = getTodaySchedule();

	$: profile = $profileStore;
	$: basePaces = profile
		? calculateWorkoutPaces(profile.prDistanceKm, profile.prTimeSeconds)
		: null;
	$: paces = basePaces ? convertPaces(basePaces, profile?.pacePreference ?? 'km') : null;
	$: paceUnit = profile?.pacePreference ?? 'km';

	function getWorkoutPace(type: string) {
		if (!paces) return '-';
		if (type === 'quality') {
			return formatPace(paces.sweetSpot7min);
		}
		if (type === 'long' || type === 'easy') {
			return `${formatPace(paces.easyPaceLow)} - ${formatPace(paces.easyPaceHigh)}`;
		}
		return '-';
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

	<!-- Profile Link -->
	{#if profile}
		<p class="mt-6 text-center text-sm text-muted-foreground">
			<a href="/profile" class="underline hover:text-foreground">Edit Profile</a>
		</p>
	{/if}
</div>
