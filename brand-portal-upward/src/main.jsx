import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import symbolLayout from "./symbols.json";
import { letterTarget, upwardPosition } from "./motion.js";
import Materials from "./Materials.jsx";
import { densifySymbols } from "./density.js";
import { separateGlyphs } from "./glyph-spacing.js";
import "../styles.css";

// Exact exported Figma vectors; only baked alpha/blur move to the interaction layer.
const vectors = import.meta.glob("../assets/imgVector*.svg", { query: "?raw", import: "default", eager: true });
const files = import.meta.glob("../assets/*", { query: "?url", import: "default", eager: true });
const asset = (name) => files[`../assets/${name}`];
const symbols = separateGlyphs(densifySymbols(symbolLayout).map((s) => {
  const source = vectors[`../${s.src}`];
  const box = source.match(/viewBox="([^"]+)"/)[1].split(" ").map(Number);
  const alpha = Number(source.match(/fill-opacity="([^"]+)"/)?.[1] ?? 1);
  const blur = Number(source.match(/stdDeviation="([^"]+)"/)?.[1] ?? 0);
  return { ...s, alpha, blur, width: box[2], height: box[3],
    depth: alpha >= .5 ? 1 : alpha >= .3 ? .55 : .22,
    svg: source.replace(/fill-opacity="[^"]*"/g, 'fill-opacity="1"')
      .replace(/ filter="[^"]*"/g, "").replace(/<defs>[\s\S]*?<\/defs>/g, "")
      .replace('preserveAspectRatio="none"', 'preserveAspectRatio="xMidYMid meet"'),
  };
}));

