from flask import Flask, render_template, request, jsonify
import subprocess
import json

app = Flask(__name__)

# 1. トップページを表示するためのルート
@app.route('/')
def index():
    # templates/index.html をブラウザに表示する
    return render_template('index.html')

# 2. 検索リクエストを処理するAPI
@app.route('/api/scylla', methods=['POST'])
def run_scylla():
    # Webページから送られてきた検索条件(JSON)を取得
    search_params = request.json
    
    # C++プログラムに渡すためのコマンドライン引数文字列を生成
    # (Colabの on_search_button_clicked 内のロジックをここに移植)
    command_arg_str = ""
    for key, value in search_params.items():
        if key in ["input1", "output", "rsid"]:
            command_arg_str += f"{key}={value};"
        else:
            # 配列の場合はカンマ区切りに
            value_str = ",".join(map(str, value)) if isinstance(value, list) else str(value)
            command_arg_str += f"{key}={value_str};"

    try:
        # Scylla（絞り込み）を実行
        # input1は固定、outputは一時ファイル名でOK
        scylla_command = ["./Hyperion", "scylla", command_arg_str]
        subprocess.run(scylla_command, check=True, capture_output=True, text=True)
        
        # Scyllaの実行結果をJSONで読み取る
        json_command = ["./Hyperion", "json", "scylla"] # scyllaが出力したファイル名
        result = subprocess.run(json_command, check=True, capture_output=True, text=True)
        
        # 実行結果をJSONとしてフロントエンドに返す
        return jsonify(json.loads(result.stdout))
        
    except subprocess.CalledProcessError as e:
        # エラーが発生した場合
        return jsonify({"error": e.stderr}), 500

if __name__ == '__main__':
    app.run(debug=True) # 開発用サーバーを起動