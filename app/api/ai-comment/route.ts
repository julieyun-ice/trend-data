import { supabaseFetch } from "../../supabase";

const MODEL = "gemini-3.5-flash";

export async function POST(request: Request) {
  const { postId } = await request.json();
  if (!Number.isInteger(postId)) {
    return Response.json({ error: "postId required" }, { status: 400 });
  }

  const existing = await supabaseFetch(`comments?post_id=eq.${postId}&author=eq.AI&select=*`);
  if (existing.length) return Response.json(existing[0]);

  const [post] = await supabaseFetch(`posts?id=eq.${postId}&select=title,content`);
  if (!post) return Response.json({ error: "post not found" }, { status: 404 });

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY!,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: "당신은 골프 트렌드 정보 게시판의 친절한 AI 도우미입니다. 게시글에 한국어로 2~4문장의 도움이 되는 댓글을 달아주세요. 마크다운 없이 일반 텍스트로만 쓰고, 확실하지 않은 정보는 단정하지 마세요.",
            },
          ],
        },
        contents: [
          { role: "user", parts: [{ text: `제목: ${post.title}\n내용: ${post.content}` }] },
        ],
        generationConfig: { thinkingConfig: { thinkingLevel: "low" } },
      }),
    },
  );
  if (!res.ok) {
    console.error("gemini failed", res.status, await res.text());
    return Response.json({ error: "gemini failed" }, { status: 502 });
  }

  const data = await res.json();
  const text: string | undefined = data.candidates?.[0]?.content?.parts
    ?.map((p: { text?: string }) => p.text ?? "")
    .join("")
    .trim();
  if (!text) return Response.json({ error: "empty response" }, { status: 502 });

  const [comment] = await supabaseFetch("comments", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ post_id: postId, content: text, author: "AI" }),
  });
  return Response.json(comment);
}
