import { makeAutoObservable, runInAction } from "mobx";
import { Profile } from "../types/profile";
import { User } from "../types/user";

class AuthStore {
  isAuth: boolean = false;
  user: User | null = null;
  profile: Profile | null = null;
  isProfileLoading: boolean = true;
  isUserLoading: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(value: boolean) {
    this.isAuth = value;
  }

  setProfile(profile: Profile | null) {
    this.profile = profile;
  }

  setProfileLoading(value: boolean) {
    this.isProfileLoading = value;
  }

  setUser(user: User | null) {
    this.user = user;
  }

  setUserLoading(value: boolean) {
    this.isUserLoading = value;
  }

  setAuthorization(user: User, token: string) {
    runInAction(() => {
      this.isAuth = true;
      this.user = user;
      localStorage.setItem("token", token);
    });
  }

  unsetAuthorization() {
    runInAction(() => {
      this.isAuth = false;
      this.user = null;
      this.profile = null;
      this.isProfileLoading = true;
      localStorage.removeItem("token");
    });
  }
}

export default new AuthStore();
