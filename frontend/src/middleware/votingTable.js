import instance from "./axios";

export const GroupAvailability = async (code, token = undefined) => {
  try {
    console.log("req:", code);
    const { data: result } = await instance.get(
      `/meet/code/${code}/available_time/all`,
      token && { headers: { "auth-token": token } }
    );
    console.log("res", result);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
