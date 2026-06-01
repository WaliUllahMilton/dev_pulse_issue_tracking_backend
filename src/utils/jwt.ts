import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

export function jwtSign(
  payload: JwtPayload,
  secret: string,
  options: SignOptions,
) {
  return jwt.sign(
    {
      data: payload,
    },
    secret,
    options,
  );
}

export function jwtVerify(token: string, secret: string) {
  return jwt.verify(token, secret);
}
