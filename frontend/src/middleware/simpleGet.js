import instance from "./axios";
const URL = {
  searchMember: "/account/search",
  browseMeet: "/meet",
  emailVerification: "/email-verification",
  getRoutine: "/routine",
  getCalendar: "/meet-calendar",
  getGoogleCalendar: "/google-calendar",
};

export default Object.keys(URL).reduce((acc, curr) => {
  acc[curr] = async (
    params = undefined,
    token = undefined,
    route = undefined
  ) => {
    try {
      console.log("GET", URL[curr], "req:", params ?? token ?? route);
      const { data: result } = await instance.get(
        `${URL[curr]}${route ? `/${route}` : ""}`,
        {
          headers: { "auth-token": token },
          params,
        }
      );
      console.log("GET", URL[curr], "res", result);
      return result;
    } catch (error) {
      throw error;
    }
  };
  return acc;
}, {});
