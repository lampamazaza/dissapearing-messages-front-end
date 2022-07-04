export const shareNative = async (text: string, url: string) => {
  try {
    return await window.navigator.share({
      title: "Secret Messenger",
      text,
      url,
    });
  } catch (error) {
    console.error(error);
  }
};
