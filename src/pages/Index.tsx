import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/7836bc18-fe8d-4921-b150-7b667c156951/files/9519dd06-b186-490c-a101-ab86e2a5853d.jpg";
const AGENT_IMG = "https://cdn.poehali.dev/projects/7836bc18-fe8d-4921-b150-7b667c156951/files/547f23ce-dfe0-4b6d-bd0c-95cc45888a23.jpg";
const SEND_LEAD_URL = "https://functions.poehali.dev/a5ec6d41-dffd-4e7e-b571-6b5bdaf450e5";

const quizSteps = [
  {
    id: 1,
    question: "Какой тип недвижимости вас интересует?",
    emoji: "🏠",
    options: [
      { id: "studio", label: "Студия", icon: "Square" },
      { id: "1room", label: "1-комнатная", icon: "Home" },
      { id: "2room", label: "2-комнатная", icon: "Building" },
      { id: "3room", label: "3+ комнаты", icon: "Building2" },
    ],
  },
  {
    id: 2,
    question: "Для каких целей покупаете?",
    emoji: "🎯",
    options: [
      { id: "live", label: "Для проживания", icon: "Heart" },
      { id: "invest", label: "Инвестиции", icon: "TrendingUp" },
      { id: "rent", label: "Под аренду", icon: "Key" },
      { id: "children", label: "Детям / близким", icon: "Users" },
    ],
  },
  {
    id: 3,
    question: "Какой бюджет рассматриваете?",
    emoji: "💰",
    options: [
      { id: "budget1", label: "До 5 млн ₽", icon: "Wallet" },
      { id: "budget2", label: "5–10 млн ₽", icon: "CreditCard" },
      { id: "budget3", label: "10–20 млн ₽", icon: "Banknote" },
      { id: "budget4", label: "Свыше 20 млн ₽", icon: "Gem" },
    ],
  },
  {
    id: 4,
    question: "Предпочтительная локация?",
    emoji: "📍",
    options: [
      { id: "center", label: "Центр города", icon: "MapPin" },
      { id: "suburb", label: "Новые районы", icon: "Map" },
      { id: "eco", label: "Экология и парки", icon: "TreePine" },
      { id: "transport", label: "Рядом с метро", icon: "Train" },
    ],
  },
  {
    id: 5,
    question: "Когда планируете покупку?",
    emoji: "📅",
    options: [
      { id: "now", label: "Прямо сейчас", icon: "Zap" },
      { id: "3month", label: "В течение 3 месяцев", icon: "Clock" },
      { id: "6month", label: "В течение полугода", icon: "Calendar" },
      { id: "year", label: "Просто изучаю рынок", icon: "Search" },
    ],
  },
];

