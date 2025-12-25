import { ProductStatus } from '@medusajs/framework/utils'

const bucketName = process.env.SAMPLE_IMAGES_BUCKET || 'hublots-sample-images'
const baseUrl = `https://storage.googleapis.com/${bucketName}`

export const productsToInsert = [
  {
    title: 'Consultation Design Intérieur',
    handle: 'consultation-design-interieur',
    subtitle: 'Expertise et conseils personnalisés',
    description:
      'Transformez votre espace de vie avec l\'aide de nos experts. Cette consultation comprend une analyse de votre intérieur, des recommandations de couleurs et d\'aménagement.',
    is_giftcard: false,
    status: ProductStatus.PUBLISHED,
    thumbnail: `${baseUrl}/consultation-design-interieur.jpeg`,
    options: [
      {
        title: 'Durée',
        values: ['1 heure', '2 heures']
      }
    ],
    variants: [
      {
        title: '1 heure',
        allow_backorder: false,
        manage_inventory: false,
        prices: [
          {
            amount: 80,
            currency_code: 'eur'
          }
        ],
        options: {
          Durée: '1 heure'
        }
      },
      {
        title: '2 heures',
        allow_backorder: false,
        manage_inventory: false,
        prices: [
          {
            amount: 150,
            currency_code: 'eur'
          }
        ],
        options: {
          Durée: '2 heures'
        }
      }
    ],
    discountable: true,
    images: [
      {
        url: `${baseUrl}/consultation-design-interieur.jpeg`
      },
      {
        url: `${baseUrl}/consultation-design-interieur-1.jpeg`
      }
    ]
  },
  {
    title: 'Cours de Cuisine Italienne',
    handle: 'cours-cuisine-italienne',
    subtitle: 'Apprenez les secrets des pâtes fraîches',
    description:
      'Un atelier immersif pour maîtriser l\'art culinaire italien. Ingrédients inclus, dégustation sur place.',
    is_giftcard: false,
    status: ProductStatus.PUBLISHED,
    thumbnail: `${baseUrl}/cours-cuisine-italienne.jpeg`,
    options: [
      {
        title: 'Niveau',
        values: ['Débutant', 'Avancé']
      }
    ],
    variants: [
      {
        title: 'Débutant',
        allow_backorder: false,
        manage_inventory: true,
        options: { Niveau: 'Débutant' },
        prices: [
          {
            currency_code: 'eur',
            amount: 65
          }
        ]
      },
      {
        title: 'Avancé',
        allow_backorder: false,
        manage_inventory: true,
        options: { Niveau: 'Avancé' },
        prices: [
          {
            currency_code: 'eur',
            amount: 85
          }
        ]
      }
    ],
    discountable: true,
    images: [
      {
        url: `${baseUrl}/cours-cuisine-italienne.jpeg`
      },
      {
        url: `${baseUrl}/cours-cuisine-italienne-1.jpeg`
      }
    ]
  },
  {
    title: 'Service de Nettoyage Professionnel',
    handle: 'nettoyage-professionnel',
    subtitle: 'Un foyer éclatant de propreté',
    description: 'Service de ménage à domicile par des professionnels qualifiés. Produits d\'entretien respectueux de l\'environnement inclus.',
    is_giftcard: false,
    status: ProductStatus.PUBLISHED,
    thumbnail: `${baseUrl}/nettoyage-professionnel.jpeg`,
    options: [
      {
        title: 'Type de Nettoyage',
        values: ['Standard', 'Approfondi']
      }
    ],
    variants: [
      {
        title: 'Standard',
        allow_backorder: false,
        manage_inventory: false,
        options: {
          'Type de Nettoyage': 'Standard'
        },
        prices: [
          {
            currency_code: 'eur',
            amount: 40
          }
        ]
      },
      {
        title: 'Approfondi',
        allow_backorder: false,
        manage_inventory: false,
        options: {
          'Type de Nettoyage': 'Approfondi'
        },
        prices: [
          {
            currency_code: 'eur',
            amount: 75
          }
        ]
      }
    ],
    discountable: true,
    images: [
      {
        url: `${baseUrl}/nettoyage-professionnel.jpeg`
      },
      {
        url: `${baseUrl}/nettoyage-professionnel-1.jpeg`
      },
      {
        url: `${baseUrl}/nettoyage-professionnel-2.jpeg`
      }
    ]
  },
  {
    title: 'Coaching Fitness Personnalisé',
    handle: 'coaching-fitness-perso',
    subtitle: 'Atteignez vos objectifs avec un pro',
    description:
      'Séance individuelle de sport adaptée à votre condition physique. Suivi nutritionnel de base inclus.',
    is_giftcard: false,
    status: ProductStatus.PUBLISHED,
    thumbnail: `${baseUrl}/coaching-fitness-perso.jpeg`,
    options: [
      { title: 'Lieu', values: ['À domicile', 'En ligne'] }
    ],
    variants: [
      {
        title: 'À domicile',
        allow_backorder: false,
        manage_inventory: false,
        options: {
          Lieu: 'À domicile'
        },
        prices: [
          {
            currency_code: 'eur',
            amount: 60
          }
        ]
      },
      {
        title: 'En ligne',
        allow_backorder: false,
        manage_inventory: false,
        options: {
          Lieu: 'En ligne'
        },
        prices: [
          {
            currency_code: 'eur',
            amount: 45
          }
        ]
      }
    ],
    discountable: true,
    images: [
      {
        url: `${baseUrl}/coaching-fitness-perso.jpeg`
      },
      {
        url: `${baseUrl}/coaching-fitness-perso-1.jpeg`
      }
    ]
  },
  {
    title: 'Réparation Smartphone',
    handle: 'reparation-smartphone',
    subtitle: 'Écran brisé ou batterie fatiguée ?',
    description:
      'Diagnostic et réparation rapide de votre smartphone. Pièces de rechange garanties 6 mois.',
    is_giftcard: false,
    status: ProductStatus.PUBLISHED,
    thumbnail: `${baseUrl}/reparation-smartphone.jpeg`,
    options: [
      { title: 'Type de Réparation', values: ['Écran', 'Batterie'] }
    ],
    variants: [
      {
        title: 'Écran',
        allow_backorder: false,
        manage_inventory: true,
        options: {
          'Type de Réparation': 'Écran'
        },
        prices: [
          {
            currency_code: 'eur',
            amount: 120
          }
        ]
      },
      {
        title: 'Batterie',
        allow_backorder: false,
        manage_inventory: true,
        options: {
          'Type de Réparation': 'Batterie'
        },
        prices: [
          {
            currency_code: 'eur',
            amount: 50
          }
        ]
      }
    ],
    discountable: true,
    images: [
      {
        url: `${baseUrl}/reparation-smartphone.jpeg`
      },
      {
        url: `${baseUrl}/reparation-smartphone-1.jpeg`
      }
    ]
  },
  {
    title: 'Photographe Événementiel',
    handle: 'photographe-evenementiel',
    subtitle: 'Capturez vos moments précieux',
    description:
      'Reportage photo pour mariages, anniversaires ou événements d\'entreprise. Remise des photos retouchées sur support numérique.',
    is_giftcard: false,
    status: ProductStatus.PUBLISHED,
    thumbnail: `${baseUrl}/photographe-evenementiel.jpeg`,
    options: [
      { title: 'Forfait', values: ['Demi-journée', 'Journée complète'] }
    ],
    variants: [
      {
        title: 'Demi-journée',
        allow_backorder: false,
        manage_inventory: false,
        options: { Forfait: 'Demi-journée' },
        prices: [
          {
            currency_code: 'eur',
            amount: 450
          }
        ]
      },
      {
        title: 'Journée complète',
        allow_backorder: false,
        manage_inventory: false,
        options: { Forfait: 'Journée complète' },
        prices: [
          {
            currency_code: 'eur',
            amount: 800
          }
        ]
      }
    ],
    discountable: true,
    images: [
      {
        url: `${baseUrl}/photographe-evenementiel.jpeg`
      },
      {
        url: `${baseUrl}/photographe-evenementiel-1.jpeg`
      },
      {
        url: `${baseUrl}/photographe-evenementiel-2.jpeg`
      }
    ]
  }
]
