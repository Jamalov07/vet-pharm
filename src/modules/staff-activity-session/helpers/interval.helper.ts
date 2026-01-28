function clipSessionToInterval(session: { startAt: Date; endAt: Date | null }, intervalStart: Date, intervalEnd: Date) {
	const start = new Date(Math.max(session.startAt.getTime(), intervalStart.getTime()))
	const end = new Date(Math.min((session.endAt ?? new Date()).getTime(), intervalEnd.getTime()))

	if (end <= start) return 0
	return end.getTime() - start.getTime()
}
