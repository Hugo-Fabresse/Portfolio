/**
 * Section Experience — Professional experience and leadership.
 *
 * Uses SplitView to display experience entries with expandable detail.
 * Data: src/data/experience.ts
 */

import Section from "@/components/Section"
import SplitView from "@/components/SplitView"
import { experienceData } from "@/data/experience"

import type { Experience } from "@/data/experience"

export default function Experience() {
  return (
    <Section id="experience">
      <SplitView<Experience>
        items={experienceData}
        getKey={(e) => e.id}
        listTitle="experience.log"
        getDetailTitle={(e) => e.id}
        renderItem={(exp, isSelected) => (
          <div>
            <span className={isSelected ? "" : "text-tn-accent"}>{exp.role}</span>
            <span className={`ml-1.5 text-[11px] ${isSelected ? "opacity-70" : "text-tn-comment"}`}>
              @ {exp.organization}
            </span>
          </div>
        )}
        renderDetail={(exp) => (
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="text-tn-accent font-bold">{exp.role}</h3>
              <p className="text-tn-comment text-[11px]">
                {exp.organization} — {exp.type}
              </p>
              {exp.period && (
                <p className="text-tn-comment text-[11px]">{exp.period}</p>
              )}
            </div>
            <p className="text-[13px] leading-relaxed">{exp.description}</p>
          </div>
        )}
      />
    </Section>
  )
}
