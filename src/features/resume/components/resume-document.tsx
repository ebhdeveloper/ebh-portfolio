import type { ResumeDocumentModel } from "../model/presentation";

export function ResumeDocument({ document: cv }: { document: ResumeDocumentModel }) {
  return (
    <article className="cv-document" lang={cv.locale} dir={cv.direction} aria-label={`${cv.basics.name} - ${cv.profileLabel} ${cv.headings.resume}`}>
      <header className="cv-document-header">
        <p className="cv-profile"><bdi lang="en">{cv.profileLabel}</bdi> / {cv.headings.curriculum}</p>
        <h1 lang={cv.basics.locale} dir={cv.basics.locale === "fa" ? "rtl" : "ltr"}>{cv.basics.name}</h1>
        {cv.basics.label && <p className="cv-role" lang={cv.basics.locale}>{cv.basics.label}</p>}
        {cv.location && <p className="cv-location">{cv.location}</p>}
        <div className="cv-contacts">{cv.contacts.map(contact => <a href={contact.url} key={contact.url} lang="en" dir="ltr">{contact.label}</a>)}</div>
      </header>
      {cv.basics.summary && <section className="cv-section"><h2>{cv.headings.profile}</h2><p lang={cv.basics.locale} dir={cv.basics.locale === "fa" ? "rtl" : "ltr"}>{cv.basics.summary}</p></section>}
      {!!cv.skills.length && <section className="cv-section"><h2>{cv.headings.expertise}</h2><dl className="cv-skills">{cv.skills.map(skill => <div key={skill.name}><dt lang={skill.locale}>{skill.name}</dt><dd lang="en" dir="ltr">{skill.keywords.join(" · ")}</dd></div>)}</dl></section>}
      {!!cv.work.length && <section className="cv-section"><h2>{cv.headings.experience}</h2>{cv.work.map(job => <div className="cv-entry" key={job.id} lang={job.locale} dir={job.locale === "fa" ? "rtl" : "ltr"}>
        <div className="cv-entry-heading"><h3>{job.company}</h3><span>{job.period}</span></div>
        <p className="cv-entry-role">{job.position} <span> / {job.location}</span></p>
        {!!job.highlights.length && <ul>{job.highlights.map((highlight, index) => <li key={index}>{highlight}</li>)}</ul>}
      </div>)}</section>}
      {!!cv.projects.length && <section className="cv-section"><h2>{cv.headings.projects}</h2>{cv.projects.map(project => <div className="cv-entry" key={project.id} lang={project.locale} dir={project.locale === "fa" ? "rtl" : "ltr"}>
        <h3>{project.title}</h3><p>{project.description}</p>
        {!!project.technologies.length && <p className="cv-technologies" lang="en" dir="ltr">{project.technologies.join(" · ")}</p>}
        {!!project.links.length && <div className="cv-project-links">{project.links.map(link => <a href={link.url} key={link.url}>{link.label}: <bdi lang="en" dir="ltr">{link.url.replace(/^https?:\/\//, "")}</bdi></a>)}</div>}
      </div>)}</section>}
      {!!cv.education.length && <section className="cv-section"><h2>{cv.headings.education}</h2>{cv.education.map((entry, index) => <div className="cv-entry" key={index} lang={entry.locale} dir={entry.locale === "fa" ? "rtl" : "ltr"}><h3>{entry.studyType} / {entry.area}</h3><p>{entry.institution}</p></div>)}</section>}
    </article>
  );
}
