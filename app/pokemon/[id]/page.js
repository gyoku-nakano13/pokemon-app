// app/pokemon/[id]/page.js
// [id] は動的ルートセグメント。URL の /pokemon/1 などの数値が id として渡される

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

  return (
    <main className="p-8 max-w-xl mx-auto">
      {/* 一覧ページへ戻るリンク */}
      <a href="/" className="text-blue-600 hover:underline">← 一覧に戻る</a>

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
            {/* 複数タイプはカンマ区切りで表示 */}
            <td className="p-2">
              {pokemon.types.map(t => t.type.name).join(', ')}
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