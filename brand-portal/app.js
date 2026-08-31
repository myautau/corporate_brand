const slides = [
  {
    title: 'Новая типографика бренда: правила применения в документах',
    category: 'Шаблоны и документы',
    date: '31 марта',
    badge: 'Изменение',
    badgeTone: 'warning'
  },
  {
    title: 'Обновлены шаблоны презентаций для внутренних встреч',
    category: 'Презентации',
    date: '28 марта',
    badge: 'Обновление',
    badgeTone: 'normal'
  },
  {
    title: 'Добавлены рекомендации по работе с фотографиями',
    category: 'Фотостиль',
    date: '24 марта',
    badge: 'Новое',
    badgeTone: 'success'
  }
];

let currentSlide = 0;
const newsTitle = document.getElementById('news-title');
const newsCategory = document.getElementById('news-category');
const newsDate = document.querySelector('.news-card time');
const newsBadge = document.querySelector('.news-card .badge');
const dots = [...document.querySelectorAll('.pager__dot')];
const pager = document.querySelector('.pager');

function renderSlide() {
  const slide = slides[currentSlide];
  newsTitle.textContent = slide.title;
  newsCategory.textContent = slide.category;
  newsDate.textContent = slide.date;
  newsBadge.textContent = slide.badge;
  newsBadge.className = `badge badge--${slide.badgeTone}`;
  dots.forEach((dot, index) => dot.classList.toggle('pager__dot--active', index === currentSlide));
  pager.setAttribute('aria-label', `Слайд ${currentSlide + 1} из ${slides.length}`);
}

document.querySelectorAll('[data-direction]').forEach((button) => {
  button.addEventListener('click', () => {
    const delta = button.dataset.direction === 'next' ? 1 : -1;
    currentSlide = (currentSlide + delta + slides.length) % slides.length;
    renderSlide();
  });
});

/* Future background animation can update these three variables per frame. */
window.brandPortalBackground = {
  setTransform({ x = 0, y = 0, scale = 1 } = {}) {
    const root = document.documentElement;
    root.style.setProperty('--background-pan-x', `${x}px`);
    root.style.setProperty('--background-pan-y', `${y}px`);
    root.style.setProperty('--background-scale', scale);
  }
};
