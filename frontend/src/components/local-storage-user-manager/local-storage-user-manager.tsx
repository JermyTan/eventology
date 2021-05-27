import { useEffect } from "react";
import { useAppSelector } from "../../redux/hooks";
import { saveToLocalStorage } from "../../utils/localStorage-utils";

function LocalStorageUserManager() {
  const user = useAppSelector(({ user }) => user);
  console.log("running local storage user manager");

  useEffect(() => {
    saveToLocalStorage(user);
  }, [user]);

  return null;
}

export default LocalStorageUserManager;
