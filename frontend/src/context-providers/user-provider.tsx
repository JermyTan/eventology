import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useLocalStorage } from "@rehooks/local-storage";
import isEqual from "lodash.isequal";
import {
  ACCESS,
  EMAIL,
  ID,
  NAME,
  PROFILE_IMAGE_URL,
  REFRESH,
} from "../constants";

export type User = {
  [ID]?: number;
  [NAME]?: string;
  [EMAIL]?: string;
  [PROFILE_IMAGE_URL]?: string;
  [ACCESS]?: string;
  [REFRESH]?: string;
};

type UserContextType = User & {
  updateUser: (user: User | null) => void;
};

export const UserContext = createContext<UserContextType>({
  updateUser: () => {
    throw new Error("updateUser is not defined.");
  },
});

type Props = {
  children: ReactNode;
};

function UserProvider({ children }: Props) {
  const [user, setUser, deleteUser] = useLocalStorage<User>("user");
  const [_user, _setUser] = useState<User | null>(user);

  const updateUser = useCallback(
    (updatedUser: User | null) => {
      updatedUser ? setUser({ ..._user, ...updatedUser }) : deleteUser();
    },
    [_user, setUser, deleteUser],
  );

  // required to prevent multiple changes to user
  useEffect(() => {
    _setUser((_user) => (isEqual(user, _user) ? _user : user));
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        ..._user,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
