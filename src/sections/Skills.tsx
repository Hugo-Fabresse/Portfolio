/**
 * Section Skills — Technical skills and certifications.
 *
 * Uses SplitView with BufferView for list and detail panels.
 * Data: src/data/skills.ts
 */

import Section from "@/components/Section"
import SplitView from "@/components/SplitView"
import BufferView from "@/components/BufferView"
import { skillsData } from "@/data/skills"

import type { SkillCategory } from "@/data/skills"
import type { BufferLine } from "@/components/BufferView"

/** Helper: a comment line */
const cm = (text: string): BufferLine => ({
  segments: [{ text, className: "text-tn-comment" }],
})

/** Helper: blank line */
const blank: BufferLine = { segments: [] }

/** Header lines count */
const HEADER_SIZE = 6

/** Build full list buffer: header + item lines */
function buildListLines(): BufferLine[] {
  return [
    cm("# skills.yml"),
    cm("# Author: Hugo Fabresse"),
    cm("# Last modified: 2026-04-27"),
    cm("# Status: active"),
    cm(`# Categories: ${skillsData.length}`),
    blank,
    ...skillsData.map((s) => ({
      segments: [
        { text: "- ", className: "text-tn-comment" },
        { text: "name", className: "text-tn-secondary" },
        { text: ": ", className: "text-tn-comment" },
        { text: s.title, className: "text-tn-green" },
        { text: " # press <enter> to open", className: "text-tn-comment" },
      ],
    })),
  ]
}

/** Indices of item lines in the list buffer */
const itemLineIndices = skillsData.map((_, i) => HEADER_SIZE + i)

/** Build detail lines with header */
function getDetailLines(category: SkillCategory): BufferLine[] {
  return [
    cm(`/* ${category.id}.c`),
    cm(` * ${category.title}`),
    cm(` * Author: Hugo Fabresse`),
    cm(` */`),
    blank,
    ...(category.description
      ? [
          cm("// Description"),
          { segments: [{ text: category.description }] } as BufferLine,
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
        listTitle="skills.yml"
        listLines={listLines}
        itemLineIndices={itemLineIndices}
        getDetailTitle={(s) => `${s.id}.c`}
        renderDetail={(category, active) => (
          <BufferView lines={getDetailLines(category)} active={active} />
        )}
      />
    </Section>
  )
}
