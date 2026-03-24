import Icon from "@/components/ui/icon";

const AGENT_IMG = "https://cdn.poehali.dev/projects/7836bc18-fe8d-4921-b150-7b667c156951/files/547f23ce-dfe0-4b6d-bd0c-95cc45888a23.jpg";

interface AboutSectionProps {
  startQuiz: () => void;
}

export default function AboutSection({ startQuiz }: AboutSectionProps) {
  return (
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
  );
}
