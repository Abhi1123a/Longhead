import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Linkedin,
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
const MOCK_USERS = {
  linkedin: {
    name: "Jordan Avery",
    headline: "Product Engineer @ Northwind Labs",
    initials: "JA",
    ring: "#0A66C2",
  },
  google: {
    name: "Priya Chandrasekaran",
    headline: "Senior Data Scientist @ Fieldstone",
    initials: "PC",
    ring: "#EA4335",
  },
};

const TONES = [
  { id: "professional", label: "Professional / Corporate" },
  { id: "casual", label: "Casual / Storytelling" },
  { id: "technical", label: "Technical / Deep-Dive" },
];

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
function GoogleMark({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.95v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.05z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.95l3.02 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  );
}

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
function Landing({ onSignIn }) {
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
              onClick={() => onSignIn("linkedin")}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-transform hover:-translate-y-0.5"
              style={{ background: "#0A66C2", color: COLOR.white, fontFamily: "'Inter', sans-serif" }}
            >
              <Linkedin size={18} />
              Sign in with LinkedIn
            </button>
            <button
              onClick={() => onSignIn("google")}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-medium border transition-transform hover:-translate-y-0.5"
              style={{ background: COLOR.white, color: COLOR.ink, borderColor: COLOR.borderStrong, fontFamily: "'Inter', sans-serif" }}
            >
              <GoogleMark />
              Sign in with Google
            </button>
          </div>
          <p className="text-xs mt-4" style={{ color: COLOR.inkFaint, fontFamily: "'Inter', sans-serif" }}>
            Prototype sign-in — no account is created, nothing leaves your browser.
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
              <Avatar initials="JA" ring="#0A66C2" size={36} />
              <div>
                <div className="text-sm font-semibold" style={{ color: COLOR.ink, fontFamily: "'Inter', sans-serif" }}>
                  Jordan Avery
                </div>
                <div className="text-xs" style={{ color: COLOR.inkFaint, fontFamily: "'Inter', sans-serif" }}>
                  Product Engineer · Now
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
            { n: "01", title: "Upload or paste", body: "Drag in a PDF, .txt, or .md file — or just paste bullet points about what you shipped.", icon: UploadCloud },
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
function UploadZone({ fileName, onFile, onClearFile, pastedText, setPastedText }) {
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
          accept=".pdf,.txt,.md,text/plain,text/markdown,application/pdf"
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
            <p className="text-xs mb-3" style={{ color: COLOR.inkFaint, fontFamily: "'Inter', sans-serif" }}>
              Ready to summarize
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
              PDF, .txt, or .md — processed locally in your browser
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
function Dashboard({ provider, onSignOut }) {
  const user = MOCK_USERS[provider];

  const [fileName, setFileName] = useState("");
  const [fileText, setFileText] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [tone, setTone] = useState("professional");
  const [drafts, setDrafts] = useState({});
  const [copied, setCopied] = useState(false);
  const previewRef = useRef(null);

  const onFile = (file) => {
    setFileName(file.name);
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "txt" || ext === "md") {
      const reader = new FileReader();
      reader.onload = (e) => setFileText(String(e.target.result || ""));
      reader.readAsText(file);
    } else {
      // PDFs aren't parsed client-side in this prototype — we just reference the filename.
      setFileText("");
    }
  };

  const onClearFile = () => {
    setFileName("");
    setFileText("");
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
              <div className="text-xs font-semibold leading-tight" style={{ color: COLOR.ink, fontFamily: "'Inter', sans-serif" }}>
                {user.name}
              </div>
              <div className="text-xs leading-tight" style={{ color: COLOR.inkFaint, fontFamily: "'Inter', sans-serif" }}>
                {user.headline}
              </div>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="text-xs px-3 py-1.5 rounded-full border"
            style={{ color: COLOR.inkSoft, borderColor: COLOR.borderStrong, fontFamily: "'Inter', sans-serif" }}
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-10 pb-16">
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
  const [provider, setProvider] = useState(null); // null | 'linkedin' | 'google'

  if (!provider) {
    return <Landing onSignIn={setProvider} />;
  }

  return <Dashboard provider={provider} onSignOut={() => setProvider(null)} />;
}
