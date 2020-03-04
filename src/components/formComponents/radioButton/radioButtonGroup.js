import classnames from "classnames";

const InputFeedback = ({ error }) =>
  error ? <span>{error}</span> : null;

const RadioButtonGroup = ({
  value,
  error,
  touched,
  id,
  label,
  className,
  children
}) => {
  const classes = classnames(
    "rad-input-field",
    {
      "is-success": value || (!error && touched), // handle prefilled or user-filled
      "is-error": !!error && touched
    },
    className
  );

  return (
    <div className={classes}>
      {children}
      {touched && <InputFeedback error={error} />}
      <legend>{label}</legend>
    </div>
  );
};

export default RadioButtonGroup;