function InteractiveLetterField({ portalRef }) {
  const fieldRef = useRef(null);
  const elapsedRef = useRef(0);
  useEffect(() => {
    const portal = portalRef.current;
    const field = fieldRef.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const letters = [...field.children].map((el, i) => ({ el, ...symbols[i], dx: 0, dy: 0, focus: 0 }));
    let rect, scale = 1, frame = 0, previous = 0;
    let inside = false, pointer = { x: 0, y: 0 };

    const render = (time) => {
      frame = 0;
      const delta = Math.min(64, previous ? time - previous : 0);
      previous = time;
      if (!document.hidden) elapsedRef.current += delta / 1000;
      const ease = reduced.matches ? 1 : 1 - Math.exp(-delta / 125);
      const interactive = inside && !document.hidden;
      for (const l of letters) {
        const y = upwardPosition(l, elapsedRef.current);
        const { focus, x: tx, y: ty } = letterTarget({ ...l, y }, pointer, rect, scale, interactive, reduced.matches);
        l.dx += (tx - l.dx) * ease;
        l.dy += (ty - l.dy) * ease;
        l.focus += (focus - l.focus) * ease;
        const rise = (y - l.y) / 800 * rect.height;
        l.el.style.transform = `translate(-50%, -50%) translate(${l.dx.toFixed(3)}px, ${(rise + l.dy).toFixed(3)}px)`;
        l.el.style.opacity = (l.alpha + (.94 - l.alpha) * l.focus).toFixed(4);
        l.el.style.filter = `blur(${(l.blur * scale * (1 - .9 * l.focus)).toFixed(3)}px)`;
      }
      if (!document.hidden) frame = requestAnimationFrame(render);
      else previous = 0;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const measure = () => {
      rect = portal.getBoundingClientRect();
      scale = Math.min(rect.width / 1440, rect.height / 800);
      field.style.setProperty("--symbol-scale", scale);
      schedule();
    };
    const move = (event) => {
      if (!fine.matches || event.pointerType === "touch") return;
      inside = true;
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      schedule();
    };
    const leave = () => { inside = false; schedule(); };
    const visibility = () => {
      inside = false;
      previous = 0;
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else schedule();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(portal);
    measure();
    portal.addEventListener("pointermove", move);
    portal.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    window.addEventListener("scroll", measure, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", leave);
    fine.addEventListener("change", leave);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      portal.removeEventListener("pointermove", move);
      portal.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
      window.removeEventListener("scroll", measure);
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", leave);
      fine.removeEventListener("change", leave);
    };
  }, [portalRef]);
  return <div ref={fieldRef} className="letter-field letter-field--running" aria-hidden="true">
    {symbols.map((s) => <span key={s.id} className="symbol" data-node-id={s.id} data-source-node-id={s.artworkSourceId} data-glyph-family={s.glyphFamily}
      style={{ left: `${s.x / 14.4}%`, top: `${s.y / 8}%`, width: `calc(${s.width}px * var(--symbol-scale, 1))`,
        aspectRatio: `${s.width} / ${s.height}`, opacity: s.alpha, filter: `blur(${s.blur}px)` }}
      dangerouslySetInnerHTML={{ __html: s.svg }} />)}
  </div>;
}

function Header({ onNotice }) {
  return <header className="header">
    <div className="header__left">
      <a className="brandlist" href="#" aria-label="Брендлист — на главную"><img src={asset("brandlist-logo.svg")} alt="Брендлист" /></a>
      <nav className="nav" aria-label="Основная навигация">
        <button className="nav__item nav__item--active" onClick={() => onNotice("Бренды компании")}><span>Бренды компании</span><img src={asset("chevron.svg")} alt="" /></button>
        <button className="nav__item" onClick={() => onNotice("Товарные знаки")}><span>Товарные знаки</span><img src={asset("chevron.svg")} alt="" /></button>
      </nav>
    </div>
    <div className="header__right">
      <button className="icon-button notifications" onClick={() => onNotice("Уведомления")} aria-label="Уведомления"><img src={asset("notification.svg")} alt="" /></button>
      <button className="profile" onClick={() => onNotice("Иван Петров")} aria-label="Открыть профиль Ивана Петрова">
        <span className="profile__avatar"><img className="profile__photo" src={asset("avatar.png")} alt="" /><img className="profile__ring" src={asset("avatar-ring.svg")} alt="" /></span><span>Иван Петров</span>
      </button>
      <button className="icon-button" onClick={() => onNotice("Выход")} aria-label="Выйти"><img src={asset("exit.svg")} alt="" /></button>
    </div>
  </header>;
}

function GuideCard({ onNotice }) {
  return <article className="guide-card">
    <div className="guide-card__content">
      <div><h2>Книга фирменного стиля</h2><p>PDF <span>·</span> 33 МБ</p></div>
      <button onClick={() => onNotice("Книга фирменного стиля")}>Скачать <img src={asset("download.svg")} alt="" /></button>
    </div>
    <div className="guide-card__cover"><div className="guide-card__art"><img src={asset("book-art.png")} alt="" /></div></div>
  </article>;
}

function PreviewDialog({ title, close }) {
  const ref = useRef(null);
  useEffect(() => { ref.current.showModal(); }, []);
  return <dialog ref={ref} aria-labelledby="dialog-title" className="preview-dialog" onClose={close} onClick={(e) => { if (e.target === ref.current) ref.current.close(); }}>
    <h2 id="dialog-title">{title}</h2>
    <p>{title === "Книга фирменного стиля" ? "PDF пока не подключён. В макете есть только обложка." : "Это визуальный прототип. Раздел пока не подключён."}</p>
    <button autoFocus onClick={() => ref.current.close()}>Закрыть</button>
  </dialog>;
}

function App() {
  const portalRef = useRef(null);
  const [notice, setNotice] = useState(null);
  return <main aria-label="Корпоративный бренд Газпром нефти">
    <section ref={portalRef} className="portal" aria-label="О корпоративном бренде">
    <InteractiveLetterField portalRef={portalRef} />
    <img className="brand-lockup" src={asset("brand-lockup.svg")} alt="Газпром нефть — энергия в людях" />
    <section className="hero-copy" aria-labelledby="hero-title">
      <h1 id="hero-title">Корпоративный бренд<br />Газпром нефть</h1>
      <p>Единая система фирменного стиля для всех подразделений и дочерних обществ</p>
    </section>
    <aside className="guide-wrap"><GuideCard onNotice={setNotice} /></aside>
    <Header onNotice={setNotice} />
    </section>
    <Materials onOpen={setNotice} />
    {notice && <PreviewDialog title={notice} close={() => setNotice(null)} />}
  </main>;
}

const root = import.meta.hot?.data.root ?? createRoot(document.getElementById("root"));
if (import.meta.hot) import.meta.hot.data.root = root;
root.render(<App />);
