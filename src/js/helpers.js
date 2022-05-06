import { async } from "regenerator-runtime";
import { Fraction } from "fractional";
import * as config from "./config";
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(config.TIMEOUT_SEC)]);
    const { data } = await res.json();
    if (!res.ok) throw new Error(`${res.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const FetchPro = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([FetchPro, timeout(config.TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${res.message} (${res.status})`);
  } catch (err) {
    throw err;
  }
};
