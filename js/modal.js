document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.getElementById('closeModal');
    document.querySelectorAll('.expand-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const img = this.closest('.image-container').querySelector('img');
            if (img) { modalImg.src = img.src; modal.classList.add('active'); }
        });
    });
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    if (modal) modal.addEventListener('click', function (e) { if (e.target === modal) modal.classList.remove('active'); });
});