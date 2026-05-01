// app/type/[name]/page.js
// /type/fire などのタイプ別ページ。英語タイプ名を日本語表示に変換する

import { notFound } from 'next/navigation';

const TYPE_LABELS_JA = {
  fire: 'ほのお',
  water: 'みず',
  electric: 'でんき',
};

export default async function TypePage({ params }) {
  // URL パラメータからタイプ名を取得
  const { name } = await params;
  const typeName = name.toLowerCase();

  // 指定された 3 タイプのみをサポート
  const typeLabel = TYPE_LABELS_JA[typeName];
  if (!typeLabel) {
    notFound();
  }

  // タイプ情報を PokéAPI から取得
  const response = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
  if (!response.ok) {
    notFound();
  }
  const typeData = await response.json();

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <a href="/" className="text-blue-600 hover:underline">← 図鑑に戻る</a>

      <h1 className="text-2xl font-bold mt-4">{typeLabel}タイプ</h1>
      <p className="text-gray-600 mt-1">/type/{typeName}</p>

      <h2 className="text-xl font-bold mt-6">該当ポケモン</h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
        {typeData.pokemon.map((entry) => {
          // URL からポケモンIDを取り出して詳細リンクに使う
          const pokemonId = entry.pokemon.url.split('/').filter(Boolean).pop();

          return (
            <li key={entry.pokemon.name}>
              <a
                href={`/pokemon/${pokemonId}`}
                className="block border border-gray-300 rounded-lg p-3 hover:bg-gray-50 no-underline text-inherit"
              >
                <p className="font-bold capitalize">{entry.pokemon.name}</p>
              </a>
            </li>
          );
        })}
      </ul>
    </main>
  );
}