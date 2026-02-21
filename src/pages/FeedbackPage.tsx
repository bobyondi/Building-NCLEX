import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, MessageSquare, Bug, Lightbulb, Star } from "lucide-react";

type FeedbackType = "bug" | "feature" | "question" | "praise";

const types: { k: FeedbackType; l: string; icon: React.ReactNode; color: string; bg: string }[] = [
  { k: "bug", l: "Bug Report", icon: <Bug size={16} />, color: "var(--nclex-red)", bg: "var(--red-s)" },
  { k: "feature", l: "Feature Request", icon: <Lightbulb size={16} />, color: "var(--gold)", bg: "var(--gold-s)" },
  { k: "question", l: "Question Issue", icon: <MessageSquare size={16} />, color: "hsl(var(--primary))", bg: "var(--accent-s)" },
  { k: "praise", l: "Send Praise", icon: <Star size={16} />, color: "var(--teal)", bg: "var(--teal-s)" },
];

export default function FeedbackPage() {
  const navigate = useNavigate();
  const [type, setType] = useState<FeedbackType | null>(null);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!type || !message.trim()) return;
    // In a real app, this would POST to a backend
    // For now, save to localStorage as a feedback queue
    try {
      const existing = JSON.parse(localStorage.getItem("nclex-feedback") || "[]");
      existing.push({ type, message, date: new Date().toISOString() });
      localStorage.setItem("nclex-feedback", JSON.stringify(existing));
    } catch { /* ignore */ }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "hsl(var(--background))" }}>
        <div className="max-w-[400px] w-full text-center" style={{ animation: "fadeUp 0.4s ease" }}>
          <div className="w-14 h-14 rounded-[16px] flex items-center justify-center mx-auto mb-4" style={{ background: "var(--green-s)" }}>
            <Send size={22} style={{ color: "var(--teal)" }} />
          </div>
          <h2 className="text-[24px] font-extrabold mb-[6px]" style={{ letterSpacing: "-0.03em" }}>Thank you!</h2>
          <p className="text-[14px] leading-[1.5] mb-6" style={{ color: "var(--text-secondary)" }}>
            Your feedback helps us build a better NCLEX prep experience for everyone.
          </p>
          <button className="btn btn-p" onClick={() => navigate("/dashboard")} style={{ padding: "14px 28px" }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "hsl(var(--background))" }}>
      <div className="max-w-[460px] w-full" style={{ animation: "fadeUp 0.4s ease" }}>
        <button className="btn btn-g mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft size={15} /> Back
        </button>

        <h2 className="text-[26px] font-extrabold mb-[6px]" style={{ letterSpacing: "-0.03em" }}>Send Feedback</h2>
        <p className="text-[14px] mb-5 leading-[1.5]" style={{ color: "var(--text-secondary)" }}>
          Help us improve NCLEXPrep. Every message is read.
        </p>

        <div className="mb-4">
          <label className="text-[13px] font-bold mb-2 block">What type of feedback?</label>
          <div className="grid grid-cols-2 gap-[8px]">
            {types.map((t) => (
              <button
                key={t.k}
                className={`mo${type === t.k ? " on" : ""}`}
                onClick={() => setType(t.k)}
                style={{ justifyContent: "flex-start", padding: "14px 16px" }}
              >
                <span style={{ color: type === t.k ? t.color : "var(--text-tertiary)" }}>{t.icon}</span>
                <span className="text-[13px]">{t.l}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="text-[13px] font-bold mb-2 block">Your message</label>
          <textarea
            className="ei"
            style={{ paddingLeft: 16, minHeight: 120, resize: "vertical", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
            placeholder={
              type === "bug" ? "Describe what happened and what you expected..."
              : type === "feature" ? "What feature would make your study experience better?"
              : type === "question" ? "Which question has an issue? What seems wrong?"
              : "What do you love about NCLEXPrep?"
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button
          className={`btn ${type && message.trim() ? "btn-p" : "btn-d"}`}
          onClick={handleSubmit}
          style={{ width: "100%", padding: 15, borderRadius: 12, fontSize: 15 }}
        >
          <Send size={15} /> Send Feedback
        </button>
      </div>
    </div>
  );
}
