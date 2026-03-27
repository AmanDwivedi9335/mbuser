export async function sendPushReminder(params: {
  token?: string | null;
  title: string;
  body: string;
}) {
  if (!params.token || !process.env.FCM_SERVER_KEY) {
    return { sent: false, reason: "Missing FCM token or server key" };
  }

  const response = await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `key=${process.env.FCM_SERVER_KEY}`,
    },
    body: JSON.stringify({
      to: params.token,
      notification: {
        title: params.title,
        body: params.body,
      },
      priority: "high",
    }),
  });

  if (!response.ok) {
    return { sent: false, reason: `FCM error (${response.status})` };
  }

  return { sent: true };
}
