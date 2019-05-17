import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import React, { Component } from 'react';
import './datepicker.scss';
import moment from 'moment';
// import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';
// import aphroditeInterface from 'react-with-styles-interface-aphrodite';
// import DefaultTheme from 'react-dates/lib/theme/DefaultTheme';

// ThemedStyleSheet.registerInterface(aphroditeInterface);
// ThemedStyleSheet.registerTheme({
//   reactDates: {
//     ...DefaultTheme.reactDates,
//     color: {
//       ...DefaultTheme.reactDates.color,
//       highlighted: {
//         backgroundColor: '#82E0AA',
//         backgroundColor_active: '#58D68D',
//         backgroundColor_hover: '#58D68D',
//         color: '#186A3B',
//         color_active: '#186A3B',
//         color_hover: '#186A3B',
//       },
//     },
//   },
// });


class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = { startDate: null, endDate: null, focusedInput: null };
  }

  componentDidMount() {
    if (this.props.startDate !== null && this.props.startDate !== undefined) {
      this.setState({ startDate: moment.utc(this.props.startDate) });
    }
    if (this.props.endDate !== null && this.props.endDate !== undefined) {
      this.setState({ endDate: moment.utc(this.props.endDate) });
    }
  }

  componentDidUpdate(prevProps, nextProps) {
    if (prevProps.startDate !== this.props.startDate) {
      this.setState({ startDate: moment.utc(this.props.startDate) });
    }
    if (prevProps.endDate !== this.props.endDate) {
      this.setState({ endDate: moment.utc(this.props.endDate) });
    }
  }

  onChange(startDate, endDate) {
    this.setState({ startDate, endDate });
    if (startDate !== null) {
      this.props.setFieldValue.setFieldValue('deliveryDate', startDate.toDate().toISOString());
    }
    if (endDate !== null) {
      this.props.setFieldValue.setFieldValue('collectionDate', endDate.toDate().toISOString());
    }
    // this.props.onChange();
  }

  render() {
    return (
      <DateRangePicker
        startDatePlaceholderText="Start Date"
        endDatePlaceholderText="End Date"
        hideKeyboardShortcutsPanel
        customArrowIcon=""
        startDate={this.state.startDate} // momentPropTypes.momentObj or null,
        startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
        endDate={this.state.endDate} // momentPropTypes.momentObj or null,
        endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
        onDatesChange={({ startDate, endDate }) => this.onChange(startDate, endDate)} // PropTypes.func.isRequired,
        focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
        onFocusChange={focusedInput => this.setState({ focusedInput })}
        block
        numberOfMonths={1}
      />
    );
  }
}

export default DatePicker;
