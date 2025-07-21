import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ZoomIn, ZoomOut, ScanSearch, Camera, BrushCleaning, Maximize2, Minimize2 } from 'lucide-react'
import { CONSTANTS } from '@/lib/utils'
import { Fonts, type ControlPanelProps } from '@/types'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'


export const ControlPanel = ({
  textColor,
  bgColor,
  textScale,
  textFont,
  outputText,
  onTextColorChange,
  isWideMode,
  onBgColorChange,
  onTextFontChange,
  onTextScaleChange,
  onColorReset,
  onSaveAsImage,
  onWideModeToggle
}: ControlPanelProps) => {
  return (
    <div className="flex flex-col items-center justify-between sm:flex-row gap-2 sticky top-0 z-10 py-4 bg-white">
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <input
              type="color"
              value={textColor}
              onChange={(e) => onTextColorChange(e.target.value)}
              className="w-8 h-8 border rounded-sm cursor-pointer"
            />
          </TooltipTrigger>
          <TooltipContent>文字顏色</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => onBgColorChange(e.target.value)}
              className="w-8 h-8 border rounded-sm cursor-pointer"
            />
          </TooltipTrigger>
          <TooltipContent>背景顏色</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onColorReset}
            >
              <BrushCleaning className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>重置顏色</TooltipContent>
        </Tooltip>

        <Select onValueChange={onTextFontChange} value={textFont}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="選擇字體" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>字體選擇</SelectLabel>
              {Object.values(Fonts).map((font) => (
                <SelectItem key={font.key} value={font.key}>
                  {font.value}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTextScaleChange(1)}
            >
              <ScanSearch className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>重置縮放</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={textScale <= CONSTANTS.MIN_TEXT_SCALE}
              onClick={() => onTextScaleChange(Math.max(textScale - CONSTANTS.STEP_TEXT_SCALE, CONSTANTS.MIN_TEXT_SCALE))}
            >
              <ZoomOut className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>縮小</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={textScale >= CONSTANTS.MAX_TEXT_SCALE}
              onClick={() => onTextScaleChange(Math.min(textScale + CONSTANTS.STEP_TEXT_SCALE, CONSTANTS.MAX_TEXT_SCALE))}
            >
              <ZoomIn className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>放大</TooltipContent>
        </Tooltip>
        {/* toggle wild */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onWideModeToggle}
            >
              {isWideMode ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>切換寬度</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={!outputText || typeof outputText !== 'object'}
              onClick={onSaveAsImage}
            >
              <Camera className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>儲存為圖片</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}