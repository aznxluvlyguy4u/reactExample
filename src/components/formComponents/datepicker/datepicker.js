import moment from "moment";
import React, { Component } from "react";
import { DateRangePicker } from "react-dates";
import "react-dates/initialize";

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
    this.state = {
      startDate: null,
      endDate: null,
      focusedInput: null,
      availabilityGraph: []
    };
  }

  componentDidMount() {
    const { startDate, endDate } = this.props;
    if (startDate !== null && startDate !== undefined) {
      this.setState({
        startDate: moment.utc(startDate)
      });
    }
    if (endDate !== null && endDate !== undefined) {
      this.setState({ endDate: moment.utc(endDate) });
    }
  }

  componentDidUpdate(prevProps) {
    const { startDate, endDate } = this.props;

    if (
      prevProps.startDate !== startDate &&
      prevProps.endDate !== endDate &&
      (startDate == null || endDate == null)
    ) {
      this.setState({ startDate: null, endDate: null });
    } else {
      if (!startDate) return;
      if (!endDate) return;
      const startDateMoment = moment.utc(startDate);
      const endDateMoment = moment.utc(endDate);
      if (prevProps.startDate !== startDate && startDate) {
        this.setState({ startDate: startDateMoment });
      }
      if (prevProps.endDate !== endDate) {
        this.setState({ endDate: endDateMoment });
      }
    }
  }

  async onFocusChange(pickerFocusedInput) {
    await this.setState({ focusedInput: pickerFocusedInput });
    if (this.state.startDate !== null && !this.state.visibleYearMonth) {
      const visibleYearMonth = moment.utc(
        new Date(this.state.startDate).setDate(1)
      );
      await this.setState({ visibleYearMonth });
      if (this.props.updateVisibleMonth) {
        this.props.updateVisibleMonth(visibleYearMonth);
      }
    } else if (!this.state.visibleYearMonth) {
      console.log("date not set");
      const visibleYearMonth = moment.utc(new Date().setDate(1));
      await this.setState({ visibleYearMonth });
      if (this.props.updateVisibleMonth) {
        this.props.updateVisibleMonth(visibleYearMonth);
      }
    }
  }

  handleChange = (startDate, endDate) => {
    if (startDate !== null) {
      this.setState({ startDate: moment.utc(startDate) });
      this.props.onChange
        ? this.props.onChange({
            deliveryDate: startDate.format("YYYY-MM-DDTHH:mm:ss.ssZ")
          })
        : null;
      this.props.setFieldValue(
        "deliveryDate",
        startDate.format("YYYY-MM-DDTHH:mm:ss.ssZ")
      );
    }

    if (endDate !== null) {
      this.setState({ endDate: moment.utc(endDate) });
      this.props.onChange
        ? this.props.onChange({
            collectionDate: endDate.format("YYYY-MM-DDTHH:mm:ss.ssZ")
          })
        : null;
      this.props.setFieldValue(
        "collectionDate",
        endDate.format("YYYY-MM-DDTHH:mm:ss.ssZ")
      );
    }

    if (endDate === null && startDate !== null) {
      let addedDay = moment(startDate).add(1, "d");
      this.setState({ endDate: moment.utc(addedDay) });
      this.props.onChange
        ? this.props.onChange({
            collectionDate: addedDay.format("YYYY-MM-DDTHH:mm:ss.ssZ")
          })
        : null;
      this.props.setFieldValue(
        "collectionDate",
        addedDay.format("YYYY-MM-DDTHH:mm:ss.ssZ")
      );
    }
  };

  updateVisibleMonth(val) {
    let visibleYearMonth = this.state.visibleYearMonth;
    if (visibleYearMonth) {
      visibleYearMonth = moment(visibleYearMonth).add(val, "M");
      this.setState({ visibleYearMonth });
      if (this.props.updateVisibleMonth) {
        this.props.updateVisibleMonth(visibleYearMonth);
      }
    }
  }

  returnValidation() {
    const { validation, form } = this.props;
    const { startDate, endDate } = this.state;

    if (validation) {
      return (
        <div className="validationWrapper">
          <div>
            {form.touched.deliveryDate && startDate === null
              ? "This is a required field"
              : ""}
          </div>
          <div>
            {form.touched.collectionDate && endDate === null
              ? "This is a required field"
              : ""}
          </div>
        </div>
      );
    }
    return null;
  }

  render() {
    const { placeholders, form } = this.props;
    const { focusedInput } = this.state;

    return (
      <div>
        <DateRangePicker
          disabled={
            this.props.disabled === undefined ? false : this.props.disabled
          }
          readOnly
          startDatePlaceholderText={placeholders[0]}
          endDatePlaceholderText={placeholders[1]}
          hideKeyboardShortcutsPanel
          customArrowIcon=""
          startDate={this.state.startDate} // momentPropTypes.momentObj or null,
          startDateId={
            form.touched.deliveryDate && this.state.startDate === null
              ? "error"
              : "deliveryDate"
          } // PropTypes.string.isRequired,
          endDate={this.state.endDate} // momentPropTypes.momentObj or null,
          endDateId={
            form.touched.collectionDate && this.state.endDate === null
              ? "error"
              : "collectionDate"
          } // PropTypes.string.isRequired,
          onDatesChange={({ startDate, endDate }) => {
            this.handleChange(startDate, endDate);
          }} // PropTypes.func.isRequired,
          focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={this.onFocusChange.bind(this)}
          block
          isDayBlocked={dateMoment => {
            if (this.props.loadingAvailabilityGraph == true) return true;

            if (!this.props.availabilityGraph) return false;
            const existingAvailability = this.props.availabilityGraph.find(
              availability => {
                return moment(availability.date).isSame(dateMoment, "day");
              }
            );
            if (!existingAvailability) return false;
            return !existingAvailability.available;
          }}
          numberOfMonths={1}
          onPrevMonthClick={() => this.updateVisibleMonth(-1)}
          onNextMonthClick={() => this.updateVisibleMonth(1)}
        />
        {this.returnValidation()}
        {this.props.loadingAvailabilityGraph == true &&
          "Checking Availability..."}
      </div>
    );
  }
}

export default DatePicker;
