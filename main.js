document.addEventListener('DOMContentLoaded', () => {
    // ドロップダウンの選択肢をセットアップする処理（省略）

    const form = document.getElementById('search-form');
    const resultsCount = document.getElementById('results-count');
    const resultsArea = document.getElementById('results-area');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // フォームのデフォルト送信をキャンセル

        resultsCount.textContent = "検索中...";
        resultsArea.innerHTML = "";

        // フォームから検索条件を取得してJSONオブジェクトを作成
        const formData = new FormData(form);
        const searchParams = {
            "input1": "qr",
            "output": "scylla"
        };
        for (const [key, value] of formData.entries()) {
            if (value && value !== '指定なし') {
                // ここでC++が期待するキーと値に変換する必要がある
                // 例: searchParams['head'] = [head_map[value]];
                searchParams[key] = value; // 簡単のためそのまま設定
            }
        }
        
        // バックエンドのAPIにリクエストを送信
        try {
            const response = await fetch('/api/scylla', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchParams),
            });

            if (!response.ok) {
                throw new Error(`サーバーエラー: ${response.status}`);
            }

            const results = await response.json();
            
            // Colabのprint_html関数を参考に、結果をHTMLテーブルに変換する関数を呼び出す
            displayResults(results);

        } catch (error) {
            resultsCount.textContent = `エラーが発生しました: ${error.message}`;
        }
    });

    function displayResults(results) {
        // Colabコード内の `print_html` のロジックをここに移植する
        // 1. `results` (JSON) を元にHTMLのテーブル文字列を生成する
        // 2. resultsArea.innerHTML = 生成したテーブル文字列;
        // 3. QRコードの動的生成スクリプトもここに含める
        
        const resultCount = results.bps.length - results.index;
        resultsCount.textContent = `${resultCount} 体見つかりました`;

        // ここにテーブルを生成するロジックを実装...
        // ...
    }
});