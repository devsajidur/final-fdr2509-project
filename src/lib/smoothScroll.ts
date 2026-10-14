export function smoothScrollTo(targetSelector: string, offset: number = 65): void {
  if (typeof window === 'undefined') return;

  const target = document.querySelector(targetSelector) as HTMLElement | null;
  if (!target) return;

  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

  window.scrollTo({
    top: Math.max(0, targetPosition),
    behavior: 'smooth',
  });
}
