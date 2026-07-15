document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('.sidebar-link');
    const panes = document.querySelectorAll('.content-pane');
    const mobileNav = document.getElementById('mobile-nav');
    function showPane(target) {
        panes.forEach(p => p.classList.remove('active'));
        links.forEach(l => l.classList.remove('active'));
        const pane = document.getElementById(target);
        if (pane) pane.classList.add('active');
        const link = document.querySelector(`.sidebar-link[data-target="${target}"]`);
        if (link) link.classList.add('active');
        if (mobileNav) mobileNav.value = target;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    links.forEach(link => link.addEventListener('click', function (e) { e.preventDefault(); showPane(this.dataset.target); }));
    if (mobileNav) mobileNav.addEventListener('change', function () { showPane(this.value); });
});