import { useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Download,
  FileText,
  Info,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Truck,
} from "lucide-react";
import type {
  Charges,
  ConsignmentForm,
  ConsignmentItem,
  Party,
  Transporter,
} from "./types";

const blankParty: Party = { name: "", address: "", gstNumber: "" };
const blankItem: ConsignmentItem = {
  quantity: "",
  description: "",
  weight: "",
  rate: "",
  amount: "",
  payment: "",
  invoiceNumber: "",
};
const blankCharges: Charges = {
  rto: "",
  additionalOtherCharges: "",
  hamali: "",
  other: "",
  door: "",
  station: "",
};

const defaultTransporter: Transporter = {
  name: "JAY SPEED CARGO",
  address: "Aqua Mist Society, 605, Shinde Wasti, Ravet, Pune - 412101",
  email: "jayspeedcargo7@gmail.com",
  phone: "9766830931",
  alternatePhone: "9607920511",
  enrollmentNumber: "27APFPD0968J1ZS",
  jurisdiction: "Pimpri",
};

function localDate(): string {
  const date = new Date();
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

const initialForm: ConsignmentForm = {
  transporter: { ...defaultTransporter },
  consignmentNumber: "",
  date: localDate(),
  insuranceStatus: "not_insured",
  insuranceCompany: "",
  insurancePolicyNumber: "",
  insuranceDate: "",
  insuranceAmount: "",
  consignor: { ...blankParty },
  consignee: { ...blankParty },
  gstPayableBy: "Consignor",
  vehicleNumber: "",
  origin: "",
  destination: "",
  eWayBillNumber: "",
  items: [{ ...blankItem }],
  charges: { ...blankCharges },
  total: "",
  declaredValue: "",
  vehicleType: "",
  receiverName: "",
  notes: "",
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {required && <span className="required"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        step={type === "number" ? "any" : undefined}
        placeholder={placeholder}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <span className="select-wrap">
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown size={16} aria-hidden="true" />
      </span>
    </label>
  );
}

function Section({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="form-section">
      <div className="section-heading">
        <span className="section-number">{number}</span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function PartyFields({
  title,
  party,
  onChange,
}: {
  title: string;
  party: Party;
  onChange: (key: keyof Party, value: string) => void;
}) {
  return (
    <div className="party-card">
      <h3>{title}</h3>
      <Field
        label="Company / person name"
        value={party.name}
        onChange={(value) => onChange("name", value)}
        placeholder={title === "Consignor" ? "Name of sender" : "Name of recipient"}
        required
      />
      <TextAreaField
        label="Full address"
        value={party.address}
        onChange={(value) => onChange("address", value)}
        placeholder="Street, area, city, state and PIN code"
        rows={3}
      />
      <Field
        label="GST number"
        value={party.gstNumber}
        onChange={(value) => onChange("gstNumber", value)}
        placeholder="e.g. 27AABCU9603R1ZM"
      />
    </div>
  );
}

function App() {
  const [form, setForm] = useState<ConsignmentForm>(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [savedNumber, setSavedNumber] = useState("");
  const [error, setError] = useState("");

  function update<K extends keyof ConsignmentForm>(
    key: K,
    value: ConsignmentForm[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setSavedNumber("");
  }

  function updateParty(side: "consignor" | "consignee", key: keyof Party, value: string) {
    setForm((current) => ({
      ...current,
      [side]: { ...current[side], [key]: value },
    }));
    setSavedNumber("");
  }

  function updateTransporter(key: keyof Transporter, value: string) {
    setForm((current) => ({
      ...current,
      transporter: { ...current.transporter, [key]: value },
    }));
    setSavedNumber("");
  }

  function updateItem(index: number, key: keyof ConsignmentItem, value: string) {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
    setSavedNumber("");
  }

  function addItem() {
    update("items", [...form.items, { ...blankItem }]);
  }

  function removeItem(index: number) {
    update(
      "items",
      form.items.filter((_, itemIndex) => itemIndex !== index),
    );
  }

  function updateCharge(key: keyof Charges, value: string) {
    setForm((current) => ({
      ...current,
      charges: { ...current.charges, [key]: value },
    }));
    setSavedNumber("");
  }

  async function downloadPDF(id: string) {
    setIsDownloadingPdf(true);
    setError("");
    try {
      const response = await fetch(`/api/consignments/${encodeURIComponent(id)}/pdf`);
      if (!response.ok) {
        let message = "Could not generate the consignment PDF.";
        try {
          const result: { error?: string } = await response.json();
          message = result.error || message;
        } catch {
          // Keep the readable default when the server does not return JSON.
        }
        throw new Error(message);
      }

      const pdf = await response.blob();
      if (pdf.type !== "application/pdf" || pdf.size === 0) {
        throw new Error("The server returned an invalid PDF.");
      }
      const url = URL.createObjectURL(pdf);
      const link = document.createElement("a");
      const filename = response.headers
        .get("Content-Disposition")
        ?.match(/filename="([^"]+)"/i)?.[1];
      link.href = url;
      link.download = filename || `consignment-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? `Consignment saved, but PDF download failed: ${downloadError.message}`
          : "Consignment saved, but PDF download failed.",
      );
    } finally {
      setIsDownloadingPdf(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setSavedNumber("");

    try {
      const response = await fetch("/api/consignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      let result: { id?: string; error?: string };
      try {
        result = await response.json();
      } catch {
        throw new Error("The server returned an invalid response.");
      }
      if (!response.ok) {
        throw new Error(result.error || "Could not save this consignment note.");
      }
      if (!result.id) {
        throw new Error("The server saved the form but returned no record ID.");
      }
      setSavedNumber(result.id);
      await downloadPDF(result.id);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? `${submitError.message} Make sure the Go backend is running on port 8080.`
          : "An unexpected error occurred while saving the form.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Spectrum home">
          <span className="brand-mark"><Truck size={19} strokeWidth={2.2} /></span>
          <span>{form.transporter.name || "Your company"}<span className="brand-muted"> Logistics</span></span>
        </a>
        <div className="topbar-right">
          <span className="draft-label"><span className="draft-dot" /> New document</span>
          <span className="avatar">JL</span>
        </div>
      </header>

      <div className="page-content">
        <a className="back-link" href="#">
          <ArrowLeft size={15} /> Documents
        </a>

        <div className="page-title-row">
          <div>
            <div className="eyebrow"><FileText size={14} /> TRANSPORT DOCUMENT</div>
            <h1>New consignment note</h1>
            <p className="page-subtitle">Enter shipment and billing details to create a consignment note.</p>
          </div>
          <div className="step-pill"><span>1</span> Details <span className="step-divider" /> <span className="step-next">2</span> PDF preview</div>
        </div>

        <div className="notice">
          <Info size={17} />
          <p>Fill in the details below. Saving generates a PDF with the consignor, consignee and driver copies.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Section number="01" title="Transporter details" description="These details are taken from the supplied consignment-note sample. Edit them for your business.">
            <div className="field-grid field-grid-three">
              <Field label="Transporter name" value={form.transporter.name} onChange={(value) => updateTransporter("name", value)} required />
              <Field label="Email address" type="email" value={form.transporter.email} onChange={(value) => updateTransporter("email", value)} />
              <Field label="Phone number" type="tel" value={form.transporter.phone} onChange={(value) => updateTransporter("phone", value)} />
              <TextAreaField label="Transporter address" value={form.transporter.address} onChange={(value) => updateTransporter("address", value)} placeholder="Street, area, city and PIN code" rows={2} />
              <Field label="Alternate phone" type="tel" value={form.transporter.alternatePhone} onChange={(value) => updateTransporter("alternatePhone", value)} />
              <Field label="Enrollment / registration number" value={form.transporter.enrollmentNumber} onChange={(value) => updateTransporter("enrollmentNumber", value)} />
              <Field label="Jurisdiction" value={form.transporter.jurisdiction} onChange={(value) => updateTransporter("jurisdiction", value)} />
            </div>
          </Section>

          <Section number="02" title="Consignment details" description="Reference, date and insurance information for this shipment.">
            <div className="field-grid field-grid-three">
              <Field
                label="Consignment note number"
                value={form.consignmentNumber}
                onChange={(value) => update("consignmentNumber", value)}
                placeholder="e.g. 8468"
                required
              />
              <Field
                label="Document date"
                type="date"
                value={form.date}
                onChange={(value) => update("date", value)}
                required
              />
              <div className="field">
                <span className="field-label">PDF copies</span>
                <div className="readonly-value">Consignor, consignee and driver</div>
              </div>
            </div>

            <div className="subsection-title"><ShieldCheck size={16} /> Cargo insurance</div>
            <div className="radio-row">
              <label className={`radio-card ${form.insuranceStatus === "not_insured" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="insurance"
                  checked={form.insuranceStatus === "not_insured"}
                  onChange={() => update("insuranceStatus", "not_insured")}
                />
                <span className="radio-indicator" />
                <span><strong>Not insured</strong><small>At owner's risk</small></span>
              </label>
              <label className={`radio-card ${form.insuranceStatus === "insured" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="insurance"
                  checked={form.insuranceStatus === "insured"}
                  onChange={() => update("insuranceStatus", "insured")}
                />
                <span className="radio-indicator" />
                <span><strong>Insured</strong><small>Add policy details</small></span>
              </label>
            </div>
            {form.insuranceStatus === "insured" && (
              <div className="field-grid field-grid-four insurance-fields">
                <Field label="Insurance company" value={form.insuranceCompany} onChange={(value) => update("insuranceCompany", value)} placeholder="Company name" />
                <Field label="Policy number" value={form.insurancePolicyNumber} onChange={(value) => update("insurancePolicyNumber", value)} placeholder="Policy reference" />
                <Field label="Policy date" type="date" value={form.insuranceDate} onChange={(value) => update("insuranceDate", value)} />
                <Field label="Insured amount (₹)" type="number" value={form.insuranceAmount} onChange={(value) => update("insuranceAmount", value)} placeholder="0.00" />
              </div>
            )}
          </Section>

          <Section number="03" title="Parties" description="Add the consignor and consignee exactly as they should appear on the note.">
            <div className="party-grid">
              <PartyFields title="Consignor" party={form.consignor} onChange={(key, value) => updateParty("consignor", key, value)} />
              <PartyFields title="Consignee" party={form.consignee} onChange={(key, value) => updateParty("consignee", key, value)} />
            </div>
            <div className="billing-row">
              <div>
                <strong>GST payable by</strong>
                <span>Choose which party is responsible for GST charges.</span>
              </div>
              <SelectField
                label="GST payable by"
                value={form.gstPayableBy}
                onChange={(value) => update("gstPayableBy", value)}
                options={["Consignor", "Consignee", "Third party"]}
              />
            </div>
          </Section>

          <Section number="04" title="Route & vehicle" description="Tell us where the shipment is going and how it will travel.">
            <div className="field-grid field-grid-three">
              <Field label="Lorry No" value={form.vehicleNumber} onChange={(value) => update("vehicleNumber", value)} placeholder="e.g. MH12AB1234" />
              <Field label="From" value={form.origin} onChange={(value) => update("origin", value)} placeholder="Origin city" required />
              <Field label="To" value={form.destination} onChange={(value) => update("destination", value)} placeholder="Destination city" required />
              <Field label="E-Way Bill No" value={form.eWayBillNumber} onChange={(value) => update("eWayBillNumber", value)} placeholder="E-way bill reference" />
              <Field label="Vehicle type" value={form.vehicleType} onChange={(value) => update("vehicleType", value)} placeholder="e.g. 10 feet" />
            </div>
          </Section>

          <Section number="05" title="Goods & charges" description="List the goods being transported and any applicable charges.">
            <div className="items-heading">
              <h3>Consignment items</h3>
              <button type="button" className="button button-outline button-small" onClick={addItem}><Plus size={15} /> Add item</button>
            </div>
            {form.items.map((item, index) => (
              <div className="item-card" key={index}>
                <div className="item-card-heading">
                  <span className="item-number">Item {String(index + 1).padStart(2, "0")}</span>
                  {form.items.length > 1 && (
                    <button type="button" className="icon-button danger" aria-label={`Remove item ${index + 1}`} onClick={() => removeItem(index)}><Trash2 size={15} /></button>
                  )}
                </div>
                <div className="field-grid item-grid">
                  <Field label="Description of goods" value={item.description} onChange={(value) => updateItem(index, "description", value)} placeholder="What are you transporting?" />
                  <Field label="Invoice number" value={item.invoiceNumber} onChange={(value) => updateItem(index, "invoiceNumber", value)} placeholder="Invoice reference" />
                  <Field label="Quantity" type="number" value={item.quantity} onChange={(value) => updateItem(index, "quantity", value)} placeholder="0" />
                  <Field label="Weight (kg / qtl)" type="number" value={item.weight} onChange={(value) => updateItem(index, "weight", value)} placeholder="0.00" />
                  <Field label="Rate (₹)" type="number" value={item.rate} onChange={(value) => updateItem(index, "rate", value)} placeholder="0.00" />
                  <Field label="Amount (₹)" type="number" value={item.amount} onChange={(value) => updateItem(index, "amount", value)} placeholder="0.00" />
                  <Field label="To pay / paid" value={item.payment} onChange={(value) => updateItem(index, "payment", value)} placeholder="e.g. To be billed" />
                </div>
              </div>
            ))}

            <div className="subsection-title charges-title">Additional charges <span>₹ INR</span></div>
            <div className="field-grid field-grid-three">
              <Field label="RTO charges (₹)" type="number" value={form.charges.rto} onChange={(value) => updateCharge("rto", value)} placeholder="0.00" />
              <Field label="A.O.C. (₹)" type="number" value={form.charges.additionalOtherCharges} onChange={(value) => updateCharge("additionalOtherCharges", value)} placeholder="0.00" />
              <Field label="Hamali (₹)" type="number" value={form.charges.hamali} onChange={(value) => updateCharge("hamali", value)} placeholder="0.00" />
              <Field label="Other charges (₹)" type="number" value={form.charges.other} onChange={(value) => updateCharge("other", value)} placeholder="0.00" />
              <Field label="Door charges (₹)" type="number" value={form.charges.door} onChange={(value) => updateCharge("door", value)} placeholder="0.00" />
              <Field label="Station charges (₹)" type="number" value={form.charges.station} onChange={(value) => updateCharge("station", value)} placeholder="0.00" />
              <Field label="Total (₹)" type="number" value={form.total} onChange={(value) => update("total", value)} placeholder="0.00" />
              <Field label="Goods value (₹)" value={form.declaredValue} onChange={(value) => update("declaredValue", value)} placeholder="As per invoice" />
            </div>
          </Section>

          <Section number="06" title="Notes & receipt" description="Optional delivery notes and receiver details.">
            <div className="field-grid field-grid-two">
              <TextAreaField label="Special instructions / notes" value={form.notes} onChange={(value) => update("notes", value)} placeholder="Add any handling or delivery instructions" rows={3} />
              <Field label="Receiver name" value={form.receiverName} onChange={(value) => update("receiverName", value)} placeholder="Name on receipt" />
            </div>
            <div className="fine-print"><Info size={15} /> The carrier is not responsible for leakage, breakage or pilferage.</div>
          </Section>

          {error && <div className="feedback error-message" role="alert">{error}</div>}
          {savedNumber && <div className="feedback success-message" role="status"><Check size={17} /> Consignment saved. PDF includes all three copies. Record ID: <strong>{savedNumber}</strong><button type="button" className="button button-outline button-small download-again" onClick={() => void downloadPDF(savedNumber)} disabled={isDownloadingPdf}><Download size={14} /> {isDownloadingPdf ? "Generating PDF..." : "Download PDF again"}</button></div>}

          <footer className="form-footer">
            <span className="footer-note"><ShieldCheck size={15} /> Your document details are saved securely.</span>
            <button type="submit" className="button button-primary" disabled={isSaving || isDownloadingPdf}>
              {isSaving ? <Save size={16} /> : <Download size={16} />} {isSaving ? "Saving..." : isDownloadingPdf ? "Generating PDF..." : "Save & download PDF"} <span className="button-arrow">→</span>
            </button>
          </footer>
        </form>

        <div className="bottom-step"><span>Next up</span> PDF preview & download <span className="step-next">02</span></div>
        <footer className="site-footer"><span>© {form.transporter.name || "Your company"}</span><span>Subject to {form.transporter.jurisdiction || "local"} jurisdiction</span></footer>
      </div>
    </main>
  );
}

export default App;
