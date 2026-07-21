import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal";

export default function About() {
  const revealRef = useReveal();

  return (
    <section id="innovations" className="py-24 overflow-hidden scroll-mt-24">
      <div
        ref={revealRef}
        className="container mx-auto px-6 md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-20 items-center transition-all duration-1000 opacity-0 translate-y-10 ease-premium"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-secondary/10 blur-3xl rounded-full -z-10"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <img
                className="w-full h-64 object-cover rounded-3xl"
                alt="Ingénieur électronique examinant une puce"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHlaBIYuRkgREtjqV6p6m2ckJc3z0Kqee2K2AtrUiKTDb2esgj2iNegDHgLxtCoF43Oa_BTXk22qvTqDFGkR3f5RTA-fKyQRCFt4ftMdwtNCP5SDDeaDnhTVCj3KI13tTvcp5OqmY7OsrhiPEAaVSkANMlfT0cIyK3hm5C5CMNk2sWeaJfn1GaAqm0AZDY2h8h3hMFtd89u9tHLyAj7HVWh9ceKQpqd2ix-7jQZnIO9YXchV8YGK4n"
              />
              <img
                className="w-full h-80 object-cover rounded-3xl"
                alt="Interface domotique premium"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqbjJ1CMCGL4kJ1km1eTw9QqAm_4HudqcTSHSlpuK93IQWsrzrwOs4wlRqhltvvxbHCW0_rJcgNxb1ni7k_By9yEXzmJlUHF68dAyv4f3R-x-AzcmSMgWfzKXjAgiPnAc7Q9PHJNfwyVPwO7xr3mTGG_2GwoN8aJleNZB6pKe7ZJ9oI2jzmdRErGQFGcq_yj4w1Apc1F8j7Sg8EvhZD9fr-LQ_51ogHASwfT_AC10pJwrvQPjRxHUa"
              />
            </div>
            <div className="space-y-4">
              <img
                className="w-full h-80 object-cover rounded-3xl"
                alt="Centre de sécurité data moderne"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZE95flrV9Yc_e2aFisErIORN4O_gcfB2Lt0X1QqE2wgis5qsAjeRvCd8VDOCSJzhFyAQDnZYv-LFp9QPxCyZZvqMc35jIcROH2fRdHidnwToyjoFh_LhdJGq85LGfTkiWlCRpIa9k5HuYMGShJzp8lVoiFUFb2-nMcPJuhRzOUQS144PN-8g0DuxWOC5bUIJun3IBk3NmND2sVBk3wQ8bXJuVheAYJjipOGTXPvHDWqVpIaweOEN6"
              />
              <img
                className="w-full h-64 object-cover rounded-3xl"
                alt="Technicien installant un capteur biométrique"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuIuFGymc0FZhgg78NUkhaptz5wrRck2sEA22o7iyjqD0mg44P7myyZN0PruQ0al2FuMgDnILiksrCen6AUrOH_nqaHZkYPe68pSW9ELG5JO5fWshH6lr0QYB2novCW_lzH9zvOfEtzdrBG0KCfR9rtkYlRfJ1JPZV6hGoX6nMjOh46FH4CG1vuQWlE9gMMXsPLRYV4Ci4jt27XY622tpJkyqhZ_CnxoujIN3DDMckbAwMdElIxLj6"
              />
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <span className="text-secondary font-bold tracking-widest text-label-sm uppercase">
            L'Excellence Ingénierie
          </span>
          <h2 className="font-display-lg text-headline-lg leading-tight md:text-display-md">
            L'expertise d'une équipe passionnée.
          </h2>
          <p className="text-body-lg text-on-surface-variant leading-relaxed">
            RAMYA TECHNOLOGIE &amp; INNOVATION n'est pas seulement un installateur ; nous sommes vos partenaires
            stratégiques. Notre équipe d'ingénieurs experts travaille sans relâche pour transformer les défis
            complexes en solutions intuitives.
          </p>
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mt-1">
                <span className="material-symbols-outlined text-lg">verified</span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface">Precision Militaire</h4>
                <p className="text-on-surface-variant text-sm">
                  Chaque composant est rigoureusement testé pour garantir une performance sans faille.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary mt-1">
                <span className="material-symbols-outlined text-lg">psychology</span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface">Design Intelligent</h4>
                <p className="text-on-surface-variant text-sm">
                  L'innovation centrée sur l'humain pour une adoption facile et une sécurité accrue.
                </p>
              </div>
            </li>
          </ul>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary-container text-white rounded-full font-bold text-body-md hover:brightness-110 hover:scale-105 transition-all ease-premium"
          >
            Un projet en tête ? Parlons-en
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
