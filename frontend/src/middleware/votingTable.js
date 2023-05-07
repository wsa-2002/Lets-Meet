import instance from "./axios";

export const getGroupAvailability = async (code, token = undefined) => {
  try {
    console.log("GET", `/meet/code/${code}/available_time/all`, "req:", code);
    const { data: result } = await instance.get(
      `/meet/code/${code}/available_time/all`,
      token && { headers: { "auth-token": token } }
    );
    console.log("GET", `/meet/code/${code}/available_time/all`, "res", result);
    return result;
  } catch (error) {
    throw error;
  }
};

export const getMyAvailability = async (
  code,
  token = undefined,
  name = undefined
) => {
  try {
    console.log("GET", `/meet/code/${code}/available_time`, "req:", code, name);
    const { data: result } = await instance.get(
      `/meet/code/${code}/available_time`,
      { headers: token && { "auth-token": token }, params: name && { name } }
    );
    console.log("GET", `/meet/code/${code}/available_time`, "res", result);
    return result;
  } catch (error) {
    throw error;
  }
};

export const addMyAvailability = async (code, data, token = undefined) => {
  try {
    console.log("POST", `/meet/code/${code}/available_time`, "req:", data);
    const { data: result } = await instance.post(
      `/meet/code/${code}/available_time`,
      data,
      token && { headers: { "auth-token": token } }
    );
    console.log("POST", `/meet/code/${code}/available_time`, "res", result);
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteMyAvailability = async (code, data, token = undefined) => {
  try {
    console.log("DELETE", `/meet/code/${code}/available_time`, "req:", data);
    const { data: result } = await instance.delete(
      `/meet/code/${code}/available_time`,
      {
        data,
        headers: token && { "auth-token": token },
      }
    );
    console.log("DELETE", `/meet/code/${code}/available_time`, "res", result);
    return result;
  } catch (error) {
    throw error;
  }
};

export const confirmMeet = async (code, data, token = undefined) => {
  try {
    console.log("POST", `/meet/code/${code}/confirm`, "req:", data);
    const { data: result } = await instance.post(
      `/meet/code/${code}/confirm`,
      data,
      token && { headers: { "auth-token": token } }
    );
    console.log("POST", `/meet/code/${code}/confirm`, "res", result);
    return result;
  } catch (error) {
    throw error;
  }
};
