(function () {
    const section = document.querySelector('.section-service');
    const scrollContainer = document.querySelector('.feature-grid-scroll');
    if (!section || !scrollContainer) return;

    function maxLeft() {
        return scrollContainer.scrollWidth - scrollContainer.clientWidth;
    }

    let targetLeft = 0;
    let locked = false;
    let passedEnd = false;
    let rafId = null;

    function tick() {
        const diff = targetLeft - scrollContainer.scrollLeft;
        if (Math.abs(diff) < 0.5) {
            scrollContainer.scrollLeft = targetLeft;
            rafId = null;
            return;
        }
        scrollContainer.scrollLeft += diff * 0.14;
        rafId = requestAnimationFrame(tick);
    }

    window.addEventListener('wheel', function (e) {
        const max = maxLeft();
        if (max <= 5) return;

        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const goingDown = e.deltaY > 0;

        if (!locked) {
            if (goingDown && passedEnd) return;
            if (!goingDown && sectionTop > window.innerHeight * 0.5) {
                passedEnd = false;
                targetLeft = 0;
                return;
            }
            if (sectionTop <= 2 && rect.bottom >= window.innerHeight * 0.1) {
                locked = true;
            } else {
                return;
            }
        }

        if (goingDown && targetLeft >= max) {
            locked = false;
            passedEnd = true;
            return;
        }
        if (!goingDown && targetLeft <= 0) {
            locked = false;
            return;
        }

        e.preventDefault();
        targetLeft = Math.max(0, Math.min(max, targetLeft + e.deltaY));
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(tick);
    }, { passive: false });

    scrollContainer.addEventListener('scroll', function () {
        if (!locked) targetLeft = scrollContainer.scrollLeft;
    });
})();

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
