import React from "react";
const Loader = () => {
  return (
    <div className="charts__loader">
      <svg
        width="90"
        height="30"
        viewBox="0 0 90 30"
        xmlns="http://www.w3.org/2000/svg"
        fill="#7F7F7F"
      >
        <circle cx="15" cy="15" r="15">
          <animate
            attributeName="r"
            from="15"
            to="15"
            begin="-0.125s"
            dur="2s"
            keyTimes="0; 0.125; 0.25; 1"
            values="9;15;9;9"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="45" cy="15" r="9">
          <animate
            attributeName="r"
            from="15"
            to="15"
            begin="0"
            dur="2s"
            keyTimes="0; 0.125; 0.25; 1"
            values="9;15;9;9"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="75" cy="15" r="9">
          <animate
            attributeName="r"
            from="15"
            to="15"
            begin="0.125s"
            dur="2s"
            keyTimes="0; 0.125; 0.25; 1"
            values="9;15;9;9"
            calcMode="linear"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};

Loader.displayName = "Loader";

export default Loader;
