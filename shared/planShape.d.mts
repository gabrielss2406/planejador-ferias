import type { SavedPlan } from '../src/lib/types';

export function validPlan(p: unknown): p is SavedPlan;
export function cleanPlan(p: SavedPlan): SavedPlan;
