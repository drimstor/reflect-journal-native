const getShortString = (inputString: string) => {
  if (inputString.length > 20) {
    return inputString.substring(0, 20) + '...';
  }
  return inputString;
};

export default getShortString;
