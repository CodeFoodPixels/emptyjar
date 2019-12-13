import React from "react";
import { connect } from "react-redux";

const InfoBar = ({ totalHits, totalUniques, totalPageUniques }) => {
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

export default connect(({ data }) => ({
  totalHits: data.totalHits,
  totalUniques: data.totalUniques,
  totalPageUniques: data.totalPageUniques
}))(InfoBar);
