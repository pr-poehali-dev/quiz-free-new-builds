import Icon from "@/components/ui/icon";

type Section = "hero" | "quiz" | "form" | "result" | "about" | "contacts";

interface NavBarProps {
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  scrollTo: (section: Section) => void;
  startQuiz: () => void;
}

export default function NavBar({ menuOpen, setMenuOpen, scrollTo, startQuiz }: NavBarProps) {
  return (
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
  );
}
