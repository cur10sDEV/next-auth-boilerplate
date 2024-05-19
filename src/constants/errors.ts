interface IAuthErrors {
  [code: string]: string;
}

export const authErrors: IAuthErrors = {
  OAuthAccountNotLinked: "Email already in use with different provider!",
};
