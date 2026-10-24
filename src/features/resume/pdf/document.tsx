import { Document, Page, Text, View, Link, StyleSheet } from "@react-pdf/renderer";
import type { ResumeLocale } from "@/lib/resume/types";
import type { ResumeDocumentModel } from "../model/presentation";

const styles = StyleSheet.create({
  page: { fontFamily: "ResumeMontserrat", fontWeight: 500, fontSize: 9.5, lineHeight: 1.3, color: "#102c44", backgroundColor: "#ffffff", paddingTop: 26, paddingBottom: 38, paddingHorizontal: 32 },
  header: { borderBottomWidth: 1.2, borderBottomColor: "#215b88", paddingBottom: 7, marginBottom: 6 },
  name: { fontSize: 23, fontWeight: 700, lineHeight: 1.1 },
  role: { fontSize: 10.5, color: "#215b88", marginTop: 3 },
  meta: { color: "#4b6378", fontSize: 8.5, marginTop: 3 },
  contacts: { flexDirection: "row", flexWrap: "wrap", columnGap: 10, rowGap: 2, marginTop: 4 },
  contact: { flexDirection: "row", gap: 3, maxWidth: "100%" },
  link: { color: "#215b88", textDecoration: "none", fontSize: 8.3 },
  section: { marginBottom: 4 },
  sectionTitle: { fontSize: 9, fontWeight: 700, color: "#215b88", borderBottomWidth: 0.5, borderBottomColor: "#c5d8e8", paddingBottom: 2, marginBottom: 3 },
  entry: { marginBottom: 4 },
  entryHeading: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 2 },
  entryTitle: { fontSize: 9.3, flexShrink: 1 },
  bold: { fontWeight: 700 },
  jobRole: { fontSize: 8.6, color: "#215b88" },
  period: { fontSize: 8.1, color: "#4b6378", flexShrink: 0 },
  bullet: { flexDirection: "row", gap: 5, marginBottom: 1.5 },
  bulletDot: { color: "#215b88", width: 4 },
  bulletText: { flex: 1 },
  skill: { fontSize: 8.7, marginBottom: 2 },
  muted: { color: "#4b6378" },
  project: { marginBottom: 3.5, fontSize: 8.8 },
  compactProject: { flexDirection: "row", alignItems: "baseline", gap: 8, marginBottom: 3.5 },
  compactProjectTitle: { fontWeight: 700, fontSize: 8.8, flexShrink: 0 },
  compactProjectLinks: { flex: 1, marginTop: 0 },
  projectHeading: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 1 },
  projectTitle: { fontWeight: 700, flexShrink: 0 },
  projectTechnologies: { fontSize: 8, flexShrink: 1 },
  projectLinks: { flexDirection: "row", flexWrap: "wrap", columnGap: 10, rowGap: 2, marginTop: 1 },
  compactRow: { flexDirection: "row", flexWrap: "wrap", columnGap: 14, rowGap: 2, fontSize: 8.7 },
  education: { fontSize: 8.7 },
  footer: { position: "absolute", top: 818, left: 32, right: 32, color: "#4b6378", fontSize: 7, textAlign: "right" },
});

function languageStyle(locale: ResumeLocale) {
  return { fontFamily: locale === "fa" ? "ResumeIranSans" : "ResumeMontserrat", direction: locale === "fa" ? "rtl" as const : "ltr" as const, textAlign: locale === "fa" ? "right" as const : "left" as const };
}

