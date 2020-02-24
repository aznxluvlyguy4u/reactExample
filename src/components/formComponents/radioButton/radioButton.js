import classnames from "classnames";

const RadioButton = ({
  field: { name, value, onChange, onBlur },
  id,
  label,
  className,
  ...props
}) => {
  return (
    <div className="outerwrapper">
      <div className="innerwrapper">
        <input
          name={name}
          id={id}
          type="radio"
          value={id} // could be something else for output?
          checked={id === props.selectedvalue}
          onChange={onChange}
          onBlur={onBlur}
          className={classnames("radio-button")}
          {...props}
        />
        <label htmlFor={id}>{label}</label>
      </div>
    </div>
  );
};
export default RadioButton;
