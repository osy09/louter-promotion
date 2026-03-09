(function () {
    const section = document.querySelector('.section-service');
    const slider  = document.querySelector('.feature-grid-scroll');
    if (!section || !slider) return;

    let locked  = false;
    let done    = false;
    let targetX = 0;
    let raf     = null;

    function getMax() {
        return slider.scrollWidth - slider.clientWidth;
    }

    function animate() {
        const d = targetX - slider.scrollLeft;
        if (Math.abs(d) < 0.5) { slider.scrollLeft = targetX; raf = null; return; }
        slider.scrollLeft += d * 0.14;
        raf = requestAnimationFrame(animate);
    }

    window.addEventListener('wheel', function (e) {
        const max  = getMax();
        if (max <= 5) return;

        const top  = section.getBoundingClientRect().top;
        const down = e.deltaY > 0;

        if (!locked) {
            if (down && done) return;
            if (!down) {
                if (top > window.innerHeight * 0.5) { done = false; targetX = 0; }
                return;
            }
            if (top > 5 || top < -(section.offsetHeight - window.innerHeight * 0.3)) return;
            locked = true;
        }

        e.preventDefault();

        if (down && targetX >= max) { locked = false; done = true; return; }
        if (!down && targetX <= 0)  { locked = false; return; }

        targetX = Math.max(0, Math.min(max, targetX + e.deltaY));
        if (!raf) raf = requestAnimationFrame(animate);
    }, { passive: false });

    slider.addEventListener('scroll', function () {
        if (!locked) targetX = slider.scrollLeft;
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
