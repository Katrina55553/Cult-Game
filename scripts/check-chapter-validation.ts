import { strict as assert } from 'node:assert'
import { CHAPTERS, SHARED_CHAPTER_EVENTS } from '../src/data/chapters.ts'
import { EVENTS } from '../src/data/events.ts'
import { validateChapterRegistrations } from '../src/engine/chapterValidation.ts'

assert.deepEqual(validateChapterRegistrations(EVENTS, CHAPTERS, SHARED_CHAPTER_EVENTS), [], '正式剧情登记没有未处理的重复或互斥条件')

const undeclared = validateChapterRegistrations(EVENTS, {
  ...CHAPTERS,
  sect_3: { ...CHAPTERS.sect_3, sideEvents: [...CHAPTERS.sect_3.sideEvents ?? [], 'sect_friend'] },
}, SHARED_CHAPTER_EVENTS)
assert(undeclared.some((issue) => issue.type === 'warning' && issue.message.includes('sect_friend')), '未声明的新重复仍会报警')

const staleDeclaration = validateChapterRegistrations(EVENTS, {
  ...CHAPTERS,
  sect_3: { ...CHAPTERS.sect_3, sideEvents: [...CHAPTERS.sect_3.sideEvents ?? [], 'herb_gather'] },
}, SHARED_CHAPTER_EVENTS)
assert(staleDeclaration.some((issue) => issue.type === 'error' && issue.message.includes('声明与实际登记不一致')), '共享声明必须覆盖全部实际登记')
assert(staleDeclaration.some((issue) => issue.type === 'error' && issue.message.includes('同一路线不得重复登记')), '共享声明不能豁免同路线重复')

const incompatibleSide = validateChapterRegistrations(EVENTS, {
  ...CHAPTERS,
  demon_3: { ...CHAPTERS.demon_3, sideEvents: [...CHAPTERS.demon_3.sideEvents ?? [], 'boss_demon_general'] },
}, SHARED_CHAPTER_EVENTS)
assert(incompatibleSide.some((issue) => issue.type === 'error' && issue.message.includes('boss_demon_general')), '路线互斥的支线也会报错')

const missingReason = validateChapterRegistrations(EVENTS, CHAPTERS, {
  ...SHARED_CHAPTER_EVENTS,
  final_choice: { ...SHARED_CHAPTER_EVENTS.final_choice, reason: '' },
})
assert(missingReason.some((issue) => issue.type === 'error' && issue.message.includes('必须说明跨路线复用用途')), '共享事件必须有复用理由')

const duplicateRole = validateChapterRegistrations(EVENTS, {
  ...CHAPTERS,
  sect_1: { ...CHAPTERS.sect_1, sideEvents: ['enter_sect'] },
}, SHARED_CHAPTER_EVENTS)
assert(duplicateRole.some((issue) => issue.type === 'error' && issue.message.includes('重复登记事件 enter_sect')), '同章节主支线不得重复登记')

console.log('✓ 章节登记校验回归通过')
