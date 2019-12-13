import React, { useState } from "react";
import { connect } from "react-redux";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";

const RangePicker = ({ from, to, updateQueryDates }) => {
  const today = new Date();

  const [state, setState] = useState({
    from,
    to
  });

  function handleDayClick(day) {
    setState(DateUtils.addDayToRange(day, state));
  }

  function setQueryDates() {
    updateQueryDates(state);
  }

  return (
    <div className="rangepicker">
      <DayPicker
        className="Selectable"
        numberOfMonths={2}
        selectedDays={[state.from, { from: state.from, to: state.to }]}
        initialMonth={state.to}
        toMonth={today}
        modifiers={{
          disabled: {
            after: today
          }
        }}
        onDayClick={handleDayClick}
      />
      <button onClick={setQueryDates}>Update</button>
    </div>
  );
};

RangePicker.displayName = "RangePicker";

export default connect(
  ({ queryDates }) => ({
    from: queryDates.from,
    to: queryDates.to
  }),
  dispatch => ({
    updateQueryDates: queryDates =>
      dispatch({
        type: "UPDATE_QUERYDATES",
        queryDates
      })
  })
)(RangePicker);
