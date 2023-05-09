import POST from "./simplePost";
import GET from "./simpleGet";
import DELETE from "./simpleDelete";

export const {
  login,
  signup,
  forgetPassword,
  resetPassword,
  addMeet,
  addRoutine,
} = POST;
export const {
  searchMember,
  browseMeet,
  getMeetInfo,
  emailVerification,
  getRoutine,
  getCalendar,
} = GET;
export const { deleteRoutine } = DELETE;
export { googleLogin } from "./google";
export {
  getGroupAvailability,
  getMyAvailability,
  addMyAvailability,
  deleteMyAvailability,
  confirmMeet,
} from "./votingTable";
export { default as meet } from "./meet";
