/**
 * Section Projects — Personal projects showcase.
 *
 * Uses SplitView with NvimBuffer-styled content in both
 * list items and detail panels.
 * Data: src/data/projects.ts
 */

import Section from "@/components/Section"
import SplitView from "@/components/SplitView"
import NvimBuffer from "@/components/NvimBuffer"
import { projectsData } from "@/data/projects"

import type { Project } from "@/data/projects"

export default function Projects() {
  return (
    <Section id="projects">
      <SplitView<Project>
        items={projectsData}
        getKey={(p) => p.id}
        listTitle="projects.yml"
        getItemText={(p) => `- name: ${p.title}`}
        getDetailTitle={(p) => `${p.id}.c`}
        renderItem={(project) => (
          <div className="font-mono text-[13px]">
            <span className="text-tn-comment">{"- "}</span>
            <span className="text-tn-secondary">{"name"}</span>
            <span className="text-tn-comment">: </span>
            <span className="text-tn-green">{project.title}</span>
          </div>
        )}
        renderDetail={(project) => (
          <NvimBuffer
            lines={[
              { content: <><span className="text-tn-comment">{"-- "}</span><span className="text-tn-accent font-bold">{project.title}</span></> },
              { content: <><span className="text-tn-comment">{"-- "}</span><span className="text-tn-secondary">{project.subtitle}</span></> },
              { content: "", isBlank: true },
              { content: <span className="text-tn-secondary font-bold">{"-- Description"}</span>, isComment: true },
              { content: <span>{project.description}</span> },
              { content: "", isBlank: true },
              { content: <span className="text-tn-secondary font-bold">{"-- Stack"}</span>, isComment: true },
              {
                content: (
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-[10px] py-[2px] text-[11px] rounded bg-tn-green/10 text-tn-green border border-tn-green/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ),
              },
              ...(project.github
                ? [
                    { content: "", isBlank: true },
                    { content: <><span className="text-tn-comment">{"-- "}</span><span className="text-tn-secondary font-bold">Source</span></>, isComment: true },
                    {
                      content: (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-tn-accent hover:underline"
                        >
                          {project.github}
                        </a>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        )}
      />
    </Section>
  )
}
