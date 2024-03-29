import { useCallback, useEffect } from "react";
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
import { useCustomAuth } from "../../../custom-hooks/api/auth-api";
import { resolveApiError } from "../../../utils/error-utils";
import FullPageContainer from "../../full-page-container";
import { useAppDispatch } from "../../../redux/hooks";
import { updateUser } from "../../../redux/slices/user-slice";
import catLogo from "../../../assets/logo-cat-green.svg";
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

const onError = (error: DeepMap<LoginFormProps, FieldError>) => {
  const errorMsg = Object.values(error)
    .flatMap((value) => (value?.message ? [value.message] : []))
    .join("\n");

  if (!errorMsg) {
    return;
  }

  toast.error(errorMsg);
};

function LoginPage() {
  const methods = useForm<LoginFormProps>({
    resolver: yupResolver(schema),
    defaultValues: defaultFormProps,
  });
  const { handleSubmit } = methods;
  const dispatch = useAppDispatch();
  const { login, isLoading } = useCustomAuth();

  useEffect(() => {
    dispatch(updateUser(null));
  }, [dispatch]);

  const onSubmit = useCallback(
    async (formData: LoginFormProps) => {
      try {
        const { id, name, email, access, refresh, profileImageUrl } =
          await login(deepTrim(formData));

        dispatch(
          updateUser({ id, name, email, access, refresh, profileImageUrl }),
        );
        toast.success("Signed in successfully.");
      } catch (error) {
        resolveApiError(error);
      }
    },
    [login, dispatch],
  );

  return (
    <FullPageContainer>
      <div className={styles.loginPage}>
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
                  <div className={styles.secondaryLogoContainer}>
                    <div className={styles.primaryLogoContainer}>
                      <Image
                        src={catLogo}
                        alt=""
                        className={styles.logo}
                        wrapped
                      />
                    </div>
                  </div>
                </Segment>

                <Segment
                  vertical
                  padded="very"
                  className={styles.inputContainer}
                >
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
      </div>
    </FullPageContainer>
  );
}

export default LoginPage;
