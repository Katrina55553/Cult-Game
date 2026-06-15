import { CHAPTERS } from '../data/chapters'
import { getRealmName } from './gameEngine'
import type { GameSession } from '../types/game'

/**
 * 将游戏日志导出为小说格式
 */
export function exportAsNovel(session: GameSession): string {
  const { player, ending, turn } = session
  const lines: string[] = []

  // ── 封面 ──
  lines.push(`《${player.name}修仙传》`)
  lines.push('')
  lines.push(`结局：${ending?.title ?? '未完'}`)
  lines.push(`灵根：${player.spiritRoot}　境界：${getRealmName(player.realm)}　寿终：${player.age} 岁`)
  lines.push(`共历 ${turn} 回合`)
  lines.push('')
  lines.push('═'.repeat(30))
  lines.push('')

  // ── 按章节分组日志 ──
  const chapterLogs = splitLogsByChapter(player.log)

  for (const { chapterName, entries } of chapterLogs) {
    if (chapterName) {
      lines.push('')
      lines.push(`【${chapterName}】`)
      lines.push('')
    }
    for (const entry of entries) {
      // 清理日志格式，使其更像小说
      const cleaned = cleanLogEntry(entry)
      if (cleaned) {
        lines.push(cleaned)
        lines.push('')
      }
    }
  }

  // ── 结局 ──
  if (ending) {
    lines.push('')
    lines.push('═'.repeat(30))
    lines.push('')
    lines.push(`【${ending.title}】`)
    lines.push('')
    lines.push(ending.description)
    lines.push('')
  }

  // ── 尾声 ──
  lines.push('─'.repeat(30))
  lines.push('')
  lines.push('（全文完）')

  return lines.join('\n')
}

interface ChapterLog {
  chapterName: string | null
  entries: string[]
}

/**
 * 将日志按章节标记分割
 */
function splitLogsByChapter(log: string[]): ChapterLog[] {
  const chapters: ChapterLog[] = []
  let current: ChapterLog = { chapterName: null, entries: [] }

  // 所有章节名称
  const chapterNames = new Set(Object.values(CHAPTERS).map((c) => c.name))

  for (const entry of log) {
    const trimmed = entry.trim()
    // 检测章节标记：— 第X章 · XXX —
    if (trimmed.startsWith('—') && trimmed.endsWith('—')) {
      const inner = trimmed.slice(1, -1).trim()
      if (chapterNames.has(inner)) {
        // 保存当前章节
        if (current.entries.length > 0 || current.chapterName) {
          chapters.push(current)
        }
        current = { chapterName: inner, entries: [] }
        continue
      }
    }
    current.entries.push(entry)
  }

  if (current.entries.length > 0 || current.chapterName) {
    chapters.push(current)
  }

  return chapters
}

/**
 * 清理日志条目，使其更像小说文本
 */
function cleanLogEntry(entry: string): string {
  let s = entry.trim()
  if (!s) return ''

  // 移除开头的年龄标记（如 "16岁："）但保留内容
  s = s.replace(/^\d+岁[：:]\s*/, '')

  // 跳过纯章节标记
  if (s.startsWith('—') && s.endsWith('—')) return ''

  // 跳过路线切换标记
  if (s.includes('你决定加入宗门') || s.includes('你离开宗门') || s.includes('你踏入魔道')) {
    return s
  }

  return s
}

/**
 * 触发浏览器下载小说文件
 */
export function downloadNovel(session: GameSession): void {
  const text = exportAsNovel(session)
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${session.player.name}修仙传_${session.ending?.title ?? '未完'}_${new Date().toISOString().slice(0, 10)}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
