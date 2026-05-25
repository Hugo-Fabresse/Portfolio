/**
 * Section Projects — Personal projects showcase.
 *
 * Uses SplitView with BufferView for list and detail panels.
 * Data: content/projects.yml (loaded via src/data/projects.ts)
 */

import Section from "@/components/Section"
import SplitView from "@/components/SplitView"
import BufferView from "@/components/BufferView"
import { projectsSection, projectsData } from "@/data/projects"

import type { Project } from "@/data/projects"
import type { BufferLine } from "@/components/BufferView"

/** Helper: a comment line */
const cm = (text: string): BufferLine => ({
  segments: [{ text, className: "text-tn-comment" }],
})

/** Helper: blank line */
const blank: BufferLine = { segments: [] }

/** Number of header lines (title + header fields + entries count + blank) */
const HEADER_SIZE =
  1 + Object.keys(projectsSection.header).length + 1 + 1

/** Build full list buffer: header + item lines */
function buildListLines(): BufferLine[] {
  const headerLines = Object.entries(projectsSection.header).map(
    ([key, value]) => cm(`# ${key}: ${value}`),
  )

  return [
    cm(`# ${projectsSection.title}`),
    ...headerLines,
    cm(`# Entries: ${projectsData.length}`),
    blank,
    ...projectsData.map((p) => ({
      segments: [
        { text: "- ", className: "text-tn-comment" },
        { text: "name", className: "text-tn-secondary" },
        { text: ": ", className: "text-tn-comment" },
        { text: p.name, className: "text-tn-green" },
        { text: " # press <enter> to open", className: "text-tn-comment" },
      ],
    })),
  ]
}

/** Indices of item lines in the list buffer */
const itemLineIndices = projectsData.map((_, i) => HEADER_SIZE + i)

/** Build detail lines with dynamic header fields */
function getDetailLines(project: Project): BufferLine[] {
  const headerEntries = Object.entries(project.header)
  const padLen = Math.max(...headerEntries.map(([k]) => k.length + 1)) + 1
  const headerLines = headerEntries.map(([key, value]) => {
    const padded = `${key}:`.padEnd(padLen)
    return cm(` * ${padded}${value}`)
  })

  return [
    cm(`/* ${project.page}`),
    cm(` * ${project.subtitle}`),
    ...headerLines,
    cm(` */`),
    blank,
    {
      segments: [
        { text: "tags = ", className: "text-tn-comment" },
        {
          text: `[${project.tags.map((t) => `"${t}"`).join(", ")}]`,
          className: "text-tn-green",
        },
      ],
    },
    blank,
    cm("// Description"),
    { segments: [{ text: project.description.trim() }] },
    ...(project.github
      ? [
          blank,
          cm("// Source"),
          {
            segments: [
              { text: project.github, className: "text-tn-accent" },
            ],
          } as BufferLine,
        ]
      : []),
    ...(project.url
      ? [
          blank,
          cm("// Live"),
          {
            segments: [
              { text: project.url, className: "text-tn-accent" },
            ],
          } as BufferLine,
        ]
      : []),
    ...(project.defaults
      ? [
          blank,
          cm("// Les defaults (selon moi)"),
          { segments: [{ text: project.defaults.trim() }] } as BufferLine,
        ]
      : []),
  ]
}

export default function Projects() {
  const listLines = buildListLines()

  return (
    <Section id="projects">
      <SplitView<Project>
        items={projectsData}
        listTitle={projectsSection.title}
        listLines={listLines}
        itemLineIndices={itemLineIndices}
        getDetailTitle={(p) => p.page}
        renderDetail={(project, active) => (
          <BufferView lines={getDetailLines(project)} active={active} />
        )}
      />
    </Section>
  )
}
