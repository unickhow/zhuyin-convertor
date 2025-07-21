import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Fonts, RenderSizes } from '@/types'

export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const CONSTANTS = {
  MAX_TEXT_SCALE: 1,
  MIN_TEXT_SCALE: 0.7,
  STEP_TEXT_SCALE: 0.1,
  DEFAULT_TEXT_COLOR: '#000000',
  DEFAULT_BG_COLOR: '#ffffff',
  DEFAULT_TEXT: '很久很久以前，在一座被銀色月光輕輕撫摸的古老森林裡，住著一隻小狐狸。小狐狸有著柔軟的火紅尾巴和一雙像星星般閃亮的眼睛…',
  DEFAULT_FONT: Fonts.DEFAULT.key,
  DEFAULT_RENDER_SIZE: RenderSizes.DEFAULT
}
