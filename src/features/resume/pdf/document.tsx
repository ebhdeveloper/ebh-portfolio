import { Document, Page, Text, View, Link, StyleSheet } from "@react-pdf/renderer";
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

export function ResumePdfDocument({ document: cv }: { document: ResumeDocumentModel }) {
  "use no memo";
  return <Document title={`${cv.basics.name} - ${cv.profileLabel} CV`} author={cv.basics.name} language="en" subject={`${cv.profileLabel} resume`}>
    <Page size="A4" style={styles.page} wrap>
      <View style={styles.header} wrap={false}>
        <Text style={styles.profile}>{cv.profileLabel.toUpperCase()} / CURRICULUM VITAE</Text>
        <Text style={styles.name}>{cv.basics.name}</Text>
        {cv.basics.label && <Text style={styles.role}>{cv.basics.label}</Text>}
        {cv.location && <Text style={styles.location}>{cv.location}</Text>}
        <View style={styles.contacts}>{cv.contacts.map(contact => <Link key={contact.url} src={contact.url} style={styles.link}>{contact.label}</Link>)}</View>
      </View>
      {cv.basics.summary && <View style={styles.section}><Text style={styles.sectionTitle} minPresenceAhead={55}>PROFILE</Text><Text orphans={3} widows={3}>{cv.basics.summary}</Text></View>}
      {!!cv.skills.length && <View style={styles.section}><Text style={styles.sectionTitle} minPresenceAhead={50}>EXPERTISE</Text>{cv.skills.map(skill => <View key={skill.name} style={styles.skill} wrap={false}><Text style={styles.skillName}>{skill.name}</Text><Text style={styles.skillWords}>{skill.keywords.join(" · ")}</Text></View>)}</View>}
      {!!cv.work.length && <View style={styles.section}><Text style={styles.sectionTitle} minPresenceAhead={80}>EXPERIENCE</Text>{cv.work.map(job => <View key={job.id} style={styles.entry}>
        <View wrap={job.company.length + job.position.length + (job.highlights[0]?.length ?? 0) > 1200}>
          <View style={styles.entryHeading}><Text style={styles.entryTitle}>{job.company}</Text><Text style={styles.period}>{job.period}</Text></View>
          <Text style={styles.jobRole}>{job.position} / {job.location}</Text>
          {job.highlights[0] && <View style={styles.bullet}><Text style={styles.bulletDot}>•</Text><Text style={styles.bulletText} orphans={3} widows={3}>{job.highlights[0]}</Text></View>}
        </View>
        {job.highlights.slice(1).map((highlight, index) => <View style={styles.bullet} key={index}><Text style={styles.bulletDot}>•</Text><Text style={styles.bulletText} orphans={3} widows={3}>{highlight}</Text></View>)}
      </View>)}</View>}
      {!!cv.projects.length && <View style={styles.section}><Text style={styles.sectionTitle} minPresenceAhead={65}>SELECTED PROJECTS</Text>{cv.projects.map(project => <View style={styles.entry} key={project.id}>
        <Text style={styles.entryTitle} minPresenceAhead={40}>{project.title}</Text><Text orphans={3} widows={3}>{project.description}</Text>
        {!!project.technologies.length && <Text style={styles.technologies}>{project.technologies.join(" · ")}</Text>}
        <View style={styles.projectLinks}>{project.links.map(link => <Link src={link.url} style={styles.link} key={link.url}>{link.label}: {link.url.replace(/^https?:\/\//, "")}</Link>)}</View>
      </View>)}</View>}
      {!!cv.education.length && <View style={styles.section}><Text style={styles.sectionTitle} minPresenceAhead={55}>EDUCATION</Text>{cv.education.map((entry, index) => <View style={styles.entry} key={index} wrap={false}><Text style={styles.entryTitle}>{entry.studyType} / {entry.area}</Text><Text style={styles.muted}>{entry.institution}</Text></View>)}</View>}
      <Text style={styles.footer} fixed render={({ pageNumber, totalPages }) => `${cv.basics.name} / ${cv.profileLabel}    ${pageNumber} / ${totalPages}`} />
    </Page>
  </Document>;
}
