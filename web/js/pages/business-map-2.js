        function openLightbox(src) {
            document.getElementById('lightboxImg').src = src;
            document.getElementById('lightboxOverlay').classList.add('is-active');
            document.body.style.overflow = 'hidden';
        }
        function closeLightbox() {
            document.getElementById('lightboxOverlay').classList.remove('is-active');
            document.body.style.overflow = '';
        }
    
