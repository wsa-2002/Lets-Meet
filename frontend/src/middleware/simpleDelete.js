import instance from "./axios";
const URL = {
  deleteRoutine: "/routine",
};

export default Object.keys(URL).reduce((acc, curr) => {
  acc[curr] = async (data, token = undefined) => {
    try {
      console.log("DELETE", URL[curr], "req:", data);
      const { data: result } = await instance.delete(URL[curr], {
        data,
        headers: token && { "auth-token": token },
      });
      console.log("DELETE", URL[curr], "res", result);
      return result;
    } catch (error) {
      throw error;
    }
  };
  return acc;
}, {});
