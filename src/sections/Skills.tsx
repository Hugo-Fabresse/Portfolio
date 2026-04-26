/**
 * Section Skills — Technical skills and certifications.
 *
 * Uses SplitView with NvimBuffer-styled content in both
 * list items and detail panels.
 * Data: src/data/skills.ts
 */

import Section from "@/components/Section"
import SplitView from "@/components/SplitView"
import NvimBuffer from "@/components/NvimBuffer"
import { skillsData } from "@/data/skills"

import type { SkillCategory } from "@/data/skills"

export default function Skills() {
  return (
    <Section id="skills">
      <SplitView<SkillCategory>
        items={skillsData}
        getKey={(s) => s.id}
        listTitle="skills.toml"
        getDetailTitle={(s) => `[${s.id}]`}
        renderItem={(category, isSelected) => (
          <div className="font-mono text-[13px]">
            <span className={isSelected ? "" : "text-tn-accent"}>
              {category.title}
            </span>
            <span className={`ml-1.5 text-[11px] ${isSelected ? "opacity-70" : "text-tn-comment"}`}>
              ({category.items.length})
            </span>
          </div>
        )}
        renderDetail={(category) => (
          <NvimBuffer
            lines={[
              { content: <><span className="text-tn-comment">{"-- "}</span><span className="text-tn-accent font-bold">{category.title}</span></> },
              { content: "", isBlank: true },
              ...(category.description
                ? [
                    { content: <><span className="text-tn-comment">{"-- "}</span><span className="text-tn-secondary font-bold">Description</span></>, isComment: true },
                    { content: <span>{category.description}</span> },
                    { content: "", isBlank: true },
                  ]
                : []),
              { content: <><span className="text-tn-comment">{"-- "}</span><span className="text-tn-secondary font-bold">Items</span></>, isComment: true },
              ...category.items.map((item) => ({
                content: <><span className="text-tn-green">{"- "}</span><span>{item}</span></>,
              })),
            ]}
          />
        )}
      />
    </Section>
  )
}
