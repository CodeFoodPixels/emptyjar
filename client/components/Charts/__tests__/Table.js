import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within
} from "@testing-library/react";
import Table from "../Table";
import { act } from "react-dom/test-utils";

describe("Table", () => {
  it("should render a table with the given data", () => {
    render(
      <Table
        data={{ Chickens: { Count: 9 }, Eggs: { Count: 37 } }}
        columnName={"Item"}
      />
    );

    const expected = [
      ["Eggs", 37],
      ["Chickens", 9]
    ];

    const header = screen.getByTestId("charts__table-header");
    expect(header.childNodes.length).toBe(2);
    expect(header.childNodes[0]).toHaveTextContent("Item");
    expect(header.childNodes[1]).toHaveTextContent("Count");

    const rows = screen.getAllByTestId("charts__table-row");
    expect(rows.length).toBe(expected.length);

    rows.forEach((row, i) => {
      const columns = screen.getAllByTestId(`charts__table-row-${i}--column`);

      expect(columns.length).toBe(expected[i].length);

      columns.forEach((column, a) => {
        expect(column).toHaveTextContent(expected[i][a]);
      });
    });

    const emptyRows = screen.getAllByTestId("charts__table-row--empty");
    expect(emptyRows.length).toBe(5 - expected.length);
  });

  it("should render an empty table", () => {
    render(<Table />);

    const rows = screen.queryAllByTestId("charts__table-row");
    expect(rows.length).toBe(0);

    const emptyRows = screen.getAllByTestId("charts__table-row--empty");
    expect(emptyRows.length).toBe(5);
  });

  it("should render a table with a title", () => {
    render(<Table title={"Hits By URL"} />);

    expect(screen.queryByTestId("charts__title")).toHaveTextContent(
      "Hits By URL"
    );
  });

  it("should render a table with multiple columns", () => {
    render(
      <Table
        data={{ Chickens: { Red: 9, Green: 1 }, Eggs: { Red: 37, Green: 10 } }}
        columnName={"Item"}
      />
    );

    const expected = [
      ["Eggs", 37, 10],
      ["Chickens", 9, 1]
    ];

    const header = screen.getByTestId("charts__table-header");
    expect(header.childNodes.length).toBe(3);
    expect(header.childNodes[0]).toHaveTextContent("Item");
    expect(header.childNodes[1]).toHaveTextContent("Red");
    expect(header.childNodes[2]).toHaveTextContent("Green");

    const rows = screen.getAllByTestId("charts__table-row");
    expect(rows.length).toBe(expected.length);

    rows.forEach((row, i) => {
      const columns = screen.getAllByTestId(`charts__table-row-${i}--column`);

      expect(columns.length).toBe(expected[i].length);

      columns.forEach((column, a) => {
        expect(column).toHaveTextContent(expected[i][a]);
      });
    });

    const emptyRows = screen.getAllByTestId("charts__table-row--empty");
    expect(emptyRows.length).toBe(5 - expected.length);
  });

  it("should render a table with percentage column", () => {
    render(
      <Table
        data={{ Chickens: { Count: 9 }, Eggs: { Count: 37 } }}
        columnName={"Item"}
        total={46}
        showPercentage={true}
      />
    );

    const expected = [
      ["Eggs", 37, "80.43%"],
      ["Chickens", 9, "19.57%"]
    ];

    const header = screen.getByTestId("charts__table-header");
    expect(header.childNodes.length).toBe(3);
    expect(header.childNodes[0]).toHaveTextContent("Item");
    expect(header.childNodes[1]).toHaveTextContent("Count");
    expect(header.childNodes[2]).toHaveTextContent("%");

    const rows = screen.getAllByTestId("charts__table-row");
    expect(rows.length).toBe(expected.length);

    rows.forEach((row, i) => {
      const columns = screen.getAllByTestId(`charts__table-row-${i}--column`);

      expect(columns.length).toBe(expected[i].length);

      columns.forEach((column, a) => {
        expect(column).toHaveTextContent(expected[i][a]);
      });
    });

    const emptyRows = screen.getAllByTestId("charts__table-row--empty");
    expect(emptyRows.length).toBe(5 - expected.length);
  });

  it("should render a table with pagination if the data is longer than the limit", async () => {
    const limit = 2;

    render(
      <Table
        data={{
          Chickens: { Count: 9 },
          Eggs: { Count: 37 },
          Cows: { Count: 1 },
          Horses: { Count: 5 }
        }}
        limit={limit}
      />
    );

    const expected = [
      ["Eggs", 37],
      ["Chickens", 9],
      ["Horses", 5],
      ["Cows", 1]
    ];

    const firstPageRows = screen.getAllByTestId("charts__table-row");
    expect(firstPageRows.length).toBe(limit);

    firstPageRows.forEach((row, i) => {
      const columns = screen.getAllByTestId(`charts__table-row-${i}--column`);

      expect(columns.length).toBe(expected[i].length);

      columns.forEach((column, a) => {
        expect(column).toHaveTextContent(expected[i][a]);
      });
    });

    const nextButton = screen.getByTestId("charts__pagination-button--next");

    fireEvent.click(nextButton);

    await waitFor(() => screen.getByTestId("charts__pagination-button--prev"));

    const secondPageRows = screen.getAllByTestId("charts__table-row");
    expect(secondPageRows.length).toBe(limit);

    secondPageRows.forEach((row, i) => {
      const columns = screen.getAllByTestId(`charts__table-row-${i}--column`);

      expect(columns.length).toBe(expected[limit + i].length);

      columns.forEach((column, a) => {
        expect(column).toHaveTextContent(expected[limit + i][a]);
      });
    });

    const prevButton = screen.getByTestId("charts__pagination-button--prev");

    fireEvent.click(prevButton);

    await waitFor(() => screen.getByTestId("charts__pagination-button--next"));

    const recheckFirstPageRows = screen.getAllByTestId("charts__table-row");
    expect(recheckFirstPageRows.length).toBe(limit);

    recheckFirstPageRows.forEach((row, i) => {
      const columns = screen.getAllByTestId(`charts__table-row-${i}--column`);

      expect(columns.length).toBe(expected[i].length);

      columns.forEach((column, a) => {
        expect(column).toHaveTextContent(expected[i][a]);
      });
    });
  });

  it("should render a table with links", () => {
    render(
      <Table
        data={{
          "https://lukeb.co.uk": { Hits: 9 },
          "https://doineedbuntingtoday.com": { Hits: 37 }
        }}
        linkContents={true}
      />
    );

    const expected = [
      ["https://doineedbuntingtoday.com", 37],
      ["https://lukeb.co.uk", 9]
    ];

    const rows = screen.getAllByTestId("charts__table-row");
    expect(rows.length).toBe(expected.length);

    rows.forEach((row, i) => {
      const columns = screen.getAllByTestId(`charts__table-row-${i}--column`);

      expect(columns.length).toBe(expected[i].length);
      const link = within(columns[0]).getByTestId(
        `charts__table-row-${i}--link`
      );
      expect(columns[0]).toHaveTextContent(
        `${expected[i][0]} [Open in new tab]`
      );
      expect(link).toHaveTextContent(`[Open in new tab]`);
      expect(link).toHaveAttribute("href", expected[i][0]);
      expect(columns[1]).toHaveTextContent(expected[i][1]);
    });

    const emptyRows = screen.getAllByTestId("charts__table-row--empty");
    expect(emptyRows.length).toBe(5 - expected.length);
  });

  it("should render show a loader", () => {
    render(<Table loading={true} />);

    expect(screen.queryByTestId("charts__loader")).toBeInTheDocument();
  });

  it("should call the filter function when a data item is clicked", () => {
    const filterInner = jest.fn();
    const filter = value => () => filterInner(value);

    render(
      <Table
        data={{
          "https://lukeb.co.uk": { Hits: 9 },
          "https://doineedbuntingtoday.com": { Hits: 37 }
        }}
        filter={filter}
      />
    );

    const columns = screen.getAllByTestId(`charts__table-row-0--column`);

    fireEvent.click(columns[0]);

    expect(filterInner).toHaveBeenCalledTimes(1);
    expect(filterInner).toHaveBeenCalledWith("https://doineedbuntingtoday.com");
  });

  it("should not call the filter function when a link is clicked", () => {
    const filterInner = jest.fn();
    const filter = value => () => filterInner(value);

    render(
      <Table
        data={{
          "https://lukeb.co.uk": { Hits: 9 },
          "https://doineedbuntingtoday.com": { Hits: 37 }
        }}
        filter={filter}
        linkContents={true}
      />
    );

    const link = screen.getByTestId(`charts__table-row-0--link`);

    fireEvent.click(link);

    expect(filterInner).toHaveBeenCalledTimes(0);
  });
});
