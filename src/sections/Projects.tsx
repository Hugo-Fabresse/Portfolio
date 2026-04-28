/**
 * Section Projects — Personal projects showcase.
 *
 * Uses SplitView with BufferView for list and detail panels.
 * Data: src/data/projects.ts
 */

import Section from "@/components/Section"
import SplitView from "@/components/SplitView"
import BufferView from "@/components/BufferView"
import { projectsData } from "@/data/projects"

import type { Project } from "@/data/projects"
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
    cm("# projects.yml"),
    cm("# Author: Hugo Fabresse"),
    cm("# Last modified: 2026-04-27"),
    cm("# Status: active"),
    cm(`# Entries: ${projectsData.length}`),
    blank,
    ...projectsData.map((p) => ({
      segments: [
        { text: "- ", className: "text-tn-comment" },
        { text: "name", className: "text-tn-secondary" },
        { text: ": ", className: "text-tn-comment" },
        { text: p.title, className: "text-tn-green" },
        { text: " # press <enter> to open", className: "text-tn-comment" },
      ],
    })),
  ]
}

/** Indices of item lines in the list buffer */
const itemLineIndices = projectsData.map((_, i) => HEADER_SIZE + i)

/** Build detail lines with C-style file header */
function getDetailLines(project: Project): BufferLine[] {
  return [
    cm(`/* ${project.id}.c`),
    cm(` * ${project.subtitle}`),
    cm(` * Author:   Hugo Fabresse`),
    cm(` * Created:  ${project.created}`),
    cm(` * Status:   ${project.status}`),
    cm(` * Language: ${project.language}`),
    cm(` * License:  ${project.license}`),
    cm(` */`),
    blank,
    { segments: [
      { text: "tags = ", className: "text-tn-comment" },
      { text: `[${project.tags.map((t) => `"${t}"`).join(", ")}]`, className: "text-tn-green" },
    ] },
    blank,
    cm("// Description"),
    { segments: [{ text: project.description }] },
    ...(project.github
      ? [
          blank,
          cm("// Source"),
          { segments: [{ text: project.github, className: "text-tn-accent" }] } as BufferLine,
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
        listTitle="projects.yml"
        listLines={listLines}
        itemLineIndices={itemLineIndices}
        getDetailTitle={(p) => `${p.id}.c`}
        renderDetail={(project, active) => (
          <BufferView lines={getDetailLines(project)} active={active} />
        )}
      />
    </Section>
  )
}
