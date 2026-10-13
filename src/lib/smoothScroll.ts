/**
 * Silky-smooth cinematic scrolling utility with cubic-bezier easing.
 * Eliminates jarring instant jumps and accounts for the 65px sticky header.
 */
export function smoothScrollTo(targetSelector: string, offset: number = 65, duration: number = 650): void {
  if (typeof window === 'undefined') return;

  const target = document.querySelector(targetSelector) as HTMLElement | null;
  if (!target) return;

  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;

  // If distance is very small, jump directly
  if (Math.abs(distance) < 2) {
    window.scrollTo(0, targetPosition);
    return;
  }

  let startTime: number | null = null;

  // Ease-in-out cubic curve: starts smooth, glides quickly, decelerates gently
  function easeInOutCubic(t: number, b: number, c: number, d: number): number {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t * t + b;
    t -= 2;
    return (c / 2) * (t * t * t + 2) + b;
  }

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const nextY = easeInOutCubic(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, nextY);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      window.scrollTo(0, targetPosition);
    }
  }

  requestAnimationFrame(animation);
}
