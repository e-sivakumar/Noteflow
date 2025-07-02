import { api } from "./axios";

export interface User {
  name: string;
  userId : string;
  email : string;
  username: string;
  phoneNumber : number;
}

type GetProfileResponse = {
    profile: User;
  };

export async function getUser() {
  return api
    .get<GetProfileResponse>(`/profile`)
    .then((res) => {
      return res.data?.profile;
    });
}

export async function updateUser(
  data: { name: string; username: string; email: string; phoneNumber: number }
) {
  return api.patch<User>(`/profile/update`, data).then((res) => res.data);
}

export async function updatePassword(
    data: { oldPassword: string; newPassword: string; }
  ) {
    return api.patch<User>(`/profile/change-password`, data).then((res) => res.data);
  }