export function ResumePdfDocument({ document: cv }: { document: ResumeDocumentModel }) {
  "use no memo";
  const row = cv.locale === "fa" ? { flexDirection: "row-reverse" as const } : {};
  return (
    <Document title={cv.basics.name + " - " + cv.profileLabel + " CV"} author={cv.basics.name} language={cv.locale} subject={cv.profileLabel + " " + cv.headings.resume}>
      <Page size="A4" style={[styles.page, languageStyle(cv.locale), cv.locale === "fa" ? { fontWeight: 400, fontSize: 10, lineHeight: 1.3 } : {}]} wrap>
        <View style={styles.header} wrap={false}>
          <Text style={[styles.name, languageStyle(cv.basics.locale)]}>{cv.basics.name}</Text>
          {cv.basics.label && <Text style={[styles.role, languageStyle(cv.basics.locale)]}>{cv.basics.label}</Text>}
          {(cv.location || cv.basics.availability) && <Text style={[styles.meta, languageStyle(cv.basics.locale)]}><Text style={languageStyle(cv.locationLocale)}>{cv.location}</Text>{cv.location && cv.basics.availability ? " | " : ""}{cv.basics.availability}</Text>}
          <View style={[styles.contacts, row]}>{cv.contacts.map(contact => (
            <View key={contact.url} style={[styles.contact, row]}>
              {contact.url === cv.basics.portfolio && <Text style={[styles.link, languageStyle(cv.locale)]}>{cv.headings.portfolio}:</Text>}
              <Link src={contact.url} style={[styles.link, languageStyle("en")]}>{contact.label}</Link>
            </View>
          ))}</View>
        </View>
        {cv.basics.summary && <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={30}>{cv.headings.profile}</Text>
          <Text style={languageStyle(cv.basics.locale)} orphans={2} widows={2}>{cv.basics.summary}</Text>
        </View>}
        {!!cv.skills.length && <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={25}>{cv.headings.expertise}</Text>
          {cv.skills.map(skill => <View key={skill.name} style={styles.skill} wrap={false}>
            <Text style={languageStyle(skill.locale)}><Text style={styles.bold}>{skill.name}: </Text><Text style={[styles.muted, languageStyle("en")]}>{skill.keywords.join(", ")}</Text></Text>
          </View>)}
        </View>}
        {!!cv.work.length && <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={40}>{cv.headings.experience}</Text>
          {cv.work.map(job => <View key={job.id} style={styles.entry} wrap={job.highlights.join(" ").length > 1200}>
            <View wrap={job.company.length + job.position.length + (job.highlights[0]?.length ?? 0) > 1200}>
              <View style={[styles.entryHeading, job.locale === "fa" ? { flexDirection: "row-reverse" } : {}]}>
                <Text style={[styles.entryTitle, languageStyle(job.locale)]}><Text style={styles.bold}>{job.company}</Text><Text style={styles.jobRole}> | {job.position}{job.location ? " / " + job.location : ""}</Text></Text>
                <Text style={[styles.period, languageStyle(cv.locale)]}>{job.period}</Text>
              </View>
              {job.highlights[0] && <View style={[styles.bullet, job.locale === "fa" ? { flexDirection: "row-reverse" } : {}]}>
                <Text style={styles.bulletDot}>•</Text><Text style={[styles.bulletText, languageStyle(job.locale)]} orphans={2} widows={2}>{job.highlights[0]}</Text>
              </View>}
            </View>
            {job.highlights.slice(1).map((highlight, index) => <View style={[styles.bullet, job.locale === "fa" ? { flexDirection: "row-reverse" } : {}]} key={index}>
              <Text style={styles.bulletDot}>•</Text><Text style={[styles.bulletText, languageStyle(job.locale)]} orphans={2} widows={2}>{highlight}</Text>
            </View>)}
          </View>)}
        </View>}
        {!!cv.projects.length && <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={35}>{cv.headings.projects}</Text>
          {cv.projects.map(project => cv.compactProjects && project.links.length ? <View style={[styles.compactProject, row]} key={project.id} wrap={false}>
            <Text style={[styles.compactProjectTitle, languageStyle(project.locale)]}>{project.title}</Text>
            <View style={[styles.projectLinks, styles.compactProjectLinks, row]}>{project.links.map(link => <View key={link.url} style={[styles.contact, row]}>
              <Text style={[styles.link, languageStyle(cv.locale)]}>{link.label}:</Text><Link src={link.url} style={[styles.link, languageStyle("en")]}>{link.url.replace(/^https?:\/\//, "")}</Link>
            </View>)}</View>
          </View> : <View style={styles.project} key={project.id} wrap={project.description.length > 1200}>
            {project.locale === "fa" ? <>
              <View style={styles.projectHeading}>
                <Text style={[styles.projectTitle, languageStyle("fa")]}>{project.title}</Text>
                {!!project.technologies.length && <Text style={[styles.projectTechnologies, styles.muted, languageStyle("en")]}>{project.technologies.join(", ")}</Text>}
              </View>
              <Text style={languageStyle("fa")} orphans={2} widows={2}>{project.description}</Text>
            </> : <Text style={languageStyle(project.locale)} orphans={2} widows={2}><Text style={styles.bold}>{project.title}: </Text>{project.description}{!!project.technologies.length && <Text style={[styles.muted, languageStyle("en")]}> ({project.technologies.join(", ")})</Text>}</Text>}
            {!!project.links.length && <View style={[styles.projectLinks, row]}>{project.links.map(link => <View key={link.url} style={[styles.contact, row]}>
              <Text style={[styles.link, languageStyle(cv.locale)]}>{link.label}:</Text><Link src={link.url} style={[styles.link, languageStyle("en")]}>{link.url.replace(/^https?:\/\//, "")}</Link>
            </View>)}</View>}
          </View>)}
        </View>}
        {!!cv.languages.length && <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle} minPresenceAhead={20}>{cv.headings.languages}</Text>
          <View style={[styles.compactRow, row]}>{cv.languages.map(entry => <Text key={entry.language} style={languageStyle(entry.locale)}>{entry.language}: {entry.fluency}</Text>)}</View>
        </View>}
        {!!cv.education.length && <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle} minPresenceAhead={20}>{cv.headings.education}</Text>
          {cv.education.map((entry, index) => <Text style={[styles.education, languageStyle(entry.locale)]} key={index}><Text style={styles.bold}>{entry.studyType} / {entry.area}</Text><Text style={styles.muted}> | {entry.institution}</Text></Text>)}
        </View>}
        <Text style={styles.footer} fixed render={({ pageNumber, totalPages }) => totalPages > 1 ? pageNumber + " / " + totalPages : ""} />
      </Page>
    </Document>
  );
}
