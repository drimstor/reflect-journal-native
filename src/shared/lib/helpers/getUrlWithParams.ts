const getUrlWithParams = (url: string, payload?: any) => {
  const urlWithParams = url.concat(
    '?',
    Object.entries(payload)
      .filter(([_, value]) => value !== null && value !== '')
      .map(val => {
        return val.join('=');
      })
      .join('&'),
  );

  console.log('urlWithParams', urlWithParams);

  return urlWithParams;
};

export default getUrlWithParams;
