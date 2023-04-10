import instance from "./axios";

export const browseMeet = async (token) => {
  try {
    console.log(token);
    const { data: result } = await instance.get("/meet", {
      headers: { "auth-token": token },
    });
    console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};
