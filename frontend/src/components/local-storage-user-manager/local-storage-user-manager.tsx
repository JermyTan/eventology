import { useEffect } from "react";
import { useAppSelector } from "../../redux/hooks";
import { saveToLocalStorage } from "../../utils/localStorage-utils";

function LocalStorageUserManager() {
  const user = useAppSelector((state) => state.user);
  console.log("test");

  useEffect(() => {
    saveToLocalStorage(user);
  }, [user]);

  return null;
}

export default LocalStorageUserManager;
