export type LogTone = 'gain' | 'loss'

export interface LogSegment {
  text: string
  tone?: LogTone
}

const HIGHLIGHT_RULES: { pattern: RegExp; tone: LogTone }[] = [
  { pattern: /获[^，。；！？\n]{1,18}/g, tone: 'gain' },
  { pattern: /赐[^，。；！？\n]{1,18}/g, tone: 'gain' },
  { pattern: /(?:修为|悟性|根骨|气运|因果|寿元|灵石|神识) \+\d+/g, tone: 'gain' },
  { pattern: /(?:习得|铸得|觉醒|灵兽|丹道阶|阵法阶)[^，。；！？]*/g, tone: 'gain' },
  { pattern: /(?:修为|悟性|根骨|气运|因果)(?:大涨|显著精进|精进|略有进益|稳步增长|提升|增加|豁然开朗|略增)/g, tone: 'gain' },
  { pattern: /突破成功[^，。；！？]*/g, tone: 'gain' },
  { pattern: /晋升[^，。；！？]+/g, tone: 'gain' },
  { pattern: /寿元(?:延长)?\s*\d+\s*年/g, tone: 'gain' },
  { pattern: /购得[^，。；！？]+/g, tone: 'gain' },
  { pattern: /即刻生效：[^。]+/g, tone: 'gain' },
  { pattern: /(?:险胜|斩杀|反夺|夺得|采得|炼成|双修大成|结为道侣|记为宗门(?:翘楚|功臣)|名震宗门)[^，。；！？]*/g, tone: 'gain' },
  { pattern: /不敌[^，。；！？]+/g, tone: 'loss' },
  { pattern: /重伤逃遁[^，。；！？]*/g, tone: 'loss' },
  { pattern: /(?:嘉奖|脱险|驯服)[^，。；！？]{0,12}/g, tone: 'gain' },
  { pattern: /(?:失败|受损|重伤|濒死|倒退|损耗|白费|翻脸|诬陷|受罚|陨落|身死|坐化|耗尽)/g, tone: 'loss' },
  { pattern: /(?:修为|悟性|根骨|气运|寿元|灵石|因果) -\d+/g, tone: 'loss' },
  { pattern: /心魔 \+\d+/g, tone: 'loss' },
  { pattern: /心魔 -\d+/g, tone: 'gain' },
  { pattern: /灵石 归零/g, tone: 'loss' },
  { pattern: /心魔(?:暗生|大起|滋生|难压|入主|微生)[^，。；！？]*/g, tone: 'loss' },
  { pattern: /(?:修为|悟性|根骨|气运|因果|寿元)(?:受损|下降|倒退|耗尽)/g, tone: 'loss' },
  { pattern: /(?:计谋败露|反被诬陷|不敌|失利|反噬|排斥|驱逐|赶出)[^，。；！？]*/g, tone: 'loss' },
  { pattern: /因果(?:受损|大损)/g, tone: 'loss' },
]

interface Match {
  start: number
  end: number
  tone: LogTone
}

function collectMatches(text: string): Match[] {
  const matches: Match[] = []

  for (const { pattern, tone } of HIGHLIGHT_RULES) {
    pattern.lastIndex = 0
    let result = pattern.exec(text)
    while (result) {
      matches.push({
        start: result.index,
        end: result.index + result[0].length,
        tone,
      })
      result = pattern.exec(text)
    }
  }

  matches.sort((a, b) => a.start - b.start || b.end - a.end)

  const merged: Match[] = []
  for (const match of matches) {
    const last = merged[merged.length - 1]
    if (!last || match.start >= last.end) {
      merged.push(match)
    }
  }

  return merged
}

export function highlightLogEntry(text: string): LogSegment[] {
  const matches = collectMatches(text)
  if (matches.length === 0) return [{ text }]

  const segments: LogSegment[] = []
  let cursor = 0

  for (const match of matches) {
    if (match.start > cursor) {
      segments.push({ text: text.slice(cursor, match.start) })
    }
    segments.push({
      text: text.slice(match.start, match.end),
      tone: match.tone,
    })
    cursor = match.end
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor) })
  }

  return segments
}

export const LOG_TONE_CLASS: Record<LogTone, string> = {
  gain: 'text-[var(--color-gold)] font-medium',
  loss: 'text-[var(--color-cinnabar-glow)] font-medium',
}
