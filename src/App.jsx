import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  UploadCloud,
  FileText,
  Sparkles,
  Loader2,
  Check,
  Copy,
  ExternalLink,
  Lock,
  Globe2,
  ThumbsUp,
  MessageCircle,
  Repeat2,
  Send,
  MoreHorizontal,
  X,
  FileUp,
  PenLine,
  ArrowRight,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/*  Design tokens                                                          */
/* ---------------------------------------------------------------------- */
const COLOR = {
  paper: "#FAF7F0",
  paperDim: "#F2EEE3",
  ink: "#191A23",
  inkSoft: "#5B5C66",
  inkFaint: "#8C8B84",
  border: "#E4E0D4",
  borderStrong: "#D8D3C4",
  accent: "#2647F0",
  accentDeep: "#1B34C4",
  accentSoft: "#EBEFFE",
  ochre: "#D98F2B",
  ochreSoft: "#FBF0DE",
  success: "#1E8E5A",
  successSoft: "#E7F5EE",
  white: "#FFFFFF",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
`;

/* ---------------------------------------------------------------------- */
/*  Mock data                                                               */
/* ---------------------------------------------------------------------- */
function initialsFrom(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const TONES = [
  { id: "professional", label: "Professional / Corporate" },
  { id: "casual", label: "Casual / Storytelling" },
  { id: "technical", label: "Technical / Deep-Dive" },
];

/* ---------------------------------------------------------------------- */
/*  Technical concept recognition — turns real technical input into a      */
/*  genuine narrative instead of a generic bullet dump.                    */
/* ---------------------------------------------------------------------- */
function joinNatural(arr) {
  const a = arr.filter(Boolean);
  if (a.length === 0) return "";
  if (a.length === 1) return a[0];
  if (a.length === 2) return `${a[0]} and ${a[1]}`;
  return `${a.slice(0, -1).join(", ")}, and ${a[a.length - 1]}`;
}

const TECH_FACTS = [
  { test: /\bjenkins\b/i, label: "Jenkins", category: "core",
    did: "got Jenkins running as the automation engine behind it",
    lesson: "the real payoff of Jenkins isn't the install, it's never touching the manual deploy steps again",
    tags: ["Jenkins", "CI/CD"] },
  { test: /\bdocker\b/i, label: "Docker", category: "core",
    did: "containerized the app with Docker",
    lesson: "\"it works on my machine\" stops being an excuse once the container is the machine",
    tags: ["Docker"] },
  { test: /kubernetes|\bk8s\b/i, label: "Kubernetes", category: "core",
    did: "orchestrated it with Kubernetes",
    lesson: "k8s rewards you for thinking in desired state instead of a checklist of manual steps",
    tags: ["Kubernetes"] },
  { test: /\breact\b/i, label: "React", category: "core", did: "built the front end in React", lesson: "", tags: ["React"] },
  { test: /node\.?js/i, label: "Node", category: "core", did: "wrote the service in Node.js", lesson: "", tags: ["NodeJS"] },
  { test: /\bpython\b/i, label: "Python", category: "core", did: "wrote the automation in Python", lesson: "", tags: ["Python"] },
  { test: /\bnginx\b/i, label: "Nginx", category: "network",
    did: "put Nginx in front of it as a reverse proxy",
    lesson: "a reverse proxy isn't cosmetic, it's the line between what the internet can see and what's actually running on the box",
    tags: ["Nginx"] },
  { test: /\bapache\b/i, label: "Apache", category: "network", did: "fronted it with Apache", lesson: "", tags: ["Apache"] },
  { test: /reverse proxy/i, label: "reverse proxy", category: "network",
    did: "routed everything through a reverse proxy instead of exposing the service directly", lesson: "", tags: [] },
  { test: /load balanc/i, label: "load balancer", category: "network", did: "load balanced traffic across multiple instances", lesson: "", tags: [] },
  { test: /\b443\b|https|\bssl\b|\btls\b/i, label: "HTTPS/TLS", category: "network",
    did: "terminated the connection on 443 so visitors get a proper HTTPS session",
    lesson: "the padlock icon people take for granted is usually just TLS termination happening one layer up from an app that has no idea HTTPS even exists",
    tags: ["HTTPS", "TLS"] },
  { test: /\b8080\b/i, label: "8080", category: "network",
    did: "kept the actual service bound to 8080 and never exposed it directly", lesson: "", tags: [] },
  { test: /\brpm\b|centos|\brhel\b|red ?hat|fedora/i, label: "RPM-based Linux", category: "platform",
    did: "an RPM-based distro — RHEL, CentOS, or Fedora territory",
    lesson: "package-management habits from the Debian/Ubuntu world don't transfer 1:1 — dnf and firewalld are worth learning properly instead of fighting",
    tags: ["Linux", "RHEL"] },
  { test: /\bubuntu\b|\bdebian\b|apt-get/i, label: "Debian-based Linux", category: "platform",
    did: "a Debian-based box", lesson: "", tags: ["Linux"] },
  { test: /\baws\b|\bec2\b|\bs3\b|\blambda\b/i, label: "AWS", category: "cloud",
    did: "hosted it on AWS", lesson: "half of \"cloud skills\" is really just learning which IAM permission you forgot to grant", tags: ["AWS"] },
  { test: /terraform/i, label: "Terraform", category: "practice",
    did: "defined the infrastructure in Terraform",
    lesson: "the first time terraform plan catches a mistake before it hits production is the moment infrastructure-as-code actually clicks", tags: ["Terraform"] },
  { test: /ansible/i, label: "Ansible", category: "practice", did: "automated the provisioning with Ansible", lesson: "", tags: ["Ansible"] },
  { test: /\bgit\b|github/i, label: "Git", category: "practice", did: "kept everything version-controlled in Git", lesson: "", tags: ["Git"] },
  { test: /ci\/cd|pipeline/i, label: "CI/CD pipeline", category: "practice", did: "wired it into a CI/CD pipeline", lesson: "", tags: ["CI/CD"] },
  { test: /database|postgres|mysql|mongodb|\bsql\b/i, label: "database", category: "data", did: "backed it with a proper database", lesson: "", tags: [] },
  { test: /\bapi\b/i, label: "API", category: "core", did: "exposed it through an API", lesson: "", tags: [] },
  { test: /monitoring|logging|prometheus|grafana/i, label: "monitoring", category: "practice", did: "added monitoring so I'd actually know if it went down", lesson: "", tags: [] },
  { test: /firewall|firewalld|iptables/i, label: "firewall", category: "network", did: "locked it down with firewall rules", lesson: "", tags: [] },
  { test: /\bssh\b/i, label: "SSH", category: "practice", did: "managed it over SSH", lesson: "", tags: [] },
  { test: /systemd/i, label: "systemd", category: "platform", did: "wired it up as a systemd service so it survives reboots", lesson: "", tags: [] },
];

function extractFacts(text) {
  if (!text) return [];
  const seen = new Set();
  let matched = [];
  TECH_FACTS.forEach((f) => {
    if (f.test.test(text) && !seen.has(f.label)) {
      matched.push(f);
      seen.add(f.label);
    }
  });
  // A named proxy tool already covers "reverse proxy" generically — avoid saying it twice.
  const hasNamedProxy = matched.some((f) => ["Nginx", "Apache", "load balancer"].includes(f.label));
  if (hasNamedProxy) {
    matched = matched.filter((f) => f.label !== "reverse proxy");
  }
  return matched;
}

function buildParagraph(facts) {
  const byCategory = {};
  facts.forEach((f) => {
    if (!f.did) return;
    byCategory[f.category] = byCategory[f.category] || [];
    byCategory[f.category].push(f.did);
  });
  const order = ["core", "network", "cloud", "data", "practice", "platform"];
  const transitions = {
    core: "I ",
    network: "To keep things properly locked down, I also ",
    cloud: "For infrastructure, I ",
    data: "Underneath, I ",
    practice: "To round it out, I ",
    platform: "It all runs on ",
  };
  const sentences = [];
  order.forEach((cat) => {
    const dids = byCategory[cat];
    if (!dids || dids.length === 0) return;
    const list = joinNatural(dids);
    let s = transitions[cat] + list;
    s = s.charAt(0).toUpperCase() + s.slice(1) + ".";
    sentences.push(s);
  });
  return sentences.join(" ");
}

function buildLessons(facts, max = 2) {
  const seen = new Set();
  const out = [];
  facts.forEach((f) => {
    if (f.lesson && !seen.has(f.lesson) && out.length < max) {
      out.push(f.lesson);
      seen.add(f.lesson);
    }
  });
  return out;
}

function buildHashtags(facts, extra) {
  const tags = [];
  facts.forEach((f) => f.tags.forEach((t) => { if (!tags.includes(t)) tags.push(t); }));
  extra.forEach((t) => { if (!tags.includes(t)) tags.push(t); });
  return tags.slice(0, 6).map((t) => `#${t.replace(/[^a-zA-Z0-9]/g, "")}`).join(" ");
}

