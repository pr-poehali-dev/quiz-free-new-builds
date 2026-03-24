import Icon from "@/components/ui/icon";

type Section = "hero" | "quiz" | "form" | "result" | "about" | "contacts";

interface ContactsSectionProps {
  scrollTo: (section: Section) => void;
  startQuiz: () => void;
}

export default function ContactsSection({ scrollTo, startQuiz }: ContactsSectionProps) {
  return (
    <>
      <section className="pt-16 min-h-screen mesh-bg">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-orange-50 text-brand-orange text-sm font-semibold px-4 py-2 rounded-full mb-4">
              <Icon name="Phone" size={14} />
              Контакты
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-wide mb-4">
              Свяжитесь с нами
            </h2>
            <p className="text-muted-foreground text-lg">
              Готовы ответить на любые вопросы
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 animate-slide-up">
            {[
              { icon: "Phone", label: "Телефон", value: "+7 (999) 123-45-67", sub: "Ежедневно 10:00–21:00" },
              { icon: "MessageCircle", label: "WhatsApp / Telegram", value: "@novarealty", sub: "Ответим в течение 15 минут" },
              { icon: "Mail", label: "Email", value: "hello@novarealty.ru", sub: "Для официальных запросов" },
              { icon: "MapPin", label: "Офис", value: "Москва, ул. Тверская, 12", sub: "Приём по предварительной записи" },
            ].map((contact) => (
              <div key={contact.label} className="stat-card bg-white rounded-3xl p-6 border border-border flex gap-4 items-start">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Icon name={contact.icon} size={20} className="text-white" fallback="Phone" />
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">{contact.label}</div>
                  <div className="font-bold text-foreground">{contact.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{contact.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-brand-dark rounded-3xl p-10 text-center animate-fade-in">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white uppercase tracking-wide mb-3">
              Начните прямо сейчас
            </h3>
            <p className="text-white/70 mb-6">
              Пройдите квиз за 5 минут и получите персональную подборку новостроек
            </p>
            <button
              onClick={startQuiz}
              className="btn-primary px-10 py-4 rounded-2xl text-base font-semibold inline-flex items-center gap-2"
            >
              Пройти квиз бесплатно
              <Icon name="ArrowRight" size={18} />
            </button>
          </div>
        </div>
      </section>

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
    </>
  );
}
