export const getUrlWithParams = (url: string, payload?: any) => {
  const urlWithParams = url.concat(
    "?",
    Object.entries(payload)
      .filter(([_, value]) => value !== null && value !== "")
      .map((val) => {
        return val.join("=");
      })
      .join("&")
  );

  return urlWithParams;
};
