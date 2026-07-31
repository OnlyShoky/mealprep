export function formatDuration(durationString) {
  if (!durationString) return '';
  const parts = durationString.split(':').map(Number);
  if (parts.length !== 3) return durationString;
  
  const [hours, minutes] = parts;
  
  if (hours === 0) {
    return `${minutes} min`;
  } else if (minutes === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr ${minutes} min`;
  }
}
