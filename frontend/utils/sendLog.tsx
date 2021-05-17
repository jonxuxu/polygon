export const sendLog = async (text: string) => {
  console.log(text);

  return await fetch(process.env.SLACK_HOOK_URL, {
    method: "POST",
    body: JSON.stringify({
      text,
    }),
  });
};
