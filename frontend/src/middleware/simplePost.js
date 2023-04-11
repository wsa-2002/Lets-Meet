import instance from "./axios";
const URL = {
  login: "/login",
  signup: "/account",
  forgetPassword: "/forget-password",
  resetPassword: "/reset-password",
  addMeet: "/meet",
  joinMeet: "/meet/invite",
};

export default Object.keys(URL).reduce((acc, curr) => {
  acc[curr] = async (data, token = undefined) => {
    try {
      console.log("req:", data);
      console.log();
      const { data: result } = await instance.post(
        URL[curr],
        data,
        token && { headers: { "auth-token": token } }
      );
      console.log("res", result);
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  return acc;
}, {});

// await instance.post("/login", { data: { user_identifier: "", password: "" } });
