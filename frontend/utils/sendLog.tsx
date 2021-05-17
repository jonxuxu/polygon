const USER_BEHAVIOR_URL =
  "https://hooks.slack.com/services/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";

export const sendLog = async (text: string) => {
  console.log(text);

  return await fetch(USER_BEHAVIOR_URL, {
    method: "POST",
    body: JSON.stringify({
      text,
    }),
  });
};
