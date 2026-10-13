/**
 * Natural, responsive smooth scrolling utility.
 * Starts immediately without lag or mid-way acceleration, gently gliding to a stop
 * with the 65px sticky header offset.
 */
export function smoothScrollTo(targetSelector: string, offset: number = 65): void {
  if (typeof window === 'undefined') return;

  const target = document.querySelector(targetSelector) as HTMLElement | null;
  if (!target) return;

  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

  // Use platform-native smooth scrolling for natural, responsive ease-out motion
  window.scrollTo({
    top: Math.max(0, targetPosition),
    behavior: 'smooth',
  });
}
