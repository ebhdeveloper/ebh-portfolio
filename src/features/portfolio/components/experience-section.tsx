import { getTranslations } from "next-intl/server";
import type { WorkExperience } from "@/lib/resume/types";

export async function ExperienceSection({ work }: { work: WorkExperience[] }) {
  const t = await getTranslations("Portfolio");
  return (
    <section id="experience" className="pf-experience" aria-labelledby="experience-title">
      <div className="pf-experience-intro">
        <p className="pf-eyebrow">02 / {t("experienceKicker")}</p>
        <h2 id="experience-title">{t("experienceTitle")}</h2>
        <p className="pf-description">{t("experienceDescription")}</p>
      </div>
      <div className="pf-jobs">
        {work.length === 0 && <p className="pf-description">{t("noExperience")}</p>}
        {work.map((job) => (
          <details className="pf-job" key={job.id}>
            <summary>
              <span lang="en" dir="ltr" className="pf-job-heading"><strong>{job.company}</strong><span>{job.position}</span></span>
              <span className="pf-job-date" dir="ltr"><time dateTime={job.startDate}>{job.startDate.slice(0, 4)}</time> — {job.endDate ? <time dateTime={job.endDate}>{job.endDate.slice(0, 4)}</time> : t("current")}</span>
              <span className="pf-job-plus" aria-hidden="true">+</span>
            </summary>
            <div className="pf-job-details" lang="en" dir="ltr">
              <p>{job.location}</p>
              <ul>{job.highlights.map((highlight, index) => <li key={index}>{highlight}</li>)}</ul>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