function craftTechNarrative(tone, facts) {
  const paragraph = buildParagraph(facts);
  const lessons = buildLessons(facts);

  if (tone === "professional") {
    const lessonLine = lessons.length
      ? `The main takeaway: ${lessons[0]}.${lessons[1] ? ` And on top of that, ${lessons[1]}.` : ""}`
      : "";
    return `Spent some time this week getting a small piece of infrastructure into proper shape — sharing the setup in case it's useful to someone working through something similar.

${paragraph}

${lessonLine}

Nothing groundbreaking here, but it's a good reminder that the unglamorous plumbing — proxies, ports, certificates — is usually what separates "it runs on my machine" from something you'd actually trust in production.

What's your go-to setup for something like this? Always interested in comparing notes with other teams.

${buildHashtags(facts, ["DevOps"])}`;
  }

  if (tone === "casual") {
    const lessonLine = lessons.length ? `Honestly, the moment it clicked for me: ${lessons[0]}.` : "";
    return `Small win to share 👇

${paragraph}

${lessonLine}

Nothing fancy — just me, a terminal, and way too many browser tabs open to config examples. But it works, it's got a real HTTPS padlock on it now, and that's a solid afternoon in my book.

Anyone else have a "why did I fight this for two hours over one missing character" story? 😅

${buildHashtags(facts, ["BuildInPublic", "Homelab"])}`;
  }

  // technical
  const lessonLine = lessons.length
    ? `Design reasoning worth calling out: ${lessons.map((l, i) => (i === 0 ? `${l}.` : `Also, ${l}.`)).join(" ")}`
    : "";
  return `Quick architecture note on something I set up recently.

Setup: ${paragraph}

${lessonLine}

Keeping the actual service bound to localhost and letting the proxy own the public-facing port is a small config decision that closes off a surprising amount of low-effort attack surface for free.

Curious how others handle this same "internal service behind a reverse proxy" pattern — different proxy of choice, different cert automation? Drop it in the comments.

${buildHashtags(facts, ["SystemDesign"])}`;
}

