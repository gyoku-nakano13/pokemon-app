// app/page.js
// トップページ（ポケモン一覧）。サーバーコンポーネントとして動作する

export default async function Home() {
  // サーバーでPokéAPIからデータを取得（最初の151匹）
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
  const data = await response.json();

  return (
    <main className="p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ポケモン図鑑</h1>
        <a href="/bookmarks" className="text-blue-600 hover:underline">お気に入りポケモン →</a>
      </div>
      {/* タイプ別一覧へのショートカット */}
      <div className="flex gap-4 mt-3 text-sm justify-between">
        <a href="/type/fire" className="text-red-600 hover:underline block">ほのおタイプ</a>
        <a href="/type/water" className="text-blue-600 hover:underline block">みずタイプ</a>
        <a href="/type/electric" className="text-yellow-600 hover:underline block">でんきタイプ</a>
      </div>
      {/* 4列グリッドでポケモンカードを並べる */}
      <div className="grid grid-cols-4 gap-4 mt-4">
        {data.results.map((pokemon, index) => {
          // PokéAPI の一覧レスポンスには id が含まれないため、インデックス+1 で代用
          const id = index + 1;
          // カード全体をリンクにして詳細ページへ遷移
          return (
            <a
              key={pokemon.name}
              href={`/pokemon/${id}`}
              className="border border-gray-300 rounded-lg p-4 text-center
            no-underline text-inherit hover:bg-gray-50"
            >
              {/* GitHub の PokeAPI スプライトリポジトリから画像を取得 */}
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                alt={pokemon.name}
                width={96}
                height={96}
              />
              <p>No.{id}</p>
              {/* capitalize で頭文字を大文字に表示 */}
              <p className="font-bold capitalize">{pokemon.name}</p>
            </a>
          );
        })}
      </div>
    </main>
  );
}