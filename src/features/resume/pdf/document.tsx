import { Document, Page, Text, View, Link, StyleSheet } from "@react-pdf/renderer";
import type { ResumeLocale } from "@/lib/resume/types";
import type { ResumeDocumentModel } from "../model/presentation";

const styles = StyleSheet.create({
  page: { fontFamily: "ResumeMontserrat", fontWeight: 500, fontSize: 9, lineHeight: 1.55, color: "#102c44", backgroundColor: "#ffffff", paddingTop: 40, paddingBottom: 64, paddingHorizontal: 44 },
  header: { borderBottomWidth: 2, borderBottomColor: "#215b88", paddingBottom: 16, marginBottom: 16 },
  profile: { fontSize: 8, letterSpacing: 1.2, fontWeight: 700, color: "#215b88", marginBottom: 5 },
  name: { fontSize: 28, fontWeight: 700, letterSpacing: -1, lineHeight: 1.2 },
  role: { fontSize: 12, color: "#215b88", marginTop: 5 },
  muted: { color: "#4b6378" },
  location: { color: "#4b6378", fontSize: 8, marginTop: 5 },
  contacts: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
  link: { color: "#215b88", textDecoration: "none", fontSize: 7.5 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "#215b88", borderBottomWidth: 0.6, borderBottomColor: "#c5d8e8", paddingBottom: 5, marginBottom: 8 },
  entry: { marginBottom: 10 },
  entryHeading: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", gap: 10 },
  entryTitle: { fontWeight: 700, fontSize: 10, flexShrink: 1 },
  period: { fontSize: 7.5, color: "#4b6378", flexShrink: 0 },
  jobRole: { fontSize: 8, color: "#215b88", marginTop: 2, marginBottom: 5 },
  bullet: { flexDirection: "row", gap: 6, marginBottom: 3 },
  bulletDot: { color: "#215b88", width: 5 },
  bulletText: { flex: 1 },
  skill: { flexDirection: "row", gap: 12, marginBottom: 5 },
  skillName: { width: 128, fontWeight: 700, fontSize: 8 },
  skillWords: { flex: 1, color: "#4b6378", fontSize: 8 },
  technologies: { fontSize: 7.5, color: "#4b6378", marginTop: 3 },
  projectLinks: { gap: 2, marginTop: 4 },
  footer: { position: "absolute", top: 785, left: 44, right: 44, borderTopWidth: 0.6, borderTopColor: "#c5d8e8", paddingTop: 7, color: "#4b6378", fontSize: 7, textAlign: "right" },
});

function languageStyle(locale: ResumeLocale) {
  return { fontFamily: locale === "fa" ? "ResumeIranSans" : "ResumeMontserrat", direction: locale === "fa" ? "rtl" as const : "ltr" as const, textAlign: locale === "fa" ? "right" as const : "left" as const };
}

