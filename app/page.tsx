import Board from "./Board";

export default function Page() {
  return (
    <main className="container">
      <header className="header">
        <h1>골프 트렌드 정보</h1>
        <p>매주 트렌드 정보를 공유하는 공간</p>
      </header>
      <Board />
    </main>
  );
}
