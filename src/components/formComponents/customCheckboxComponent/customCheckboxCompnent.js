import { Fragment } from "react";

// Input feedback
const InputFeedback = ({ error }) => (error ? <span>{error}</span> : null);

const CustomCheckboxComponent = ({
  field: { name, value, onChange, onBlur },
  form: { errors, touched, setFieldValue },
  id,
  label,
  className,
  ...props
}) => {
  return (
    <Fragment key={`${name}_${id}`}>
      <input
        style={{ width: "auto" }}
        name={name}
        id={id}
        type="checkbox"
        value={value}
        checked={value}
        onChange={onChange}
        onBlur={onBlur}
      />{" "}
      <span style={{ color: "#000" }}>{label}</span>
      <br />
      {touched[name] && <InputFeedback error={errors[name]} />}
    </Fragment>
  );
};

export default CustomCheckboxComponent;