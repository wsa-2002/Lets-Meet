import axios from "axios";
// axios.defaults.headers.common["Access-Control-Allow-Origin"] =
//   process.env.REACT_APP_Access_Control_Allow_Origin;
export default axios.create({
  baseURL: `${
    process.env.REACT_APP_SERVER_USE_HTTPS === "true" ? "https" : "http"
  }://${process.env.REACT_APP_SERVER_DOMAIN}:${
    process.env.REACT_APP_SERVER_PORT
  }`,
  // crossDomain: true,
  headers: {
    "Access-Control-Allow-Origin":
      process.env.REACT_APP_Access_Control_Allow_Origin,
  },
});
