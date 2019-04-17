const CustomInputComponent = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => (
  <div>
    <input className={touched[field.name] &&
      errors[field.name] ? 'error ': ''} type="text" {...field} {...props} />
    {touched[field.name] &&
      errors[field.name] && <span>{errors[field.name]}</span>}
  </div>
);

export default CustomInputComponent