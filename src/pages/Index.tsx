import { useState } from "react";
import NavBar from "@/components/NavBar";
import QuizFlow from "@/components/QuizFlow";
import AboutSection from "@/components/AboutSection";
import ContactsSection from "@/components/ContactsSection";

const SEND_LEAD_URL = "https://functions.poehali.dev/a5ec6d41-dffd-4e7e-b571-6b5bdaf450e5";

type Section = "hero" | "quiz" | "form" | "result" | "about" | "contacts";

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [menuOpen, setMenuOpen] = useState(false);

  const totalSteps = 5;

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (!selectedOption) return;
    const newAnswers = { ...answers, [currentStep]: selectedOption };
    setAnswers(newAnswers);
    setSelectedOption(null);
    if (currentStep < totalSteps - 1) {
      setCurrentStep((p) => p + 1);
    } else {
      setActiveSection("form");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((p) => p - 1);
      setSelectedOption(answers[currentStep - 1] || null);
    } else {
      setActiveSection("hero");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(SEND_LEAD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          answers,
        }),
      });
    } catch (err) { console.error(err); }
    setActiveSection("result");
  };

  const scrollTo = (section: Section) => {
    setActiveSection(section);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setSelectedOption(null);
    setActiveSection("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen font-body">
      <NavBar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        scrollTo={scrollTo}
        startQuiz={startQuiz}
      />

      <QuizFlow
        activeSection={activeSection}
        currentStep={currentStep}
        answers={answers}
        selectedOption={selectedOption}
        formData={formData}
        setFormData={setFormData}
        handleOptionSelect={handleOptionSelect}
        handleNext={handleNext}
        handleBack={handleBack}
        handleFormSubmit={handleFormSubmit}
        scrollTo={scrollTo}
        startQuiz={startQuiz}
      />

      {activeSection === "about" && (
        <AboutSection startQuiz={startQuiz} />
      )}

      {activeSection === "contacts" && (
        <ContactsSection scrollTo={scrollTo} startQuiz={startQuiz} />
      )}

      {!["about", "contacts"].includes(activeSection) && (
        <footer className="bg-brand-dark py-8 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-display text-xl font-bold text-white tracking-wide">
              NOVA<span className="text-brand-orange">REALTY</span>
            </div>
            <div className="text-white/40 text-xs text-center">
              © 2024 NovaRealty. Профессиональный подбор новостроек
            </div>
            <div className="flex gap-4">
              {(["about", "contacts"] as Section[]).map((s) => (
                <button
                  key={s}
                  onClick={() => scrollTo(s)}
                  className="text-white/50 hover:text-white text-xs transition-colors"
                >
                  {s === "about" ? "О сервисе" : "Контакты"}
                </button>
              ))}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
