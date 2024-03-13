export interface UserInput {
  name?: string;
  email: string;
  password: string;
}

export interface IDecode {
  _id: string;
  iat: number;
  exp: number;
}

export interface PasswordInput{
  oldPassword:string,
  newPassword:string
}
