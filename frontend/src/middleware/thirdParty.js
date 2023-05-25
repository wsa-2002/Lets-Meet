export default (baseURL, token) => ({
  googleLogin: async () => {
    try {
      window.open(`${baseURL}/google-login`, "_self");
    } catch (error) {
      throw error;
    }
  },
  lineConnect: async () => {
    try {
      window.open(`${baseURL}/line?token=${token}`, "_self");
    } catch (error) {
      throw error;
    }
  },
  lineToken: async (code, state) => {
    try {
      var newWindow = window.open(
        `${baseURL}/account/line?state=${state}&code=${code}`,
        "_blank"
      );
      newWindow.focus();
    } catch (error) {
      throw error;
    }
  },
});
