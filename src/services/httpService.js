import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// default header
// axios.defaults.headers.common["any header Key"] = "add any default header";

axios.interceptors.response.use(null, (error) => {
  console.log("INTERCEPTOR CALLED");
  console.log(error);

  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  // Unexpected Error
  if (!expectedError) {
    console.log("Logging the error", error);
    // alert("An unexpected error occurred");
  }

  if (error.response.status === "400") {
    console.log("access denied");
    window.location = process.env.REACT_APP_BASENAME + "/isp/logout";
    // localStorage.removeItem("token");
    // window.location.reload();
  }

  return Promise.reject(error);
});

axios.interceptors.request.use((config) => {
  // console.log("Logging the request config of axios", config);
  return config;
});

function setJwt(jwt) {
  axios.defaults.headers.common["AUTHENTICATION"] = jwt;
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
};
