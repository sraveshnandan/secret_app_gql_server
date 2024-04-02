export interface UserInput {
  name?: string;
  email: string;
  password: string;
  avatar?:{
    public_id:string,
    url:string
  }
  phone_no?:number
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
