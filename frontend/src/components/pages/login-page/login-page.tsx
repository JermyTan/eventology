import { useCallback, useContext, useEffect } from "react";
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
import { UserContext } from "../../../context-providers";
import { useCustomAuth } from "../../../custom-hooks/api/auth-api";
import { resolveApiError } from "../../../utils/error-utils";
import catLogo from "../../../assets/logo-cat-green.svg";
import styles from "./login-page.module.scss";
import FullPageContainer from "../../full-page-container";

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
  const { updateUser } = useContext(UserContext);
  const { login, isLoading } = useCustomAuth();

  useEffect(() => {
    updateUser(null);
  }, [updateUser]);

  const onSubmit = useCallback(
    async (formData: LoginFormProps) => {
      try {
        const { id, name, email, access, refresh } = await login(
          deepTrim(formData),
        );
        updateUser({ id, name, email, access, refresh });
        toast.success("Signed in successfully.");
      } catch (error) {
        resolveApiError(error);
      }
    },
    [login, updateUser],
  );

  const onError = useCallback((error: DeepMap<LoginFormProps, FieldError>) => {
    const errorMsg = Object.values(error)
      .flatMap((value) => (value?.message ? [value.message] : []))
      .join("\n");

    if (!errorMsg) {
      return;
    }

    toast.error(errorMsg);
  }, []);

  return (
    <FullPageContainer>
      <FormProvider {...methods}>
        <Form
          className={styles.formContainer}
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
                <Image src={catLogo} alt="" size="tiny" wrapped />
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </Segment>
            </Segment>
          </Container>

          <Button
            type="submit"
            fluid
            className={styles.button}
            loading={isLoading}
          >
            <h3>SIGN IN</h3>
          </Button>
        </Form>
      </FormProvider>
    </FullPageContainer>
  );
}

export default LoginPage;
