import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Bar from "../Bar";

class ResizeObserver {
  constructor(cb) {
    cb([{ contentRect: { width: 500, height: 500 } }]);
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

describe("Bar", () => {
  it("should render a chartJS chart", () => {
    render(
      <Bar
        data={{
          labels: ["2022-04-20", "2022-04-21", "2022-04-22"],
          data: [
            { name: "Pizzas", values: [13, 14, 15] },
            { name: "Burgers", values: [12, 13, 11] },
            { name: "Fries", values: [19, 10, 3] }
          ]
        }}
      />
    );

    expect(screen.getByTestId("charts__bar-chart")).toBeInTheDocument();
  });

  it("should render a title", () => {
    render(
      <Bar data={{ labels: [1, 2, 3], data: [] }} title={"Hits By URL"} />
    );

    expect(screen.getByTestId("charts__title")).toHaveTextContent(
      "Hits By URL"
    );
  });

  it("should show a loader", () => {
    render(<Bar data={{ labels: [1, 2, 3], data: [] }} loading={true} />);

    expect(screen.queryByTestId("charts__loader")).toBeInTheDocument();
  });
});
