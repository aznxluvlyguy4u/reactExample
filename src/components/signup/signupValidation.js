const validate = (values) => {
  let errors = {};

  // if (!values.email) {
  //   errors.email = 'Please fill in an email address';
  // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
  //   errors.email = 'Invalid email address';
  // }

  // console.log("special character "+/^(?=.[!@#$%^&*(),.?":{}|<>])/.test(values.password))

  // if (!values.password) {
  //   errors.password = 'Please fill in a password';
  // }
  // else if (!/^(?=.*[a-z])/.test(values.password)) {
  //   errors.password = 'The string must contain at least 1 lowercase alphabetical character';
  // }
  // else if (!/^(?=.*[A-Z])/.test(values.password)) {
  //   errors.password = 'The string must contain at least 1 uppercase alphabetical character';
  // }
  // else if (!/^(?=.*[0-9])/.test(values.password)) {
  //   errors.password = 'The string must contain at least 1 numeric character';
  // }
  // else if (!/^([!@#$%^&*(),.?":{}|<>])/.test(values.password)) {
  //   errors.password = 'The string must contain at least one special character';
  // }
  // else if (!/^(?=.{8,})/.test(values.password)) {
  //   errors.password = 'The string must be eight characters or longer';
  // }

  return errors
};

export default validate