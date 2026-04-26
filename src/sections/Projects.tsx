/**
 * Section Projects — Personal projects showcase.
 *
 * Uses SplitView to display project cards with expandable detail.
 * Data: src/data/projects.ts
 */

import Section from "@/components/Section"
import SplitView from "@/components/SplitView"
import { projectsData } from "@/data/projects"

import type { Project } from "@/data/projects"

export default function Projects() {
  return (
    <Section id="projects">
      <SplitView<Project>
        items={projectsData}
        getKey={(p) => p.id}
        listTitle="projects/"
        getDetailTitle={(p) => `${p.id}.c`}
        renderItem={(project, isSelected) => (
          <div>
            <span className={isSelected ? "" : "text-tn-accent"}>{project.title}</span>
            <span className={`ml-1.5 text-[11px] ${isSelected ? "opacity-70" : "text-tn-comment"}`}>
              {project.subtitle}
            </span>
          </div>
        )}
        renderDetail={(project) => (
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="text-tn-accent font-bold">{project.title}</h3>
              <p className="text-tn-comment text-[11px]">{project.subtitle}</p>
            </div>
            <p className="text-[13px] leading-relaxed">{project.description}</p>
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
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-tn-accent text-[11px] hover:underline"
              >
                {project.github}
              </a>
            )}
          </div>
        )}
      />
    </Section>
  )
}
