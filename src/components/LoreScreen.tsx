import { useState } from 'react'

interface Props {
  onContinue: () => void
}

const LORE_PAGES = [
  {
    title: '天地初开',
    text: '混沌初分，天地始立。万物生灵于天地间汲取灵气，渐生修行之法。\n\n上古之时，大能者可移山填海、摘星拿月。然天道有常，盛极必衰，一场浩劫席卷修真界，上古传承断绝大半。\n\n万年过去，修真界重归繁荣。宗门林立，散修如云，天骄辈出。只是再无人能触及上古大能的高度。',
  },
  {
    title: '当今天下',
    text: '正道以天玄宗为首，据守东方灵脉，门下弟子数万。苍穹阁盘踞北方，与天玄宗分庭抗礼，两宗明争暗斗数百年。\n\n魔道六宗蛰伏暗处，伺机而动。每逢正道内乱，魔修便趁虚而入。\n\n散修游走于宗门夹缝之中，或逍遥自在，或朝不保夕。\n\n而你，不过是芸芸众生中的一名少年。灵根初显，仙途在即。',
  },
  {
    title: '仙途在即',
    text: '十六岁这年，你体内的灵根终于觉醒。\n\n修真界的规矩很简单：有灵根者，可拜入宗门，踏上仙途；无灵根者，终老凡尘。\n\n你的灵根品质如何？是万中无一的天灵根，还是人人嫌弃的五灵根？是拜入宗门做个外门弟子，还是拒绝束缚做个散修？\n\n一切，从今日开始。\n\n每一次抉择皆关机缘，每一步修行皆是天命。\n\n你，准备好了吗？',
  },
]

export function LoreScreen({ onContinue }: Props) {
  const [page, setPage] = useState(0)

  const current = LORE_PAGES[page]
  const isLast = page === LORE_PAGES.length - 1

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 relative overflow-hidden safe-bottom">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-jade)]/[0.05] blur-3xl" />
        <div className="absolute bottom-[5%] left-[30%] w-[400px] h-[400px] rounded-full bg-[var(--color-cinnabar)]/[0.03] blur-3xl" />
      </div>

      <div className="w-full max-w-lg animate-fade-up relative z-10">
        {/* 页码指示 */}
        <div className="flex justify-center gap-2 mb-8">
          {LORE_PAGES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                i === page
                  ? 'bg-[var(--color-gold)] w-6'
                  : 'bg-[var(--color-mist)]/30 hover:bg-[var(--color-mist)]/60'
              }`}
            />
          ))}
        </div>

        {/* 内容区域 */}
        <div className="border border-[var(--color-jade)]/30 bg-[rgba(12,15,13,0.6)] p-6 sm:p-8 rounded-sm mb-8">
          <h2
            className="text-2xl sm:text-3xl text-[var(--color-gold)] mb-6 text-center"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {current.title}
          </h2>
          <div className="space-y-4">
            {current.text.split('\n\n').map((para, i) => (
              <p
                key={i}
                className="text-[var(--color-parchment-dim)] leading-[1.9] text-sm sm:text-base"
              >
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* 导航按钮 */}
        <div className="flex gap-3">
          {page > 0 && (
            <button
              type="button"
              onClick={() => setPage((p) => p - 1)}
              className="flex-1 py-3 min-h-[44px] border border-[var(--color-mist)]/30 rounded-sm
                text-[var(--color-mist)] hover:text-[var(--color-parchment)] hover:border-[var(--color-mist)]/60
                cursor-pointer transition-all tracking-wider"
            >
              上一页
            </button>
          )}
          <button
            type="button"
            onClick={isLast ? onContinue : () => setPage((p) => p + 1)}
            className="flex-1 py-3 min-h-[44px] bg-[var(--color-cinnabar)] hover:bg-[var(--color-cinnabar-glow)]
              text-[var(--color-parchment)] tracking-[0.2em] rounded-sm transition-all cursor-pointer
              border border-[var(--color-cinnabar-glow)]/50
              hover:shadow-[0_0_20px_rgba(184,58,42,0.2)] active:scale-[0.98]"
          >
            {isLast ? '开始修行' : '下一页'}
          </button>
        </div>
      </div>
    </div>
  )
}
