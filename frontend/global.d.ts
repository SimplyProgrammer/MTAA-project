import type { AddOptions, DateValues, Duration, SetOptions } from "date-fns";
import type { SetDateWith } from "date-fns/fp";

declare global {
	interface Date {
		equals(another: Date | string | number): boolean;
		format(formatStr?: string, options?: { moreThan24H?: boolean }): string;
		set(values: DateValues, options?: SetDateWith): Date;
		add(duration: Duration, options?: AddOptions): Date;
	}

	interface DateConstructor {
		time?(time?: number | string, minutes?: number, hours?: number, date?: Date): Date;
	}
}

export {};