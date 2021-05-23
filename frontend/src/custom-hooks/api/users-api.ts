import { useCallback } from "react";
import { UserData } from "../../types/users";
import { errorHandlerWrapper, resolveApiError } from "../../utils/error-utils";
import { useAxiosWithTokenRefresh } from "./auth-api";

export function useGetSingleUser() {
  const [{ data: user, loading }, apiCall] = useAxiosWithTokenRefresh<UserData>(
    {
      method: "get",
    },
    { manual: true },
  );

  const getSingleUser = useCallback(
    async (userId: string | number) => {
      const url = `/users/${userId}`;

      try {
        return await errorHandlerWrapper(async () => {
          const { data: user } = await apiCall({
            url,
          });
          console.log(`GET ${url} success:`, user);

          return user;
        }, `GET ${url} error:`)();
      } catch (error) {
        resolveApiError(error);
        return undefined;
      }
    },
    [apiCall],
  );

  return { user, isLoading: loading, getSingleUser };
}
