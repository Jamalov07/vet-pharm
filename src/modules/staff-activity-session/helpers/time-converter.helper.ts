export function formatDuration(ms: number): {
	text: string
	seconds: number
	minutes: number
	hours: number
} {
	const seconds = Math.floor(ms / 1000)
	const minutes = Math.floor(seconds / 60)
	const hours = Math.floor(minutes / 60)

	const h = hours
	const m = minutes % 60
	const s = seconds % 60

	return {
		text: `${h} soat ${m} daqiqa ${s} soniya`,
		seconds,
		minutes,
		hours: Number((ms / 3_600_000).toFixed(2)),
	}
}
