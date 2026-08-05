export default async function handler(req, res) {
  const backendUrl = process.env.BACKEND_URL || "http://gitops-backend:3000";

  try {
    const response = await fetch(`${backendUrl}/message`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Unable to reach backend service.",
        error: String(error),
      });
  }
}
