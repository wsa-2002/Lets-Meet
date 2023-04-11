import POST from "./simplePost";

export const {
  login,
  signup,
  forgetPassword,
  resetPassword,
  addMeet,
  joinMeet,
} = POST;
export { googleLogin } from "./google";
export { emailVerification } from "./emailVerification";
export { browseMeet, meetInfo } from "./meet";
export { member } from "./member";
