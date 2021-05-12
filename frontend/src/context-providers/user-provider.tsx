import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useLocalStorage } from "@rehooks/local-storage";
import isEqual from "lodash.isequal";

export type User = {
  id?: number;
  name?: string;
  email?: string;
  accessToken?: string;
  refreshToken?: string;
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
        id: _user?.id,
        name: _user?.name,
        email: _user?.email,
        accessToken: _user?.accessToken,
        refreshToken: _user?.refreshToken,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
