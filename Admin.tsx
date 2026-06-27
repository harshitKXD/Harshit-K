export default function MarqueeSection() {
  const words = [
    "Handcrafted",
    "Heirloom",
    "Sustainable",
    "Imaginative",
    "Timeless",
    "Curious",
    "Wonder",
    "Artisanal",
  ];

  return (
    <section
      className="py-6 sm:py-8 overflow-hidden border-y"
      style={{
        backgroundColor: "var(--burgundy)",
        borderColor: "rgba(247,241,227,0.1)",
      }}
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {[...words, ...words, ...words, ...words].map((word, i) => (
          <span
            key={i}
            className="mx-6 sm:mx-10 text-lg sm:text-xl md:text-2xl font-medium uppercase tracking-[0.2em] flex items-center gap-6 sm:gap-10"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: "var(--cream)",
              opacity: 0.8,
            }}
          >
            {word}
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: "var(--mustard)" }}
            />
          </span>
        ))}
      </div>
    </section>
  );
}
