/**
 * Section About — Presentation and philosophy.
 *
 * Renders Hugo's bio as a nvim buffer with line numbers and config-file style.
 * Data: src/data/about.ts
 */

import Section from "@/components/Section"
import NvimBuffer from "@/components/NvimBuffer"
import { aboutData } from "@/data/about"

export default function About() {
  const lines = [
    { content: <><span className="text-tn-comment">{"-- "}</span><span className="text-tn-accent font-bold">{aboutData.title}</span></>, },
    { content: <><span className="text-tn-comment">{"-- "}</span><span className="text-tn-secondary">{aboutData.tagline}</span></>, },
    { content: "", isBlank: true },
    { content: <span className="text-tn-secondary font-bold">{"-- Bio"}</span>, isComment: true },
    ...aboutData.bio.map((p) => ({
      content: <span>{p}</span>,
    })),
    { content: "", isBlank: true },
    { content: <span className="text-tn-secondary font-bold">{"-- Focus"}</span>, isComment: true },
    {
      content: (
        <div className="flex flex-wrap gap-1.5">
          {aboutData.focus.map((tag) => (
            <span
              key={tag}
              className="px-[10px] py-[2px] text-[11px] rounded bg-tn-accent/10 text-tn-accent border border-tn-accent/20"
            >
              {tag}
            </span>
          ))}
        </div>
      ),
    },
  ]

  return (
    <Section id="about">
      <NvimBuffer lines={lines} />
    </Section>
  )
}
