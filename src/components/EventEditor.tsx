import { useState } from 'react'
import { createPortal } from 'react-dom'
import { EventCard } from './EventCard'
import { ChoiceList } from './ChoiceList'
import type { GameEvent, PlayerState } from '../types/game'

interface Props {
  player: PlayerState
  onClose: () => void
  onChoose: (choiceId: string) => void
}

const DEFAULT_EVENT: GameEvent = {
  id: 'new_event',
  title: '新事件标题',
  description: '在这里填写事件描述文本……',
  weight: 10,
  years: 1,
  once: true,
  choices: [
    {
      id: 'choice_1',
      text: '第一个选项',
      effects: [{ type: 'cultivation', value: 10 }],
    },
    {
      id: 'choice_2',
      text: '第二个选项',
      effects: [{ type: 'stat', key: 'karma', value: 5 }],
    },
  ],
}

export function EventEditor({ player, onClose, onChoose }: Props) {
  const [jsonText, setJsonText] = useState(JSON.stringify(DEFAULT_EVENT, null, 2))
  const [error, setError] = useState<string | null>(null)
  const [event, setEvent] = useState<GameEvent | null>(DEFAULT_EVENT)

  const handleValidate = () => {
    try {
      const parsed = JSON.parse(jsonText)
      if (!parsed.id || !parsed.title || !parsed.description || !parsed.choices) {
        setError('缺少必填字段：id, title, description, choices')
        setEvent(null)
        return
      }
      if (!Array.isArray(parsed.choices) || parsed.choices.length === 0) {
        setError('choices 必须是非空数组')
        setEvent(null)
        return
      }
      setError(null)
      setEvent(parsed as GameEvent)
    } catch (e) {
      setError(`JSON 解析错误：${e instanceof Error ? e.message : '未知错误'}`)
      setEvent(null)
    }
  }

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText)
      setJsonText(JSON.stringify(parsed, null, 2))
      setError(null)
    } catch {
      setError('JSON 格式错误，无法格式化')
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText).catch(() => {})
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4"
      onClick={(e) => { if ((e.target as HTMLElement).dataset.overlay) onClose() }}
    >
      <div
        data-overlay="false"
        className="w-full max-w-5xl h-[85vh] border border-[var(--color-jade)]/40 bg-[var(--color-ink)] flex flex-col rounded-sm max-md:flex-col"
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-jade)]/20">
          <h3 className="text-lg text-[var(--color-gold)]" style={{ fontFamily: 'var(--font-display)' }}>
            ⚙ 事件编辑器
          </h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleFormat}
              className="text-xs px-3 py-1 border border-[var(--color-jade)]/40 rounded-sm
                text-[var(--color-jade-light)] hover:text-[var(--color-gold)] cursor-pointer transition-colors"
            >
              格式化
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="text-xs px-3 py-1 border border-[var(--color-jade)]/40 rounded-sm
                text-[var(--color-jade-light)] hover:text-[var(--color-gold)] cursor-pointer transition-colors"
            >
              复制 JSON
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-xs px-3 py-1 border border-[var(--color-mist)]/20 rounded-sm
                text-[var(--color-mist)] hover:text-[var(--color-parchment)] cursor-pointer transition-colors"
            >
              关闭
            </button>
          </div>
        </div>

        {/* 内容区 */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          {/* 左侧：JSON 编辑器 */}
          <div className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-[var(--color-jade)]/20">
            <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-jade)]/10">
              <span className="text-xs text-[var(--color-mist)]">JSON 数据</span>
              <button
                type="button"
                onClick={handleValidate}
                className="text-xs px-3 py-1 bg-[var(--color-jade)]/20 hover:bg-[var(--color-jade)]/30
                  text-[var(--color-jade-light)] rounded-sm cursor-pointer transition-colors"
              >
                验证并预览
              </button>
            </div>
            {error && (
              <div className="px-3 py-2 bg-[rgba(184,58,42,0.1)] border-b border-[var(--color-cinnabar)]/20">
                <p className="text-xs text-[var(--color-cinnabar)]">{error}</p>
              </div>
            )}
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              spellCheck={false}
              className="flex-1 resize-none bg-transparent text-[var(--color-parchment)] text-xs
                font-mono p-3 outline-none border-none"
              style={{ tabSize: 2 }}
            />
          </div>

          {/* 右侧：游戏内预览 */}
          <div className="w-full md:w-1/2 flex flex-col">
            <div className="px-3 py-2 border-b border-[var(--color-jade)]/10">
              <span className="text-xs text-[var(--color-mist)]">游戏内预览</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {event ? (
                <div className="border border-[var(--color-jade)]/30 bg-[rgba(12,15,13,0.6)] p-4 sm:p-6 rounded-sm">
                  <EventCard event={event} />
                  <ChoiceList choices={event.choices} player={player} onChoose={onChoose} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-[var(--color-mist)]">点击「验证并预览」查看效果</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
