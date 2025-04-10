import axios from "axios";

const api = axios.create({
  // baseURL: "https://corleebackend-05d62e3e59f9.herokuapp.com/api",
  baseURL: "http://127.0.0.1:8000/api",
});

const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Token ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export { api, setAuthToken };

const data = {
  name: "ali",
  age: 20,
  city: "tehran",
  country: "iran",
  email: "ali@gmail.com",
};
