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
      let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=0,height=0,left=-1000,top=-1000`;
      window.open(
        `${baseURL}/account/line?state=${state}&code=${code}`,
        "test",
        params
      );
    } catch (error) {
      throw error;
    }
  },
});
