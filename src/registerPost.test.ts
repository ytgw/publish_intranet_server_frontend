import {checkRegisterRequestData} from './register'

test('checkRegisterRequestData_正常の場合', () => {
    const data = {tcp_ports: [1,2], udp_ports: [1]}
    expect(checkRegisterRequestData(data)).toEqual({isValid: true, message: ''})
})

test('checkRegisterRequestData_不要なデータが含まれている場合', () => {
    const data = {tcp_ports: [1,2], udp_ports: [1], test: 1}
    expect(checkRegisterRequestData(data)).toEqual({isValid: true, message: ''})
})

test('checkRegisterRequestData_片方しか設定されていない場合', () => {
    const data = {tcp_ports: [1,2], udp_ports: []}
    expect(checkRegisterRequestData(data)).toEqual({isValid: true, message: ''})
})

test('checkRegisterRequestData_両方設定されていない場合', () => {
    const data = {tcp_ports: [], udp_ports: []}
    expect(checkRegisterRequestData(data)).toEqual({
        isValid: false,
        message: 'ポート番号欄に入力がありません。\n'
            +'ポート番号欄に1以上65535以内の整数をコンマ区切りで入力してください。'
    })
})

test('checkRegisterRequestData_数字以外が含まれている場合', () => {
    const data = {tcp_ports: [NaN], udp_ports: []}
    expect(checkRegisterRequestData(data)).toEqual({
        isValid: false,
        message: '数値に変換できない文字列がポート番号欄に入力されています。\n'
            +'ポート番号欄に1以上65535以内の整数をコンマ区切りで入力してください。'
    })
})

test('checkRegisterRequestData_小数が含まれている場合', () => {
    const data = {tcp_ports: [1.5], udp_ports: []}
    expect(checkRegisterRequestData(data)).toEqual({
        isValid: false,
        message: '整数に変換できない数字がポート番号欄に入力されています。\n'
            +'ポート番号欄に1以上65535以内の整数をコンマ区切りで入力してください。'
    })
})

test('checkRegisterRequestData_想定より小さい整数が含まれている場合', () => {
    const data = {tcp_ports: [0], udp_ports: []}
    expect(checkRegisterRequestData(data)).toEqual({
        isValid: false,
        message: '1以上65535以下の範囲外の整数がポート番号欄に入力されています。\n'
            +'ポート番号欄に1以上65535以内の整数をコンマ区切りで入力してください。'
    })
})

test('checkRegisterRequestData_想定より大きい整数が含まれている場合', () => {
    const data = {tcp_ports: [65536], udp_ports: []}
    expect(checkRegisterRequestData(data)).toEqual({
        isValid: false,
        message: '1以上65535以下の範囲外の整数がポート番号欄に入力されています。\n'
            +'ポート番号欄に1以上65535以内の整数をコンマ区切りで入力してください。'
    })
})
