// Storybook's date control hands back a timestamp (local midnight of the
// picked day); convert to the YYYY-MM-DD string a `datetime` attribute needs.
export function toISODate(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Converts an ISO date literal to the local timestamp toISODate round-trips,
// so story args can still be written as readable YYYY-MM-DD strings.
export function timestamp(isoDate: string): number {
  const [year, month, day] = isoDate.split("-").map(Number) as [
    number,
    number,
    number,
  ];
  return new Date(year, month - 1, day).getTime();
}
