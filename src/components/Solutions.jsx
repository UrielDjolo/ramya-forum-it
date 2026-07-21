import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal";

const solutions = [
  {
    title: "Clôture électrique",
    service: "Clôture électrique",
    description: "Systèmes de dissuasion active avec alertes temps réel et haute tension sécurisée.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBh9qm1bg5zTCQVVxR1lkIV_Jfiq259PkJ7Jao74V-uokmyGj1Zs6YFCyCm5f8N1wH-Pb5t3KQyb32bYmixeOrF3aE1z-3l9PYdVatYbCh8deEZMOo36ASbPKG-B9INpvqXVvci9xj6NFVMIAhUx0Jdzc_tk0Xxy42Udaw_BIxds-l2dfgcmry2utsZgky_V3NEVbEZiHonrfo-VE7giBynN6VnzDo1RdWdyarNURAPNg7GmwjIJan90_mQbwr1zn-QBA",
  },
  {
    title: "Automatisation de portail",
    service: "Automatisation de portail",
    description: "Accès fluide et sécurisé via smartphone, télécommande ou reconnaissance biométrique.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzvAWUOj2nx0M_MlE63i0xfnH3tjFZIvR9nMcY_7OuxFRbrjE8hZzBEfwe0rV_3y8SMU-T3RJBZBFSQWFQx-m9jqwr9_vZ5deEGKTlMxwKDBM9muXHlCmFofdtzB58LAdFxjCQlHcFYQt6RrIL331wIgGErI-UOFGAZAEJbMSEibRZms-cc2W014moz_douLwcscZAc2uPAROwkzLXTjaDhUeXhVBVXwqObNIgRqE_XPsU9paqkx4df6mhBUGJW0f4lg",
  },
  {
    title: "Poignées Bio",
    service: "Poignées intelligentes",
    description: "Serrures intelligentes à empreintes digitales pour une gestion d'accès sans clé.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMZPqWsRpW_2KENsRkQ2eZtkwMcWNIjJ4i_Sc9Cr1YpJ421l7CDt0fr4ohqa10-cY6oBV68j-gTPPd2gxcwPqzjzB3Ms2TtKiw26u4-gXmiNBH5blCBx9hRaqjlAFrcZv31WzncKSsiVTSt0O7MeJvnfeqNQUaPVk4VMmeg-X-RX1hJ1ZxYwoyedVozTEfBnoh4X6pT5Fc6Q-FDeId0lmglTT6FWmbQOTyMUFl0AACzmBdOFf4Ih3iJbI9-lZbQ-va9Q",
  },
  {
    title: "Portier Vidéo",
    service: "Portier vidéo",
    description: "Communication visuelle bidirectionnelle HD pour vos visiteurs, même à distance.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuASe2nWQdl4OC3mKVNuTKVsmFpAp4BAmLQAHh9h-48Rs6KDIbD4FsFTIXmsLAfPlP93Sd8HJRuPGDZ_i4BI9RgJqV7P6mUM2DqOZI1DjbgZv5nUToUnR5QJlY236OkExblWh8L2YynQliCD5LUdcerF9iM9kU1hE5kb-E9RImMdAxTZAGx8WvGDT2ZScY-VU0hltbfikGDxOiYz53QTuuy4HJVhDrzR5PNOIyRnCg2G4jB5BQPegNbvUhpb_qaS2ffgqg",
  },
  {
    title: "Alarme Anti-intrusion",
    service: "Alarme anti-intrusion",
    description: "Capteurs intelligents détectant toute présence suspecte avec sirènes et notifications cloud.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKwAEJoAyPS6spSrOHKvvdfDHipMsqIyJcy1eBicBHn7QXZzDBWDKE_wjANnTujdzrYiwbJYeIJypMpqFR--oq7-2_2qV1gb_waNIDfxwFAHWW7jYtuwliRhvHpQDmrJR-UrrjJvnSNZK1H-qzi0_dbx7qN7AgqDaRwvfpHXPQa2EVPLPlh2beqziOLiWil_i6CzSmCt6KnDuEB85LsLxU7k-YvqpBSFbWiZDBlmGbjNfRpDfnS5ZA6iZgKZ-iZNXq_Q",
  },
  {
    title: "Contrôle d'Accès",
    service: "Contrôle d'accès",
    description: "Gestion hiérarchique des accès pour entreprises avec traçabilité complète.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDpVHuzfEM2pwsj2MPorFI5bvK2KtV6QipskCEFvl0tJbLtqTEeYsnnoBIJEkv5qWV2-rbgR0C1q9QzaUHLeD9Rmd6Z_TTDzOBDjPkcvrsGXaC9HwzTE1EvwF75HriP4pLx5iyG9HzYklBy_aFHJyak1yc80Hg2IwLRp5KCVhGrlKp8h750MqPiTVEu8ztrAuhE7VhuF64Sso9RD5xWT9SRIfZ0qztbcd-STPBLhI8bsCGAoF4UstXQ-cC6YbhvsK-FuA",
  },
  {
    title: "Tracking GPS",
    service: "Balises de tracking",
    description: "Suivi en temps réel de flottes et de véhicules avec coupure moteur à distance.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLCghUh3GqMa3hOs1PQKl61KDQXCDMFjUQx7otrDBOTGmDNU8o01BG_xvrha0U2GseY4O8JGxgWMS0SmQedk02z64RDJyfmvhQQjmSJUJUOzVvp519gX4pTItkthXuv8oSlUieZZlMqIU1OvJvv0ioXNbQMj9XcVJY63w8pjMcVZgW1pGgmStPzGtAvRuqQcO_fXOnUJiMv01FaohkE-FIJMLJ8do3ZPIV_-N5mOx9kmFQ-mUF7bwswP5x8CmzVUv9YQ",
  },
  {
    title: "Domotique",
    service: "Domotique",
    description: "Maison connectée : éclairage, climatisation et sécurité pilotés par IA.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBApr0ZzvjjKhtGYtHYMVKJvPOnWq91FQEELS9ki-joW5AHfAcCgOe7lZRsqmEklMpjMUoCEwXCUwEqx8SHyyDqMZxWtplGMjKJYcPFTLScTvyoRGZBSSwZrdVOpS3tEqbPovOvPajuEgD105-oK40P2WN9evJk8BVjl8sIVLlYLIgX7Oh38n5ptFTmWuHnMPhONQkcCHLZkMsFWnJsk5nA2XiBj4znElGhA_nSpVbk69BOywKmLdBcpqOUkq7FSp_oIg",
  },
];

