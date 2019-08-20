const CustomTextArea = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => (
  <div className="input-wrapper">
    <textarea
      className={touched[field.name]
      && errors[field.name] ? 'error ' : ''}
      type="text"
      {...field}
      {...props}
    />
    {touched[field.name]
      && errors[field.name] && <span>{errors[field.name]}</span>}
  </div>
);

export default CustomTextArea;
