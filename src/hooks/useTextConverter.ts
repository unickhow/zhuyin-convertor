import { useState } from 'react'
import pinyin from 'pinyin'
import zhuyinMap from '@/map/zhuyin.json'
import toneSymbols from '@/map/toneSymbols.json'

export interface ZhuyinItem {
  char: string
  zhuyin: string
  tone: string
  symbol: string
}

export type ConvertType = 'zhuyin' | 'pinyin'
export type OutputText = string | ZhuyinItem[]

export const useTextConverter = (initialText: string = '') => {
  const [inputText, setInputText] = useState<string>(initialText)
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

  const handleClear = () => {
    setInputText('')
    setOutputText('')
  }

  return {
    inputText,
    setInputText,
    outputText,
    setOutputText,
    convertType,
    handleConvert,
    handleModeChange,
    handleClear
  }
}