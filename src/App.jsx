import { useState } from 'react'
import './App.css'
import pinyin from 'pinyin'
import zhuyinMap from './map/zhuyin.json'
import toneSymbols from './map/toneSymbols.json'

function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [convertType, setConvertType] = useState('zhuyin')

  const convertToPinyin = (text) => {
    const pyArr = pinyin(text, {
      style: pinyin.STYLE_TONE2,
    })
    return pyArr.map(item => item[0]).join(' ')
  }

  const convertToZhuyin = (text) => {
    const pyArr = pinyin(text, {
      style: pinyin.STYLE_TONE2,
    })

    return pyArr.map(item => {
      const pinyinWithTone = item[0]
      const toneNumber = pinyinWithTone.match(/\d/) ? pinyinWithTone.match(/\d/)[0] : '0'
      const pinyinWithoutTone = pinyinWithTone.replace(/\d/g, '')

      const zhuyinBase = zhuyinMap[pinyinWithoutTone] || pinyinWithoutTone
      const toneSymbol = toneSymbols[toneNumber] || ''

      return zhuyinBase + toneSymbol
    }).join(' ')
  }

  const handleConvert = () => {
    if (convertType === 'pinyin') {
      setOutputText(convertToPinyin(inputText))
    } else {
      setOutputText(convertToZhuyin(inputText))
    }
  }

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>中文轉音標工具</h1>
        <p>支援中文轉拼音與注音符號</p>
      </div>

      <div className="card">
        <div style={{ marginBottom: '1rem' }}>
          <label>
            <input
              type="radio"
              value="zhuyin"
              checked={convertType === 'zhuyin'}
              onChange={(e) => setConvertType(e.target.value)}
            />
            轉換為注音符號
          </label>
          <label style={{ marginLeft: '1rem' }}>
            <input
              type="radio"
              value="pinyin"
              checked={convertType === 'pinyin'}
              onChange={(e) => setConvertType(e.target.value)}
            />
            轉換為拼音
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="請輸入中文文字..."
            style={{ width: '100%', minHeight: '100px', padding: '10px' }}
          />
        </div>

        <button onClick={handleConvert} style={{ marginBottom: '1rem' }}>
          {convertType === 'zhuyin' ? '轉換為注音' : '轉換為拼音'}
        </button>

        <div style={{
          minHeight: '100px',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9',
          fontSize: '18px',
          lineHeight: '1.5'
        }}>
          {outputText || '轉換結果會顯示在這裡...'}
        </div>
      </div>
    </>
  )
}

export default App
