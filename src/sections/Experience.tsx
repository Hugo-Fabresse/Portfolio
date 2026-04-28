/**
 * Section Experience — Professional experience and leadership.
 *
 * Uses SplitView with BufferView for list and detail panels.
 * Data: src/data/experience.ts
 */

import Section from "@/components/Section"
import SplitView from "@/components/SplitView"
import BufferView from "@/components/BufferView"
import { experienceData } from "@/data/experience"

import type { Experience } from "@/data/experience"
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
    cm("# experience.log"),
    cm("# Author: Hugo Fabresse"),
    cm("# Last modified: 2026-04-27"),
    cm("# Status: active"),
    cm(`# Entries: ${experienceData.length}`),
    blank,
    ...experienceData.map((e) => ({
      segments: [
        { text: e.role, className: "text-tn-accent" },
        { text: ` @ ${e.organization}`, className: "text-tn-comment" },
        { text: " # press <enter> to open", className: "text-tn-comment" },
      ],
    })),
  ]
}

/** Indices of item lines in the list buffer */
const itemLineIndices = experienceData.map((_, i) => HEADER_SIZE + i)

/** Build detail lines with header */
function getDetailLines(exp: Experience): BufferLine[] {
  return [
    cm(`# ${exp.id}.log`),
    cm(`# ${exp.role} @ ${exp.organization}`),
    cm(`# Type: ${exp.type}`),
    ...(exp.period ? [cm(`# Period: ${exp.period}`)] : []),
    blank,
    cm("# Description"),
    { segments: [{ text: exp.description }] },
  ]
}

export default function Experience() {
  const listLines = buildListLines()

  return (
    <Section id="experience">
      <SplitView<Experience>
        items={experienceData}
        listTitle="experience.log"
        listLines={listLines}
        itemLineIndices={itemLineIndices}
        getDetailTitle={(e) => `${e.id}.log`}
        renderDetail={(exp, active) => (
          <BufferView lines={getDetailLines(exp)} active={active} />
        )}
      />
    </Section>
  )
}
