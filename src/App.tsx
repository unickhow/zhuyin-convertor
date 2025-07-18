import { useState } from 'react'
import type { ReactNode } from 'react'
import './App.css'
import pinyin from 'pinyin'
import zhuyinMap from './map/zhuyin.json'
import toneSymbols from './map/toneSymbols.json'

interface ZhuyinItem {
  char: string
  zhuyin: string
  tone: string
  symbol: string
}

type ConvertType = 'zhuyin' | 'pinyin'
type OutputText = string | ZhuyinItem[]

function App() {
  const [inputText, setInputText] = useState<string>('')
  const [outputText, setOutputText] = useState<OutputText>('')
  const [convertType, setConvertType] = useState<ConvertType>('zhuyin')

  const convertToPinyin = (text: string): string => {
    const pyArr = pinyin(text, {
      style: pinyin.STYLE_TONE2,
    })
    return pyArr.map(item => item[0]).join(' ')
  }

  const isChinese = (char: string): boolean => {
    return /[\u4e00-\u9fff]/.test(char)
  }

  const convertToZhuyin = (text: string): ZhuyinItem[] => {
    const pyArr = pinyin(text, {
      style: pinyin.STYLE_TONE2,
    })

    return text.split('').map((char, index) => {
      if (isChinese(char) && pyArr[index]) {
        const pinyinWithTone = pyArr[index][0]
        const toneNumber = pinyinWithTone.match(/\d/) ? pinyinWithTone.match(/\d/)[0] : '0'
        const pinyinWithoutTone = pinyinWithTone.replace(/\d/g, '')

        const zhuyinBase = (zhuyinMap as Record<string, string>)[pinyinWithoutTone] || pinyinWithoutTone
        const toneSymbol = (toneSymbols as Record<string, string>)[toneNumber] || ''

        return {
          char: char,
          zhuyin: zhuyinBase,
          tone: toneNumber,
          symbol: toneSymbol
        }
      }
      return {
        char: char,
        zhuyin: '',
        tone: '0',
        symbol: ''
      }
    })
  }

  const handleConvert = () => {
    if (convertType === 'pinyin') {
      setOutputText(convertToPinyin(inputText))
    } else {
      setOutputText(convertToZhuyin(inputText))
    }
  }

  const handleModeChange = (mode: ConvertType): void => {
    setConvertType(mode)
    setOutputText('')
  }

  const renderZhuyinOutput = (): ReactNode => {
    if (convertType === 'zhuyin' && Array.isArray(outputText)) {
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {outputText.map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              minWidth: '30px'
            }}>
              <div style={{
                fontSize: '3rem',
                minHeight: '20px'
              }}>
                {item.char}
              </div>
              <div style={{
                display: 'flex',
                flexDirection: item.tone === '0' ? 'column-reverse' : 'row',
                alignItems: 'center'
              }}>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  writingMode: 'vertical-rl',
                  textOrientation: 'upright'
                }}>
                  {item.zhuyin}
                </div>
                <div style={{
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  lineHeight: item.tone === '0' ? '1px' : '3rem',
                  color: '#666'
                }}>
                  {item.symbol}
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }
    return outputText || '轉換結果會顯示在這裡...'
  }

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>ㄅㄆㄇㄈ注音小幫手</h1>
        <p>支援中文轉拼音與注音符號</p>
      </div>

      <div className="card">
        <div style={{ marginBottom: '1rem' }}>
          <label>
            <input
              type="radio"
              value="zhuyin"
              checked={convertType === 'zhuyin'}
              onChange={(e) => handleModeChange(e.target.value as ConvertType)}
            />
            轉換為注音符號
          </label>
          <label style={{ marginLeft: '1rem' }}>
            <input
              type="radio"
              value="pinyin"
              checked={convertType === 'pinyin'}
              onChange={(e) => handleModeChange(e.target.value as ConvertType)}
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
          {renderZhuyinOutput()}
        </div>
      </div>
    </>
  )
}

export default App
