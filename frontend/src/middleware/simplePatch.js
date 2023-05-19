import instance from "./axios";
const URL = {
  editAccount: "/account",
  editPreference: "/account/notification-preference",
};

export default Object.keys(URL).reduce((acc, curr) => {
  acc[curr] = async (data, token = undefined) => {
    try {
      console.log("POST", URL[curr], "req:", data);
      const { data: result } = await instance.patch(
        URL[curr],
        data,
        token && { headers: { "auth-token": token } }
      );
      console.log("POST", URL[curr], "res", result);
      return result;
    } catch (error) {
      throw error;
    }
  };
  return acc;
}, {});
