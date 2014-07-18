voice2cmd - 音声でコマンドを実行するツール
==========================================

要件
----

- マイクの接続されたマシン
- Node.js >= v0.10.29

概要
----

- Julius 用の辞書を自動生成
- 生成した辞書を利用して Julius を起動
- 認識した音声に従って指定のコマンドを実行

インストール
------------

### Julius のインストール

- 任意のパスに Julius をインストールする
  - [Julius最新版](http://julius.sourceforge.jp/index.php?q=newjulius.html)
- 任意のパスにディクテーションキットをインストールする
  - [Juliusディクテーション実行キット](http://julius.sourceforge.jp/index.php?q=dictation-kit.html)
- jconf を作成する

例 : `/opt/julius/julius.jconf`

```
-h /opt/dictation-kit/model/phone_m/jnas-tri-3k16-gid.binhmm
-v /opt/dictation-kit/model/lang_m/bccwj.60k.htkdic
-hlist /opt/dictation-kit/model/phone_m/logicalTri

-lmp 8.0 -2.0
-lmp2 8.0 -2.0
-b 1500
-b2 100
-s 500
-m 10000

-n 5
-output 1
-48
-input mic
-zmeanframe
-rejectshort 800

-quiet
```

### voice2cmd のインストール

- voice2cmd の配置・依存モジュールのインストール

```
$ cd /path/to/somewhere
$ git clone https://github.com/kteru/voice2cmd.git .
$ npm install
```

- コンフィグの作成

```
$ cp -a config.json.sample config.json
$ vi config.json
```

例 : `config.json`

```
{
  "julius": {
    "port"     : 10500,
    "binPath"  : "/opt/julius/bin/julius",
    "jconfPath": "/opt/julius/julius.jconf",
    "dictPath" : "/opt/julius/dictionary.dict"
  },

  "voiceToCmds": [
    {
      "name" : "light_power_on",
      "voice": "でんきつけて",
      "cmd"  : "/opt/irkit/send.sh /opt/irkit/json/light_power_toggle.json"
    },
    {
      "name" : "light_power_off",
      "voice": "でんきけして",
      "cmd"  : "/opt/irkit/send.sh /opt/irkit/json/light_power_toggle.json"
    }
  ]
}
```

実行
----

1. 起動

```
$ cd /path/to/somewhere
$ node app.js
```

2. マイクに向かって話す

