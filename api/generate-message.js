export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: "Missing OPENAI_API_KEY. Add it in your deployment environment variables.",
    });
    return;
  }

  try {
    const { contact, baselineMessage, tone, userInstructions } = req.body || {};

    if (!contact || !baselineMessage) {
      res.status(400).json({ error: "Missing contact or baselineMessage." });
      return;
    }

    const prompt = [
      "You are helping rewrite a short outreach message for job networking.",
      "Return only the final message text with no preamble.",
      "Keep it natural and realistic, under 120 words, and avoid hype.",
      `Tone: ${tone || "Warm and concise"}`,
      `Contact name: ${contact.contactName || "Unknown"}`,
      `Contact title: ${contact.title || "Unknown"}`,
      `Company: ${contact.company || "Unknown"}`,
      `Connection type: ${contact.connectionType || "Unknown"}`,
      `Current stage: ${contact.stage || "Unknown"}`,
      `Baseline draft: ${baselineMessage}`,
      `User instructions: ${userInstructions || "None"}`,
    ].join("\n");

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(500).json({ error: `OpenAI request failed: ${errText}` });
      return;
    }

    const data = await response.json();
    const message = data?.output_text?.trim();

    if (!message) {
      res.status(500).json({ error: "OpenAI returned an empty message." });
      return;
    }

    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ error: error?.message || "Failed to generate AI message." });
  }
}
