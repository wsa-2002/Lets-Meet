import POST from "./simplePost";
import GET from "./simpleGet";
import PATCH from "./simplePatch";
import DELETE from "./simpleDelete";

export const {
  login,
  signup,
  forgetPassword,
  resetPassword,
  addMeet,
  addRoutine,
} = POST;
export const { editAccount, editPreference } = PATCH;
export const {
  searchMember,
  browseMeet,
  getMeetInfo,
  emailVerification,
  getRoutine,
  getCalendar,
  getGoogleCalendar,
  getUserInfo,
  lineToken,
} = GET;
export const { deleteRoutine } = DELETE;
export { googleLogin, lineConnect } from "./thirdParty";
export {
  getGroupAvailability,
  getMyAvailability,
  addMyAvailability,
  deleteMyAvailability,
  confirmMeet,
} from "./votingTable";
export { default as meet } from "./meet";
