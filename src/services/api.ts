import axios from "axios";

// baseURL: "http://localhost:3333/", local

export const api = axios.create({
  baseURL: "https://broad-delicate-touch.glitch.me/",
});
