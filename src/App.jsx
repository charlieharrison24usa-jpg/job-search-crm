import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  Save,
  Upload,
  Download,
  Building2,
  Users,
  MessageSquare,
  Sparkles,
  Pencil,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  FileUp,
} from "lucide-react";
// Simple local UI components (replacing shadcn/ui)
const Card = ({ children, className="", ...props }) => (
  <div
    className={`border border-violet-300/15 rounded-xl bg-[#140b23]/80 text-violet-100 shadow-[0_20px_70px_-45px_rgba(168,85,247,0.85)] backdrop-blur ${className}`}
    {...props}
  >
    {children}
  </div>
);
const CardContent = ({ children, className="" }) => <div className={className}>{children}</div>;
const CardHeader = ({ children, className="" }) => <div className={`p-4 border-b border-violet-300/15 ${className}`}>{children}</div>;
const CardTitle = ({ children }) => <h3 className="text-lg font-semibold tracking-tight text-violet-50">{children}</h3>;

const Button = ({ children, className="", onClick, variant="default", size="default", asChild=false, ...props }) => {
  const base = "inline-flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg border transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/60";
  const style =
    variant === "outline"
      ? "bg-[#110818] text-violet-100 border-violet-300/25 hover:bg-[#1b0e2b] hover:border-violet-300/45 hover:shadow-[0_0_32px_-20px_rgba(192,132,252,0.95)]"
      : "btn-glow bg-gradient-to-r from-violet-600 to-fuchsia-600 border-transparent text-white hover:brightness-110 shadow-[0_10px_35px_-18px_rgba(216,180,254,0.9)]";
  const sizeClass = size === "icon" ? "h-10 w-10 p-0" : "";
  const classes = `${base} ${style} ${sizeClass} ${className}`;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: `${classes} ${children.props.className || ""}`,
    });
  }

  return (
    <button onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  );
};

const Input = (props) => (
  <input
    {...props}
    className={`border border-violet-300/25 rounded-lg px-3 py-2 text-sm w-full bg-[#0f0918] text-violet-100 placeholder:text-violet-300/55 focus:outline-none focus:ring-2 focus:ring-violet-400/50 ${props.className || ""}`}
  />
);

const Textarea = (props) => (
  <textarea
    {...props}
    className={`border border-violet-300/25 rounded-lg px-3 py-2 text-sm w-full bg-[#0f0918] text-violet-100 placeholder:text-violet-300/55 focus:outline-none focus:ring-2 focus:ring-violet-400/50 ${props.className || ""}`}
  />
);

const Badge = ({ children, className="", tone="neutral" }) => {
  const toneMap = {
    neutral: "border-violet-300/30 text-violet-200 bg-violet-600/10",
    brand: "border-violet-300/45 text-violet-100 bg-violet-500/20",
    success: "border-emerald-300/45 text-emerald-100 bg-emerald-500/20",
    warn: "border-amber-300/45 text-amber-100 bg-amber-500/20",
    danger: "border-rose-300/45 text-rose-100 bg-rose-500/20",
    info: "border-sky-300/45 text-sky-100 bg-sky-500/20",
  };
  return (
    <span className={`text-xs px-2 py-1 border rounded ${toneMap[tone] || toneMap.neutral} ${className}`}>{children}</span>
  );
};

const Dialog = ({ open, children }) => (open ? <div className="fixed inset-0 flex items-center justify-center bg-black/70 p-4 z-50">{children}</div> : null);
const DialogContent = ({ children, className="" }) => (
  <div className={`bg-[#130a21] border border-violet-300/20 p-6 max-w-md w-full rounded-xl shadow-2xl fade-up ${className}`}>{children}</div>
);
const DialogHeader = ({ children }) => <div className="mb-3">{children}</div>;
const DialogTitle = ({ children }) => <h2 className="text-lg font-semibold text-violet-50">{children}</h2>;

