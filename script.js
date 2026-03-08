const revealSelectors = [
    '.hero-left',
    '.hero-right',
    '.about-header',
    '.about-item',
    '.service-header',
    '.feature-card',
    '.roadmap-header',
    '.timeline-card',
    '.why-header',
    '.why-card',
    '.recruit-header',
    '.recruit-card'
];

const revealElements = Array.from(
    document.querySelectorAll(revealSelectors.join(', '))
).filter((el) => el !== null);

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
} else {
    revealElements.forEach((el) => el.classList.add('reveal-up'));

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const delay = Number(entry.target.dataset.revealDelay || 0);
                window.setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);

                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -8% 0px'
        }
    );

    revealElements.forEach((el, index) => {
        el.dataset.revealDelay = String((index % 6) * 70);
        revealObserver.observe(el);
    });
}
