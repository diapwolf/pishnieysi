// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Анимация при скролле
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.about-item').forEach(item => {
        observer.observe(item);
    });

    // Установка минимальной даты для бронирования
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('date').min = formattedDate;

    // Управление временными ограничениями
    const timeInput = document.getElementById('time');

    // Проверка времени при изменении
    timeInput.addEventListener('change', function() {
        validateTime(this.value);
    });

    function validateTime(selectedTime) {
        if (!selectedTime) return true;

        const [hours, minutes] = selectedTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;

        // Рабочее время: 18:00 (1080 минут) до 01:00 (60 минут следующего дня)
        const startMinutes = 18 * 60; // 1080 минут
        const endMinutes = 25 * 60;   // 1500 минут (01:00 следующего дня)

        if (totalMinutes < startMinutes || totalMinutes >= endMinutes) {
            alert('Пожалуйста, выберите время между 18:00 и 01:00');
            timeInput.value = '';
            return false;
        }
        return true;
    }

    // Обработка формы бронирования
    const form = document.getElementById('bookingForm');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;

        // Проверка времени перед отправкой
        if (!validateTime(time)) {
            return;
        }

        // Форматирование даты
        const dateObj = new Date(date);
        const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${dateObj.getFullYear()}`;

        try {
            // Здесь будет ваш API ключ и URL Google Apps Script
            const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';

            const formData = new FormData();
            formData.append('date', formattedDate);
            formData.append('name', name);
            formData.append('phone', phone);
            formData.append('time', time);

            const response = await fetch(scriptURL, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Бронирование успешно оформлено!');
                form.reset();
            } else {
                throw new Error('Ошибка отправки');
            }
        } catch (error) {
            alert('Произошла ошибка при бронировании. Попробуйте еще раз.');
            console.error('Ошибка:', error);
        }
    });

    // Анимации наведения
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});