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
  lines.push(`灵根：${player.spiritRoot} | 境界：${getRealmName(player.realm)} | 寿终：${player.age} 岁`)
  lines.push(`共历 ${turn} 回合`)
  lines.push('')
  lines.push('═'.repeat(30))
  lines.push('')

  // ── 按章节分组日志 ──
  const chapterLogs = splitLogsByChapter(player.log)
  let chapterIndex = 0

  for (const { chapterName, entries, chapterId } of chapterLogs) {
    chapterIndex++
    if (chapterName) {
      lines.push('')
      if (chapterIndex > 1) lines.push('')
      lines.push(`【${chapterName}】`)
      lines.push('')
      // 插入章节 intro 作为场景描写
      const chapter = chapterId ? CHAPTERS[chapterId] : null
      if (chapter?.intro) {
        lines.push(chapter.intro)
        lines.push('')
      }
    }
    for (const entry of entries) {
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

  // ── 人物档案 ──
  lines.push('')
  lines.push('═'.repeat(30))
  lines.push('')
  lines.push('【人物档案】')
  lines.push('')
  lines.push(`${player.name}`)
  lines.push(`  灵根：${player.spiritRoot}`)
  lines.push(`  境界：${getRealmName(player.realm)}`)
  lines.push(`  年龄：${player.age} 岁`)
  lines.push(`  根骨：${player.stats.rootBone} | 悟性：${player.stats.comprehension} | 气运：${player.stats.luck}`)
  lines.push(`  因果：${player.stats.karma} | 心魔：${player.stats.demonHeart}`)
  if (player.cultivationSystems.bloodline) {
    lines.push(`  血脉：${player.cultivationSystems.bloodline}`)
  }
  if (player.cultivationSystems.spiritBeast) {
    lines.push(`  灵兽：${player.cultivationSystems.spiritBeast.name}（${player.cultivationSystems.spiritBeast.tier}阶）`)
  }
  if (player.cultivationSystems.techniques.length > 0) {
    lines.push(`  功法：${player.cultivationSystems.techniques.join('、')}`)
  }
  if (player.cultivationSystems.divineWeapons.length > 0) {
    lines.push(`  神兵：${player.cultivationSystems.divineWeapons.join('、')}`)
  }
  if (player.artifacts.length > 0) {
    lines.push(`  法宝：${player.artifacts.join('、')}`)
  }

  // ── 尾声 ──
  lines.push('')
  lines.push('─'.repeat(30))
  lines.push('')
  lines.push('（全文完）')

  return lines.join('\n')
}

interface ChapterLog {
  chapterId: string | null
  chapterName: string | null
  entries: string[]
}

/**
 * 将日志按章节标记分割
 */
function splitLogsByChapter(log: string[]): ChapterLog[] {
  const chapters: ChapterLog[] = []
  let current: ChapterLog = { chapterId: null, chapterName: null, entries: [] }

  // 章节名称 → ID 映射
  const nameToId = new Map<string, string>()
  for (const [id, ch] of Object.entries(CHAPTERS)) {
    nameToId.set(ch.name, id)
  }

  for (const entry of log) {
    const trimmed = entry.trim()
    if (trimmed.startsWith('—') && trimmed.endsWith('—')) {
      const inner = trimmed.slice(1, -1).trim()
      const chapterId = nameToId.get(inner)
      if (chapterId) {
        if (current.entries.length > 0 || current.chapterName) {
          chapters.push(current)
        }
        current = { chapterId, chapterName: inner, entries: [] }
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