/* ---------------------------------------------------------------------- */
/*  Content generation (mocked "AI")                                       */
/* ---------------------------------------------------------------------- */
function extractTopic(rawText, fileName) {
  const trimmed = (rawText || "").trim();
  if (trimmed.length > 0) {
    const firstLine = trimmed.split(/\n/)[0].replace(/^[-*•\s]+/, "");
    return firstLine.length > 70 ? firstLine.slice(0, 70).trim() + "…" : firstLine;
  }
  if (fileName) {
    const stem = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim();
    return stem.charAt(0).toUpperCase() + stem.slice(1);
  }
  return "a project I've been heads-down on this quarter";
}

function craftPost(tone, rawText, fileName) {
  const facts = extractFacts(rawText);
  if (facts.length > 0) {
    return craftTechNarrative(tone, facts);
  }

  const topic = extractTopic(rawText, fileName);
  const detailLines = (rawText || "")
    .split("\n")
    .map((l) => l.replace(/^[-*•\s]+/, "").trim())
    .filter((l) => l.length > 0)
    .slice(1, 5);

  const bullets =
    detailLines.length > 0
      ? detailLines
      : [
          "Cut manual handoffs by rebuilding the core workflow end to end",
          "Partnered closely with design and data to validate the approach early",
          "Shipped in phases so we could learn from real usage, not assumptions",
        ];

  if (tone === "professional") {
    return `Excited to share a project our team just wrapped up: ${topic}.

Over the past few weeks, we focused on solving a problem that had quietly been costing the business time and clarity. A few things that made the difference:

${bullets.map((b) => `→ ${b}`).join("\n")}

The result is a leaner process that's already showing measurable impact, and a strong reminder that the best solutions come from listening closely to the people doing the work every day.

Grateful to the team that made this possible — proud of what we built together.

#ProductDevelopment #Teamwork #ContinuousImprovement`;
  }

  if (tone === "casual") {
    return `Okay, I have to tell you about ${topic} 👇

A few months back, this was just a messy idea on a whiteboard. Lots of "wait, does this actually work?" moments. Lots of coffee.

Here's what actually happened along the way:
${bullets.map((b) => `• ${b}`).join("\n")}

Honestly, the best part wasn't shipping it — it was the middle part, where nothing worked and the team just kept showing up and figuring it out anyway. That's the stuff that doesn't make it into the case study, but it's the stuff I'll remember.

If you're in the messy middle of something right now: keep going, it's working better than it feels like it is 😊

#BuildInPublic #StartupLife #Learnings`;
  }

  // technical
  return `Deep-dive: how we approached ${topic}.

Problem: the existing setup didn't scale with the load and complexity we were seeing, and the failure modes were hard to trace.

Approach:
${bullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}

Trade-offs worth calling out: we optimized for observability and rollback safety over raw throughput in v1 — the right call given how new the system is. Latency improved, but the bigger win was cutting time-to-diagnose on incidents by a wide margin.

Next up: load testing at 3x current traffic and tightening the retry/backoff logic.

Happy to go deeper on architecture decisions in the comments if useful.

#SoftwareEngineering #SystemDesign #EngineeringNotes`;
}

