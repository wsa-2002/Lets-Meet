const URL = {
  logIn: "/login",
  signUp: "/account",
  forgetPassword: "/forget-password",
  resetPassword: "/reset-password",
  addMeet: "/meet",
  addRoutine: "/routine",
};

export default function POST(instance) {
  return Object.keys(URL).reduce((acc, curr) => {
    acc[curr] = async (data) => {
      try {
        console.log("POST", URL[curr], "req:", data);
        const { data: result } = await instance.post(URL[curr], data);
        console.log("POST", URL[curr], "res", result);
        return result;
      } catch (error) {
        throw error;
      }
    };
    return acc;
  }, {});
}
