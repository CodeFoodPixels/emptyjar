import React, { useContext } from "react";
import { StateContext } from "../context";

const InfoBar = () => {
  const {
    state: {
      data: { totalHits, totalUniques, totalPageUniques }
    }
  } = useContext(StateContext);

  return (
    <section className="infobar">
      <div className="infobar__stat">
        <div>Unique Vists</div>
        <div className="infobar__stat-value">{totalUniques}</div>
      </div>
      <div className="infobar__stat">
        <div>Page Views</div>
        <div className="infobar__stat-value">{totalHits}</div>
      </div>
      <div className="infobar__stat">
        <div>Unique Page Views</div>
        <div className="infobar__stat-value">{totalPageUniques}</div>
      </div>
    </section>
  );
};

InfoBar.displayName = "InfoBar";

export default InfoBar;
