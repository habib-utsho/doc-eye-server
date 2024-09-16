type TUserRole = "admin" | "doctor" | "patient";
type TUser = {
  id: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  role: TUserRole;
  status: "active" | "inactive";
  isDeleted: boolean;
};

export { TUser, TUserRole };