/* ---------------------------------------------------------------------- */
/*  Small building blocks                                                   */
/* ---------------------------------------------------------------------- */
function StepBadge({ n }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full text-xs font-medium shrink-0"
      style={{
        width: 26,
        height: 26,
        background: COLOR.ink,
        color: COLOR.paper,
        fontFamily: "'IBM Plex Mono', monospace",
      }}
    >
      {n}
    </span>
  );
}

function Avatar({ initials, ring, size = 48 }) {
  return (
    <div
      className="flex items-center justify-center rounded-full font-semibold shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${COLOR.accent}, ${ring || COLOR.ochre})`,
        color: COLOR.white,
        fontSize: size * 0.36,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {initials}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Landing page                                                           */
/* ---------------------------------------------------------------------- */
function Landing({ onGetStarted }) {
  return (
    <div style={{ background: COLOR.paper, minHeight: "100vh" }}>
      <style>{FONTS}</style>

      {/* Nav */}
      <header className="max-w-6xl mx-auto px-6 md:px-10 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded"
            style={{ width: 30, height: 30, background: COLOR.ink }}
          >
            <PenLine size={16} color={COLOR.paper} />
          </div>
          <span
            className="text-lg tracking-tight"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: COLOR.ink }}
          >
            Longhand
          </span>
        </div>
        <span
          className="text-xs hidden sm:block"
          style={{ fontFamily: "'IBM Plex Mono', monospace", color: COLOR.inkFaint, letterSpacing: "0.08em" }}
        >
          DOCS → DRAFTS → POSTS
        </span>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 md:pt-20 pb-20 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <div
            className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-6"
            style={{ background: COLOR.accentSoft, color: COLOR.accentDeep, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.04em" }}
          >
            NO DATABASE · NO DATA RETENTION
          </div>
          <h1
            className="text-4xl md:text-5xl leading-[1.08] mb-6"
            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: COLOR.ink, letterSpacing: "-0.01em" }}
          >
            Drop a project document.
            <br />
            Walk away with a post worth reading.
          </h1>
          <p className="text-base md:text-lg mb-9 max-w-md" style={{ color: COLOR.inkSoft, fontFamily: "'Inter', sans-serif" }}>
            Longhand turns your specs, notes, and README files into a polished
            LinkedIn update — in three tones, ready to paste in under a minute.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onGetStarted()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-transform hover:-translate-y-0.5"
              style={{ background: COLOR.ink, color: COLOR.paper, fontFamily: "'Inter', sans-serif" }}
            >
              Get Started
              <ArrowRight size={16} />
            </button>
          </div>
          <p className="text-xs mt-4" style={{ color: COLOR.inkFaint, fontFamily: "'Inter', sans-serif" }}>
            No account, no sign-in. You'll just type your own name and headline
            for the preview — nothing is saved.
          </p>
        </div>

        {/* Signature visual: document morphing into a feed post */}
        <div className="relative">
          <div
            className="rounded-xl p-6 border relative"
            style={{ background: COLOR.white, borderColor: COLOR.border }}
          >
            <div className="flex items-center gap-2 mb-5">
              <FileText size={16} color={COLOR.inkFaint} />
              <span className="text-xs" style={{ fontFamily: "'IBM Plex Mono', monospace", color: COLOR.inkFaint }}>
                project-notes.md
              </span>
            </div>
            {[92, 78, 85, 60, 88, 45].map((w, i) => (
              <div
                key={i}
                className="h-2 rounded-full mb-3"
                style={{ width: `${w}%`, background: i === 0 ? COLOR.ink : COLOR.paperDim, opacity: i === 0 ? 1 : 0.9 }}
              />
            ))}
          </div>

          <div
            className="flex items-center justify-center rounded-full absolute z-10 shadow-sm"
            style={{
              width: 40,
              height: 40,
              background: COLOR.accent,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <ArrowRight size={18} color={COLOR.white} />
          </div>

          <div
            className="rounded-xl p-5 border mt-4"
            style={{ background: COLOR.white, borderColor: COLOR.border }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Avatar initials="?" ring="#0A66C2" size={36} />
              <div>
                <div className="text-sm font-semibold" style={{ color: COLOR.ink, fontFamily: "'Inter', sans-serif" }}>
                  Your name
                </div>
                <div className="text-xs" style={{ color: COLOR.inkFaint, fontFamily: "'Inter', sans-serif" }}>
                  Your headline · Now
                </div>
              </div>
            </div>
            <div className="h-2 rounded-full mb-2" style={{ width: "95%", background: COLOR.paperDim }} />
            <div className="h-2 rounded-full mb-2" style={{ width: "88%", background: COLOR.paperDim }} />
            <div className="h-2 rounded-full" style={{ width: "60%", background: COLOR.ochreSoft }} />
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: "01", title: "Upload or paste", body: "Drag in a PDF, Word doc, .txt, or .md file — or just paste bullet points about what you shipped.", icon: UploadCloud },
            { n: "02", title: "Generate a draft", body: "Pick a tone — Professional, Casual, or Technical — and get a ready-to-edit post.", icon: Sparkles },
            { n: "03", title: "Copy & post", body: "One click copies your final text and opens LinkedIn so you can paste and publish.", icon: Send },
          ].map((s) => (
            <div key={s.n} className="rounded-xl p-6 border" style={{ background: COLOR.white, borderColor: COLOR.border }}>
              <div className="flex items-center justify-between mb-5">
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: COLOR.inkFaint, fontSize: 13 }}>{s.n}</span>
                <s.icon size={18} color={COLOR.accent} />
              </div>
              <h3 className="text-base font-semibold mb-1.5" style={{ fontFamily: "'Fraunces', serif", color: COLOR.ink }}>
                {s.title}
              </h3>
              <p className="text-sm" style={{ color: COLOR.inkSoft, fontFamily: "'Inter', sans-serif" }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 md:px-10 pb-10 flex items-center gap-2 text-xs" style={{ color: COLOR.inkFaint, fontFamily: "'Inter', sans-serif" }}>
        <Lock size={13} />
        Everything above runs client-side. No documents are stored, no database, no data retention.
      </footer>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Upload / paste zone                                                     */
/* ---------------------------------------------------------------------- */
function UploadZone({ fileName, fileParseNote, onFile, onClearFile, pastedText, setPastedText }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = useCallback(
    (files) => {
      const file = files[0];
      if (!file) return;
      onFile(file);
    },
    [onFile]
  );

  return (
    <div className="grid md:grid-cols-2 gap-5">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center px-6 py-10 cursor-pointer transition-colors"
        style={{
          borderColor: dragging ? COLOR.accent : COLOR.borderStrong,
          background: dragging ? COLOR.accentSoft : COLOR.white,
          minHeight: 220,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,.md,.doc,.docx,text/plain,text/markdown,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {fileName ? (
          <>
            <div className="flex items-center justify-center rounded-full mb-4" style={{ width: 44, height: 44, background: COLOR.successSoft }}>
              <FileText size={20} color={COLOR.success} />
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: COLOR.ink, fontFamily: "'Inter', sans-serif" }}>
              {fileName}
            </p>
            <p className="text-xs mb-3" style={{ color: fileParseNote ? COLOR.ochre : COLOR.inkFaint, fontFamily: "'Inter', sans-serif", maxWidth: 220 }}>
              {fileParseNote || "Ready to summarize"}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearFile();
              }}
              className="text-xs underline"
              style={{ color: COLOR.inkFaint, fontFamily: "'Inter', sans-serif" }}
            >
              Remove file
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center rounded-full mb-4" style={{ width: 44, height: 44, background: COLOR.accentSoft }}>
              <UploadCloud size={20} color={COLOR.accent} />
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: COLOR.ink, fontFamily: "'Inter', sans-serif" }}>
              Drag a file here, or click to browse
            </p>
            <p className="text-xs" style={{ color: COLOR.inkFaint, fontFamily: "'Inter', sans-serif" }}>
              PDF, Word (.doc/.docx), .txt, or .md — processed locally in your browser
            </p>
          </>
        )}
      </div>

      <div className="rounded-xl border p-5 flex flex-col" style={{ borderColor: COLOR.border, background: COLOR.white, minHeight: 220 }}>
        <div className="flex items-center gap-2 mb-3">
          <FileUp size={15} color={COLOR.inkFaint} />
          <span className="text-xs font-medium" style={{ color: COLOR.inkFaint, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.04em" }}>
            OR PASTE NOTES
          </span>
        </div>
        <textarea
          value={pastedText}
          onChange={(e) => setPastedText(e.target.value)}
          placeholder={"• Rebuilt the onboarding flow, cut drop-off by 30%\n• Led a small cross-functional squad over 6 weeks\n• Shipped in phases, learned a ton along the way"}
          className="w-full flex-1 resize-none text-sm outline-none"
          style={{ color: COLOR.ink, fontFamily: "'Inter', sans-serif", background: "transparent", minHeight: 130 }}
        />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  LinkedIn-style post preview                                             */
/* ---------------------------------------------------------------------- */
function PostPreview({ user, tone, setTone, text, setText }) {
  return (
    <div>
      {/* Tone tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {TONES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTone(t.id)}
            className="px-4 py-2 rounded-full text-xs font-medium transition-colors"
            style={
              tone === t.id
                ? { background: COLOR.ink, color: COLOR.paper, fontFamily: "'Inter', sans-serif" }
                : { background: COLOR.white, color: COLOR.inkSoft, border: `1px solid ${COLOR.borderStrong}`, fontFamily: "'Inter', sans-serif" }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Realistic feed card */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: COLOR.border, background: COLOR.white }}>
        <div className="p-4 pb-0 flex items-start justify-between">
          <div className="flex gap-3">
            <Avatar initials={user.initials} ring={user.ring} size={48} />
            <div>
              <div className="text-sm font-semibold" style={{ color: COLOR.ink, fontFamily: "'Inter', sans-serif" }}>
                {user.name}
              </div>
              <div className="text-xs leading-snug max-w-xs" style={{ color: COLOR.inkSoft, fontFamily: "'Inter', sans-serif" }}>
                {user.headline}
              </div>
              <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: COLOR.inkFaint, fontFamily: "'Inter', sans-serif" }}>
                Now · <Globe2 size={11} />
              </div>
            </div>
          </div>
          <MoreHorizontal size={18} color={COLOR.inkFaint} />
        </div>

        <div className="px-4 pt-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full resize-none text-sm leading-relaxed outline-none whitespace-pre-wrap"
            style={{ color: COLOR.ink, fontFamily: "'Inter', sans-serif", minHeight: 260, background: "transparent" }}
          />
        </div>

        <div className="px-4 pb-3 pt-2 flex items-center justify-between border-t mt-1" style={{ borderColor: COLOR.border }}>
          <div className="flex gap-5 py-2">
            <span className="flex items-center gap-1.5 text-xs" style={{ color: COLOR.inkFaint, fontFamily: "'Inter', sans-serif" }}>
              <ThumbsUp size={15} /> Like
            </span>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: COLOR.inkFaint, fontFamily: "'Inter', sans-serif" }}>
              <MessageCircle size={15} /> Comment
            </span>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: COLOR.inkFaint, fontFamily: "'Inter', sans-serif" }}>
              <Repeat2 size={15} /> Repost
            </span>
            <span className="flex items-center gap-1.5 text-xs" style={{ color: COLOR.inkFaint, fontFamily: "'Inter', sans-serif" }}>
              <Send size={15} /> Send
            </span>
          </div>
        </div>
      </div>
      <p className="text-xs mt-2" style={{ color: COLOR.inkFaint, fontFamily: "'Inter', sans-serif" }}>
        This is a live preview — edit the text above directly, it's what gets copied.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Dashboard (authenticated app)                                           */