function SolutionCard({ title, service, description, img }) {
  return (
    <Link
      to="/contact"
      state={{ preselectServices: [service] }}
      className="group relative glass p-6 rounded-3xl border border-on-surface/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer h-full flex flex-col"
    >
      <div className="relative h-48 mb-6 rounded-2xl overflow-hidden">
        <img
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          src={img}
        />
      </div>
      <h3 className="font-headline-lg text-xl mb-2">{title}</h3>
      <p className="text-on-surface-variant text-sm mb-6 flex-grow">{description}</p>
      <div className="flex items-center gap-2 text-primary text-label-sm group-hover:gap-4 transition-all">
        DÉCOUVRIR <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </div>
    </Link>
  );
}

export default function Solutions() {
  const revealRef = useReveal();

  return (
    <section id="solutions" className="py-24 bg-surface-container-lowest scroll-mt-24">
      <div
        ref={revealRef}
        className="container mx-auto px-6 md:px-margin-desktop transition-all duration-1000 opacity-0 translate-y-10 ease-premium"
      >
        <div className="mb-16 text-center max-w-3xl mx-auto space-y-4">
          <span className="text-primary font-bold tracking-widest text-label-sm uppercase">Nos Expertises</span>
          <h2 className="font-display-md text-display-md">Ingénierie de Haute Précision</h2>
          <p className="text-on-surface-variant text-body-lg">
            Une suite complète de technologies intégrées pour une protection à 360 degrés de vos actifs les plus
            précieux.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {solutions.map((solution) => (
            <SolutionCard key={solution.title} {...solution} />
          ))}
        </div>
      </div>
    </section>
  );
}
