/**
 * NSA Weekly Schedule
 *
 * Fixed template based on Norwegian Singles Approach:
 * - 2-3 quality sessions per week
 * - 1 long run
 * - Easy runs on other days
 * - Quality work = 20-25% of weekly running time
 */

export type WorkoutType = 'quality' | 'easy' | 'long' | 'rest';

export interface DaySchedule {
	day: string;
	dayIndex: number;
	type: WorkoutType;
	description: string;
	workout?: string;
}

/**
 * Fixed weekly schedule template
 * Monday = 0, Sunday = 6
 */
export const WEEKLY_SCHEDULE: DaySchedule[] = [
	{ day: 'Monday', dayIndex: 0, type: 'easy', description: 'Easy Run', workout: undefined },
	{
		day: 'Tuesday',
		dayIndex: 1,
		type: 'quality',
		description: 'Quality Session',
		workout: '5 x 7 min @ Sweet Spot'
	},
	{ day: 'Wednesday', dayIndex: 2, type: 'easy', description: 'Easy Run', workout: undefined },
	{
		day: 'Thursday',
		dayIndex: 3,
		type: 'quality',
		description: 'Quality Session',
		workout: '10 x 3 min @ Sweet Spot'
	},
	{ day: 'Friday', dayIndex: 4, type: 'rest', description: 'Rest Day', workout: undefined },
	{
		day: 'Saturday',
		dayIndex: 5,
		type: 'long',
		description: 'Long Run',
		workout: 'Easy pace, duration based on training phase'
	},
	{ day: 'Sunday', dayIndex: 6, type: 'easy', description: 'Easy Run / Recovery', workout: undefined }
];

/**
 * Quality workout options to rotate through
 */
export const QUALITY_WORKOUTS = [
	{ name: '3 x 10 min', intervals: 3, duration: 10, paceKey: 'sweetSpot10min' as const },
	{ name: '5 x 7 min', intervals: 5, duration: 7, paceKey: 'sweetSpot7min' as const },
	{ name: '10 x 3 min', intervals: 10, duration: 3, paceKey: 'sweetSpot3min' as const }
];

/**
 * Get today's workout
 */
export function getTodaySchedule(): DaySchedule {
	const today = new Date();
	const dayIndex = (today.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
	return WEEKLY_SCHEDULE[dayIndex];
}

/**
 * Get workout for a specific date
 */
export function getScheduleForDate(date: Date): DaySchedule {
	const dayIndex = (date.getDay() + 6) % 7;
	return WEEKLY_SCHEDULE[dayIndex];
}

/**
 * Get the full week schedule starting from today
 */
export function getWeekSchedule(): DaySchedule[] {
	const today = new Date();
	const todayIndex = (today.getDay() + 6) % 7;

	return WEEKLY_SCHEDULE.map((schedule, index) => ({
		...schedule,
		isToday: index === todayIndex
	}));
}
