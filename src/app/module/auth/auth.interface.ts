export type TLoginUser = {
  id: string
  password: string
}

export type TPasswordUpdate = {
  oldPassword: string
  newPassword: string
}

export type TResetPassword = {
  id: string
  newPassword: string
}
