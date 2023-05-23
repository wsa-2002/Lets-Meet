export default (instance) => ({
  getGroupAvailability: async (code) => {
    try {
      console.log("GET", `/meet/code/${code}/available_time/all`, "req:", code);
      const { data: result } = await instance.get(
        `/meet/code/${code}/available_time/all`
      );
      console.log(
        "GET",
        `/meet/code/${code}/available_time/all`,
        "res",
        result
      );
      return result;
    } catch (error) {
      throw error;
    }
  },
  getMyAvailability: async (code, name = undefined) => {
    try {
      console.log(
        "GET",
        `/meet/code/${code}/available_time`,
        "req:",
        code,
        name
      );
      const { data: result } = await instance.get(
        `/meet/code/${code}/available_time`,
        { params: name && { name } }
      );
      console.log("GET", `/meet/code/${code}/available_time`, "res", result);
      return result;
    } catch (error) {
      throw error;
    }
  },
  addMyAvailability: async (code, data) => {
    try {
      console.log("POST", `/meet/code/${code}/available_time`, "req:", data);
      const { data: result } = await instance.post(
        `/meet/code/${code}/available_time`,
        data
      );
      console.log("POST", `/meet/code/${code}/available_time`, "res", result);
      return result;
    } catch (error) {
      throw error;
    }
  },
  deleteMyAvailability: async (code, data) => {
    try {
      console.log("DELETE", `/meet/code/${code}/available_time`, "req:", data);
      const { data: result } = await instance.delete(
        `/meet/code/${code}/available_time`,
        { data }
      );
      console.log("DELETE", `/meet/code/${code}/available_time`, "res", result);
      return result;
    } catch (error) {
      throw error;
    }
  },
  confirmMeet: async (code, data) => {
    try {
      console.log("POST", `/meet/code/${code}/confirm`, "req:", data);
      const { data: result } = await instance.post(
        `/meet/code/${code}/confirm`,
        data
      );
      console.log("POST", `/meet/code/${code}/confirm`, "res", result);
      return result;
    } catch (error) {
      throw error;
    }
  },
});
