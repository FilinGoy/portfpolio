if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("js/sw.js");
    /*                 .then(function (reg) {
console.log('Registration succeeded. Scope is ' + reg.scope);
    })
.catch(function (error) {
console.error('Trouble with sw: ', error);
    }); */
}

const d = document;
const cl = (info) => console.log(info);

// Автоматическое прокручивание слайдов
d.addEventListener('DOMContentLoaded', () => {
    const container = d.querySelector('.row-snap');
    const prevButton = d.querySelector('.prev-button');
    const nextButton = d.querySelector('.next-button');
    const indicators = d.querySelectorAll('.indicator');
    let currentIndex = 0;
    const totalSlides = container.childElementCount;
    let scrollInterval;

    // Функции для начала и конца автоматической прокрутки
    function startAutoScroll() {
        scrollInterval = setInterval(() => {
            nextButtonClickHandler();
        }, 5000);
    }
    function stopAutoScroll() {
        clearInterval(scrollInterval);
    }

    // Обновляем индикаторы текущего слайда
    function updateIndicator() {
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    // Обработчик клика на кнопку "Предыдущий слайд"
    function prevButtonClickHandler() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        scrollToSlide(currentIndex);
        updateIndicator();
    }

    // Обработчик клика на кнопку "Следующий слайд"
    function nextButtonClickHandler() {
        currentIndex = (currentIndex + 1) % totalSlides;
        scrollToSlide(currentIndex);
        updateIndicator();
    }

    // Обработчики событий для кнопок переключения слайдов
    prevButton.addEventListener('click', prevButtonClickHandler);
    nextButton.addEventListener('click', nextButtonClickHandler);

    // Функция для прокрутки к указанному слайду
    function scrollToSlide(index) {
        const slideWidth = container.querySelector('div').clientWidth;
        container.scrollLeft = index * slideWidth;
    }

    // Начать автоматическую прокрутку при загрузке страницы
    startAutoScroll();

    // Остановка автоматической прокрутки при наведении курсора на слайдер
    container.addEventListener('mouseenter', stopAutoScroll);
    container.addEventListener('mouseleave', startAutoScroll);

    // Обработчики событий для свайпа
    let isDragging = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseup', () => {
        isDragging = false;
        handleEdgeScroll();
    });

    container.addEventListener('mouseleave', () => {
        isDragging = false;
        handleEdgeScroll();
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 0.1; // Чувствительность перемещения
        container.scrollLeft = scrollLeft - walk;

        // Определяем направление свайпа
        if (walk > 0) {
            prevButtonClickHandler(); // Вызываем функцию для предыдущего слайда
        } else {
            nextButtonClickHandler(); // Вызываем функцию для следующего слайда
        }
    });

    // Обработка прокрутки к первому или последнему слайду при достижении края
    function handleEdgeScroll() {
        if (container.scrollLeft === 0 && currentIndex !== 0) {
            currentIndex = 0;
            updateIndicator();
        } else if (container.scrollLeft + container.clientWidth >= container.scrollWidth && currentIndex !== totalSlides - 1) {
            currentIndex = totalSlides - 1;
            updateIndicator();
        }
    }
});