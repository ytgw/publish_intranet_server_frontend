import {Register} from './register'
import {LT2P_PRE_SHARED_KEY} from './config'

function Manual() {
    return (
        <div className="Manual">
            <h2>使い方</h2>
            <ol>
                <li>公開したいTCPおよびUDPポート番号をフォームから登録してください。<br />
                    ポート番号欄には1以上65535以下の整数をコンマ区切りで入力してください。
                </li>
                <li>表示されたVPN接続URL、ユーザ名、パスワード、外部アクセス用ポート番号を保存します。<br />
                    これらの情報は自動で発行されますので、提供いただく情報は公開したいサーバーのポート番号のみです。
                </li>
                <li>公開したいサーバーにVPNクライアントソフトをインストールしてください。<br />
                    対応しているVPNプロトコルはL2TP over IPSecおよびSoftEther VPNですので、好みのクライアントソフトを利用ください。
                    例えばWindowsの場合L2TP over IPSecのクライアントとして、初期インストール済みのものがあります。
                </li>
                <li>公開したいサーバーをVPN接続URLに対してユーザ名とパスワードでVPN接続してください。<br />
                    L2TP over IPSecプロトコルで接続する場合、事前共有鍵に {LT2P_PRE_SHARED_KEY} を設定ください。<br />
                    SoftEther VPNプロトコルで接続する場合、ポート番号には443か5555を設定ください。
                </li>
                <li>VPN接続URLの外部アクセス用ポート番号にアクセスします。<br />
                    インターネットから外部アクセス用FQDNの外部アクセス用ポート番号に来た通信を、VPN接続したサーバーの登録ポート番号に転送します。<br />
                    転送設定の更新は一定周期で行っていますので、外部からアクセスできるようになるまでVPN接続から1分ほどお待ちください。
                </li>
            </ol>
        </div>
    )
}

function App() {
    return (
        <>
        <Manual />
        <Register />
        </>
    )
}

export default App;
