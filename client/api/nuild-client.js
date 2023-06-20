import axios from "axios";
import { NGINX_SERVER_URL } from "../constant";

export default ({ req }) => {
  if (typeof window === "undefined") {
    return axios.create({
      baseURL: NGINX_SERVER_URL,
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: "/",
    });
  }
};
