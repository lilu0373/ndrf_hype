// ColabのPythonコードから必要なデータをJavaScriptオブジェクトとして移植
const head_map = { "まる": 327680077, "よこまる": 327680023, "たてまる": 327680054, "さんかく": 327680002, "おにぎり": 327680007, "しかく": 327680072, "かどまる": 327680031, "しずく": 327680071, "つぼ": 327680061, "こぐま": 327680009, "あまつゆ": 327680012, "チューリップ": 327680011, "ロボ": 327680066, "イカ": 327680024, "ロケット": 327680032, "スター": 327680058, "くま": 327680003, "ハート": 327680005, "ねこみみ": 327680069, "デビル": 327680004, "みかづき": 327680056, "とんがり": 327680008, "でんち": 327680052, "トゲトゲ": 327680033, "たまご": 327680010, "タワー": 327680062, "いぬみみ": 327680030, "メラメラ": 327680051, "クワガタ": 327680034, "ダイヤ": 327680020, "ルビー": 327680044, "たいよう": 327680013, "うさみみ": 327680014, "まきがい": 327680076, "キャッスル": 327680045, "ブロック": 327680017, "たまねぎ": 327680079, "わっか": 327680039, "コック": 327680035, "おさかな": 327680036, "スポーティ": 327680001, "キャンディ": 327680073, "でこ": 327680006, "ピエロ": 327680046, "おだんご": 327680047, "おんがくか": 327680022, "りゅうせい": 327680037, "まめ": 327680038, "ぼこ": 327680049, "ひつじ": 327680053, "ヒレ": 327680064, "シルクハット": 327680015, "おかっぱ": 327680027, "かえる": 327680065, "しょくパン": 327680021, "てんしゅ": 327680040, "はね": 327680016 };
const skill_group_map = { "アンテナなし": 327680258, "ちょっとかいふく": 327680180, "みんなちょっとかいふく": 327680213, "ちょっとふっかつ": 327680169, "みんなちょっとふっかつ": 327680212, "げどく": 327680019, "しびれとる": 327680001, "めざめる": 327680119, "ぞくせいなおす": 327680217, "ぜんぶなおす": 327680221, "すこしむてき": 327680248, "すこしこうふん": 327680230, "たくわえる": 327680309, "すこしひっちゅう": 327680175, "ちいさくトゲトゲ": 327680210, "すこしつよくなれ": 327680040, "すこしかたくなれ": 327680289, "すこしはやくなれ": 327680161, "すこしかわしやすい": 327680171, "どくになれ": 327680197, "すこしねむらせる": 327680009, "すこししびれさせる": 327680192, "すこしめかくし": 327680146, "ひのたま": 327680095, "ばくはつ": 327680259, "とがったこおり": 327680067, "ロックアイス": 327680164, "つむじかぜ": 327680059, "ビルかぜ": 327680224, "らくせき": 327680033, "いしつぶて": 327680214, "せいでんき": 327680123, "いなづま": 327680048, "みずでっぽう": 327680143, "バケツのみず": 327680076, "よわいこうせん": 327680052, "スポットライト": 327680172, "おどかす": 327680110, "ダークボール": 327680189, "ノックダウン": 327680240, };
// 他の`_map`データも同様にここに追加します

document.addEventListener('DOMContentLoaded', () => {
    // ここで<select>タグに選択肢を追加する処理を実装
    // 例:
    // const skillSelect = document.getElementById('skill_group');
    // Object.keys(skill_group_map).forEach(key => {
    //     const option = document.createElement('option');
    //     option.value = key;
    //     option.textContent = key;
    //     skillSelect.appendChild(option);
    // });


    const form = document.getElementById('search-form');
    const resultsCount = document.getElementById('results-count');
    const resultsArea = document.getElementById('results-area');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        resultsCount.textContent = "検索中...";
        resultsArea.innerHTML = "";

        const formData = new FormData(form);
        const searchParams = {
            "input1": "qr", // 検索対象ファイル（固定でOK）
            "output": "scylla" // 出力ファイル名（固定でOK）
        };

        // フォームの値をC++が期待するIDに変換してsearchParamsに追加
        for (const [key, value] of formData.entries()) {
            if (value && value !== '指定なし') {
                let convertedValue;
                switch (key) {
                    case 'skill_group':
                        convertedValue = skill_group_map[value];
                        break;
                    case 'head':
                        convertedValue = head_map[value];
                        break;
                    // 他のキー（body, body_color1など）も同様に変換
                    // Pythonの`body_color_map2`のような複雑なマッピングもここでJSロジックとして実装
                    case 'name':
                        // name_mapもJSオブジェクトとして用意し、変換する
                        // convertedValue = name_map[value];
                        break;
                    default:
                        // IDを直接使う項目（face_typeなど）はそのまま
                        convertedValue = parseInt(value);
                        break;
                }
                
                // C++側は配列を期待しているので、配列に入れる
                if (convertedValue !== undefined) {
                    searchParams[key] = [convertedValue];
                }
            }
        }
        
        try {
            const backendUrl = 'https://ndrf-hype.onrender.com/'; // ローカル開発時のURL
            // デプロイ後は 'https://your-app-name.onrender.com/api/scylla' のように変更
            
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(searchParams),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`サーバーエラー: ${response.status} - ${errorData.error}`);
            }

            const results = await response.json();
            displayResults(results);

        } catch (error) {
            resultsCount.textContent = `エラーが発生しました: ${error.message}`;
        }
    });

    function displayResults(results) {
        // Colabコード内の `print_html` のロジックをここに移植
        // この部分は非常に長くなるため、基本構造のみ示します。
        // `print_html`内の<style>, <table>, <script>をほぼそのまま利用できます。

        if (!results || !results.bps) {
            resultsCount.textContent = "有効な結果がありません。";
            return;
        }

        const resultCount = results.bps.length - results.index;
        resultsCount.textContent = `${resultCount} 体見つかりました`;

        // ColabのPythonスクリプトからNameStringListなどもJSに移植しておく
        // const NameStringList = [ [...], [...], ... ];
        
        let tableBodyHtml = "";
        for (let i = results.index; i < results.bps.length; i++) {
            // ここで `print_html` 内の `generate_ancestry_html` に相当する処理を行い、
            // <tr>要素の文字列を生成して tableBodyHtml に追加していく
            // 例: tableBodyHtml += `<tr><td>${results.bps[i].rsid}</td>...</tr>`;
        }
        
        const fullHtml = `
            <style>
                /* Colabのprint_htmlからCSSをコピー */
            </style>
            <table class='sr'>
                <thead>
                    <tr>
                        <th>QR</th><th>RSID</th><th>名前</th>...
                    </tr>
                </thead>
                <tbody>
                    ${tableBodyHtml}
                </tbody>
            </table>
            <div id="qrOverlay" class="qr-overlay">...</div>
            <script>
                // Colabのprint_htmlから<script>タグの中身をコピー
                // QRコード表示やコピーなどの機能
            <\/script>
        `;

        resultsArea.innerHTML = fullHtml;

        // QRコード生成用のIntersectionObserverを再度有効化する処理
        // (print_html内のscriptタグの即時実行関数を呼び出す)
    }
});
