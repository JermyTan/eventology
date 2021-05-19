import { ReactNode } from "react";
import classNames from "classnames";
import { Form, Label, FormFieldProps, InputProps } from "semantic-ui-react";
import get from "lodash.get";
import { useFormContext } from "react-hook-form";

type Props = {
  className?: string;
  required?: boolean;
  label?: string;
  inputName: string;
  type?: string;
  errorMsg?: string;
  placeholder?: string;
  defaultValue?: string;
  readOnly?: boolean;
  hidden?: boolean;
  width?: FormFieldProps["width"];
  icon?: ReactNode;
  iconPosition?: InputProps["iconPosition"];
  showError?: boolean;
  disabled?: boolean;
};

function FormField({
  className,
  required = false,
  label,
  errorMsg,
  inputName,
  type = "text",
  placeholder,
  defaultValue,
  readOnly = false,
  hidden = false,
  width,
  icon,
  iconPosition,
  showError = true,
  disabled = false,
}: Props) {
  const {
    formState: { errors },
    register,
  } = useFormContext();
  const error = get(errors, inputName);
  const hasIcon = Boolean(icon);

  return (
    <Form.Field
      className={classNames(
        {
          ui: hasIcon,
          left: hasIcon && iconPosition === "left",
          icon: hasIcon,
          input: hasIcon,
        },
        className,
      )}
      required={required}
      error={showError && error}
      style={hidden ? { display: "none" } : undefined}
      width={width}
      disabled={disabled}
    >
      {label && <label>{label}</label>}
      {showError && error && (
        <Label
          basic
          color="red"
          content={errorMsg ?? error?.message}
          pointing="below"
        />
      )}
      <input
        placeholder={placeholder}
        type={type}
        {...register(inputName, { required })}
        defaultValue={defaultValue}
        readOnly={readOnly}
        disabled={disabled}
      />
      {icon}
    </Form.Field>
  );
}

export default FormField;
