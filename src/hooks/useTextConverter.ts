import { useState } from 'react'
import pinyin from 'pinyin'
import zhuyinMap from '@/map/zhuyin.json'
import toneSymbols from '@/map/toneSymbols.json'
import heteronymPatch from '@/lib/heteronymPatch.json'
import type { ZhuyinItem, ConvertType, OutputText } from '@/types'
import { CONSTANTS } from '@/lib/utils'

export const useTextConverter = (initialText: string = CONSTANTS.DEFAULT_TEXT) => {
  const [inputText, setInputText] = useState<string>(initialText)
  const [outputText, setOutputText] = useState<OutputText>([])
  const [convertType, setConvertType] = useState<ConvertType>('zhuyin')

  const isChinese = (char: string): boolean => {
    return /[\u4e00-\u9fff]/.test(char)
  }

  const parseZhuyin = (pinyinWithTone: string): { zhuyin: string, tone: string, symbol: string } => {
    const toneMatch = pinyinWithTone.match(/\d/)
    const tone = toneMatch ? toneMatch[0] : '0'
    const pinyinWithoutTone = pinyinWithTone.replace(/\d/g, '')
    const zhuyinBase = (zhuyinMap as Record<string, string>)[pinyinWithoutTone] || pinyinWithoutTone
    const toneSymbol = (toneSymbols as unknown as Record<string, string>)[tone] || ''
    return {
      zhuyin: zhuyinBase,
      tone: tone,
      symbol: toneSymbol
    }
  }

  const convertToZhuyin = (text: string): ZhuyinItem[] => {
    const zhuyinItems: ZhuyinItem[] = []

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      if (isChinese(char)) {
        const pinyinTones = pinyin(char, {
          style: pinyin.STYLE_TONE2,
          heteronym: true
        })

        // 檢查是否有自訂的 heteronym patch
        const customHeteronyms = (heteronymPatch as Record<string, string[]>)[char]
        let zhuyinItem: Pick<ZhuyinItem, 'zhuyin' | 'tone' | 'symbol'>[] = []

        if (customHeteronyms && customHeteronyms.length > 0) {
          // 使用自訂的讀音覆蓋 pinyin 的結果
          zhuyinItem = customHeteronyms.map(pinyinItem => {
            const { zhuyin, tone, symbol } = parseZhuyin(pinyinItem)
            return { zhuyin, tone, symbol }
          })
        } else {
          // 使用 pinyin 原有的破音字
          zhuyinItem = pinyinTones[0].map(pinyinItem => {
            const { zhuyin, tone, symbol } = parseZhuyin(pinyinItem)
            return { zhuyin, tone, symbol }
          })
        }

        const pinyinWithDefaultTone = zhuyinItem[0].zhuyin + zhuyinItem[0].tone
        const { zhuyin: zhuyinBase, tone: toneNumber, symbol: toneSymbol } = parseZhuyin(pinyinWithDefaultTone)

        zhuyinItems.push({
          char: char,
          zhuyin: zhuyinBase,
          tone: toneNumber,
          symbol: toneSymbol,
          ...(zhuyinItem.length > 1 && { heteronym: zhuyinItem })
        })
      } else {
        zhuyinItems.push({
          char: char,
          zhuyin: '',
          tone: '0',
          symbol: '',
          heteronym: []
        })
      }
    }
    return zhuyinItems
  }

  const handleConvert = () => {
    if (!inputText.trim()) return
    setOutputText(convertToZhuyin(inputText))
  }

  const handleModeChange = (mode: ConvertType): void => {
    setConvertType(mode)
    setOutputText([])
  }

  const handleClear = () => {
    setInputText('')
    setOutputText([])
  }

  const handleZhuyinItemUpdate = (index: number, newZhuyin: string, newTone: string, newSymbol: string) => {
    if (Array.isArray(outputText)) {
      const updatedItems = JSON.parse(JSON.stringify(outputText)) as ZhuyinItem[]
      if (updatedItems[index]) {
        updatedItems[index] = {
          ...updatedItems[index],
          zhuyin: newZhuyin,
          tone: newTone,
          symbol: newSymbol
        }
        setOutputText(updatedItems)
      }
    }
  }

  return {
    inputText,
    setInputText,
    outputText,
    setOutputText,
    convertType,
    handleConvert,
    handleModeChange,
    handleClear,
    handleZhuyinItemUpdate
  }
}