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
      try {
        return await errorHandlerWrapper(async () => {
          const { data: user } = await apiCall({
            url: `/users/${userId}`,
          });
          console.log(`GET /users/${userId} success:`, user);

          return user;
        }, `GET /events/${userId} error:`)();
      } catch (error) {
        resolveApiError(error);
        return undefined;
      }
    },
    [apiCall],
  );

  return { user, isLoading: loading, getSingleUser };
}
