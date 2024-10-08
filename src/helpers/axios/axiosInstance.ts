import { ResponseSuccessType } from "@/types/common";

import axios from "axios";

const instance = axios.create();
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.headers["Accept"] = "application/json";
instance.defaults.timeout = 60000;
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    const token = useSelector((state: RootState) => state.auth.token);

    if (token) {
      config.headers.Authorization = token;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    const responseObject: ResponseSuccessType = {
      data: response?.data?.data,
      meta: response?.data?.meta,
    };

    return responseObject;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const responseObject = {
      statusCode: error?.response?.data?.statusCode || 500,
      message: error?.response?.data?.message || "Something went wrong!!",
      errorMessages: error?.response?.data?.message,
    };
    return responseObject;
  }
);

export { instance };
