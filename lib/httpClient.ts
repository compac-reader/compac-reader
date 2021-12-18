import cheerio from "cheerio";
import * as FileSystem from "expo-file-system";

const defaultHeaders = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 CompacReaderClient/0.0.0",
};

export async function fetchRaw(url: string, options: RequestInit = {}) {
  return await fetch(url, {
    ...{ headers: defaultHeaders },
    ...options,
  });
}

export async function fetchHTML(url: string, options: RequestInit = {}) {
  const resp = await fetchRaw(url, options);
  const html = await resp.text();
  return cheerio.load(html);
}

export async function fetchJSON(url: string, options: RequestInit = {}) {
  const resp = await fetchRaw(url, options);
  return await resp.json();
}

export async function fetchBlobBase64(url: string) {
  const tmp = FileSystem.cacheDirectory + "/img";
  const result = await FileSystem.downloadAsync(url, tmp);
  return await FileSystem.readAsStringAsync(tmp, {
    encoding: "base64",
  });
}
