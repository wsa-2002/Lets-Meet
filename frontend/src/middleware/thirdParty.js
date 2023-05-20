import instance from "./axios";

const baseURL = `${
  process.env.REACT_APP_SERVER_USE_HTTPS === "true" ? "https" : "http"
}://${process.env.REACT_APP_SERVER_DOMAIN}:${
  process.env.REACT_APP_SERVER_PORT
}`;

export const googleLogin = async () => {
  try {
    window.open(`${baseURL}/google-login`, "_self");
  } catch (error) {
    throw error;
  }
};

export const lineConnect = async (token) => {
  try {
    window.open(`${baseURL}/line?token=${token}`, "_self");
  } catch (error) {
    throw error;
  }
};

export const lineToken = async (code, state) => {
  try {
    var newWindow = window.open(
      `${baseURL}/account/line?state=${state}&code=${code}`,
      "_blank",
      "height=500,width=500,menubar=0,status=0,toolbar=0",
      false
    );
    newWindow.focus();
  } catch (error) {
    throw error;
  }
};
