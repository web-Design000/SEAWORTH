    (function(){
        const sphereCol = document.getElementById('spSpheres');
        const spheres = document.querySelectorAll('.sp-sphere');
        const idle = document.getElementById('spIdle');
        const stack = document.getElementById('spContentStack');

        function setActive(i){
            document.querySelectorAll('.sp-sphere').forEach(el => el.classList.toggle('active', +el.dataset.i === i));
            document.querySelectorAll('.sp-bg-photo, .sp-eyebrow, .sp-headline, .sp-brand').forEach(el => el.classList.toggle('on', +el.dataset.i === i));
            if(idle) idle.classList.add('hide');
            if(stack) stack.classList.add('show');
        }

        function setIdle(){
            document.querySelectorAll('.sp-sphere').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.sp-bg-photo').forEach(el => el.classList.remove('on'));
            if(idle) idle.classList.remove('hide');
            if(stack) stack.classList.remove('show');
        }

        if(spheres && sphereCol) {
            spheres.forEach(sp => {
                sp.addEventListener('click', () => setActive(+sp.dataset.i));
                sp.addEventListener('mouseenter', () => setActive(+sp.dataset.i));
            });

            sphereCol.addEventListener('mouseleave', setIdle);

            document.addEventListener('click', (e) => {
                if (!sphereCol.contains(e.target)) setIdle();
            });
        }
    })();
