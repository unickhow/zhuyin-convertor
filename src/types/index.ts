export interface ZhuyinItem {
  char: string
  zhuyin: string
  tone: string
  symbol: string
  heteronym?: Pick<ZhuyinItem, 'zhuyin' | 'tone' | 'symbol'>[]
}

export interface TextInputProps {
  inputText: string
  setInputText: (text: string) => void
  convertType: ConvertType
  onConvert: () => void
  onClear: () => void
}

export type ConvertType = 'zhuyin' | 'pinyin'
export type OutputText = ZhuyinItem[]

export interface ControlPanelProps {
  textColor: string
  onTextColorChange: (color: string) => void
  bgColor: string
  onBgColorChange: (color: string) => void
  onColorReset: () => void
  textScale: number
  onTextScaleChange: (scale: number) => void
  textFont: typeof Fonts[keyof typeof Fonts]['key']
  onTextFontChange: (font: typeof Fonts[keyof typeof Fonts]['key']) => void
  outputText: OutputText
  isWideMode: boolean
  onWideModeToggle: () => void
  onSaveAsImage: () => void
  onRenderSizeChange: () => void
}

export interface OutputDisplayProps {
  outputText: OutputText
  convertType: ConvertType
  textScale: number
  textColor: string
  textFont: typeof Fonts[keyof typeof Fonts]['key']
  bgColor: string
  onZhuyinChange?: (index: number, newZhuyin: string, newTone: string, newSymbol: string) => void
  renderSize: typeof RenderSizes[keyof typeof RenderSizes]
}

export interface ZhuyinRendererProps {
  items: ZhuyinItem[]
  textScale: number
  textColor: string
  onZhuyinChange?: (index: number, newZhuyin: string, newTone: string, newSymbol: string) => void
  renderSize: typeof RenderSizes[keyof typeof RenderSizes]
}

export const Fonts = {
  DEFAULT: {
    key: 'default-font',
    value: '預設字體'
  },
  MICROSOFT_JHENGHEI: {
    key: 'microsoft-jhenghei',
    value: '微軟正黑體'
  },
  DFKAI_SB: {
    key: 'dfkai-sb',
    value: '標楷體'
  },
  HEITI_TC: {
    key: 'heiti-tc',
    value: '黑體'
  },
  NOTO_SANS: {
    key: 'noto-sans',
    value: 'Noto Sans'
  }
} as const

export const RenderSizes = {
  DEFAULT: 'size-default',
  MEDIUM: 'size-medium',
  SMALL: 'size-small'
} as const