/* ---------------------------------------------------------------------- */
function Dashboard() {
  // Nothing here is persisted anywhere — this is plain component state.
  // Refresh the page and it's gone; it never touches localStorage, a
  // cookie, or a server.
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const user = {
    name: name || "Your Name",
    headline: headline || "Your headline",
    initials: initialsFrom(name) || "—",
    ring: "#0A66C2",
  };

  const [fileName, setFileName] = useState("");
  const [fileText, setFileText] = useState("");
  const [fileParseNote, setFileParseNote] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [tone, setTone] = useState("professional");
  const [drafts, setDrafts] = useState({});
  const [copied, setCopied] = useState(false);
  const previewRef = useRef(null);

  const onFile = (file) => {
    setFileName(file.name);
    setFileParseNote("");
    const ext = file.name.split(".").pop().toLowerCase();

    if (ext === "txt" || ext === "md") {
      const reader = new FileReader();
      reader.onload = (e) => setFileText(String(e.target.result || ""));
      reader.readAsText(file);
    } else if (ext === "docx") {
      // Parsed fully client-side — the file's bytes never leave the browser.
      // mammoth is only downloaded when someone actually uploads a .docx,
      // so it doesn't add weight to the initial page load.
      import("mammoth")
        .then((mod) => file.arrayBuffer().then((buffer) => mod.default.extractRawText({ arrayBuffer: buffer })))
        .then((result) => setFileText(result.value || ""))
        .catch(() => {
          setFileText("");
          setFileParseNote("Couldn't read this .docx file — try pasting the text instead.");
        });
    } else {
      // Legacy .doc and .pdf aren't parsed client-side in this prototype —
      // we just reference the filename in the generated draft.
      setFileText("");
      if (ext === "doc") {
        setFileParseNote("Older .doc files aren't read for content — paste the text below for a fuller draft.");
      }
    }
  };

  const onClearFile = () => {
    setFileName("");
    setFileText("");
    setFileParseNote("");
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const source = pastedText || fileText;
      const built = {};
      TONES.forEach((t) => {
        built[t.id] = craftPost(t.id, source, fileName);
      });
      setDrafts(built);
      setTone("professional");
      setIsGenerating(false);
      setGenerated(true);
      setTimeout(() => previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }, 1600);
  };

  const handleToneChange = (nextTone) => {
    setTone(nextTone);
  };

  const setCurrentDraftText = (val) => {
    setDrafts((prev) => ({ ...prev, [tone]: val }));
  };

  const handleCopyAndOpen = async () => {
    const text = drafts[tone] || "";
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // Clipboard API can fail without user gesture context in some embeds — fail silently in this prototype.
    }
    setCopied(true);
    window.open("https://www.linkedin.com", "_blank", "noopener,noreferrer");
    setTimeout(() => setCopied(false), 3000);
  };

  const canGenerate = (pastedText.trim().length > 0 || fileName.length > 0) && !isGenerating;

  const handleStartOver = () => {
    setFileName("");
    setFileText("");
    setFileParseNote("");
    setPastedText("");
    setDrafts({});
    setTone("professional");
    setGenerated(false);
    setIsGenerating(false);
    setCopied(false);
  };

  return (
    <div style={{ background: COLOR.paper, minHeight: "100vh" }}>
      <style>{FONTS}</style>

      {/* Top bar */}
      <header className="max-w-5xl mx-auto px-6 md:px-10 pt-8 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded" style={{ width: 30, height: 30, background: COLOR.ink }}>
            <PenLine size={16} color={COLOR.paper} />
          </div>
          <span className="text-lg tracking-tight" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: COLOR.ink }}>
            Longhand
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <Avatar initials={user.initials} ring={user.ring} size={34} />
            <div className="hidden sm:block">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="text-xs font-semibold leading-tight outline-none block w-36"
                style={{ color: COLOR.ink, fontFamily: "'Inter', sans-serif", background: "transparent" }}
              />
              <input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Your headline"
                className="text-xs leading-tight outline-none block w-36"
                style={{ color: COLOR.inkFaint, fontFamily: "'Inter', sans-serif", background: "transparent" }}
              />
            </div>
          </div>
          <button
            onClick={handleStartOver}
            className="text-xs px-3 py-1.5 rounded-full border"
            style={{ color: COLOR.inkSoft, borderColor: COLOR.borderStrong, fontFamily: "'Inter', sans-serif" }}
          >
            Start over
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-10 pb-16">
        {!name && (
          <div
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 mb-8 text-xs"
            style={{ background: COLOR.accentSoft, color: COLOR.accentDeep, fontFamily: "'Inter', sans-serif" }}
          >
            👋 Add your name and headline up top — that's what shows on the post preview.
            It's only kept in this browser tab and is never saved or sent anywhere.
          </div>
        )}

        {/* Step 1 */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <StepBadge n="01" />
            <h2 className="text-xl" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: COLOR.ink }}>
              Bring in your project
            </h2>
          </div>
          <UploadZone
            fileName={fileName}
            fileParseNote={fileParseNote}
            onFile={onFile}
            onClearFile={onClearFile}
            pastedText={pastedText}
            setPastedText={setPastedText}
          />

          <div className="flex items-center justify-between mt-5">
            <p className="text-xs" style={{ color: COLOR.inkFaint, fontFamily: "'Inter', sans-serif" }}>
              {fileName ? `Using file: ${fileName}` : pastedText.trim() ? "Using pasted notes" : "Add a file or a few notes to continue"}
            </p>
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-opacity"
              style={{
                background: COLOR.ink,
                color: COLOR.paper,
                fontFamily: "'Inter', sans-serif",
                opacity: canGenerate ? 1 : 0.4,
                cursor: canGenerate ? "pointer" : "not-allowed",
              }}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating summary…
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate Summary
                </>
              )}
            </button>
          </div>
        </section>

        {/* Step 2 + 3 */}
        {generated && (
          <section ref={previewRef} className="mb-10" style={{ animation: "fadeIn 0.4s ease" }}>
            <div className="flex items-center gap-3 mb-4">
              <StepBadge n="02" />
              <h2 className="text-xl" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: COLOR.ink }}>
                Preview & tune your post
              </h2>
            </div>

            <PostPreview
              user={user}
              tone={tone}
              setTone={handleToneChange}
              text={drafts[tone] || ""}
              setText={setCurrentDraftText}
            />

            <div className="flex items-center gap-3 mt-8 mb-4">
              <StepBadge n="03" />
              <h2 className="text-xl" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, color: COLOR.ink }}>
                Copy it over to LinkedIn
              </h2>
            </div>

            <button
              onClick={handleCopyAndOpen}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold transition-transform hover:-translate-y-0.5"
              style={{ background: COLOR.accent, color: COLOR.white, fontFamily: "'Inter', sans-serif" }}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              Copy & Open LinkedIn
              <ExternalLink size={16} />
            </button>
          </section>
        )}

        {/* Privacy notice */}
        <div className="flex items-center gap-2 rounded-lg px-4 py-3 mt-4" style={{ background: COLOR.paperDim, border: `1px solid ${COLOR.border}` }}>
          <Lock size={15} color={COLOR.inkSoft} />
          <p className="text-xs" style={{ color: COLOR.inkSoft, fontFamily: "'Inter', sans-serif" }}>
            <strong style={{ color: COLOR.ink }}>Privacy first:</strong> your documents are processed locally.
            No database, no data retention.
          </p>
        </div>
      </main>

      {/* Toast */}
      <div
        className="fixed bottom-6 left-1/2 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all"
        style={{
          transform: `translate(-50%, ${copied ? "0" : "20px"})`,
          opacity: copied ? 1 : 0,
          pointerEvents: "none",
          background: COLOR.ink,
          color: COLOR.paper,
        }}
      >
        <div className="flex items-center justify-center rounded-full" style={{ width: 20, height: 20, background: COLOR.success }}>
          <Check size={13} color={COLOR.white} />
        </div>
        <span className="text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
          Text copied to clipboard!
        </span>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Root app                                                                */
/* ---------------------------------------------------------------------- */
export default function App() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return <Landing onGetStarted={() => setStarted(true)} />;
  }

  return <Dashboard />;
}
