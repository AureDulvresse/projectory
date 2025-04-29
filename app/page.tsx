"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Star, Users, Zap, Shield, BarChart3, ArrowUpRight, Layers } from "lucide-react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/landing/navbar"
import { CookieConsent } from "@/components/landing/cookie-consent"

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CookieConsent />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full pt-36 pb-20 md:pt-44 md:pb-28 lg:pt-48 lg:pb-32 bg-gradient-to-b from-background via-background to-muted/30 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-indigo/5 opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/60" />
        <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center space-y-10 text-center"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none border-indigo-200 dark:border-indigo-800 bg-indigo-100/50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-200/50 dark:hover:bg-indigo-900/30"
              >
                <Star className="mr-2 h-4 w-4" />
                La solution de gestion de projet préférée des équipes
              </motion.div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text">
                Gérez vos projets avec <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-400 animate-gradient">ProjecTory</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
                Une solution complète pour la gestion de projet, la collaboration et le suivi des tâches.
                Simplifiez votre travail d'équipe dès aujourd'hui.
              </p>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-700 hover:via-violet-700 hover:to-indigo-700 text-white px-8 py-6 text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl animate-gradient">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300 hover:scale-105">
                  Se connecter
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center items-center gap-8 pt-8"
            >
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm text-muted-foreground">10,000+ utilisateurs</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm text-muted-foreground">99.9% uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm text-muted-foreground">4.9/5 satisfaction</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="w-full py-20 md:py-28 lg:py-32 bg-background"
      >
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center space-y-5 mb-16"
          >
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">FONCTIONNALITÉS</span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Tout ce dont vous avez besoin
            </h2>
            <p className="max-w-[700px] text-muted-foreground text-lg">
              Découvrez comment ProjecTory peut transformer votre façon de travailler
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col space-y-5 p-8 rounded-xl border border-blue-100 dark:border-blue-900/40 hover:border-blue-200 dark:hover:border-blue-800 bg-white dark:bg-slate-900/60 hover:shadow-xl transition-all duration-300 group hover:translate-y-[-5px]"
              >
                <div className="p-3 bg-indigo-100/50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400 w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground flex-grow">{feature.description}</p>
                <Button variant="ghost" className="mt-2 group/btn p-0 hover:bg-transparent flex items-center text-indigo-600 dark:text-indigo-400">
                  En savoir plus
                  <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:translate-y-[-2px]" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="w-full py-20 md:py-28 lg:py-32 bg-gradient-to-b from-slate-50 via-indigo-50/30 to-blue-50 dark:bg-gradient-to-b dark:from-muted/30 dark:via-background dark:to-background relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-indigo/5 opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/60" />
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center space-y-5 mb-16"
          >
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">TARIFICATION</span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Nos forfaits
            </h2>
            <p className="max-w-[700px] text-muted-foreground text-lg">
              Choisissez le plan qui correspond à vos besoins
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                viewport={{ once: true }}
                className={`flex flex-col p-8 rounded-xl shadow-xl transition-all duration-300 relative backdrop-blur-sm ${plan.featured
                  ? 'bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-600 text-white border-2 border-indigo-500 hover:scale-105 hover:shadow-2xl'
                  : 'bg-white/80 dark:bg-slate-900/80 hover:border-indigo-300 dark:hover:border-indigo-700 border border-indigo-100 dark:border-indigo-900 hover:scale-105 hover:shadow-2xl'
                  }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 right-8 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    RECOMMANDÉ
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold">{plan.price.split('€')[0]}</span>
                  <span className={`text-xl ${plan.featured ? 'text-white/90' : 'text-muted-foreground'}`}>
                    {plan.price.includes('€') ? '€/mois' : ''}
                  </span>
                </div>
                <p className={`mb-6 ${plan.featured ? 'text-white/80' : 'text-muted-foreground'}`}>
                  {plan.description}
                </p>
                <ul className="mt-4 space-y-4 flex-grow mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className={`h-5 w-5 ${plan.featured ? 'text-white' : 'text-indigo-500'} mr-3 mt-0.5 flex-shrink-0`} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/register?plan=${plan.id}`} className="mt-auto">
                  <Button
                    className={`w-full transition-all duration-300 py-6 ${plan.featured
                      ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                      : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-700 text-white'
                      }`}
                  >
                    {plan.id === 'enterprise' ? 'Contactez-nous' : 'Choisir ce forfait'}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="w-full py-20 md:py-28 bg-gradient-to-b from-white via-indigo-50/30 to-blue-50 dark:bg-gradient-to-b dark:from-slate-900/30 dark:via-background dark:to-background relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-indigo/5 opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/60" />

        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Prêt à transformer votre <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-600 dark:from-indigo-400 dark:to-indigo-400">gestion de projet</span> ?
            </h2>
            <p className="max-w-[700px] mx-auto text-muted-foreground text-lg">
              Rejoignez des milliers d'équipes qui utilisent déjà ProjecTory pour simplifier leur travail et augmenter leur productivité.
            </p>
            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-700 text-white px-8 py-6 text-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300 hover:scale-105">
                  Demander une démo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <footer className="w-full py-12 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div className="space-y-4">
              <div className="flex items-center text-xl font-bold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-6 w-6 text-indigo-600 dark:text-indigo-400"
                >
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
                ProjecTory
              </div>
              <p className="text-sm text-muted-foreground">
                Simplifiez votre gestion de projet et améliorez la collaboration de votre équipe.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Produit</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/features" className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400">Fonctionnalités</Link></li>
                <li><Link href="/pricing" className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400">Tarifs</Link></li>
                <li><Link href="/integrations" className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400">Intégrations</Link></li>
                <li><Link href="/changelog" className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Ressources</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/blog" className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400">Blog</Link></li>
                <li><Link href="/documentation" className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400">Documentation</Link></li>
                <li><Link href="/webinars" className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400">Webinaires</Link></li>
                <li><Link href="/api" className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Entreprise</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400">À propos</Link></li>
                <li><Link href="/customers" className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400">Clients</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400">Contact</Link></li>
                <li><Link href="/careers" className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400">Carrières</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} ProjecTory. Tous droits réservés.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400">Confidentialité</Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400">Conditions d'utilisation</Link>
              <Link href="/cookies" className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Caractéristiques avec icônes actualisées
