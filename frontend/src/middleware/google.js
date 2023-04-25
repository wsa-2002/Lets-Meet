export const googleLogin = async () => {
  try {
    window.open(
      `http://${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/google-login`,
      "_self"
    );
  } catch (error) {
    throw error;
  }
};
