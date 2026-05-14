// app/pokemon/[id]/page.js
// [id] は動的ルートセグメント。URL の /pokemon/1 などの数値が id として渡される

import Database from 'better-sqlite3';
import Link from 'next/link';
import { redirect } from 'next/navigation';

// generateMetadata: ページの <title> や OGP タグをサーバー側で動的に生成する関数
export async function generateMetadata({ params }) {
  // URL パラメータから id を取得（Next.js 15以降、params は非同期）
  const { id } = await params;

  // PokéAPI からそのポケモンのデータを取得
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const pokemon = await response.json();

  // ページのメタデータを返す
  return {
    title: `No.${pokemon.id} ${pokemon.name}`,
    description: `${pokemon.name}のステータス・タイプ情報`,
    openGraph: {
      title: `No.${pokemon.id} ${pokemon.name}`,
      // OGP 画像には公式アートワークを使用
      images: [pokemon.sprites.other['official-artwork'].front_default],
    },
  };
}

// PokemonDetail: ポケモン詳細ページのメインコンポーネント（サーバーコンポーネント）
export default async function PokemonDetail({ params }) {
  // URL パラメータから id を取得
  const { id } = await params;

  // サーバーでPokéAPIからデータを取得
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const pokemon = await response.json();

  async function addToBookmarks() {
    'use server';// サーバーアクションとして定義。フォームの送信で呼び出される

    const db = new Database('app.db');// SQLite データベースに接続

    try {
      const exists = db
        .prepare('SELECT 1 FROM bookmarks WHERE pokemon_id = ? LIMIT 1')// 既にブックマークされているか確認
        .get(pokemon.id);// 存在しない場合は新規に挿入

      if (!exists) {// ブックマークテーブルに pokemon_id, pokemon_name, note を挿入
        db.prepare(// SQL インジェクション対策のためプレースホルダを使用
          'INSERT INTO bookmarks (pokemon_id, pokemon_name, note) VALUES (?, ?, ?)'// note は空文字で初期化
        ).run(pokemon.id, pokemon.name, '');// ブックマークに追加された後、ユーザーをブックマーク一覧ページにリダイレクト
      }
    } finally {// データベース接続を確実に閉じる
      db.close();// データベース接続を閉じる
    }

    redirect('/bookmarks');
  }

  return (
    <main className="p-8 max-w-xl mx-auto">
      {/* 一覧ページへ戻るリンク */}
      <Link href="/" className="text-blue-600 hover:underline">
        ← 一覧に戻る
      </Link>

      <form action={addToBookmarks} className="mt-4 text-center">
        <button
          type="submit"
          className="rounded-full bg-yellow-400 px-5 py-2 font-bold text-gray-900 shadow-sm transition hover:bg-yellow-300"
        >
          お気に入りに追加
        </button>
      </form>

      {/* ポケモンの公式アートワークと名前 */}
      <div className="text-center mt-4">
        <img
          src={pokemon.sprites.other['official-artwork'].front_default}
          alt={pokemon.name}
          width={300}
          height={300}
        />
        <h1 className="text-2xl font-bold capitalize mt-2">
          No.{pokemon.id} {pokemon.name}
        </h1>
      </div>

      {/* 基本情報テーブル */}
      <table className="w-full border-collapse mt-4">
        <tbody>
          <tr className="border-b border-gray-300">
            <th className="p-2 text-left">タイプ</th>
            {/* タイプ別一覧へ遷移できるリンクとして表示 */}
            <td className="p-2">
              <div className="flex flex-wrap gap-2">
                {pokemon.types.map((t) => (
                  <a
                    key={t.type.name}
                    href={`/type/${t.type.name}`}
                    className="text-blue-600 hover:underline"
                  >
                    {t.type.name}
                  </a>
                ))}
              </div>
            </td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="p-2 text-left">高さ</th>
            {/* API の値はデシメートル単位なので 10 で割ってメートルに変換 */}
            <td className="p-2">{pokemon.height / 10} m</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="p-2 text-left">重さ</th>
            {/* API の値はヘクトグラム単位なので 10 で割ってキログラムに変換 */}
            <td className="p-2">{pokemon.weight / 10} kg</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="p-2 text-left">基本経験値</th>
            <td className="p-2">{pokemon.base_experience}</td>
          </tr>
        </tbody>
      </table>

      {/* ステータスバー一覧 */}
      <h2 className="text-xl font-bold mt-6">ステータス</h2>
      <div className="mt-2">
        {pokemon.stats.map(stat => (
          <div key={stat.stat.name} className="mb-2">
            {/* ステータス名と数値を左右に並べて表示 */}
            <div className="flex justify-between mb-1">
              <span className="capitalize">{stat.stat.name}</span>
              <span>{stat.base_stat}</span>
            </div>
            {/* バーの幅を最大値 255 基準のパーセンテージで表現 */}
            <div className="bg-gray-200 rounded h-2">
              <div
                className="bg-green-500 rounded h-full"
                style={{ width: `${Math.min(stat.base_stat / 255 * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}