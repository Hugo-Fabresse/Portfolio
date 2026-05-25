/**
 * Section Skills — Technical skills and certifications.
 *
 * Uses SplitView with BufferView for list and detail panels.
 * Data: content/skills.yml (loaded via src/data/skills.ts)
 */

import Section from "@/components/Section"
import SplitView from "@/components/SplitView"
import BufferView from "@/components/BufferView"
import { skillsSection, skillsData } from "@/data/skills"

import type { SkillCategory } from "@/data/skills"
import type { BufferLine } from "@/components/BufferView"

/** Helper: a comment line */
const cm = (text: string): BufferLine => ({
  segments: [{ text, className: "text-tn-comment" }],
})

/** Helper: blank line */
const blank: BufferLine = { segments: [] }

/** Number of header lines (title + header fields + entries count + blank) */
const HEADER_SIZE =
  1 + Object.keys(skillsSection.header).length + 1 + 1

/** Build full list buffer: header + item lines */
function buildListLines(): BufferLine[] {
  const headerLines = Object.entries(skillsSection.header).map(
    ([key, value]) => cm(`# ${key}: ${value}`),
  )

  return [
    cm(`# ${skillsSection.title}`),
    ...headerLines,
    cm(`# Categories: ${skillsData.length}`),
    blank,
    ...skillsData.map((s) => ({
      segments: [
        { text: "- ", className: "text-tn-comment" },
        { text: "name", className: "text-tn-secondary" },
        { text: ": ", className: "text-tn-comment" },
        { text: s.name, className: "text-tn-green" },
        { text: " # press <enter> to open", className: "text-tn-comment" },
      ],
    })),
  ]
}

/** Indices of item lines in the list buffer */
const itemLineIndices = skillsData.map((_, i) => HEADER_SIZE + i)

/** Build detail lines with dynamic header fields */
function getDetailLines(category: SkillCategory): BufferLine[] {
  const headerEntries = Object.entries(category.header)
  const padLen = Math.max(...headerEntries.map(([k]) => k.length + 1)) + 1
  const headerLines = headerEntries.map(([key, value]) => {
    const padded = `${key}:`.padEnd(padLen)
    return cm(` * ${padded}${value}`)
  })

  return [
    cm(`/* ${category.page}`),
    cm(` * ${category.name}`),
    ...headerLines,
    cm(` */`),
    blank,
    ...(category.description
      ? [
          cm("// Description"),
          { segments: [{ text: category.description.trim() }] } as BufferLine,
          blank,
        ]
      : []),
    cm("// Items"),
    ...category.items.map((item) => ({
      segments: [
        { text: "- ", className: "text-tn-green" },
        { text: item },
      ],
    })),
  ]
}

export default function Skills() {
  const listLines = buildListLines()

  return (
    <Section id="skills">
      <SplitView<SkillCategory>
        items={skillsData}
        listTitle={skillsSection.title}
        listLines={listLines}
        itemLineIndices={itemLineIndices}
        getDetailTitle={(s) => s.page}
        renderDetail={(category, active) => (
          <BufferView lines={getDetailLines(category)} active={active} />
        )}
      />
    </Section>
  )
}
