/**
 * Section Skills — Technical skills and certifications.
 *
 * Uses SplitView to display skill categories with item lists.
 * Data: src/data/skills.ts
 */

import Section from "@/components/Section"
import SplitView from "@/components/SplitView"
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
          <div>
            <span className={isSelected ? "" : "text-tn-accent"}>{category.title}</span>
            <span className={`ml-1.5 text-[11px] ${isSelected ? "opacity-70" : "text-tn-comment"}`}>
              ({category.items.length})
            </span>
          </div>
        )}
        renderDetail={(category) => (
          <div className="flex flex-col gap-3">
            <h3 className="text-tn-accent font-bold">{category.title}</h3>
            {category.description && (
              <p className="text-[13px] leading-relaxed">{category.description}</p>
            )}
            <ul className="flex flex-col gap-1">
              {category.items.map((item) => (
                <li key={item} className="text-[13px]">
                  <span className="text-tn-comment mr-1.5">-</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      />
    </Section>
  )
}
