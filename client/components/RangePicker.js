import React, { useState, useContext, useEffect } from "react";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
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

  const [state, setState] = useState({
    from,
    to,
    selectedBothDates: true
  });

  useEffect(() => {
    setState({
      ...state,
      to,
      from
    });
  }, [to, from]);

  const updateQueryDates = queryDates =>
    dispatch({
      type: UPDATE_QUERYDATES,
      queryDates
    });

  function handleDayClick(day, modifiers = {}) {
    if (modifiers.disabled) {
      return;
    }

    const newState = {};

    if (state.selectedBothDates) {
      newState.from = new Date(day);
      newState.selectedBothDates = false;
    } else if (
      !state.selectedBothDates &&
      DateUtils.isSameDay(state.from, day)
    ) {
      newState.from = state.from;
      newState.to = new Date(day);
      newState.selectedBothDates = true;
    } else {
      const dateRange = DateUtils.addDayToRange(day, state);
      newState.from = dateRange.from;
      newState.to = dateRange.to;
      newState.selectedBothDates = true;
    }

    if (newState.from) {
      newState.from.setUTCHours(0, 0, 0, 0);
    }

    if (newState.to) {
      newState.to.setUTCHours(23, 59, 59, 999);
    }

    setState(newState);
  }

  function setQueryDates() {
    updateQueryDates({
      from: state.from,
      to: state.to
    });
  }

  function setNewDates(newDates) {
    newDates.from.setUTCHours(0, 0, 0, 0);
    newDates.to.setUTCHours(23, 59, 59, 999);

    setState({
      ...newDates,
      selectedBothDates: true
    });

    updateQueryDates(newDates);
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
            className="Selectable"
            numberOfMonths={2}
            selectedDays={[state.from, { from: state.from, to: state.to }]}
            month={to}
            toMonth={today}
            modifiers={{
              disabled: {
                after: today
              }
            }}
            onDayClick={handleDayClick}
          />
        </div>
      </div>
      <span>
        {state.from &&
          state.to &&
          `From ${dateYMD(state.from)} to ${dateYMD(state.to)}`}
        {state.from && !state.to && `Please select the 2nd date`}
      </span>
      <button onClick={setQueryDates} disabled={!state.from || !state.to}>
        Update
      </button>
    </div>
  );
};

RangePicker.displayName = "RangePicker";

export default RangePicker;
