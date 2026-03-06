/**
 * Norwegian Singles Approach (NSA) Pace Calculator
 *
 * Placeholder formulas based on research from norwegiansingles.run
 * User will provide exact formulas from book later
 */

export type PaceUnit = 'km' | 'mi';

export interface PaceTime {
	minutes: number;
	seconds: number;
}

export interface WorkoutPaces {
	sweetSpot3min: PaceTime; // ~15K pace for 10x3'
	sweetSpot7min: PaceTime; // ~HM pace for 5x7'
	sweetSpot10min: PaceTime; // ~25-30K pace for 3x10'
	easyPaceLow: PaceTime;
	easyPaceHigh: PaceTime;
}

/**
 * Convert race time to pace per km
 */
export function raceToPacePerKm(distanceKm: number, timeSeconds: number): PaceTime {
	const paceSeconds = timeSeconds / distanceKm;
	return {
		minutes: Math.floor(paceSeconds / 60),
		seconds: Math.round(paceSeconds % 60)
	};
}

/**
 * Convert pace from min/km to min/mi
 */
export function kmToMilePace(pace: PaceTime): PaceTime {
	const totalSeconds = pace.minutes * 60 + pace.seconds;
	const mileSeconds = totalSeconds * 1.60934; // 1 mile = 1.60934 km
	return {
		minutes: Math.floor(mileSeconds / 60),
		seconds: Math.round(mileSeconds % 60)
	};
}

/**
 * Convert pace from min/mi to min/km
 */
export function mileToKmPace(pace: PaceTime): PaceTime {
	const totalSeconds = pace.minutes * 60 + pace.seconds;
	const kmSeconds = totalSeconds / 1.60934;
	return {
		minutes: Math.floor(kmSeconds / 60),
		seconds: Math.round(kmSeconds % 60)
	};
}

/**
 * Format pace as string (e.g., "5:30")
 */
export function formatPace(pace: PaceTime): string {
	return `${pace.minutes}:${pace.seconds.toString().padStart(2, '0')}`;
}

/**
 * Parse pace string (e.g., "5:30") to PaceTime
 */
export function parsePace(paceStr: string): PaceTime {
	const [minutes, seconds] = paceStr.split(':').map(Number);
	return { minutes, seconds };
}

/**
 * Add seconds to a pace
 */
export function adjustPace(pace: PaceTime, adjustSeconds: number): PaceTime {
	const totalSeconds = pace.minutes * 60 + pace.seconds + adjustSeconds;
	return {
		minutes: Math.floor(totalSeconds / 60),
		seconds: Math.round(totalSeconds % 60)
	};
}

/**
 * Calculate NSA workout paces from a recent PR
 *
 * Placeholder formulas (to be refined with exact book formulas):
 * - 10x3' @ ~15K pace (slightly faster than HM pace)
 * - 5x7' @ ~Half marathon pace
 * - 3x10' @ ~25-30K pace (slightly slower than HM pace)
 * - Easy pace @ ~70% max HR (estimated as PR pace + 90-120 sec/km)
 */
export function calculateWorkoutPaces(prDistanceKm: number, prTimeSeconds: number): WorkoutPaces {
	const prPace = raceToPacePerKm(prDistanceKm, prTimeSeconds);
	const prPaceSeconds = prPace.minutes * 60 + prPace.seconds;

	// Estimate paces based on PR distance
	// These are placeholder calculations to be refined
	let adjustmentFactor = 1;

	// Normalize to 5K equivalent pace using approximate Riegel formula
	// T2 = T1 * (D2/D1)^1.06
	const fiveKEquivalentSeconds = prTimeSeconds * Math.pow(5 / prDistanceKm, 1.06);
	const fiveKPace = raceToPacePerKm(5, fiveKEquivalentSeconds);
	const fiveKPaceSeconds = fiveKPace.minutes * 60 + fiveKPace.seconds;

	// Calculate target paces based on 5K equivalent
	// 15K pace: approximately 5K pace + 15-20 sec/km
	const pace15k = adjustPace(fiveKPace, 18);

	// HM pace: approximately 5K pace + 25-35 sec/km
	const paceHM = adjustPace(fiveKPace, 30);

	// 30K pace: approximately 5K pace + 40-50 sec/km
	const pace30k = adjustPace(fiveKPace, 45);

	// Easy pace: approximately 5K pace + 90-120 sec/km
	const easyPaceLow = adjustPace(fiveKPace, 90);
	const easyPaceHigh = adjustPace(fiveKPace, 120);

	return {
		sweetSpot3min: pace15k, // 10x3' @ 15K pace
		sweetSpot7min: paceHM, // 5x7' @ HM pace
		sweetSpot10min: pace30k, // 3x10' @ 25-30K pace
		easyPaceLow,
		easyPaceHigh
	};
}

/**
 * Convert workout paces to the user's preferred unit
 */
export function convertPaces(paces: WorkoutPaces, toUnit: PaceUnit): WorkoutPaces {
	if (toUnit === 'mi') {
		return {
			sweetSpot3min: kmToMilePace(paces.sweetSpot3min),
			sweetSpot7min: kmToMilePace(paces.sweetSpot7min),
			sweetSpot10min: kmToMilePace(paces.sweetSpot10min),
			easyPaceLow: kmToMilePace(paces.easyPaceLow),
			easyPaceHigh: kmToMilePace(paces.easyPaceHigh)
		};
	}
	return paces;
}

/**
 * Adjustment factors for conditions
 * Returns seconds to add to pace per km
 */
export interface ConditionAdjustments {
	temperature: number; // Celsius
	humidity: number; // Percentage 0-100
	wind: number; // km/h headwind
	surface: 'road' | 'trail' | 'track';
	feeling: number; // 1-10 scale
}

export function calculatePaceAdjustment(conditions: ConditionAdjustments): number {
	let adjustmentSeconds = 0;

	// Temperature adjustment (optimal is ~10-15°C)
	if (conditions.temperature > 20) {
		adjustmentSeconds += Math.round((conditions.temperature - 20) * 1.5); // +1.5s per degree over 20°C
	} else if (conditions.temperature < 5) {
		adjustmentSeconds += Math.round((5 - conditions.temperature) * 0.5); // +0.5s per degree under 5°C
	}

	// Humidity adjustment (significant above 70%)
	if (conditions.humidity > 70) {
		adjustmentSeconds += Math.round((conditions.humidity - 70) * 0.3); // +0.3s per % over 70%
	}

	// Wind adjustment (headwind)
	if (conditions.wind > 0) {
		adjustmentSeconds += Math.round(conditions.wind * 0.5); // +0.5s per km/h headwind
	}

	// Surface adjustment
	if (conditions.surface === 'trail') {
		adjustmentSeconds += 15; // +15s for trail
	}

	// Feeling adjustment (5 is neutral)
	const feelingDiff = 5 - conditions.feeling;
	adjustmentSeconds += feelingDiff * 3; // +/-3s per point from neutral

	return adjustmentSeconds;
}
