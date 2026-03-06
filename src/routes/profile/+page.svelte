<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { profileStore, type LocalProfile } from '$lib/stores/profile';

	const DISTANCE_PRESETS = [
		{ label: '5K', value: 5 },
		{ label: '10K', value: 10 },
		{ label: '15K', value: 15 },
		{ label: 'Half Marathon', value: 21.0975 },
		{ label: 'Marathon', value: 42.195 },
		{ label: 'Custom', value: 0 }
	];

	let name = '';
	let selectedPreset = '5';
	let customDistance = '';
	let minutes = '';
	let seconds = '';
	let raceDate = new Date().toISOString().split('T')[0];
	let maxHr = '';
	let useMiles = false;

	let isEditing = false;

	onMount(() => {
		profileStore.load();
		const profile = $profileStore;
		if (profile) {
			isEditing = true;
			name = profile.name;
			// Find matching preset or set to custom
			const preset = DISTANCE_PRESETS.find((p) => p.value === profile.prDistanceKm);
			if (preset && preset.value !== 0) {
				selectedPreset = String(preset.value);
			} else {
				selectedPreset = '0';
				customDistance = String(profile.prDistanceKm);
			}
			minutes = String(Math.floor(profile.prTimeSeconds / 60));
			seconds = String(profile.prTimeSeconds % 60).padStart(2, '0');
			raceDate = profile.prDate;
			maxHr = profile.maxHr ? String(profile.maxHr) : '';
			useMiles = profile.pacePreference === 'mi';
		}
	});

	function getDistanceKm(): number {
		if (selectedPreset === '0') {
			return parseFloat(customDistance) || 0;
		}
		return parseFloat(selectedPreset);
	}

	function getTimeSeconds(): number {
		const mins = parseInt(minutes) || 0;
		const secs = parseInt(seconds) || 0;
		return mins * 60 + secs;
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		const distanceKm = getDistanceKm();
		const timeSeconds = getTimeSeconds();

		if (!name.trim() || distanceKm <= 0 || timeSeconds <= 0) {
			return;
		}

		const profile: LocalProfile = {
			name: name.trim(),
			prDistanceKm: distanceKm,
			prTimeSeconds: timeSeconds,
			prDate: raceDate,
			maxHr: maxHr ? parseInt(maxHr) : null,
			pacePreference: useMiles ? 'mi' : 'km'
		};

		profileStore.save(profile);
		goto('/');
	}

	// Explicit reactive dependencies for validation
	$: distanceKm = selectedPreset === '0' ? parseFloat(customDistance) || 0 : parseFloat(selectedPreset);
	$: timeSeconds = (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
	$: isValid = name.trim().length > 0 && distanceKm > 0 && timeSeconds > 0;
</script>

<svelte:head>
	<title>Profile Setup - Sweet Spot</title>
</svelte:head>

<div class="container mx-auto max-w-2xl px-4 py-8">
	<header class="mb-8">
		<h1 class="text-2xl font-bold tracking-tight">
			{isEditing ? 'Edit Profile' : 'Profile Setup'}
		</h1>
		<p class="text-muted-foreground">Enter your recent race result to calculate training paces</p>
	</header>

	<form onsubmit={handleSubmit} class="space-y-6">
		<Card.Root>
			<Card.Header>
				<Card.Title>Your Name</Card.Title>
				<Card.Description>How should we greet you?</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="space-y-2">
					<Label for="name">Name</Label>
					<Input
						id="name"
						type="text"
						placeholder="e.g., Alex"
						bind:value={name}
						required
					/>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Recent PR</Card.Title>
				<Card.Description>Your best recent race performance</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<!-- Race Distance -->
				<div class="space-y-2">
					<Label for="distance">Race Distance</Label>
					<select
						id="distance"
						bind:value={selectedPreset}
						class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
					>
						{#each DISTANCE_PRESETS as preset}
							<option value={String(preset.value)}>{preset.label}</option>
						{/each}
					</select>
				</div>

				<!-- Custom Distance (shown when Custom is selected) -->
				{#if selectedPreset === '0'}
					<div class="space-y-2">
						<Label for="customDistance">Distance (km)</Label>
						<Input
							id="customDistance"
							type="number"
							step="0.01"
							min="0.1"
							placeholder="e.g., 8"
							bind:value={customDistance}
						/>
					</div>
				{/if}

				<!-- Race Time -->
				<div class="space-y-2">
					<Label>Race Time</Label>
					<div class="flex items-center gap-2">
						<div class="flex-1">
							<Input
								type="number"
								min="0"
								max="999"
								placeholder="20"
								bind:value={minutes}
								class="text-center"
							/>
							<span class="mt-1 block text-center text-xs text-muted-foreground">minutes</span>
						</div>
						<span class="text-xl font-bold">:</span>
						<div class="flex-1">
							<Input
								type="number"
								min="0"
								max="59"
								placeholder="30"
								bind:value={seconds}
								class="text-center"
							/>
							<span class="mt-1 block text-center text-xs text-muted-foreground">seconds</span>
						</div>
					</div>
				</div>

				<!-- Race Date -->
				<div class="space-y-2">
					<Label for="raceDate">Race Date</Label>
					<Input id="raceDate" type="date" bind:value={raceDate} />
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Preferences</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-4">
				<!-- Max HR (optional) -->
				<div class="space-y-2">
					<Label for="maxHr">Max Heart Rate (optional)</Label>
					<Input
						id="maxHr"
						type="number"
						min="100"
						max="250"
						placeholder="e.g., 185"
						bind:value={maxHr}
					/>
					<p class="text-xs text-muted-foreground">Used for HR-based training zones</p>
				</div>

				<!-- Pace Preference -->
				<div class="space-y-2">
					<Label>Pace Display</Label>
					<div class="inline-flex rounded-lg border border-input p-1">
						<button
							type="button"
							class="rounded-md px-4 py-1.5 text-sm font-medium transition-colors {!useMiles
								? 'bg-primary text-primary-foreground'
								: 'hover:bg-muted'}"
							onclick={() => (useMiles = false)}
						>
							km
						</button>
						<button
							type="button"
							class="rounded-md px-4 py-1.5 text-sm font-medium transition-colors {useMiles
								? 'bg-primary text-primary-foreground'
								: 'hover:bg-muted'}"
							onclick={() => (useMiles = true)}
						>
							mi
						</button>
					</div>
					<p class="text-sm text-muted-foreground">
						{useMiles ? 'Minutes per mile' : 'Minutes per kilometer'}
					</p>
				</div>
			</Card.Content>
		</Card.Root>

		<Button type="submit" class="w-full" disabled={!isValid}>
			{isEditing ? 'Save Changes' : 'Save Profile'}
		</Button>
	</form>
</div>
