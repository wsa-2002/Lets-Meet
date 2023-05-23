import POST from "./simplePost";
import GET from "./simpleGet";
import PATCH from "./simplePatch";
import DELETE from "./simpleDelete";
import axios from "axios";

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
} = GET;
export const { deleteRoutine } = DELETE;
export { googleLogin, lineConnect, lineToken } from "./thirdParty";
export {
  getGroupAvailability,
  getMyAvailability,
  addMyAvailability,
  deleteMyAvailability,
  confirmMeet,
} from "./votingTable";
export { default as meet } from "./meet";

export default (token) => {
  const instance = axios.create({
    baseURL: `${
      process.env.REACT_APP_SERVER_USE_HTTPS === "true" ? "https" : "http"
    }://${process.env.REACT_APP_SERVER_DOMAIN}:${
      process.env.REACT_APP_SERVER_PORT
    }`,
    headers: { "auth-token": token },
  });
};
