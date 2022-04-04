import React, { useState, useContext, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { subMonths, isBefore } from "date-fns";
import "react-day-picker/dist/style.css";
import { dateYMD } from "../helpers";
import { StateContext } from "../context";
import { ONE_DAY, UPDATE_QUERYDATES } from "../constants";

const RangePicker = () => {
  const {
    state: {
      queryDates: { to, from }
    },
    dispatch
  } = useContext(StateContext);
  const today = new Date();

  const [range, setRange] = useState({
    from,
    to,
    bothDatesSelected: true
  });

  const [month, setMonth] = useState(subMonths(range.to, 1));

  useEffect(() => {
    const rangeTo = new Date();
    rangeTo.setFullYear(to.getUTCFullYear());
    rangeTo.setMonth(to.getUTCMonth());
    rangeTo.setDate(to.getUTCDate());
    rangeTo.setHours(23, 59, 59, 999);

    const rangeFrom = new Date();
    rangeFrom.setFullYear(from.getUTCFullYear());
    rangeFrom.setMonth(from.getUTCMonth());
    rangeFrom.setDate(from.getUTCDate());
    rangeFrom.setHours(0, 0, 0, 0);

    setMonth(subMonths(rangeTo, 1));
    setRange({
      ...range,
      to: rangeTo,
      from: rangeFrom
    });
  }, [to, from]);

  const updateQueryDates = queryDates => {
    const to = new Date();
    to.setUTCFullYear(queryDates.to.getFullYear());
    to.setUTCMonth(queryDates.to.getMonth());
    to.setUTCDate(queryDates.to.getDate());
    to.setUTCHours(23, 59, 59, 999);

    const from = new Date();
    from.setUTCFullYear(queryDates.from.getFullYear());
    from.setUTCMonth(queryDates.from.getMonth());
    from.setUTCDate(queryDates.from.getDate());
    from.setUTCHours(0, 0, 0, 0);

    dispatch({
      type: UPDATE_QUERYDATES,
      queryDates: {
        to,
        from
      }
    });
  };

  function setQueryDates() {
    updateQueryDates({
      to: range.to,
      from: range.from
    });
  }

  function setNewDates(newDates) {
    setMonth(subMonths(newDates.to, 1));
    setRange({
      ...newDates
    });

    updateQueryDates(newDates);
  }

  function handleDayClick(day) {
    setRange(() => {
      const newRange = {};
      if (range.bothDatesSelected) {
        newRange.to = day;
        newRange.from = day;
        newRange.bothDatesSelected = false;
      } else if (isBefore(range.to, day)) {
        newRange.to = day;
        newRange.from = range.from;
        newRange.bothDatesSelected = true;
      } else {
        newRange.to = range.to;
        newRange.from = day;
        newRange.bothDatesSelected = true;
      }
      return newRange;
    });
  }

  function handleTodayClick() {
    setNewDates({
      from: new Date(),
      to: new Date()
    });
  }

  function handleYesterdayClick() {
    setNewDates({
      from: new Date(Date.now() - ONE_DAY),
      to: new Date(Date.now() - ONE_DAY)
    });
  }

  function handleLast7DaysClick() {
    setNewDates({
      from: new Date(Date.now() - ONE_DAY * 6),
      to: new Date(Date.now())
    });
  }

  function handleLast30DaysClick() {
    setNewDates({
      from: new Date(Date.now() - ONE_DAY * 29),
      to: new Date(Date.now())
    });
  }

  function handleLast60DaysClick() {
    setNewDates({
      from: new Date(Date.now() - ONE_DAY * 59),
      to: new Date(Date.now())
    });
  }

  function handleLast90DaysClick() {
    setNewDates({
      from: new Date(Date.now() - ONE_DAY * 89),
      to: new Date(Date.now())
    });
  }

  return (
    <div className="rangepicker">
      <div className="rangepicker__picker">
        <div className="rangepicker__buttons">
          <button className="rangepicker__button" onClick={handleTodayClick}>
            Today
          </button>
          <button
            className="rangepicker__button"
            onClick={handleYesterdayClick}
          >
            Yesterday
          </button>
          <button
            className="rangepicker__button"
            onClick={handleLast7DaysClick}
          >
            Last 7 days
          </button>
          <button
            className="rangepicker__button"
            onClick={handleLast30DaysClick}
          >
            Last 30 days
          </button>
          <button
            className="rangepicker__button"
            onClick={handleLast60DaysClick}
          >
            Last 60 days
          </button>
          <button
            className="rangepicker__button"
            onClick={handleLast90DaysClick}
          >
            Last 90 days
          </button>
        </div>
        <div className="rangepicker__daypicker">
          <DayPicker
            numberOfMonths={2}
            mode="range"
            defaultMonth={subMonths(today, 1)}
            selected={range}
            month={month}
            onMonthChange={setMonth}
            onSelect={setRange}
            hidden={{
              after: today
            }}
            disabled={{
              after: today
            }}
            toDate={today}
            onDayClick={handleDayClick}
          />
        </div>
      </div>
      <span>
        {range.bothDatesSelected &&
          `From ${dateYMD(range.from)} to ${dateYMD(range.to)}`}
        {!range.bothDatesSelected && `Please select the second date`}
      </span>
      <button onClick={setQueryDates} disabled={!range.from || !range.to}>
        Update
      </button>
    </div>
  );
};

RangePicker.displayName = "RangePicker";

export default RangePicker;
