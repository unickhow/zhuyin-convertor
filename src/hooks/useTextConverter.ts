import { useState } from 'react'
import pinyin from 'pinyin'
import zhuyinMap from '@/map/zhuyin.json'
import toneSymbols from '@/map/toneSymbols.json'
import type { ZhuyinItem, ConvertType, OutputText } from '@/types'

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
    const zhuyinItems: ZhuyinItem[] = []

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      if (isChinese(char)) {
        const pinyinWithTone = pinyin(char, { style: pinyin.STYLE_TONE2 })[0][0]
        const toneNumber = pinyinWithTone.match(/\d/)?.[0] || '0'
        const pinyinWithoutTone = pinyinWithTone.replace(/\d/g, '')

        const zhuyinBase = (zhuyinMap as Record<string, string>)[pinyinWithoutTone] || pinyinWithoutTone
        const toneSymbol = (toneSymbols as unknown as Record<string, string>)[toneNumber] || ''

        zhuyinItems.push({
          char: char,
          zhuyin: zhuyinBase,
          tone: toneNumber,
          symbol: toneSymbol
        })
      } else {
        zhuyinItems.push({
          char: char,
          zhuyin: '',
          tone: '0',
          symbol: ''
        })
      }
    }
    return zhuyinItems
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