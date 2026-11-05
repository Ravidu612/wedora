/**
 * Date and Countdown Helpers
 */

export function formatDate(dateString) {
  if (!dateString) return 'Not set';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return 'Invalid date';

  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(dateString) {
  if (!dateString) return 'Not set';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return 'Invalid date';

  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getDaysUntil(targetDate) {
  if (!targetDate) return 0;
  const target = new Date(targetDate);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getCountdownDetails(targetDate) {
  if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };

  const total = new Date(targetDate).getTime() - new Date().getTime();
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, isPast: false };
}

