// Multi-language support for TrueRate Liberia
// Supports English, Liberian English, French, and Kpelle

export type Language = 'en' | 'lr-en' | 'fr' | 'kpe'

export const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'lr-en', name: 'Liberian English', nativeName: 'Liberian English' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'kpe', name: 'Kpelle', nativeName: 'Kpɛllɛ' },
]

export const translations: Record<Language, Record<string, string>> = {
  'en': {
    // Navigation
    'nav.home': 'Home',
    'nav.converter': 'Converter',
    'nav.analytics': 'Analytics',
    'nav.predictions': 'Predictions',
    'nav.tools': 'Tools',
    'nav.business': 'Business',
    'nav.community': 'Community',
    'nav.forums': 'Forums',
    'nav.signIn': 'Sign In',
    'nav.signOut': 'Sign Out',
    
    // Hero & Rates
    'hero.title': 'The most accurate exchange rates in Liberia',
    'hero.subtitle': 'TrueRate aggregates data from 100+ trusted sources',
    'rate.current': 'Current Rate',
    'rate.buy': 'Buy Rate',
    'rate.sell': 'Sell Rate',
    'rate.best': "Today's Best Rate",
    'rate.bestNearYou': 'Best rate near you',
    'rate.updated': 'Last updated',
    
    // Best Rate Widget
    'widget.bestRate': "Today's Best Rate",
    'widget.nearestChanger': 'Nearest Verified Changer',
    'widget.distance': 'mins from you',
    'widget.smsAlert': 'Get SMS Alerts',
    'widget.morningAlert': '8 AM Alert',
    'widget.afternoonAlert': '4 PM Alert',
    
    // Invoice Protector
    'invoice.title': 'Invoice USD Protector',
    'invoice.subtitle': 'See exactly how much your invoice costs today vs next week',
    'invoice.amount': 'Invoice Amount (USD)',
    'invoice.todayCost': "Today's Cost",
    'invoice.predicted': 'Predicted in 7 Days',
    'invoice.recommendation': 'Recommendation',
    'invoice.payNow': 'Pay now to save',
    'invoice.wait': 'Wait to save',
    'invoice.share': 'Share Screenshot',
    
    // Cashflow Forecast
    'cashflow.title': 'Cashflow Forecast',
    'cashflow.subtitle': 'Enter your weekly USD sales to predict LRD cash',
    'cashflow.weeklySales': 'Weekly USD Sales',
    'cashflow.predictedLRD': 'Predicted LRD Next Week',
    'cashflow.potentialSavings': 'Potential Savings',
    
    // Market Woman Mode
    'simple.mode': 'Market Woman Mode',
    'simple.modeDesc': 'Big numbers, voice readout',
    'simple.currentRate': 'Dollar Rate Now',
    'simple.tapForVoice': 'Tap for voice',
    'simple.goingUp': 'Going Up!',
    'simple.goingDown': 'Going Down!',
    'simple.stayingSame': 'Staying Same',
    
    // Import Alerts
    'import.title': 'Import Price Alert',
    'import.rice': 'Rice (50kg bag)',
    'import.cement': 'Cement (50kg bag)',
    'import.fuel': 'Fuel (Gallon)',
    'import.priceToday': 'Price Today',
    'import.priceChange': 'If you wait until Friday',
    'import.alert': 'will cost you extra',
    
    // Forums
    'forum.title': 'Community Forums',
    'forum.newTopic': 'Start New Topic',
    'forum.trending': 'Trending Discussions',
    'forum.categories': 'Categories',
    'forum.scamAlerts': 'Scam Alerts',
    'forum.exchangeTips': 'Exchange Tips',
    'forum.marketNews': 'Market News',
    'forum.changerReviews': 'Changer Reviews',
    
    // Sharing & Referrals
    'share.rate': 'Share Rate',
    'share.warning': 'Share Warning',
    'share.whatsapp': 'Share to WhatsApp',
    'share.telegram': 'Share to Telegram',
    'share.copy': 'Copy Link',
    'referral.title': 'Invite Friends',
    'referral.subtitle': 'Get 1 month premium alerts free!',
    'referral.yourCode': 'Your Referral Code',
    'referral.smsInvite': 'Send SMS Invite',
    
    // Gamification
    'points.title': 'Your Points',
    'points.rank': 'Your Rank',
    'badge.rateReporter': 'Rate Reporter',
    'badge.fraudFighter': 'Fraud Fighter',
    'badge.topContributor': 'Top Contributor',
    'badge.earlyAdopter': 'Early Adopter',
    'badge.verified': 'Verified User',
    'leaderboard.title': 'Top Contributors',
    'leaderboard.thisWeek': 'This Week',
    'leaderboard.allTime': 'All Time',
    
    // Business Pro
    'business.pro': 'TrueRate Business',
    'business.proPrice': '$3-5/month',
    'business.bulkConvert': 'Bulk Invoice Converter',
    'business.pdfExport': 'PDF Export',
    'business.booking': 'Book a Changer',
    'business.reserveCash': 'Reserve cash pickup',
    'business.teamAccounts': 'Team Accounts',
    'business.historicalReports': 'Historical Reports',
    
    // Changer Queue
    'queue.title': 'Live Changer Queue',
    'queue.available': 'Available Now',
    'queue.cashReady': 'Cash Ready',
    'queue.reserve': 'Reserve',
    'queue.call': 'Call',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.close': 'Close',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.viewAll': 'View All',
    'common.learnMore': 'Learn More',
  },
  
  'lr-en': {
    // Liberian English translations
    'nav.home': 'Home',
    'nav.converter': 'Change Money',
    'nav.analytics': 'Rate Story',
    'nav.predictions': 'Tomorrow Rate',
    'nav.tools': 'Money Tools',
    'nav.business': 'Business',
    'nav.community': 'Our People',
    'nav.forums': 'Talk Shop',
    'nav.signIn': 'Enter',
    'nav.signOut': 'Leave',
    
    'hero.title': 'The correct dollar rate in Liberia',
    'hero.subtitle': 'We check rate from plenty-plenty places',
    'rate.current': 'Rate Now',
    'rate.buy': 'They Buy',
    'rate.sell': 'They Sell',
    'rate.best': 'Best Rate Today',
    'rate.bestNearYou': 'Best rate by you',
    'rate.updated': 'Last time we check',
    
    'widget.bestRate': 'Best Rate Today-O!',
    'widget.nearestChanger': 'Money Man Near You',
    'widget.distance': 'minute from you',
    'widget.smsAlert': 'Text Me Rate',
    'widget.morningAlert': 'Morning Text',
    'widget.afternoonAlert': 'Afternoon Text',
    
    'invoice.title': 'Bill Protector',
    'invoice.subtitle': 'See how your bill different today and next week',
    'invoice.amount': 'Bill Amount (Dollar)',
    'invoice.todayCost': 'Pay Today',
    'invoice.predicted': 'Pay Next Week',
    'invoice.recommendation': 'My Advice',
    'invoice.payNow': 'Pay now, you save',
    'invoice.wait': 'Wait small, you save',
    'invoice.share': 'Send Picture',
    
    'cashflow.title': 'Money Come Money Go',
    'cashflow.subtitle': 'Put your week dollar sale, we show you LRD',
    'cashflow.weeklySales': 'Week Dollar Sale',
    'cashflow.predictedLRD': 'LRD You Get Next Week',
    'cashflow.potentialSavings': 'You Can Save',
    
    'simple.mode': 'Market Woman Way',
    'simple.modeDesc': 'Big number, voice talk',
    'simple.currentRate': 'Dollar Now',
    'simple.tapForVoice': 'Touch for voice',
    'simple.goingUp': 'Going Up-O!',
    'simple.goingDown': 'Going Down!',
    'simple.stayingSame': 'Same-Same',
    
    'import.title': 'Import Price Warning',
    'import.rice': 'Rice (Big Bag)',
    'import.cement': 'Cement (Bag)',
    'import.fuel': 'Gasoline (Gallon)',
    'import.priceToday': 'Price Today',
    'import.priceChange': 'If you wait Friday',
    'import.alert': 'you go pay extra',
    
    'forum.title': 'Talk Shop',
    'forum.newTopic': 'Start New Talk',
    'forum.trending': 'Hot Talk',
    'forum.categories': 'Topics',
    'forum.scamAlerts': 'Rogue People Warning',
    'forum.exchangeTips': 'Change Money Tips',
    'forum.marketNews': 'Market News',
    'forum.changerReviews': 'Money Man Reviews',
    
    'share.rate': 'Send Rate',
    'share.warning': 'Send Warning',
    'share.whatsapp': 'WhatsApp It',
    'share.telegram': 'Telegram It',
    'share.copy': 'Copy',
    'referral.title': 'Bring Your People',
    'referral.subtitle': 'Get 1 month free-o!',
    'referral.yourCode': 'Your Code',
    'referral.smsInvite': 'Text Your Friend',
    
    'points.title': 'Your Points',
    'points.rank': 'Your Level',
    'badge.rateReporter': 'Rate Reporter',
    'badge.fraudFighter': 'Rogue Fighter',
    'badge.topContributor': 'Top Person',
    'badge.earlyAdopter': 'First People',
    'badge.verified': 'Trusted Person',
    'leaderboard.title': 'Top People',
    'leaderboard.thisWeek': 'This Week',
    'leaderboard.allTime': 'All Time',
    
    'business.pro': 'Business Plan',
    'business.proPrice': '$3-5 every month',
    'business.bulkConvert': 'Change Plenty Bill',
    'business.pdfExport': 'Get Paper',
    'business.booking': 'Book Money Man',
    'business.reserveCash': 'Hold cash for me',
    'business.teamAccounts': 'Team Account',
    'business.historicalReports': 'Old Rate Report',
    
    'queue.title': 'Money Man Ready Now',
    'queue.available': 'Ready Now',
    'queue.cashReady': 'Cash Ready',
    'queue.reserve': 'Hold For Me',
    'queue.call': 'Call',
    
    'common.loading': 'Wait small...',
    'common.error': 'Problem',
    'common.success': 'Good-O!',
    'common.save': 'Keep',
    'common.cancel': 'Leave It',
    'common.submit': 'Send',
    'common.close': 'Close',
    'common.next': 'Next',
    'common.previous': 'Back',
    'common.viewAll': 'See All',
    'common.learnMore': 'Learn More',
  },
  
  'fr': {
    // French translations
    'nav.home': 'Accueil',
    'nav.converter': 'Convertisseur',
    'nav.analytics': 'Analytique',
    'nav.predictions': 'Prédictions',
    'nav.tools': 'Outils',
    'nav.business': 'Entreprise',
    'nav.community': 'Communauté',
    'nav.forums': 'Forums',
    'nav.signIn': 'Connexion',
    'nav.signOut': 'Déconnexion',
    
    'hero.title': 'Les taux de change les plus précis au Libéria',
    'hero.subtitle': 'TrueRate agrège les données de plus de 100 sources fiables',
    'rate.current': 'Taux Actuel',
    'rate.buy': 'Taux Achat',
    'rate.sell': 'Taux Vente',
    'rate.best': 'Meilleur Taux du Jour',
    'rate.bestNearYou': 'Meilleur taux près de vous',
    'rate.updated': 'Dernière mise à jour',
    
    'widget.bestRate': 'Meilleur Taux du Jour',
    'widget.nearestChanger': 'Bureau de Change le Plus Proche',
    'widget.distance': 'minutes de vous',
    'widget.smsAlert': 'Alertes SMS',
    'widget.morningAlert': 'Alerte 8h',
    'widget.afternoonAlert': 'Alerte 16h',
    
    'invoice.title': 'Protecteur de Facture USD',
    'invoice.subtitle': 'Voyez exactement combien coûte votre facture',
    'invoice.amount': 'Montant Facture (USD)',
    'invoice.todayCost': 'Coût Aujourd\'hui',
    'invoice.predicted': 'Prévu dans 7 Jours',
    'invoice.recommendation': 'Recommandation',
    'invoice.payNow': 'Payez maintenant pour économiser',
    'invoice.wait': 'Attendez pour économiser',
    'invoice.share': 'Partager Capture',
    
    'simple.mode': 'Mode Simple',
    'simple.modeDesc': 'Grands chiffres, lecture vocale',
    'simple.currentRate': 'Taux Dollar',
    'simple.tapForVoice': 'Touchez pour écouter',
    'simple.goingUp': 'En Hausse!',
    'simple.goingDown': 'En Baisse!',
    'simple.stayingSame': 'Stable',
    
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.submit': 'Soumettre',
    'common.close': 'Fermer',
  },
  
  'kpe': {
    // Kpelle translations (simplified)
    'nav.home': 'Taa',
    'nav.converter': 'Sɛŋ Kpalai',
    'rate.current': 'Kpala Yɛɛi',
    'rate.best': 'Kpala Kɛlɛi',
    'simple.mode': 'Laa-kaa Tɔɔ',
    'simple.currentRate': 'Dɔla Kpalai',
    'simple.tapForVoice': 'Gɛɛ ma woo',
    'common.loading': 'Kpɔlɔi...',
    // Add more as needed
  },
}

export function getTranslation(lang: Language, key: string): string {
  return translations[lang]?.[key] || translations['en'][key] || key
}

export function t(lang: Language) {
  return (key: string) => getTranslation(lang, key)
}






