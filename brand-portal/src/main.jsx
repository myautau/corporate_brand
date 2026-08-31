import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { MeshGradient } from "@paper-design/shaders-react";
import "../styles.css";

const slides = [
  { title: "Новая типографика бренда: правила применения в документах", category: "Шаблоны и документы", date: "31 марта", badge: "Изменение", tone: "warning" },
  { title: "Обновлены шаблоны презентаций для внутренних встреч", category: "Презентации", date: "28 марта", badge: "Обновление", tone: "normal" },
  { title: "Добавлены рекомендации по работе с фотографиями", category: "Фотостиль", date: "24 марта", badge: "Новое", tone: "success" },
];

function App() {
  const [slide, setSlide] = useState(0);
  const current = slides[slide];
  const move = (delta) => setSlide((value) => (value + delta + slides.length) % slides.length);

  return (
    <main className="portal" aria-label="Брендлист Газпром нефти">
      <div className="ambient-background" aria-hidden="true">
        <MeshGradient
          className="ambient-background__shader"
          width={1280}
          height={720}
          colors={["#ff630f", "#2e728e", "#173c82", "#00115c"]}
          distortion={0.22}
          swirl={0.03}
          grainMixer={0}
          grainOverlay={0}
          speed={0.7}
          scale={1.15}
          rotation={8}
          offsetX={0.08}
          offsetY={0.02}
          fit="cover"
        />
      </div>

      <header className="header">
        <div className="header__left">
          <a className="brandlist" href="#" aria-label="Брендлист — на главную"><img src="/assets/brandlist-logo.svg" alt="" /></a>
          <nav className="nav" aria-label="Основная навигация">
            <span className="nav__item nav__item--active">Бренды компании <img src="/assets/chevron.svg" alt="" /></span>
            <span className="nav__item">Товарные знаки <img src="/assets/chevron.svg" alt="" /></span>
          </nav>
        </div>
        <div className="header__right">
          <button className="icon-button notifications" type="button" aria-label="Уведомления"><img src="/assets/search.svg" alt="" /><span className="notifications__dot" /></button>
          <button className="profile" type="button" aria-label="Открыть профиль Ивана Петрова"><span className="profile__avatar"><img className="profile__photo" src="/assets/avatar.png" alt="" /><img className="profile__ring" src="/assets/avatar-ring.svg" alt="" /></span><span>Иван Петров</span></button>
          <button className="icon-button" type="button" aria-label="Выйти"><img src="/assets/exit.svg" alt="" /></button>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <img className="hero__logo" src="/assets/brand-logo.svg" alt="Газпром нефть — Цифровая нефтяная компания" />
        <h1 id="hero-title">Единая система<br />фирменного стиля для всех<br />подразделений и&nbsp;ДО</h1>
      </section>

      <aside className="cards" aria-label="Материалы и новости">
        <article className="glass-card guide-card"><div className="guide-card__copy"><div><h2>Книга фирменного стиля</h2><p>PDF <span aria-hidden="true">·</span> 33 МБ</p></div><a className="download-button" href="/assets/guide-cover.png" download>Скачать <img src="/assets/download.svg" alt="" /></a></div><img className="guide-card__cover" src="/assets/guide-cover.png" alt="Обложка книги фирменного стиля" /></article>
        <article className="glass-card news-card" aria-live="polite"><div className="news-card__content"><div className="news-card__meta"><span className={`badge badge--${current.tone}`}>{current.badge}</span><time>{current.date}</time></div><div><h2>{current.title}</h2><p>{current.category}</p></div></div><div className="news-card__footer"><div className="pager" aria-label={`Слайд ${slide + 1} из ${slides.length}`}>{slides.map((_, index) => <span key={index} className={`pager__dot ${index === slide ? "pager__dot--active" : ""}`} />)}</div><div className="slider-controls"><button type="button" onClick={() => move(-1)} aria-label="Предыдущая новость"><img src="/assets/arrow-left.svg" alt="" /></button><button type="button" onClick={() => move(1)} aria-label="Следующая новость"><img src="/assets/arrow-right.svg" alt="" /></button></div></div></article>
      </aside>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
