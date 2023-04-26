import axios from "axios";
export default axios.create({
  baseURL: `${process.env.REACT_APP_SERVER_USE_HTTPS ? "https" : "http"}://${
    process.env.REACT_APP_SERVER_DOMAIN
  }:${process.env.REACT_APP_SERVER_PORT}`,
});
