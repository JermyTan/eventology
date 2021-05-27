import { useCallback, useState, useMemo } from "react";
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from "axios";
import useAxios, { Options, RefetchOptions, ResponseValues } from "axios-hooks";
import { AuthenticationData, AuthenticationPostData } from "../../types/auth";
import {
  errorHandlerWrapper,
  isForbiddenOrNotAuthenticated,
} from "../../utils/error-utils";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateUser } from "../../redux/slices/user-slice";

export function useAxiosWithTokenRefresh<T>(
  config: AxiosRequestConfig,
  options?: Options,
): [
  ResponseValues<T, Error>,
  (config?: AxiosRequestConfig, options?: RefetchOptions) => AxiosPromise<T>,
] {
  const { access, refresh } = { ...useAppSelector(({ user }) => user) };
  const dispatch = useAppDispatch();
  const [responseValues, apiCall] = useAxios<T>(
    {
      ...config,
      headers: {
        ...config?.headers,
        authorization: `Bearer ${access}`,
      },
    },
    {
      ...options,
      manual: true,
    },
  );
  const [, tokenRefresh] = useAxios<AuthenticationData>(
    {
      url: "/gateway/refresh",
      method: "post",
      data: { refresh },
    },
    { manual: true },
  );
  const [isLoading, setLoading] = useState(false);

  const apiCallWithTokenRefresh = useCallback(
    async (
      config?: AxiosRequestConfig,
      options?: RefetchOptions,
    ): Promise<AxiosResponse<T>> => {
      try {
        setLoading(true);
        const response = await apiCall(config, options);
        return response;
      } catch (error) {
        if (!isForbiddenOrNotAuthenticated(error)) {
          throw error;
        }

        try {
          console.log("Error before token refresh:", error, error?.response);

          const { data } = await tokenRefresh();

          console.log("POST /gateway/refresh success:", data);

          const response = await apiCall(
            {
              ...config,
              headers: { authorization: `Bearer ${data.access}` },
            },
            options,
          );

          dispatch(updateUser(data));

          return response;
        } catch (error) {
          console.log("Error after token refresh:", error, error?.response);
          if (isForbiddenOrNotAuthenticated(error)) {
            // kick user out
            dispatch(updateUser(null));
            throw new Error(
              "Your current session has expired. Please log in again.",
            );
          } else {
            throw error;
          }
        }
      } finally {
        setLoading(false);
      }
    },
    [apiCall, tokenRefresh, dispatch],
  );

  return [{ ...responseValues, loading: isLoading }, apiCallWithTokenRefresh];
}

export function useCustomAuth() {
  const [{ loading }, apiCall] = useAxios<AuthenticationData>(
    {
      url: "/gateway/login",
      method: "post",
    },
    { manual: true },
  );

  const login = useMemo(
    () =>
      errorHandlerWrapper(async (data: AuthenticationPostData) => {
        console.log("POST /gateway/login data:", data);

        const { data: authenticationData } = await apiCall({ data });

        console.log("POST /gateway/login success:", authenticationData);

        return authenticationData;
      }, "POST /gateway/login error"),
    [apiCall],
  );

  return { isLoading: loading, login };
}