type Section = "hero" | "quiz" | "form" | "result" | "about" | "contacts";

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [menuOpen, setMenuOpen] = useState(false);

  const totalSteps = quizSteps.length;

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

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => scrollTo("hero")}
            className="font-display text-xl font-bold text-brand-dark tracking-wide"
          >
            NOVA<span className="text-brand-orange">REALTY</span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "О сервисе", key: "about" },
              { label: "Контакты", key: "contacts" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => scrollTo(item.key as Section)}
                className="nav-link text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={startQuiz}
              className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold"
            >
              Пройти квиз
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary"
          >
            <Icon name={menuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-border px-4 pb-4 pt-2 flex flex-col gap-3 animate-fade-in">
            <button onClick={() => scrollTo("about")} className="text-left py-2 text-sm font-medium hover:text-brand-orange transition-colors">О сервисе</button>
            <button onClick={() => scrollTo("contacts")} className="text-left py-2 text-sm font-medium hover:text-brand-orange transition-colors">Контакты</button>
            <button onClick={startQuiz} className="btn-primary py-3 rounded-xl text-sm font-semibold mt-1">Пройти квиз бесплатно</button>
          </div>
        )}
      </nav>

      {/* HERO */}
      {activeSection === "hero" && (
        <section className="pt-16 min-h-screen relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMG})` }}
          />
          <div className="absolute inset-0 hero-gradient opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />

          <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-24 min-h-screen flex flex-col justify-center">
            <div className="max-w-2xl animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-6 border border-white/20">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-soft" />
                Бесплатный подбор · Без скрытых платежей
              </div>

              <h1 className="font-display text-5xl md:text-7xl text-white leading-tight mb-6 uppercase tracking-wide">
                Найди свою
                <br />
                <span className="text-brand-orange">идеальную</span>
                <br />
                новостройку
              </h1>

              <p className="text-white/80 text-lg md:text-xl mb-10 leading-relaxed">
                Пройдите 5-минутный квиз — получите персональную подборку объектов и консультацию агента бесплатно
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={startQuiz}
                  className="btn-primary px-8 py-4 rounded-2xl text-base font-semibold flex items-center justify-center gap-2"
                >
                  Подобрать бесплатно
                  <Icon name="ArrowRight" size={18} />
                </button>
                <button
                  onClick={() => scrollTo("about")}
                  className="px-8 py-4 rounded-2xl border border-white/30 text-white hover:bg-white/10 transition-all text-base font-medium"
                >
                  Узнать подробнее
                </button>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl animate-fade-in">
              {[
                { value: "500+", label: "Сделок закрыто" },
                { value: "8 лет", label: "Опыт работы" },
                { value: "98%", label: "Довольных клиентов" },
                { value: "0 ₽", label: "Стоимость подбора" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15 text-center">
                  <div className="font-display text-2xl font-bold text-brand-orange">{stat.value}</div>
                  <div className="text-white/70 text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
            <div className="w-8 h-12 border-2 border-white/30 rounded-full flex items-start justify-center pt-2">
              <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse-soft" />
            </div>
          </div>
        </section>
      )}

      {/* QUIZ */}
      {activeSection === "quiz" && (
        <section className="pt-16 min-h-screen mesh-bg flex items-center">
          <div className="max-w-2xl mx-auto px-4 py-12 w-full">
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">
                  Вопрос {currentStep + 1} из {totalSteps}
                </span>
                <span className="text-sm font-bold text-brand-orange">
                  {Math.round(((currentStep + 1) / totalSteps) * 100)}%
                </span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="progress-bar h-full rounded-full"
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 animate-scale-in">
              <div className="text-5xl mb-4">{quizSteps[currentStep].emoji}</div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 uppercase tracking-wide leading-tight">
                {quizSteps[currentStep].question}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {quizSteps[currentStep].options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionSelect(opt.id)}
                    className={`quiz-option border-2 rounded-2xl p-4 text-left flex items-center gap-3 ${
                      selectedOption === opt.id
                        ? "selected"
                        : "border-border hover:border-brand-orange bg-secondary/50"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      selectedOption === opt.id ? "bg-white/20" : "bg-white"
                    }`}>
                      <Icon
                        name={opt.icon}
                        size={20}
                        className={selectedOption === opt.id ? "text-white" : "text-brand-orange"}
                        fallback="Star"
                      />
                    </div>
                    <span className="font-medium text-sm">{opt.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="px-6 py-3.5 rounded-xl border-2 border-border hover:border-brand-orange text-foreground font-semibold transition-all hover:bg-secondary flex items-center gap-2"
                >
                  <Icon name="ArrowLeft" size={16} />
                  Назад
                </button>
                <button
                  onClick={handleNext}
                  disabled={!selectedOption}
                  className={`flex-1 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                    selectedOption
                      ? "btn-primary"
                      : "bg-secondary text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {currentStep < totalSteps - 1 ? "Следующий вопрос" : "Получить подборку"}
                  <Icon name="ArrowRight" size={16} />
                </button>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-4">
              🔒 Ваши данные в безопасности. Результаты сразу после квиза.
            </p>
          </div>
        </section>
      )}

      {/* FORM */}
      {activeSection === "form" && (
        <section className="pt-16 min-h-screen mesh-bg flex items-center">
          <div className="max-w-lg mx-auto px-4 py-12 w-full">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 animate-scale-in">
              <div className="text-center mb-8">
                <div className="text-4xl mb-3">🎉</div>
                <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wide mb-2">
                  Отлично! Квиз пройден
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Введите контактные данные — получите персональную подборку новостроек прямо сейчас
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">Ваше имя</label>
                  <input
                    type="text"
                    placeholder="Александр"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full border-2 border-border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-orange transition-colors bg-secondary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">Телефон</label>
                  <input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full border-2 border-border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-orange transition-colors bg-secondary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    Email <span className="text-muted-foreground font-normal">(опционально)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border-2 border-border rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-brand-orange transition-colors bg-secondary/30"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-4 rounded-xl text-base font-semibold mt-2 flex items-center justify-center gap-2"
                >
                  Получить подборку бесплатно
                  <Icon name="Send" size={18} />
                </button>
              </form>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
              </p>
            </div>
          </div>
        </section>
      )}

      {/* RESULT */}
      {activeSection === "result" && (
        <section className="pt-16 min-h-screen mesh-bg flex items-center">
          <div className="max-w-2xl mx-auto px-4 py-12 w-full animate-slide-up">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="hero-gradient p-8 text-center">
                <div className="text-5xl mb-4">🏆</div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white uppercase tracking-wide mb-2">
                  Заявка принята!
                </h2>
                <p className="text-white/80">
                  Спасибо{formData.name ? `, ${formData.name}` : ""}! Скоро с вами свяжемся.
                </p>
              </div>

              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                  <img
                    src={AGENT_IMG}
                    alt="Агент"
                    className="w-24 h-24 rounded-2xl object-cover flex-shrink-0 mx-auto md:mx-0"
                  />
                  <div>
                    <h3 className="font-display text-xl font-bold uppercase mb-1">Ваш личный агент</h3>
                    <p className="text-brand-orange font-semibold text-sm mb-3">Специалист по новостройкам</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Я изучу ваши ответы и свяжусь с вами в течение 15 минут с персональной подборкой объектов по вашим критериям.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {[
                    { icon: "FileText", title: "Презентация объектов", desc: "Топ-10 новостроек под ваш запрос" },
                    { icon: "Calculator", title: "Расчёт ипотеки", desc: "Лучшие ставки от банков-партнёров" },
                    { icon: "Shield", title: "Юридическая проверка", desc: "Проверка застройщика и документов" },
                    { icon: "BadgePercent", title: "Скидки от застройщика", desc: "Эксклюзивные акции и бонусы" },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-3 p-4 bg-secondary/50 rounded-2xl">
                      <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon name={item.icon} size={18} className="text-white" fallback="Star" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{item.title}</div>
                        <div className="text-muted-foreground text-xs mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100 rounded-2xl p-5 mb-6 flex gap-3 items-start">
                  <Icon name="Clock" size={20} className="text-brand-orange flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm">Ожидайте звонка</div>
                    <div className="text-muted-foreground text-xs mt-1">
                      Свяжемся в течение 15 минут в рабочее время (10:00–21:00)
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => scrollTo("hero")}
                  className="w-full py-3.5 rounded-xl border-2 border-border hover:border-brand-orange text-foreground font-semibold transition-all hover:bg-secondary text-sm"
                >
                  Вернуться на главную
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ABOUT */}
      {activeSection === "about" && (
        <section className="pt-16 min-h-screen mesh-bg">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center mb-14 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-orange-50 text-brand-orange text-sm font-semibold px-4 py-2 rounded-full mb-4">
                <Icon name="Star" size={14} />
                О сервисе
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-wide mb-4">
                Почему выбирают нас?
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Профессиональный подбор новостроек с заботой о каждом клиенте
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-slide-up">
              {[
                { emoji: "⚡", title: "Быстро", desc: "Подборка готова за 15 минут после прохождения квиза. Никаких долгих ожиданий." },
                { emoji: "🛡️", title: "Безопасно", desc: "Проверяем каждого застройщика и документы перед тем, как рекомендовать объект." },
                { emoji: "🎁", title: "Выгодно", desc: "Получаем эксклюзивные условия и скидки от застройщиков для наших клиентов." },
                { emoji: "🤝", title: "Бесплатно", desc: "Наши услуги оплачивает застройщик. Для вас — всё абсолютно бесплатно." },
                { emoji: "🏆", title: "Опыт", desc: "8 лет на рынке, 500+ закрытых сделок, партнёрство с 50+ застройщиками." },
                { emoji: "📍", title: "Весь рынок", desc: "Подбираем из всех доступных новостроек, а не только из ограниченного списка." },
              ].map((card) => (
                <div key={card.title} className="stat-card bg-white rounded-3xl p-7 border border-border">
                  <div className="text-3xl mb-4">{card.emoji}</div>
                  <h3 className="font-display text-xl font-bold uppercase tracking-wide mb-2">{card.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl p-8 md:p-12 border border-border animate-fade-in">
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <img
                  src={AGENT_IMG}
                  alt="Агент по недвижимости"
                  className="w-48 h-48 rounded-3xl object-cover flex-shrink-0"
                />
                <div>
                  <div className="inline-flex items-center gap-2 bg-orange-50 text-brand-orange text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
                    <Icon name="Award" size={12} />
                    Персональный агент
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wide mb-3">
                    Ваш эксперт по новостройкам
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Специализируюсь на рынке первичной недвижимости уже 8 лет. Знаю всех застройщиков, слежу за новыми проектами и помогаю находить лучшие объекты по оптимальной цене.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Аккредитован банками", "Партнёр 50+ ЖК", "Бесплатная консультация"].map((tag) => (
                      <span key={tag} className="bg-secondary text-foreground text-xs font-medium px-3 py-1.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <button
                onClick={startQuiz}
                className="btn-primary px-10 py-4 rounded-2xl text-base font-semibold inline-flex items-center gap-2"
              >
                Начать подбор бесплатно
                <Icon name="ArrowRight" size={18} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CONTACTS */}
      {activeSection === "contacts" && (
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
      )}

      {/* FOOTER */}
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

    </div>
  );
}