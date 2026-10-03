"use client";

import { useState } from "react";

type Post = {
  id: number;
  category: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
};

const CATEGORY = "Q&A";

const initialPosts: Post[] = [
  {
    id: 2,
    category: CATEGORY,
    title: "이번 주 인기 있는 골프웨어 컬러는 무엇인가요?",
    content: "가을 시즌을 앞두고 많이 보이는 컬러 조합이 궁금합니다.",
    author: "익명",
    createdAt: "2026-10-02 10:30",
  },
  {
    id: 1,
    category: CATEGORY,
    title: "요즘 많이 쓰는 드라이버 트렌드가 궁금해요",
    content: "올해 출시된 드라이버 중 주목할 만한 흐름이 있을까요?",
    author: "익명",
    createdAt: "2026-10-01 09:00",
  },
];

function formatNow() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function Board() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [writing, setWriting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setPosts((prev) => [
      {
        id: Math.max(0, ...prev.map((p) => p.id)) + 1,
        category: CATEGORY,
        title: title.trim(),
        content: content.trim(),
        author: "익명",
        createdAt: formatNow(),
      },
      ...prev,
    ]);
    setTitle("");
    setContent("");
    setWriting(false);
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
          </li>
        ))}
      </ul>

      <p className="notice">데이터베이스에 저장되지 않아 새로고침하면 작성한 글이 사라집니다.</p>
    </>
  );
}
