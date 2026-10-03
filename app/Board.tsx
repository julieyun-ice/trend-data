"use client";

import { useEffect, useState } from "react";
import { supabaseFetch } from "./supabase";

type Post = {
  id: number;
  category: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  comments: Comment[];
};

type Comment = { id: number; author: string; content: string };

const CATEGORY = "Q&A";

type Row = {
  id: number;
  category: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  comments?: Comment[];
};

function toPost(r: Row): Post {
  return {
    id: r.id,
    category: r.category,
    title: r.title,
    content: r.content,
    author: r.author,
    createdAt: formatDate(r.created_at),
    comments: r.comments ?? [],
  };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function Board() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  const [writing, setWriting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pending, setPending] = useState<number[]>([]);

  useEffect(() => {
    supabaseFetch("posts?select=*,comments(id,author,content)&order=created_at.desc&comments.order=created_at.asc")
      .then((rows: Row[]) => setPosts(rows.map(toPost)))
      .catch(() => setError("글을 불러오지 못했습니다."));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    try {
      const [row]: Row[] = await supabaseFetch("posts", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({ category: CATEGORY, title: title.trim(), content: content.trim() }),
      });
      setPosts((prev) => [toPost(row), ...prev]);
      requestAiComment(row.id);
      setTitle("");
      setContent("");
      setWriting(false);
      setError("");
    } catch {
      setError("글을 등록하지 못했습니다.");
    }
  }

  async function requestAiComment(postId: number) {
    setPending((prev) => [...prev, postId]);
    try {
      const res = await fetch("/api/ai-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      if (!res.ok) throw new Error();
      const comment: Comment = await res.json();
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, comment] } : p)),
      );
    } catch {
      setError("AI 댓글을 작성하지 못했습니다.");
    } finally {
      setPending((prev) => prev.filter((id) => id !== postId));
    }
  }

  return (
    <>
      <div className="toolbar">
        <span className="count">전체 {posts.length}개</span>
        <button className="btn" onClick={() => setWriting((w) => !w)}>
          {writing ? "닫기" : "글쓰기"}
        </button>
      </div>

      {writing && (
        <form className="form" onSubmit={handleSubmit}>
          <div className="meta">
            <span className="badge">{CATEGORY}</span>
            <span>작성자: 익명</span>
          </div>
          <input
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="내용을 입력하세요"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <button className="btn" type="submit">등록</button>
        </form>
      )}

      <ul className="list">
        {posts.map((post) => (
          <li key={post.id} className="item">
            <div className="meta">
              <span className="badge">{post.category}</span>
              <span>{post.author}</span>
              <span>{post.createdAt}</span>
            </div>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            {post.comments.map((c) => (
              <div key={c.id} className="comment">
                <span className="badge">{c.author}</span>
                <p>{c.content}</p>
              </div>
            ))}
            {pending.includes(post.id) && <p className="comment-pending">AI 댓글 작성 중…</p>}
          </li>
        ))}
      </ul>

      {error && <p className="notice">{error}</p>}
    </>
  );
}