// Simple Tabs implementation
const TabsContext = React.createContext({ value: "", setValue: () => {} });
function Tabs({ children, defaultValue="", className="", ...props }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className} {...props}>{children}</div>
    </TabsContext.Provider>
  );
}
function TabsList({ children, className="", ...props }) {
  return <div className={`flex gap-2 mb-4 bg-[#140a22]/90 border border-violet-300/15 p-1.5 overflow-x-auto ${className}`} {...props}>{children}</div>;
}
function TabsTrigger({ children, value, className="", ...props }) {
  const { value: activeValue, setValue } = React.useContext(TabsContext);
  const isActive = activeValue === value;
  return (
    <button
      onClick={() => setValue(value)}
      aria-pressed={isActive}
      className={`px-4 py-2 border rounded-xl text-sm transition-all ${
        isActive
          ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-transparent shadow-md"
          : "bg-transparent border-transparent text-violet-200 hover:bg-violet-600/20"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
function TabsContent({ children, value, className="", ...props }) {
  const { value: activeValue } = React.useContext(TabsContext);
  if (activeValue !== value) return null;
  return <div className={className} {...props}>{children}</div>;
}

const STORAGE_KEY = "charlie-job-search-crm-v5";
const AI_MESSAGES_KEY = "charlie-job-search-crm-ai-messages-v1";

const targetCompanySeed = [
  "Databricks",
  "Snowflake",
  "OpenAI",
  "Anthropic",
  "Stripe",
  "MongoDB",
  "Confluent",
  "Google Cloud",
  "Microsoft",
  "Scale AI",
  "Cohere",
  "Hugging Face",
  "Ramp",
  "Plaid",
  "Rippling",
  "ServiceNow",
  "Salesforce",
  "Weights & Biases",
  "Pinecone",
  "Fivetran",
  "dbt Labs",
  "Elastic",
  "HashiCorp",
  "Mistral AI",
  "Together AI",
];

const stageOptions = ["Not Contacted", "Contacted", "Meeting Scheduled", "Meeting Held", "Closed Won", "Closed Lost"];

const connectionTypeOptions = ["Cold", "LinkedIn", "Ex-AWS", "Ivey", "Recruiter", "Other"];

const emptyForm = {
  company: "",
  contactName: "",
  title: "",
  connectionType: "Cold",
  linkedinUrl: "",
  stage: "Not Contacted",
  notes: "",
};

function normalizeCompanyName(value = "") {
  return value.trim().toLowerCase();
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];

  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] || "";
    });
    return obj;
  });
}

function findMatchingTargetCompany(company = "") {
  const normalized = normalizeCompanyName(company);
  return targetCompanySeed.find((target) => normalized.includes(target.toLowerCase())) || "";
}

function extractLinkedInConnections(rows, existingContacts) {
  const existingKeys = new Set(
    existingContacts.map((c) => `${c.contactName.toLowerCase()}|${normalizeCompanyName(c.company)}`)
  );

  const newContacts = [];

  rows.forEach((row) => {
    const company = row["Company"] || row["Company Name"] || row["Current Company"] || "";
    const name = `${row["First Name"] || ""} ${row["Last Name"] || ""}`.trim();
    const matchedCompany = findMatchingTargetCompany(company);

    if (!company || !name || !matchedCompany) return;

    const dedupeKey = `${name.toLowerCase()}|${normalizeCompanyName(matchedCompany)}`;
    if (existingKeys.has(dedupeKey)) return;

    newContacts.push({
      id: crypto.randomUUID(),
      company: matchedCompany,
      contactName: name,
      title: row["Position"] || row["Title"] || "",
      connectionType: "LinkedIn",
      linkedinUrl: row["URL"] || row["Profile URL"] || "",
      stage: "Contacted",
      notes: "Imported from LinkedIn connections export.",
      createdAt: new Date().toISOString(),
    });
  });

  return newContacts;
}

function getWarmIntroScore(count) {
  if (count >= 4) return { label: "🔥 Strong", tone: "default", description: "You already have multiple warm paths here." };
  if (count >= 2) return { label: "👍 Good", tone: "secondary", description: "You have a credible network entry point here." };
  if (count === 1) return { label: "👌 Light", tone: "outline", description: "You have one warm lead here." };
  return { label: "❗ Build Network", tone: "outline", description: "No warm contacts yet. This is a networking gap." };
}

function getStageTone(stage) {
  const map = {
    "Not Contacted": "neutral",
    Contacted: "brand",
    "Meeting Scheduled": "info",
    "Meeting Held": "success",
    "Closed Won": "success",
    "Closed Lost": "danger",
  };
  return map[stage] || "neutral";
}

function normalizeStage(stage = "") {
  const trimmed = String(stage || "").trim();
  if (stageOptions.includes(trimmed)) return trimmed;

  const legacyMap = {
    Target: "Not Contacted",
    Researching: "Not Contacted",
    Applied: "Not Contacted",
    "Outreach Sent": "Contacted",
    Connected: "Contacted",
    "Intro Call": "Meeting Scheduled",
    Interviewing: "Meeting Held",
    "Final Round": "Meeting Held",
    Offer: "Meeting Held",
    Closed: "Closed Lost",
  };
  return legacyMap[trimmed] || "Not Contacted";
}

function getConnectionTone(connectionType) {
  const map = {
    Cold: "neutral",
    LinkedIn: "brand",
    "Ex-AWS": "info",
    Ivey: "warn",
    Recruiter: "success",
    Other: "neutral",
  };
  return map[connectionType] || "neutral";
}

function generateOutreachMessage(contact) {
  const firstName = (contact.contactName || "there").split(" ")[0];
  const company = contact.company || "your company";
  const title = contact.title ? ` and noticed you're a ${contact.title}` : "";

  return `Hi ${firstName} — hope you're doing well. I'm currently exploring enterprise sales / partnerships opportunities in NYC and SF, and ${company} is high on my target list. I came across your profile${title}. Would you be open to a quick chat about your experience there and any advice on where I should focus?`;
}

function moveStage(currentStage, direction = 1) {
  const idx = stageOptions.indexOf(normalizeStage(currentStage));
  const nextIdx = Math.min(stageOptions.length - 1, Math.max(0, idx + direction));
  return stageOptions[nextIdx];
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function MetricCard({ title, value, subtitle, icon: Icon }) {
  return (
    <Card className="rounded-2xl transition-transform duration-300 hover:-translate-y-1">
      <CardContent className="p-5">
        <div className="h-1.5 w-14 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-4 opacity-70" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-violet-200/70">{title}</p>
            <p className="text-3xl font-semibold mt-1 text-violet-50"><AnimatedNumber value={value} /></p>
            <p className="text-xs text-violet-200/60 mt-2">{subtitle}</p>
          </div>
          <div className="p-3 rounded-2xl bg-violet-600/20 border border-violet-300/20">
            <Icon className="h-5 w-5 text-violet-100" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AnimatedNumber({ value, duration=700 }) {
  const [display, setDisplay] = useState(value);
  const [previousValue, setPreviousValue] = useState(value);

  useEffect(() => {
    const start = performance.now();
    const from = Number(previousValue) || 0;
    const to = Number(value) || 0;
    let frame = 0;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - ((1 - progress) ** 3);
      const next = Math.round(from + ((to - from) * eased));
      setDisplay(next);
      if (progress < 1) frame = window.requestAnimationFrame(tick);
      else setPreviousValue(to);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [value, duration, previousValue]);

  return <span>{display}</span>;
}

export default function JobSearchMiniCRM() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [copiedMessageId, setCopiedMessageId] = useState("");
  const [editingId, setEditingId] = useState("");
  const [backupMessage, setBackupMessage] = useState("");
  const [aiMessages, setAiMessages] = useState({});
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [aiContact, setAiContact] = useState(null);
  const [aiTone, setAiTone] = useState("Warm and concise");
  const [aiInstructions, setAiInstructions] = useState("");
  const [aiDraft, setAiDraft] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setContacts(
          Array.isArray(parsed)
            ? parsed.map((contact) => ({ ...contact, stage: normalizeStage(contact.stage) }))
            : []
        );
      } catch {
        setContacts([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    const savedMessages = localStorage.getItem(AI_MESSAGES_KEY);
    if (!savedMessages) return;
    try {
      const parsed = JSON.parse(savedMessages);
      if (parsed && typeof parsed === "object") {
        setAiMessages(parsed);
      }
    } catch {
      setAiMessages({});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(AI_MESSAGES_KEY, JSON.stringify(aiMessages));
  }, [aiMessages]);

  function openAddDialog() {
    setEditingId("");
    setForm(emptyForm);
    setIsDialogOpen(true);
  }

  function openEditDialog(contact) {
    setEditingId(contact.id);
    setForm({
      company: contact.company || "",
      contactName: contact.contactName || "",
      title: contact.title || "",
      connectionType: contact.connectionType || "Cold",
      linkedinUrl: contact.linkedinUrl || "",
      stage: normalizeStage(contact.stage),
      notes: contact.notes || "",
    });
    setIsDialogOpen(true);
  }

  function importLinkedInCSV(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const rows = parseCSV(String(e.target?.result || ""));
      const newContacts = extractLinkedInConnections(rows, contacts);

      if (!newContacts.length) {
        alert("No LinkedIn connections found at your target companies.");
        return;
      }

      setContacts((prev) => [...newContacts, ...prev]);
      setBackupMessage(`${newContacts.length} LinkedIn connections added.`);
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function importJsonBackup(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(String(e.target?.result || "[]"));
        if (!Array.isArray(parsed)) throw new Error("Invalid format");
        setContacts(parsed.map((contact) => ({ ...contact, stage: normalizeStage(contact.stage) })));
        setBackupMessage(`Backup restored with ${parsed.length} contacts.`);
      } catch {
        alert("Could not import backup. Please use a JSON export from this app.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function exportJsonBackup() {
    const filename = `job-search-crm-backup-${new Date().toISOString().slice(0, 10)}.json`;
    downloadFile(filename, JSON.stringify(contacts, null, 2), "application/json");
    setBackupMessage("Backup exported. Save it somewhere safe.");
  }

  function exportCsvBackup() {
    const headers = ["company", "contactName", "title", "connectionType", "linkedinUrl", "stage", "notes"];
    const escape = (value) => {
      const stringValue = String(value || "");
      if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };
    const csv = [headers.join(","), ...contacts.map((contact) => headers.map((header) => escape(contact[header])).join(","))].join("\n");
    const filename = `job-search-crm-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadFile(filename, csv, "text/csv;charset=utf-8;");
    setBackupMessage("CSV exported.");
  }

  function saveContact() {
    if (!form.company.trim() || !form.contactName.trim()) return;
    const normalizedCompany = findMatchingTargetCompany(form.company) || form.company.trim();

    if (editingId) {
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === editingId
            ? {
                ...contact,
                ...form,
                company: normalizedCompany,
                stage: normalizeStage(form.stage),
              }
            : contact
        )
      );
      setBackupMessage("Contact updated.");
    } else {
      const newContact = {
        id: crypto.randomUUID(),
        ...form,
        company: normalizedCompany,
        stage: normalizeStage(form.stage),
        createdAt: new Date().toISOString(),
      };
      setContacts((prev) => [newContact, ...prev]);
      setBackupMessage("Contact added.");
    }

    setForm(emptyForm);
    setEditingId("");
    setIsDialogOpen(false);
  }

  async function copyMessage(contact) {
    const message = aiMessages[contact.id] || generateOutreachMessage(contact);
    try {
      await navigator.clipboard.writeText(message);
      setCopiedMessageId(contact.id);
      window.setTimeout(() => setCopiedMessageId(""), 2000);
    } catch {
      alert("Could not copy message.");
    }
  }

  function deleteContact(id) {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setAiMessages((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setBackupMessage("Contact deleted.");
  }

  function updateContactStage(id, stage) {
    setContacts((prev) => prev.map((contact) => (contact.id === id ? { ...contact, stage: normalizeStage(stage) } : contact)));
  }

  function openAiDialog(contact) {
    const existing = aiMessages[contact.id] || generateOutreachMessage(contact);
    setAiContact(contact);
    setAiDraft(existing);
    setAiInstructions(`Personalize this for ${contact.contactName}. Mention shared context and ask for a short call.`);
    setAiError("");
    setIsAiDialogOpen(true);
  }

  async function generateAiMessage() {
    if (!aiContact) return;
    setAiLoading(true);
    setAiError("");
    try {
      const response = await fetch("/api/generate-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: aiContact,
          baselineMessage: generateOutreachMessage(aiContact),
          tone: aiTone,
          userInstructions: aiInstructions,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Could not generate AI message.");
      }
      if (!data?.message) {
        throw new Error("AI response did not include a message.");
      }
      setAiDraft(data.message);
    } catch (error) {
      setAiError(error.message || "Could not generate AI message.");
    } finally {
      setAiLoading(false);
    }
  }

  function saveAiMessage() {
    if (!aiContact) return;
    setAiMessages((prev) => ({ ...prev, [aiContact.id]: aiDraft.trim() || generateOutreachMessage(aiContact) }));
    setBackupMessage(`AI message saved for ${aiContact.contactName}.`);
    setIsAiDialogOpen(false);
  }

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const haystack = `${contact.company} ${contact.contactName} ${contact.title} ${contact.notes} ${contact.stage} ${contact.connectionType}`.toLowerCase();
      return haystack.includes(search.toLowerCase());
    });
  }, [contacts, search]);

  const companyMap = useMemo(() => {
    const map = new Map();

    targetCompanySeed.forEach((company) => {
      map.set(company, {
        name: company,
        contacts: [],
      });
    });

    contacts.forEach((contact) => {
      const company = findMatchingTargetCompany(contact.company) || contact.company;
      if (!map.has(company)) {
        map.set(company, { name: company, contacts: [] });
      }
      map.get(company).contacts.push(contact);
    });

    return Array.from(map.values()).sort((a, b) => b.contacts.length - a.contacts.length || a.name.localeCompare(b.name));
  }, [contacts]);

  const filteredCompanies = useMemo(() => {
    return companyMap.filter((company) => company.name.toLowerCase().includes(companySearch.toLowerCase()));
  }, [companyMap, companySearch]);

  const selectedCompanyData = useMemo(() => {
    return companyMap.find((company) => company.name === selectedCompany) || null;
  }, [companyMap, selectedCompany]);

  const stats = useMemo(() => {
    const connectedCount = contacts.filter((c) => c.connectionType === "LinkedIn").length;
    const warmCompanies = companyMap.filter((c) => c.contacts.length > 0).length;
    const activeOutreach = contacts.filter((c) => ["Contacted", "Meeting Scheduled", "Meeting Held"].includes(normalizeStage(c.stage))).length;
    const stageCounts = stageOptions.reduce((acc, stage) => {
      acc[stage] = contacts.filter((contact) => normalizeStage(contact.stage) === stage).length;
      return acc;
    }, {});
    return {
      totalContacts: contacts.length,
      connectedCount,
      warmCompanies,
      targetCompanies: companyMap.length,
      activeOutreach,
      stageCounts,
    };
  }, [contacts, companyMap]);
  const topStages = Object.entries(stats.stageCounts)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const conversionPct = stats.totalContacts ? Math.round((stats.activeOutreach / stats.totalContacts) * 100) : 0;
  const warmthPct = stats.targetCompanies ? Math.round((stats.warmCompanies / stats.targetCompanies) * 100) : 0;
  const statCards = [
    { title: "Contacts", value: stats.totalContacts, subtitle: "All contacts in your CRM", icon: Users },
    { title: "LinkedIn Imports", value: stats.connectedCount, subtitle: "Warm contacts from LinkedIn", icon: Sparkles },
    { title: "Warm Companies", value: stats.warmCompanies, subtitle: "Targets where you know someone", icon: Building2 },
    { title: "Target Companies", value: stats.targetCompanies, subtitle: "Seed list plus additions", icon: MessageSquare },
    { title: "Active Outreach", value: stats.activeOutreach, subtitle: "Contacts beyond pure research", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#08050f] text-violet-100 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="pointer-events-none absolute top-20 right-0 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-3xl" />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 relative z-10">
        <Card className="rounded-2xl border-violet-300/25 bg-gradient-to-r from-violet-800/35 to-fuchsia-800/20 fade-up">
          <CardContent className="p-4 md:p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-medium">Local-only storage</p>
                  <p className="text-sm text-violet-100/75 mt-1">
                    Your CRM is saved only in this browser on this device. Export a JSON backup regularly before clearing browser data or switching machines.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-2xl" onClick={exportJsonBackup}>
                  <Download className="h-4 w-4 mr-2" /> Export JSON
                </Button>
                <label>
                  <input type="file" accept=".json" className="hidden" onChange={importJsonBackup} />
                  <Button variant="outline" className="rounded-2xl" asChild>
                    <span><FileUp className="h-4 w-4 mr-2" /> Import JSON</span>
                  </Button>
                </label>
              </div>
            </div>
            {backupMessage ? <p className="text-sm text-violet-100/80 mt-3">{backupMessage}</p> : null}
          </CardContent>
        </Card>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 fade-up" style={{ animationDelay: "80ms" }}>
          <div>
            <p className="inline-flex items-center px-3 py-1 rounded-full border border-violet-300/25 bg-violet-900/30 text-xs uppercase tracking-[0.18em] text-violet-200 mb-3">
              Personal Pipeline
            </p>
            <p className="text-sm uppercase tracking-[0.2em] text-violet-300/80">Charlie Harrison</p>
            <h1 className="text-3xl md:text-4xl font-semibold mt-2 text-violet-50">Job Search Mini CRM</h1>
            <p className="text-violet-100/75 mt-2 max-w-3xl">
              Track warm intros, target companies, and outreach messages across your NYC and SF search.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={openAddDialog} className="rounded-2xl">
              <Plus className="h-4 w-4 mr-2" /> Add Contact
            </Button>
            <label>
              <input type="file" accept=".csv" className="hidden" onChange={importLinkedInCSV} />
              <Button variant="outline" className="rounded-2xl" asChild>
                <span><Upload className="h-4 w-4 mr-2" /> Import LinkedIn Connections</span>
              </Button>
            </label>
            <Button variant="outline" className="rounded-2xl" onClick={exportCsvBackup}>
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {statCards.map((item, index) => (
            <div key={item.title} className="fade-up" style={{ animationDelay: `${100 + (index * 60)}ms` }}>
              <MetricCard title={item.title} value={item.value} subtitle={item.subtitle} icon={item.icon} />
            </div>
          ))}
        </div>

        <Card className="rounded-2xl fade-up" style={{ animationDelay: "220ms" }}>
          <CardContent className="p-5 grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-violet-200/75">Pipeline Health</p>
              <p className="text-3xl font-semibold text-violet-50">{conversionPct}%</p>
              <p className="text-sm text-violet-200/70">of contacts are in active outreach stages</p>
              <div className="h-2 rounded-full bg-violet-900/60 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-400" style={{ width: `${conversionPct}%` }} />
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-violet-200/75">Warmth Coverage</p>
              <p className="text-3xl font-semibold text-violet-50">{warmthPct}%</p>
              <p className="text-sm text-violet-200/70">of target companies have at least one connection</p>
              <div className="h-2 rounded-full bg-violet-900/60 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sky-400 to-violet-400" style={{ width: `${warmthPct}%` }} />
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.18em] text-violet-200/75">Top Stages</p>
              <div className="flex flex-wrap gap-2">
                {topStages.length ? topStages.map(([stage, count]) => (
                  <Badge key={stage} tone={getStageTone(stage)} className="rounded-xl">{stage}: {count}</Badge>
                )) : <p className="text-sm text-violet-200/70">No stage data yet.</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="companies" className="space-y-6">
          <TabsList className="rounded-2xl fade-up" style={{ animationDelay: "140ms" }}>
            <TabsTrigger value="companies">Warm Intro Map</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="deploy">Deploy Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="companies" className="space-y-6 fade-up tab-switch" style={{ animationDelay: "180ms" }}>
            <Card className="rounded-2xl">
              <CardContent className="p-4">
                <Input
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  placeholder="Search companies..."
                  className="rounded-2xl"
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCompanies.map((company) => {
                  const score = getWarmIntroScore(company.contacts.length);
                  return (
                    <Card
                      key={company.name}
                      className={`rounded-2xl cursor-pointer transition-all duration-300 ${selectedCompany === company.name ? "ring-2 ring-violet-300/80 bg-violet-700/25" : "hover:-translate-y-0.5 hover:bg-violet-800/20"}`}
                      onClick={() => setSelectedCompany(company.name)}
                    >
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-semibold">{company.name}</h3>
                            <p className="text-sm text-violet-200/70 mt-1">{company.contacts.length} warm contact{company.contacts.length === 1 ? "" : "s"}</p>
                          </div>
                          <Badge tone="brand" className="rounded-xl">{score.label}</Badge>
                        </div>
                        <p className="text-sm text-violet-100/75">{score.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
                {!filteredCompanies.length ? (
                  <Card className="rounded-2xl md:col-span-2">
                    <CardContent className="p-6 text-sm text-violet-200/75">No companies match that search.</CardContent>
                  </Card>
                ) : null}
              </div>

              <div>
                <Card className="rounded-2xl sticky top-6">
                  <CardHeader>
                    <CardTitle>{selectedCompanyData ? selectedCompanyData.name : "Select a Company"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedCompanyData ? (
                      <div className="space-y-4">
                        <div>
                          <Badge tone="brand" className="rounded-xl">
                            {getWarmIntroScore(selectedCompanyData.contacts.length).label}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          {selectedCompanyData.contacts.length ? selectedCompanyData.contacts.map((contact) => (
                            <div key={contact.id} className="p-3 rounded-2xl bg-violet-900/25 border border-violet-300/15 space-y-2">
                              <div>
                                <p className="font-medium text-sm">{contact.contactName}</p>
                                <p className="text-xs text-violet-200/70 mt-1">{contact.title || "No title saved"}</p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Badge tone={getConnectionTone(contact.connectionType)} className="rounded-xl">{contact.connectionType}</Badge>
                                <Badge tone={getStageTone(contact.stage)} className="rounded-xl">{contact.stage}</Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="rounded-2xl"
                                  onClick={() => updateContactStage(contact.id, moveStage(contact.stage, -1))}
                                  disabled={normalizeStage(contact.stage) === stageOptions[0]}
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <p className="text-xs text-violet-200/80">Move through pipeline stage</p>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="rounded-2xl"
                                  onClick={() => updateContactStage(contact.id, moveStage(contact.stage, 1))}
                                  disabled={normalizeStage(contact.stage) === stageOptions[stageOptions.length - 1]}
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" className="w-full rounded-2xl" onClick={() => copyMessage(contact)}>
                                  <MessageSquare className="h-4 w-4 mr-2" /> {copiedMessageId === contact.id ? "Copied" : "Copy Outreach Message"}
                                </Button>
                                <Button
                                  variant="outline"
                                  className="rounded-2xl"
                                  onClick={() => openAiDialog(contact)}
                                  title="Personalize message"
                                >
                                  <Sparkles className="h-4 w-4" /> Personalize
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-2xl" onClick={() => openEditDialog(contact)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </div>
                              {aiMessages[contact.id] ? (
                                <p className="text-xs text-violet-200/70">AI-personalized message saved for this contact.</p>
                              ) : null}
                            </div>
                          )) : (
                            <p className="text-sm text-violet-200/70">No warm contacts yet. Build this company intentionally.</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-violet-200/70">Select a company to see your warm intro strength and copy outreach messages.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6 fade-up tab-switch" style={{ animationDelay: "180ms" }}>
            <Card className="rounded-2xl">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-300/55" />
                  <Input
                    placeholder="Search contacts, companies, stages..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 rounded-2xl"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {filteredContacts.map((contact) => (
                <Card key={contact.id} className="rounded-2xl transition-all duration-300 hover:bg-violet-800/20">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{contact.contactName}</p>
                        <p className="text-sm text-violet-200/70">{contact.title || "No title saved"}</p>
                        <p className="text-sm mt-1">{contact.company}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge tone={getConnectionTone(contact.connectionType)} className="rounded-xl">{contact.connectionType}</Badge>
                          <Badge tone={getStageTone(contact.stage)} className="rounded-xl">{contact.stage}</Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-2xl"
                            onClick={() => updateContactStage(contact.id, moveStage(contact.stage, -1))}
                            disabled={normalizeStage(contact.stage) === stageOptions[0]}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <p className="text-xs text-violet-200/80">Move through pipeline stage</p>
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-2xl"
                            onClick={() => updateContactStage(contact.id, moveStage(contact.stage, 1))}
                            disabled={normalizeStage(contact.stage) === stageOptions[stageOptions.length - 1]}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="rounded-2xl" onClick={() => copyMessage(contact)}>
                          <MessageSquare className="h-4 w-4 mr-2" /> {copiedMessageId === contact.id ? "Copied" : "Copy Message"}
                        </Button>
                        <Button variant="outline" className="rounded-2xl" onClick={() => openAiDialog(contact)}>
                          <Sparkles className="h-4 w-4 mr-2" /> Personalize
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-2xl" onClick={() => openEditDialog(contact)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-2xl"
                          onClick={() => deleteContact(contact.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {aiMessages[contact.id] ? (
                      <p className="text-xs text-violet-200/70 mt-3">This contact has a saved AI-customized message.</p>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
              {!filteredContacts.length ? (
                <Card className="rounded-2xl">
                  <CardContent className="p-6 text-sm text-violet-200/75">
                    No contacts found for that query.
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </TabsContent>

          <TabsContent value="deploy" className="fade-up tab-switch" style={{ animationDelay: "180ms" }}>
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Deploy checklist for Vercel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-violet-100/75 leading-6">
                <div>
                  <p className="font-medium text-violet-50">1. Keep this app in one main browser</p>
                  <p>Since data is stored locally, treat one browser on one machine as your source of truth.</p>
                </div>
                <div>
                  <p className="font-medium text-violet-50">2. Export JSON every few days</p>
                  <p>Save your backup file to iCloud Drive, Dropbox, or Google Drive before making major changes.</p>
                </div>
                <div>
                  <p className="font-medium text-violet-50">3. Deploy through GitHub + Vercel</p>
                  <p>Push the code to GitHub, import the repo into Vercel, and let Vercel handle each new deployment.</p>
                </div>
                <div>
                  <p className="font-medium text-violet-50">4. Upgrade only when you feel pain</p>
                  <p>When local-only storage becomes limiting, move just the data layer to a backend instead of rebuilding the app.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="rounded-3xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Contact" : "Add Contact"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                placeholder="Company"
                value={form.company}
                onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
                className="rounded-2xl"
              />
              <Input
                placeholder="Name"
                value={form.contactName}
                onChange={(e) => setForm((prev) => ({ ...prev, contactName: e.target.value }))}
                className="rounded-2xl"
              />
              <Input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                className="rounded-2xl"
              />
              <Input
                placeholder="LinkedIn URL"
                value={form.linkedinUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                className="rounded-2xl"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={form.connectionType}
                  onChange={(e) => setForm((prev) => ({ ...prev, connectionType: e.target.value }))}
                  className="h-10 rounded-2xl border border-violet-300/25 bg-[#0f0918] px-3 py-2 text-sm text-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-400/50"
                >
                  {connectionTypeOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select
                  value={form.stage}
                  onChange={(e) => setForm((prev) => ({ ...prev, stage: e.target.value }))}
                  className="h-10 rounded-2xl border border-violet-300/25 bg-[#0f0918] px-3 py-2 text-sm text-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-400/50"
                >
                  {stageOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <Textarea
                placeholder="Notes"
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                className="rounded-2xl"
                rows={4}
              />
              <Button onClick={saveContact} className="rounded-2xl w-full">
                <Save className="h-4 w-4 mr-2" /> {editingId ? "Save Changes" : "Save Contact"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
          <DialogContent className="rounded-3xl max-w-2xl">
            <DialogHeader>
              <DialogTitle>AI Message Editor</DialogTitle>
            </DialogHeader>
            {aiContact ? (
              <div className="space-y-3">
                <p className="text-sm text-violet-200/80">
                  Editing message for <span className="text-violet-100 font-medium">{aiContact.contactName}</span> at{" "}
                  <span className="text-violet-100 font-medium">{aiContact.company}</span>.
                </p>
                <p className="text-xs text-violet-200/70">
                  Write a prompt below and generate a personalized draft, then edit or save it.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <select
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value)}
                    className="h-10 rounded-2xl border border-violet-300/25 bg-[#0f0918] px-3 py-2 text-sm text-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-400/50"
                  >
                    <option value="Warm and concise">Warm and concise</option>
                    <option value="Highly professional">Highly professional</option>
                    <option value="Confident and direct">Confident and direct</option>
                    <option value="Friendly and casual">Friendly and casual</option>
                  </select>
                  <Button variant="outline" className="rounded-2xl" onClick={generateAiMessage} disabled={aiLoading}>
                    <Sparkles className="h-4 w-4 mr-2" /> {aiLoading ? "Generating..." : "Generate Personalized Draft"}
                  </Button>
                </div>
                <Textarea
                  value={aiInstructions}
                  onChange={(e) => setAiInstructions(e.target.value)}
                  placeholder="Prompt: mention shared AWS background, ask for 15 minutes next week, keep under 90 words..."
                  className="rounded-2xl"
                  rows={3}
                />
                <Textarea
                  value={aiDraft}
                  onChange={(e) => setAiDraft(e.target.value)}
                  className="rounded-2xl"
                  rows={8}
                />
                {aiError ? <p className="text-sm text-rose-300">{aiError}</p> : null}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(aiDraft);
                        if (aiContact) {
                          setCopiedMessageId(aiContact.id);
                          window.setTimeout(() => setCopiedMessageId(""), 2000);
                        }
                      } catch {
                        alert("Could not copy message.");
                      }
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" /> Copy Draft
                  </Button>
                  <Button variant="outline" className="rounded-2xl" onClick={() => setIsAiDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="rounded-2xl" onClick={saveAiMessage}>
                    <Save className="h-4 w-4 mr-2" /> Save Message
                  </Button>
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
