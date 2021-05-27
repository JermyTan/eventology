import { User } from "../types/users";

export function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem("user");
    return serializedState === null ? undefined : JSON.parse(serializedState);
  } catch (error) {
    console.warn(error);
    localStorage.removeItem("user");
    return undefined;
  }
}

export function saveToLocalStorage(user: User | null) {
  if (user === null) {
    localStorage.removeItem("user");
    return;
  }

  try {
    const serializedState = JSON.stringify(user);
    localStorage.setItem("user", serializedState);
  } catch (error) {
    console.warn(error);
  }
}
