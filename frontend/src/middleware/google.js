import instance from "./axios";

export const googleLogin = async () => {
  try {
    const { data: result } = await instance.post("/google-login");
    console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};
