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
  ShieldAlert,
  FileUp,
} from "lucide-react";
// Simple local UI components (replacing shadcn/ui)
const Card = ({ children, className="" }) => <div className={`border rounded-xl bg-white ${className}`}>{children}</div>;
const CardContent = ({ children, className="" }) => <div className={className}>{children}</div>;
const CardHeader = ({ children, className="" }) => <div className={`p-4 border-b ${className}`}>{children}</div>;
const CardTitle = ({ children }) => <h3 className="text-lg font-semibold">{children}</h3>;

const Button = ({ children, className="", onClick, variant="default", ...props }) => {
  const base = "px-3 py-2 text-sm rounded-lg border";
  const style = variant === "outline" ? "bg-white" : "bg-black text-white";
  return (
    <button onClick={onClick} className={`${base} ${style} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input = (props) => (
  <input {...props} className={`border rounded-lg px-3 py-2 text-sm w-full ${props.className || ""}`} />
);

const Textarea = (props) => (
  <textarea {...props} className={`border rounded-lg px-3 py-2 text-sm w-full ${props.className || ""}`} />
);

const Badge = ({ children, className="" }) => (
  <span className={`text-xs px-2 py-1 border rounded ${className}`}>{children}</span>
);

const Dialog = ({ open, children }) => (open ? <div className="fixed inset-0 flex items-center justify-center bg-black/40">{children}</div> : null);
const DialogContent = ({ children, className="" }) => <div className={`bg-white p-6 max-w-md w-full rounded-xl ${className}`}>{children}</div>;
const DialogHeader = ({ children }) => <div className="mb-3">{children}</div>;
const DialogTitle = ({ children }) => <h2 className="text-lg font-semibold">{children}</h2>;

// Simple Tabs implementation
function Tabs({ children }) { return <div>{children}</div>; }
function TabsList({ children }) { return <div className="flex gap-2 mb-4">{children}</div>; }
function TabsTrigger({ children, onClick }) { return <button onClick={onClick} className="px-3 py-2 border rounded">{children}</button>; }
function TabsContent({ children }) { return <div>{children}</div>; }

const STORAGE_KEY = "charlie-job-search-crm-v5";

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

const stageOptions = [
  "Target",
  "Researching",
  "Applied",
  "Outreach Sent",
  "Connected",
  "Intro Call",
  "Interviewing",
  "Final Round",
  "Offer",
  "Closed",
];

const connectionTypeOptions = ["Cold", "LinkedIn", "Ex-AWS", "Ivey", "Recruiter", "Other"];

const emptyForm = {
  company: "",
  contactName: "",
  title: "",
  connectionType: "Cold",
  linkedinUrl: "",
  stage: "Target",
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
      stage: "Connected",
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

function generateOutreachMessage(contact) {
  const firstName = (contact.contactName || "there").split(" ")[0];
  const company = contact.company || "your company";
  const title = contact.title ? ` and noticed you're a ${contact.title}` : "";

  return `Hi ${firstName} — hope you're doing well. I'm currently exploring enterprise sales / partnerships opportunities in NYC and SF, and ${company} is high on my target list. I came across your profile${title}. Would you be open to a quick chat about your experience there and any advice on where I should focus?`;
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
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-3xl font-semibold mt-1">{value}</p>
            <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-100">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
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

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setContacts(JSON.parse(saved));
      } catch {
        setContacts([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

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
      stage: contact.stage || "Target",
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
        setContacts(parsed);
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
    const message = generateOutreachMessage(contact);
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
    setBackupMessage("Contact deleted.");
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
    const activeOutreach = contacts.filter((c) => ["Outreach Sent", "Connected", "Intro Call", "Interviewing", "Final Round", "Offer"].includes(c.stage)).length;
    return {
      totalContacts: contacts.length,
      connectedCount,
      warmCompanies,
      targetCompanies: companyMap.length,
      activeOutreach,
    };
  }, [contacts, companyMap]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
        <Card className="rounded-2xl border-amber-200 bg-amber-50 shadow-sm">
          <CardContent className="p-4 md:p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-medium">Local-only storage</p>
                  <p className="text-sm text-slate-600 mt-1">
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
            {backupMessage ? <p className="text-sm text-slate-600 mt-3">{backupMessage}</p> : null}
          </CardContent>
        </Card>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Charlie Harrison</p>
            <h1 className="text-3xl md:text-4xl font-semibold mt-2">Job Search Mini CRM</h1>
            <p className="text-slate-600 mt-2 max-w-3xl">
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
          <MetricCard title="Contacts" value={stats.totalContacts} subtitle="All contacts in your CRM" icon={Users} />
          <MetricCard title="LinkedIn Imports" value={stats.connectedCount} subtitle="Warm contacts from LinkedIn" icon={Sparkles} />
          <MetricCard title="Warm Companies" value={stats.warmCompanies} subtitle="Targets where you know someone" icon={Building2} />
          <MetricCard title="Target Companies" value={stats.targetCompanies} subtitle="Seed list plus additions" icon={MessageSquare} />
          <MetricCard title="Active Outreach" value={stats.activeOutreach} subtitle="Contacts beyond pure research" icon={MessageSquare} />
        </div>

        <Tabs defaultValue="companies" className="space-y-6">
          <TabsList className="rounded-2xl">
            <TabsTrigger value="companies">Warm Intro Map</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="deploy">Deploy Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="companies" className="space-y-6">
            <Card className="rounded-2xl shadow-sm">
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
                      className={`rounded-2xl shadow-sm cursor-pointer transition-all ${selectedCompany === company.name ? "ring-2 ring-slate-900" : "hover:shadow-md"}`}
                      onClick={() => setSelectedCompany(company.name)}
                    >
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-semibold">{company.name}</h3>
                            <p className="text-sm text-slate-500 mt-1">{company.contacts.length} warm contact{company.contacts.length === 1 ? "" : "s"}</p>
                          </div>
                          <Badge variant={score.tone} className="rounded-xl">{score.label}</Badge>
                        </div>
                        <p className="text-sm text-slate-600">{score.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div>
                <Card className="rounded-2xl shadow-sm sticky top-6">
                  <CardHeader>
                    <CardTitle>{selectedCompanyData ? selectedCompanyData.name : "Select a Company"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedCompanyData ? (
                      <div className="space-y-4">
                        <div>
                          <Badge variant={getWarmIntroScore(selectedCompanyData.contacts.length).tone} className="rounded-xl">
                            {getWarmIntroScore(selectedCompanyData.contacts.length).label}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          {selectedCompanyData.contacts.length ? selectedCompanyData.contacts.map((contact) => (
                            <div key={contact.id} className="p-3 rounded-2xl bg-slate-100 space-y-2">
                              <div>
                                <p className="font-medium text-sm">{contact.contactName}</p>
                                <p className="text-xs text-slate-500 mt-1">{contact.title || "No title saved"}</p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="rounded-xl">{contact.connectionType}</Badge>
                                <Badge variant="outline" className="rounded-xl">{contact.stage}</Badge>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" className="w-full rounded-2xl" onClick={() => copyMessage(contact)}>
                                  <MessageSquare className="h-4 w-4 mr-2" /> {copiedMessageId === contact.id ? "Copied" : "Copy Outreach Message"}
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-2xl" onClick={() => openEditDialog(contact)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )) : (
                            <p className="text-sm text-slate-500">No warm contacts yet. Build this company intentionally.</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">Select a company to see your warm intro strength and copy outreach messages.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
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
                <Card key={contact.id} className="rounded-2xl shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{contact.contactName}</p>
                        <p className="text-sm text-slate-500">{contact.title || "No title saved"}</p>
                        <p className="text-sm mt-1">{contact.company}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary" className="rounded-xl">{contact.connectionType}</Badge>
                          <Badge variant="outline" className="rounded-xl">{contact.stage}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="rounded-2xl" onClick={() => copyMessage(contact)}>
                          <MessageSquare className="h-4 w-4 mr-2" /> {copiedMessageId === contact.id ? "Copied" : "Copy Message"}
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="deploy">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle>Deploy checklist for Vercel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-600 leading-6">
                <div>
                  <p className="font-medium text-slate-900">1. Keep this app in one main browser</p>
                  <p>Since data is stored locally, treat one browser on one machine as your source of truth.</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">2. Export JSON every few days</p>
                  <p>Save your backup file to iCloud Drive, Dropbox, or Google Drive before making major changes.</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">3. Deploy through GitHub + Vercel</p>
                  <p>Push the code to GitHub, import the repo into Vercel, and let Vercel handle each new deployment.</p>
                </div>
                <div>
                  <p className="font-medium text-slate-900">4. Upgrade only when you feel pain</p>
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
                  className="h-10 rounded-2xl border border-input bg-background px-3 py-2 text-sm"
                >
                  {connectionTypeOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <select
                  value={form.stage}
                  onChange={(e) => setForm((prev) => ({ ...prev, stage: e.target.value }))}
                  className="h-10 rounded-2xl border border-input bg-background px-3 py-2 text-sm"
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
      </div>
    </div>
  );
}
