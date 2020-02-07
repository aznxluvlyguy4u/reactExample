import moment from 'moment';
import React, { Component } from 'react';
import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';

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
    const { startDate, endDate } = this.props;
    if (startDate !== null && startDate !== undefined) {
      this.setState({ startDate: moment.utc(startDate) });
    }
    if (endDate !== null && endDate !== undefined) {
      this.setState({ endDate: moment.utc(endDate) });
      // this.props.setFieldValue('deliveryDate', this.state.endDate.format('YYYY-MM-DDTHH:mm:ss.ssZ'));
    }
  }

  componentDidUpdate(prevProps) {
    const { startDate, endDate } = this.props;
    if (prevProps.startDate !== startDate && startDate !== undefined && startDate !== null) {
      this.setState({ startDate: moment.utc(startDate) });
    }
    if (prevProps.endDate !== endDate && endDate !== undefined && endDate !== null) {
      this.setState({ endDate: moment.utc(endDate) });
    }
  }

  onChange(startDate, endDate) {
    // const { onChange, setFieldValue } = this.props;
    // console.log('onchange props = ', this.props);
    // console.log('onChange = ', onChange);

    // this.setState({ startDate, endDate });
    // if (startDate !== null) {
    //   // this.setState({ startDate: moment.utc(startDate) });
    //   // onChange ? onChange({ collectionDate: startDate.format('YYYY-MM-DDTHH:mm:ss.ssZ') }) : null;
    //   this.props.setFieldValue('collectionDate', startDate.format('YYYY-MM-DDTHH:mm:ss.ssZ'));
    // }
    // if (endDate !== null) {
    //   // this.setState({ endDate: moment.utc(endDate) });
    //   // onChange ? onChange({ deliveryDate: endDate.format('YYYY-MM-DDTHH:mm:ss.ssZ') }) : null;
    //   this.props.setFieldValue('deliveryDate', endDate.format('YYYY-MM-DDTHH:mm:ss.ssZ'));
    // }

    // if (endDate === null && startDate !== null) {
    //   let addedDay = moment(startDate).add(1, 'd');
    //   this.setState({ startDate: moment.utc(startDate) });
    //   this.setState({ endDate: moment.utc(addedDay) });
    //   // onChange ? onChange({ collectionDate: addedDay.format('YYYY-MM-DDTHH:mm:ss.ssZ') }) : null;
    //   this.props.setFieldValue('collectionDate', addedDay.format('YYYY-MM-DDTHH:mm:ss.ssZ'));
    // }
  }

  handleChange = (startDate, endDate) => {
    if (startDate !== null) {
      // alert('start not null so set start date');
      this.setState({ startDate: moment.utc(startDate) });
      this.props.onChange ? this.props.onChange({ deliveryDate: startDate.format('YYYY-MM-DDTHH:mm:ss.ssZ') }) : null;
      this.props.setFieldValue('deliveryDate', startDate.format('YYYY-MM-DDTHH:mm:ss.ssZ'));
      // alert('start date is set');
    }

    if (endDate !== null) {
      // alert('end not null set end date' + endDate);
      this.setState({ endDate: moment.utc(endDate) });
      this.props.onChange ? this.props.onChange({ collectionDate: endDate.format('YYYY-MM-DDTHH:mm:ss.ssZ') }) : null;
      this.props.setFieldValue('collectionDate', endDate.format('YYYY-MM-DDTHH:mm:ss.ssZ'));
      // alert('end date is set')
    }

    if (endDate === null && startDate !== null) {
      // alert('start !== null && end === null so end should be the next day ');
      let addedDay = moment(startDate).add(1, 'd');
      this.setState({ endDate: moment.utc(addedDay) });
      this.props.onChange ? this.props.onChange({ collectionDate: addedDay.format('YYYY-MM-DDTHH:mm:ss.ssZ') }) : null;
      this.props.setFieldValue('collectionDate', addedDay.format('YYYY-MM-DDTHH:mm:ss.ssZ'));
      // alert('end date is set to tomorrow')
    }
  }

  returnValidation() {
    const { validation, form } = this.props;
    const { startDate, endDate } = this.state;

    if (validation) {
      return (
        <div className="validationWrapper">
          <div>
            {form.touched.deliveryDate && startDate === null ? 'This is a required field' : ''}
          </div>
          <div>
            {form.touched.collectionDate && endDate === null ? 'This is a required field' : ''}
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
          readOnly
          startDatePlaceholderText={placeholders[0]}
          endDatePlaceholderText={placeholders[1]}
          hideKeyboardShortcutsPanel
          customArrowIcon=""
          startDate={this.state.startDate} // momentPropTypes.momentObj or null,
          startDateId={form.touched.deliveryDate && this.state.startDate === null ? 'error' : 'deliveryDate'} // PropTypes.string.isRequired,
          endDate={this.state.endDate} // momentPropTypes.momentObj or null,
          endDateId={form.touched.collectionDate && this.state.endDate === null ? 'error' : 'collectionDate'} // PropTypes.string.isRequired,
          onDatesChange={({ startDate, endDate }) => this.handleChange(startDate, endDate)} // PropTypes.func.isRequired,
          focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={pickerFocusedInput => {
            this.setState({ focusedInput: pickerFocusedInput })
          }}
          block
          numberOfMonths={1}
        />
        {this.returnValidation()}
      </div>
    );
  }
}

export default DatePicker;