const features = [
  {
    title: "Gestion de projet intuitive",
    description: "Créez et gérez vos projets avec une interface simple et des outils puissants adaptés à tous les types d'équipes.",
    icon: <Layers className="h-6 w-6" />
  },
  {
    title: "Collaboration en temps réel",
    description: "Travaillez ensemble efficacement avec des outils de collaboration simultanée et des notifications intelligentes.",
    icon: <Users className="h-6 w-6" />
  },
  {
    title: "Suivi des tâches avancé",
    description: "Organisez et suivez l'avancement avec des tableaux Kanban, des diagrammes Gantt et des calendriers interactifs.",
    icon: <CheckCircle className="h-6 w-6" />
  },
  {
    title: "Analyses et rapports",
    description: "Obtenez des insights précieux sur la progression de vos projets avec des tableaux de bord et rapports personnalisables.",
    icon: <BarChart3 className="h-6 w-6" />
  },
  {
    title: "Sécurité renforcée",
    description: "Protégez vos données et vos projets avec des contrôles d'accès avancés et un chiffrement de bout en bout.",
    icon: <Shield className="h-6 w-6" />
  },
  {
    title: "Automatisation intelligente",
    description: "Économisez du temps avec des workflows automatisés et des rappels intelligents pour respecter vos échéances.",
    icon: <Zap className="h-6 w-6" />
  }
];

// Plans de tarification
const plans = [
  {
    id: "free",
    name: "Gratuit",
    price: "0€",
    description: "Parfait pour débuter et découvrir l'application",
    featured: false,
    features: [
      "Jusqu'à 3 projets",
      "Jusqu'à 5 membres",
      "Tableaux Kanban basiques",
      "1 Go de stockage",
      "Support par email"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    price: "19€",
    description: "Idéal pour les équipes en pleine croissance",
    featured: true,
    features: [
      "Projets illimités",
      "Jusqu'à 20 membres",
      "Tableaux Kanban & Gantt avancés",
      "10 Go de stockage",
      "Intégrations (Slack, Google Drive)",
      "Rapports et analyses",
      "Support prioritaire"
    ]
  },
  {
    id: "enterprise",
    name: "Entreprise",
    price: "Sur mesure",
    description: "Pour les grandes équipes et organisations",
    featured: false,
    features: [
      "Projets et membres illimités",
      "Fonctionnalités complètes",
      "Stockage illimité",
      "SSO et contrôles d'administration",
      "API complète",
      "Intégrations personnalisées",
      "Gestionnaire de compte dédié"
    ]
  }
];