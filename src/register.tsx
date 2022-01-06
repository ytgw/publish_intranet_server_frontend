import React from 'react';
import {HOST, API_ENDPOINT} from './config'


// ----------------------------------------------------------------------------------------------------
// type
// ----------------------------------------------------------------------------------------------------
type PortPair = {
    protocol: 'tcp' | 'udp',
    original: number,
    translated: number,
}

type RegisterRequestData = {
    tcp_ports: number[],
    udp_ports: number[],
}

type RegisterInfoData = {
    name: string,
    password: string,
    port_pairs: PortPair[],
}

type RegisterState = {
    request: RegisterRequestData,
    info: RegisterInfoData,
}


// ----------------------------------------------------------------------------------------------------
// function
// ----------------------------------------------------------------------------------------------------
async function register(data: RegisterRequestData): Promise<any> {
    const endpoint = API_ENDPOINT
    const response = await fetch(endpoint, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    return response.json();
}


export function checkRegisterRequestData(data: RegisterRequestData): {isValid: boolean, message: string} {
    // 型チェックで保証できないものをチェック
    const port_numbers = data['tcp_ports'].concat(data['udp_ports'])
    if (port_numbers.length === 0) {
        return {
            isValid: false,
            message: 'ポート番号欄に入力がありません。\n'
                +'ポート番号欄に1以上65535以内の整数をコンマ区切りで入力してください。'
        }
    }
    for (const port_number of port_numbers) {
        if (isNaN(port_number)) {
            return {
                isValid: false,
                message: '数値に変換できない文字列がポート番号欄に入力されています。\n'
                    +'ポート番号欄に1以上65535以内の整数をコンマ区切りで入力してください。'
            }
        }
        if (!Number.isInteger(port_number)) {
            return {
                isValid: false,
                message: '整数に変換できない数字がポート番号欄に入力されています。\n'
                    +'ポート番号欄に1以上65535以内の整数をコンマ区切りで入力してください。'
            }
        }
        if ((port_number < 1 || 65535 < port_number)) {
            return {
                isValid: false,
                message: '1以上65535以下の範囲外の整数がポート番号欄に入力されています。\n'
                    +'ポート番号欄に1以上65535以内の整数をコンマ区切りで入力してください。'
            }
        }
    }
    return {isValid: true, message: ''}
}


// ----------------------------------------------------------------------------------------------------
// class
// ----------------------------------------------------------------------------------------------------
export class Register extends React.Component<{}, RegisterState> {
    constructor(props: {}) {
        super(props)
        this.state = {
            request: {tcp_ports: [], udp_ports: []},
            info: {name: 'sample', password: 'sampleでは接続できません。', port_pairs: [{'protocol': 'tcp', original: 8080, translated: 80}]}
        }
    }

    render(): JSX.Element {
        return (
            <>
            {this.renderRegisterForm()}
            {this.renderRegisterInfo()}
            </>
        )
    }

    // ----------------------------------------------------------------------------------------------------
    // 登録フォーム
    // ----------------------------------------------------------------------------------------------------
    handleSubmit(event: React.ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
    }

    onPortChange = (event: React.ChangeEvent<HTMLInputElement>, protocol: 'tcp' | 'udp'): void => {
        // カンマとスペースで区切り、整数型にパースする
        const ports = event.target.value.split(/,\s*/).map(e => parseInt(e, 10))
        const info = this.state.info
        if (protocol === 'tcp') {
            this.setState({
                request: {tcp_ports: ports, udp_ports: this.state.request.udp_ports},
                info: info
            })
        } else if (protocol === 'udp') {
            this.setState({
                request: {tcp_ports: this.state.request.tcp_ports, udp_ports: ports},
                info: info
            })
        }
    }

    onRegister = (): void => {
        const requestData = this.state.request
        const checkResult = checkRegisterRequestData(requestData)
        if (!checkResult.isValid) {
            alert(checkResult.message)
            return
        }

        register(requestData)
            .then(response => {
                this.setState({
                    request: this.state.request,
                    info: response,
                })
            })
    }

    renderRegisterForm(): JSX.Element {
        return (
            <>
            <h2>登録フォーム</h2>
            <form onSubmit={this.handleSubmit}><table width={500}><tbody>
                <tr key='tcp'>
                    <td>登録するTCPポート番号</td><td><input type='text' size={20} onChange={e => this.onPortChange(e, 'tcp')} placeholder='入力例: 22,443'/></td>
                </tr>< tr key='udp'>
                    <td>登録するUDPポート番号</td><td><input type='text' size={20} onChange={e => this.onPortChange(e, 'udp')} placeholder='入力例: 53' /></td>
                </tr>< tr key='submit'>
                    <td></td><td></td><td><input type='submit' value='登録' onClick={this.onRegister} /></td>
                </tr>
            </tbody></table></form>
            </>
        )
    }

    // ----------------------------------------------------------------------------------------------------
    // 登録情報
    // ----------------------------------------------------------------------------------------------------
    renderUserInfo(username: string, password: string): JSX.Element {
        if (username === '' || password === '') {
            return <></>
        }
        return (
            <div>
                <h2>登録情報</h2>
                VPN接続用ユーザ名 : {username}<br />
                VPN接続用パスワード : {password}
            </div>
        )
    }

    renderPortInfo(hostname: string, port_pairs: PortPair[]): JSX.Element {
        if (port_pairs.length === 0) {
            return <></>
        }
        const portInfo = []
        for (let i = 0; i < port_pairs.length; i++) {
            portInfo.push(<tr key={i}><td>{hostname}:{port_pairs[i].original}</td><td>{port_pairs[i].translated}</td><td>{port_pairs[i].protocol}</td></tr>)
        }
        return (
            <table width={500}>
                <tbody>
                    <tr key='header'><th>外部アクセス用 FQDN:ポート番号</th><th>登録ポート番号</th><th>プロトコル</th></tr>
                    {portInfo}
                </tbody>
            </table>
        )
    }

    renderRegisterInfo(): JSX.Element {
        return (
            <div className='RegisterInfo'>
                {this.renderUserInfo(this.state.info.name, this.state.info.password)}
                {this.renderPortInfo(HOST, this.state.info.port_pairs)}
            </div>
        )
    }
}
