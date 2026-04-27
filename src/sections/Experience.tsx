/**
 * Section Experience — Professional experience and leadership.
 *
 * Uses SplitView with NvimBuffer-styled content in both
 * list items and detail panels.
 * Data: src/data/experience.ts
 */

import Section from "@/components/Section"
import SplitView from "@/components/SplitView"
import NvimBuffer from "@/components/NvimBuffer"
import { experienceData } from "@/data/experience"

import type { Experience } from "@/data/experience"

export default function Experience() {
  return (
    <Section id="experience">
      <SplitView<Experience>
        items={experienceData}
        getKey={(e) => e.id}
        listTitle="experience.log"
        getItemText={(e) => `${e.role} @ ${e.organization}`}
        getDetailTitle={(e) => `${e.id}.log`}
        renderItem={(exp) => (
          <div className="font-mono text-[13px]">
            <span className="text-tn-accent">{exp.role}</span>
            <span className="ml-1.5 text-[11px] text-tn-comment">@ {exp.organization}</span>
          </div>
        )}
        renderDetail={(exp) => (
          <NvimBuffer
            lines={[
              { content: <><span className="text-tn-comment">{"-- "}</span><span className="text-tn-accent font-bold">{exp.role}</span></> },
              { content: <><span className="text-tn-comment">{"-- "}</span><span className="text-tn-secondary">{exp.organization}</span></> },
              { content: "", isBlank: true },
              { content: <><span className="text-tn-comment">{"-- "}</span><span className="text-tn-secondary font-bold">Type</span></>, isComment: true },
              { content: <span className="text-tn-green">{exp.type}</span> },
              ...(exp.period
                ? [
                    { content: "", isBlank: true },
                    { content: <><span className="text-tn-comment">{"-- "}</span><span className="text-tn-secondary font-bold">Period</span></>, isComment: true },
                    { content: <span>{exp.period}</span> },
                  ]
                : []),
              { content: "", isBlank: true },
              { content: <><span className="text-tn-comment">{"-- "}</span><span className="text-tn-secondary font-bold">Description</span></>, isComment: true },
              { content: <span>{exp.description}</span> },
            ]}
          />
        )}
      />
    </Section>
  )
}
