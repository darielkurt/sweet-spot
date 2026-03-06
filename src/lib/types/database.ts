export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			profiles: {
				Row: {
					id: string;
					max_hr: number | null;
					recent_pr_distance_km: number | null;
					recent_pr_time_seconds: number | null;
					recent_pr_date: string | null;
					pace_preference: 'km' | 'mi';
					created_at: string;
				};
				Insert: {
					id: string;
					max_hr?: number | null;
					recent_pr_distance_km?: number | null;
					recent_pr_time_seconds?: number | null;
					recent_pr_date?: string | null;
					pace_preference?: 'km' | 'mi';
					created_at?: string;
				};
				Update: {
					id?: string;
					max_hr?: number | null;
					recent_pr_distance_km?: number | null;
					recent_pr_time_seconds?: number | null;
					recent_pr_date?: string | null;
					pace_preference?: 'km' | 'mi';
					created_at?: string;
				};
			};
			journal_entries: {
				Row: {
					id: string;
					user_id: string;
					date: string;
					workout_type: string;
					planned_pace_min_km: number | null;
					actual_pace_min_km: number | null;
					temperature: number | null;
					humidity: number | null;
					wind: number | null;
					surface: string | null;
					hill: string | null;
					pre_run_feeling: number | null;
					notes: string | null;
					created_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					date: string;
					workout_type: string;
					planned_pace_min_km?: number | null;
					actual_pace_min_km?: number | null;
					temperature?: number | null;
					humidity?: number | null;
					wind?: number | null;
					surface?: string | null;
					hill?: string | null;
					pre_run_feeling?: number | null;
					notes?: string | null;
					created_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					date?: string;
					workout_type?: string;
					planned_pace_min_km?: number | null;
					actual_pace_min_km?: number | null;
					temperature?: number | null;
					humidity?: number | null;
					wind?: number | null;
					surface?: string | null;
					hill?: string | null;
					pre_run_feeling?: number | null;
					notes?: string | null;
					created_at?: string;
				};
			};
		};
		Views: Record<string, never>;
		Functions: Record<string, never>;
		Enums: Record<string, never>;
	};
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type JournalEntry = Database['public']['Tables']['journal_entries']['Row'];
