<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { getTodaySchedule, WEEKLY_SCHEDULE } from '$lib/utils/schedule';
	import {
		calculateWorkoutPaces,
		formatPace,
		convertPaces,
		type PaceUnit
	} from '$lib/utils/pace';

	// Demo data (will be replaced with user profile data)
	const demoProfile = {
		prDistanceKm: 5,
		prTimeSeconds: 20 * 60 + 30, // 20:30 5K
		pacePreference: 'km' as PaceUnit
	};

	const today = getTodaySchedule();
	const basePaces = calculateWorkoutPaces(demoProfile.prDistanceKm, demoProfile.prTimeSeconds);
	const paces = convertPaces(basePaces, demoProfile.pacePreference);

	function getWorkoutPace(type: string) {
		if (type === 'quality') {
			// Default to 5x7' pace for quality days
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
		<h1 class="text-3xl font-bold tracking-tight">Sweet Spot</h1>
		<p class="text-muted-foreground">Norwegian Singles Approach</p>
	</header>

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
								/{demoProfile.pacePreference}
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

	<!-- Demo Notice -->
	<p class="mt-6 text-center text-sm text-muted-foreground">
		Demo mode: Using 20:30 5K PR. Sign in to set your personal records.
	</p>
</div>
