import React from "react";
import logo from "../assets/materials/imgVector.svg";
import slogan from "../assets/materials/imgVector1.svg";
import arrow from "../assets/materials/imgIconForward.svg";
import colors from "../assets/materials/colors.png";
import fonts from "../assets/materials/fonts.png";
import presentations from "../assets/materials/presentations.png";
import "./materials.css";

// Figma's SVG export drops backdrop blur. Glass artwork uses exact raster exports;
// all labels and layout remain native HTML.
function MaterialCard({ kind, title, src, onOpen }) {
  return <article className={`material-card material-card--${kind}`}>
    <button type="button" onClick={() => onOpen(title)} aria-label={title}>
      <span className="material-visual" aria-hidden="true">
        <img className={kind === "logo" ? "material-logo" : kind === "slogan" ? "material-slogan" : "material-scene"}
          src={src} alt="" loading="lazy" draggable="false" />
      </span>
      <span className="material-title">{title}</span>
    </button>
  </article>;
}

export default function Materials({ onOpen }) {
  return <section className="materials" id="materials" aria-labelledby="materials-title">
    <div className="materials__heading">
      <h2 id="materials-title">Материалы корпоративного бренда</h2>
      <button className="materials__more" type="button" onClick={() => onOpen("Материалы корпоративного бренда")}>
        Перейти в раздел <img src={arrow} alt="" />
      </button>
    </div>
    <div className="materials__grid">
      <div className="materials__row materials__row--primary">
        <MaterialCard kind="logo" title="Логотип «Газпром нефти»" src={logo} onOpen={onOpen} />
        <MaterialCard kind="slogan" title="Слоган «Энергия в людях»" src={slogan} onOpen={onOpen} />
      </div>
      <div className="materials__row materials__row--secondary">
        <MaterialCard kind="colors" title="Фирменные цвета" src={colors} onOpen={onOpen} />
        <MaterialCard kind="fonts" title="Фирменные шрифты" src={fonts} onOpen={onOpen} />
        <MaterialCard kind="presentations" title="Презентации" src={presentations} onOpen={onOpen} />
      </div>
    </div>
  </section>;
}
