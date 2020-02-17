const CustomInputComponent = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) =>
  field.name.indexOf("[") === -1 ? (
    <div className="input-wrapper">
      <input
        className={touched[field.name] && errors[field.name] ? "error " : ""}
        type="text"
        {...field}
        {...props}
      />
      {touched[field.name] && errors[field.name] && (
        <span>{errors[field.name]}</span>
      )}
    </div>
  ) : (
    <div className="input-wrapper">
      <input
        className={
          touched[field.name.substr(0, field.name.indexOf("["))]
          && touched[field.name.substr(0, field.name.indexOf("["))][field.name.substring(field.name.indexOf("[") + 1, field.name.indexOf("]"))]
          && errors[field.name.substr(0, field.name.indexOf("["))]
          && errors[field.name.substr(0, field.name.indexOf("["))][field.name.substring(field.name.indexOf("[") + 1, field.name.indexOf("]"))]
            ? "error "
            : ""
        }
        type="text"
        {...field}
        {...props}
      />
      {touched[field.name.substr(0, field.name.indexOf("["))]
        && touched[field.name.substr(0, field.name.indexOf("["))][field.name.substring(field.name.indexOf("[") + 1, field.name.indexOf("]"))]
        && errors[field.name.substr(0, field.name.indexOf("["))]
        && errors[field.name.substr(0, field.name.indexOf("["))][field.name.substring(field.name.indexOf("[") + 1, field.name.indexOf("]"))] && (
        <span>{errors[field.name.substr(0, field.name.indexOf("["))][field.name.substring(field.name.indexOf("[") + 1, field.name.indexOf("]"))]}</span>
      )}
    </div>
  );

export default CustomInputComponent;
