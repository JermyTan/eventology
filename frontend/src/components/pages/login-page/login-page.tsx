import { useCallback, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { DeepMap, FieldError, FormProvider, useForm } from "react-hook-form";
import {
  Container,
  Segment,
  Button,
  Image,
  Form,
  Icon,
} from "semantic-ui-react";
import { toast } from "react-toastify";
import FormField from "../../form-field";
import { deepTrim } from "../../../utils/parser-utils";
import { EMAIL, PASSWORD } from "../../../constants";
import logoCat from "../../../assets/logo-cat-green.svg";
import styles from "./login-page.module.scss";

const schema = yup.object().shape({
  [EMAIL]: yup
    .string()
    .trim()
    .email("Not a valid email.")
    .required("Email is required."),
  [PASSWORD]: yup.string().required("Password is required."),
});

type LoginFormProps = {
  [EMAIL]: string;
  [PASSWORD]: string;
};

const defaultFormProps: LoginFormProps = {
  [EMAIL]: "",
  [PASSWORD]: "",
};

function LoginPage() {
  const methods = useForm<LoginFormProps>({
    resolver: yupResolver(schema),
    defaultValues: defaultFormProps,
  });
  const { handleSubmit } = methods;

  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = useCallback(async (formData: LoginFormProps) => {
    setSubmitting(true);
    console.log(deepTrim(formData));
    setTimeout(() => setSubmitting(false), 1000);
  }, []);

  const onError = useCallback((error: DeepMap<LoginFormProps, FieldError>) => {
    const errorMsg = Object.values(error)
      .flatMap((value) => (value?.message ? [value.message] : []))
      .join("\n");

    toast.error(errorMsg);
  }, []);

  return (
    <FormProvider {...methods}>
      <Form
        className={styles.loginPage}
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <Container className={styles.contentContainer}>
          <Segment vertical padded="very">
            <Segment
              vertical
              padded="very"
              textAlign="center"
              className={styles.viewContainer}
            >
              <h4>FIND THE MOST LOVED ACTIVITIES</h4>
              <h1>BLACK CAT</h1>
              <Image src={logoCat} size="tiny" wrapped />
            </Segment>

            <Segment vertical padded="very" className={styles.inputContainer}>
              <FormField
                className={styles.roundedInput}
                type="email"
                inputName={EMAIL}
                placeholder="Email"
                required
                icon={<Icon name="user circle" />}
                iconPosition="left"
                showError={false}
                disabled={isSubmitting}
              />

              <FormField
                className={styles.roundedInput}
                type="password"
                inputName={PASSWORD}
                placeholder="Password"
                required
                icon={<Icon name="lock" />}
                iconPosition="left"
                showError={false}
                disabled={isSubmitting}
              />
            </Segment>
          </Segment>
        </Container>

        <Button
          type="submit"
          fluid
          className={styles.button}
          loading={isSubmitting}
        >
          <h3>SIGN IN</h3>
        </Button>
      </Form>
    </FormProvider>
  );
}

export default LoginPage;
