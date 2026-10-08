        lucide.createIcons();

        function handleFormSubmit(e) {
            e.preventDefault();

            const serviceInput = document.getElementById('serviceSelect');
            if (serviceInput && !serviceInput.value) {
                document.getElementById('serviceSelectTrigger').focus();
                return;
            }

            const toast = document.getElementById('blanzToast');
            toast.style.display = 'flex';

            document.getElementById('blanzContactForm').reset();

            setTimeout(() => {
                toast.style.display = 'none';
            }, 4500);
        }
    
