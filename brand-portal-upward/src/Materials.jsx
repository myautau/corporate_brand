import React from "react";
import logo from "../assets/materials/imgVector.svg";
import slogan from "../assets/materials/imgVector1.svg";
import arrow from "../assets/materials/imgIconForward.svg";
import colors from "../assets/materials/colors.png";
import fontLight from "../assets/materials/font-light.svg";
import fontMedium from "../assets/materials/font-medium.svg";
import fontBold from "../assets/materials/font-bold.svg";
import presentations from "../assets/materials/presentations.png";
import "./materials.css";

// Stretch the glass independently from the exact exported glyphs.
function FontScene() {
  return <span className="font-scene">
    <img className="font-scene__letter font-scene__letter--light" src={fontLight} alt="" draggable="false" />
    <span className="font-scene__glass font-scene__glass--first" />
    <img className="font-scene__letter font-scene__letter--medium" src={fontMedium} alt="" draggable="false" />
    <span className="font-scene__glass font-scene__glass--last" />
    <img className="font-scene__letter font-scene__letter--bold" src={fontBold} alt="" draggable="false" />
  </span>;
}

// Other glass artwork retains its exact raster exports.
function MaterialCard({ kind, title, src, onOpen }) {
  return <article className={`material-card material-card--${kind}`}>
    <button type="button" onClick={() => onOpen(title)} aria-label={title}>
      <span className="material-visual" aria-hidden="true">
        {kind === "fonts" ? <FontScene /> : <img className={kind === "logo" ? "material-logo" : kind === "slogan" ? "material-slogan" : "material-scene"}
          src={src} alt="" loading="lazy" draggable="false" />}
      </span>
      <span className="material-title">{title}</span>
    </button>
  </article>;
}

export default function Materials({ onOpen }) {
  return <section className="materials" id="materials" aria-labelledby="materials-title">
    <div className="materials__heading">
      <h2 id="materials-title">Материалы бренда</h2>
      <button className="materials__more" type="button" onClick={() => onOpen("Материалы бренда")}>
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
        <MaterialCard kind="fonts" title="Фирменные шрифты" onOpen={onOpen} />
        <MaterialCard kind="presentations" title="Презентации" src={presentations} onOpen={onOpen} />
      </div>
    </div>
  </section>;
}
