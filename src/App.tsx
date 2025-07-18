import { useState } from 'react'
import type { ReactNode } from 'react'
import '@/App.css'
import pinyin from 'pinyin'
import zhuyinMap from '@/map/zhuyin.json'
import toneSymbols from '@/map/toneSymbols.json'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ZoomIn, ZoomOut, ScanSearch, Camera } from 'lucide-react'
import { saveAs } from 'file-saver'
import { toPng } from 'html-to-image'

interface ZhuyinItem {
  char: string
  zhuyin: string
  tone: string
  symbol: string
}

type ConvertType = 'zhuyin' | 'pinyin'
type OutputText = string | ZhuyinItem[]

function App() {
  const [inputText, setInputText] = useState<string>('很久很久以前，在一座被銀色月光輕輕撫摸的古老森林裡，住著一隻叫「小葉」的小狐狸。小葉有著柔軟的火紅尾巴和一雙像星星般閃亮的眼睛，但牠最愛做的事情，不是追蝴蝶，也不是挖蘑菇，而是…')
  const [outputText, setOutputText] = useState<OutputText>('')
  const [convertType, setConvertType] = useState<ConvertType>('zhuyin')
  const [textScale, setTextScale] = useState<number>(1)

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
        const toneNumber = pinyinWithTone.match(/\d/)?.[0] || '0'
        const pinyinWithoutTone = pinyinWithTone.replace(/\d/g, '')

        const zhuyinBase = (zhuyinMap as Record<string, string>)[pinyinWithoutTone] || pinyinWithoutTone
        const toneSymbol = (toneSymbols as unknown as Record<string, string>)[toneNumber] || ''

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
    if (!inputText.trim()) return

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
        <div className="flex flex-wrap gap-2" style={{ scale: textScale }}>
          {outputText.map((item, index) => (
            <div key={index} className="flex items-center min-w-[30px] w-[80px]">
              <div className="text-[3rem] min-h-[2rem]">
                {item.char}
              </div>
              <div className="flex items-center" style={{
                flexDirection: item.tone === '0' ? 'column-reverse' : 'row',
              }}>
                <div className="text-[1rem] font-bold text-gray-600" style={{
                  writingMode: 'vertical-rl',
                  textOrientation: 'upright'
                }}>
                  {item.zhuyin}
                </div>
                <div className="text-gray-600 text-[1rem] font-bold" style={{
                  lineHeight: item.tone === '0' ? '1px' : '3rem'
                }}>
                  {item.symbol}
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }
    return typeof outputText === 'string' ? outputText : '轉換結果會顯示在這裡...'
  }

  const handleSaveAsImage = () => {
    if (!outputText || typeof outputText !== 'object') {
      console.error('No valid output to save as image')
      return
    }
    const element = document.getElementById('output-block')
    if (element) {
      toPng(element)
        .then((dataUrl) => {
          saveAs(dataUrl, 'story_zhuyin.png')
        })
        .catch((error) => {
          console.error('Error generating image:', error)
        })
    }
  }

  return (
    <main className="app-main">
      <div className="container mx-auto pt-20 pb-20 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">ㄅㄆㄇㄈ注音小幫手</h1>
        </div>

        <div className="card">
          <RadioGroup defaultValue="zhuyin" className="hidden" onValueChange={handleModeChange}>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="zhuyin" id="zhuyin" />
                <Label htmlFor="zhuyin">轉換為注音符號</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pinyin" id="pinyin" />
                <Label htmlFor="pinyin">轉換為拼音</Label>
              </div>
            </div>
          </RadioGroup>

          <div style={{ marginBottom: '1rem' }}>
            <Textarea
              value={inputText}
              placeholder="請輸入中文文字..."
              className="w-full min-h-40 p-4 bg-white border rounded-md shadow-sm"
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <div className="flex justify-center gap-4">
            <Button
              className="mb-4"
              variant="outline"
              disabled={!inputText.trim()}
              onClick={() => {
                setInputText('')
                setOutputText('')
              }}
            >
              清除
            </Button>
            <Button className="mb-4" onClick={handleConvert}>
              {convertType === 'zhuyin' ? '轉換為注音' : '轉換為拼音'}
            </Button>
          </div>

          <div>
            <div className="flex justify-end gap-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                disabled={!outputText || typeof outputText !== 'object'}
                onClick={handleSaveAsImage}
              >
                <Camera className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTextScale(1)}
              >
                <ScanSearch className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={textScale <= 0.7}
                onClick={() => setTextScale(prev => Math.max(prev - 0.1, 0.7))}
              >
                <ZoomOut className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={textScale >= 1}
                onClick={() => setTextScale(prev => Math.min(prev + 0.1, 1))}
              >
                <ZoomIn className="size-4" />
              </Button>
            </div>
            <div id="output-block" className="min-h-40 p-4 border rounded-md bg-gray-100">
              {renderZhuyinOutput()}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
