// app/bookmarks/page.js
// お気に入りポケモン一覧ページ。SQLite に保存したブックマークをサーバー側で取得して表示する

// SQLite を Node.js から操作するライブラリ
import Database from 'better-sqlite3';

// Next.js のキャッシュを無効化し、アクセスのたびに最新データを取得する
export const dynamic = 'force-dynamic';

export default function BookmarksPage() {
  // サーバーでSQLiteからデータを取得
  // app.db ファイルを開く（存在しない場合は新規作成される）
  const db = new Database('app.db');
  // bookmarks テーブルから登録日時の降順（新しい順）で全件取得
  const bookmarks = db.prepare(
    'SELECT * FROM bookmarks ORDER BY created_at DESC'
  ).all();
  // 取得後はすぐに接続を閉じてリソースを解放する
  db.close();

  return (
    <main className="p-8 max-w-xl mx-auto">
      {/* ポケモン図鑑トップへ戻るリンク */}
      <a href="/" className="text-blue-600 hover:underline ">← 図鑑に戻る</a>
      <h1 className="text-2xl font-bold mt-4">お気に入りポケモン</h1>

      <div className="mt-4">
        {/* ブックマーク一覧をリスト表示。各行がポケモン詳細ページへのリンク */}
        {bookmarks.map(bookmark => (
          <a
            key={bookmark.id}
            href={`/pokemon/${bookmark.pokemon_id}`}
            className="flex items-center gap-4 p-4 border-b border-gray-200
          no-underline text-inherit hover:bg-gray-50"
          >
            {/* ポケモンのスプライト画像（64×64） */}
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${bookmark.pokemon_id}.png`}
              alt={bookmark.pokemon_name}
              width={64}
              height={64}
            />
            <div>
              {/* ポケモン名（capitalize で頭文字を大文字に）とメモを表示 */}
              <p className="font-bold capitalize">{bookmark.pokemon_name}</p>
              <p className="text-gray-500 text-sm">{bookmark.note}</p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}