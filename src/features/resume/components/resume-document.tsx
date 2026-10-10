import type { ResumeDocumentModel } from "../model/presentation";

export function ResumeDocument({ document: cv }: { document: ResumeDocumentModel }) {
  return (
    <article className="cv-document" lang="en" dir="ltr" aria-label={`${cv.basics.name} - ${cv.profileLabel} resume`}>
      <header className="cv-document-header">
        <p className="cv-profile">{cv.profileLabel} / Curriculum vitae</p>
        <h1>{cv.basics.name}</h1>
        {cv.basics.label && <p className="cv-role">{cv.basics.label}</p>}
        {cv.location && <p className="cv-location">{cv.location}</p>}
        <div className="cv-contacts">{cv.contacts.map(contact => <a href={contact.url} key={contact.url}>{contact.label}</a>)}</div>
      </header>
      {cv.basics.summary && <section className="cv-section"><h2>Profile</h2><p>{cv.basics.summary}</p></section>}
      {!!cv.skills.length && <section className="cv-section"><h2>Expertise</h2><dl className="cv-skills">{cv.skills.map(skill => <div key={skill.name}><dt>{skill.name}</dt><dd>{skill.keywords.join(" · ")}</dd></div>)}</dl></section>}
      {!!cv.work.length && <section className="cv-section"><h2>Experience</h2>{cv.work.map(job => <div className="cv-entry" key={job.id}>
        <div className="cv-entry-heading"><h3>{job.company}</h3><span>{job.period}</span></div>
        <p className="cv-entry-role">{job.position} <span> / {job.location}</span></p>
        {!!job.highlights.length && <ul>{job.highlights.map((highlight, index) => <li key={index}>{highlight}</li>)}</ul>}
      </div>)}</section>}
      {!!cv.projects.length && <section className="cv-section"><h2>Selected projects</h2>{cv.projects.map(project => <div className="cv-entry" key={project.id}>
        <h3>{project.title}</h3><p>{project.description}</p>
        {!!project.technologies.length && <p className="cv-technologies">{project.technologies.join(" · ")}</p>}
        {!!project.links.length && <div className="cv-project-links">{project.links.map(link => <a href={link.url} key={link.url}>{link.label}: {link.url.replace(/^https?:\/\//, "")}</a>)}</div>}
      </div>)}</section>}
      {!!cv.education.length && <section className="cv-section"><h2>Education</h2>{cv.education.map((entry, index) => <div className="cv-entry" key={index}><h3>{entry.studyType} / {entry.area}</h3><p>{entry.institution}</p></div>)}</section>}
    </article>
  );
}
