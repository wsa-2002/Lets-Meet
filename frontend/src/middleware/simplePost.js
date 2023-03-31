import instance from "./axios";
const URL = { login: "/login", signup: "/account" };

export default Object.keys(URL).reduce((acc, curr) => {
  acc[curr] = async (data) => {
    try {
      console.log(data);
      const { data: result } = await instance.post(URL[curr], data);
      console.log(result);
      return result;
    } catch (error) {
      throw error;
    }
  };
  return acc;
}, {});

// await instance.post("/login", { data: { user_identifier: "", password: "" } });