export function ResumePdfDocument({ document: cv }: { document: ResumeDocumentModel }) {
  "use no memo";
  const row = cv.locale === "fa" ? { flexDirection: "row-reverse" as const } : {};
  const plain = cv.locale === "fa" ? { letterSpacing: 0 } : {};
  return <Document title={`${cv.basics.name} - ${cv.profileLabel} CV`} author={cv.basics.name} language={cv.locale} subject={`${cv.profileLabel} ${cv.headings.resume}`}>
    <Page size="A4" style={[styles.page, languageStyle(cv.locale), cv.locale === "fa" ? { fontWeight: 400, fontSize: 9.5, lineHeight: 1.55 } : {}]} wrap>
      <View style={styles.header} wrap={false}>
        <Text style={[styles.profile, plain]}>{cv.profileLabel} / {cv.headings.curriculum}</Text>
        <Text style={[styles.name, languageStyle(cv.basics.locale), plain]}>{cv.basics.name}</Text>
        {cv.basics.label && <Text style={[styles.role, languageStyle(cv.basics.locale)]}>{cv.basics.label}</Text>}
        {cv.location && <Text style={styles.location}>{cv.location}</Text>}
        <View style={[styles.contacts, row]}>{cv.contacts.map(contact => <Link key={contact.url} src={contact.url} style={[styles.link, languageStyle("en")]}>{contact.label}</Link>)}</View>
      </View>
      {cv.basics.summary && <View style={styles.section}><Text style={[styles.sectionTitle, plain]} minPresenceAhead={55}>{cv.headings.profile}</Text><Text style={languageStyle(cv.basics.locale)} orphans={3} widows={3}>{cv.basics.summary}</Text></View>}
      {!!cv.skills.length && <View style={styles.section}><Text style={[styles.sectionTitle, plain]} minPresenceAhead={50}>{cv.headings.expertise}</Text>{cv.skills.map(skill => <View key={skill.name} style={[styles.skill, row]} wrap={false}><Text style={[styles.skillName, languageStyle(skill.locale)]}>{skill.name}</Text><Text style={[styles.skillWords, languageStyle("en")]}>{skill.keywords.join(" · ")}</Text></View>)}</View>}
      {!!cv.work.length && <View style={styles.section}><Text style={[styles.sectionTitle, plain]} minPresenceAhead={80}>{cv.headings.experience}</Text>{cv.work.map(job => <View key={job.id} style={styles.entry}>
        <View wrap={job.company.length + job.position.length + (job.highlights[0]?.length ?? 0) > 1200}>
          <View style={[styles.entryHeading, job.locale === "fa" ? { flexDirection: "row-reverse" } : {}]}><Text style={[styles.entryTitle, languageStyle(job.locale)]}>{job.company}</Text><Text style={[styles.period, languageStyle(cv.locale)]}>{job.period}</Text></View>
          <Text style={[styles.jobRole, languageStyle(job.locale)]}>{job.position} / {job.location}</Text>
          {job.highlights[0] && <View style={[styles.bullet, job.locale === "fa" ? { flexDirection: "row-reverse" } : {}]}><Text style={styles.bulletDot}>•</Text><Text style={[styles.bulletText, languageStyle(job.locale)]} orphans={3} widows={3}>{job.highlights[0]}</Text></View>}
        </View>
        {job.highlights.slice(1).map((highlight, index) => <View style={[styles.bullet, job.locale === "fa" ? { flexDirection: "row-reverse" } : {}]} key={index}><Text style={styles.bulletDot}>•</Text><Text style={[styles.bulletText, languageStyle(job.locale)]} orphans={3} widows={3}>{highlight}</Text></View>)}
      </View>)}</View>}
      {!!cv.projects.length && <View style={styles.section}><Text style={[styles.sectionTitle, plain]} minPresenceAhead={110}>{cv.headings.projects}</Text>{cv.projects.map(project => <View style={styles.entry} key={project.id} wrap={project.description.length > 1200}>
        <Text style={[styles.entryTitle, languageStyle(project.locale)]} minPresenceAhead={40}>{project.title}</Text><Text style={languageStyle(project.locale)} orphans={3} widows={3}>{project.description}</Text>
        {!!project.technologies.length && <Text style={[styles.technologies, languageStyle("en")]}>{project.technologies.join(" · ")}</Text>}
        <View style={styles.projectLinks}>{project.links.map(link => <View key={link.url} style={{ flexDirection: cv.locale === "fa" ? "row-reverse" : "row", gap: 4 }}><Text style={styles.link}>{link.label}:</Text><Link src={link.url} style={[styles.link, languageStyle("en")]}>{link.url.replace(/^https?:\/\//, "")}</Link></View>)}</View>
      </View>)}</View>}
      {!!cv.education.length && <View style={styles.section} wrap={false}><Text style={[styles.sectionTitle, plain]} minPresenceAhead={55}>{cv.headings.education}</Text>{cv.education.map((entry, index) => <View style={styles.entry} key={index} wrap={false}><Text style={[styles.entryTitle, languageStyle(entry.locale)]}>{entry.studyType} / {entry.area}</Text><Text style={[styles.muted, languageStyle(entry.locale)]}>{entry.institution}</Text></View>)}</View>}
      <Text style={styles.footer} fixed render={({ pageNumber, totalPages }) => `${cv.basics.name} / ${cv.profileLabel}    ${pageNumber} / ${totalPages}`} />
    </Page>
  </Document>;
}
