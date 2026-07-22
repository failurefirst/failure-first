/** Format a second count as zero-padded HH:MM:SS. */
export function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const remainingSeconds = total % 60;
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
}

/** Return a cached formatted duration, or omit it when no positive value exists. */
export function getDuration(
  url: string,
  cache: Record<string, number>,
): string | undefined {
  const seconds = cache[url];
  if (typeof seconds !== 'number' || seconds <= 0) return undefined;
  return formatDuration(seconds);
}
