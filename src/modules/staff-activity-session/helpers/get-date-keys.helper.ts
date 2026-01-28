export function getDateKeys(start: Date, end: Date): string[] {
	const days: string[] = []
	const current = new Date(start)

	current.setHours(0, 0, 0, 0)
	end = new Date(end)
	end.setHours(0, 0, 0, 0)

	while (current <= end) {
		days.push(current.toISOString().slice(0, 10))
		current.setDate(current.getDate() + 1)
	}

	return days
}
