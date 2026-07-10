import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Departement, Zone, Colis } from './models.js'
import departementsInitiaux from '../src/data/departements.json' assert { type: 'json' }
import zonesInitiales from '../src/data/zones.json' assert { type: 'json' }
import colisInitiaux from '../src/data/colis.json' assert { type: 'json' }

dotenv.config()

async function initializeDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('✓ Connecté à MongoDB')

        // Vérifier si les données existent déjà
        const deptCount = await Departement.countDocuments()
        if (deptCount > 0) {
            console.log('✓ Base de données déjà initialisée')
            process.exit(0)
        }

        // Créer les départements
        console.log('📝 Création des départements...')
        const depts = await Promise.all(
            departementsInitiaux.map(d =>
                Departement.create({
                    _id: `dept-${d.id || Date.now()}`,
                    nom: d.nom,
                    actif: true,
                })
            )
        )
        console.log(`✓ ${depts.length} départements créés`)

        // Créer les zones pour "meubles"
        const meublesDept = depts.find(d => d.nom === 'meubles') || depts[0]
        console.log('📝 Création des zones...')
        const zones = await Promise.all(
            zonesInitiales.map(z =>
                Zone.create({
                    departementId: meublesDept._id,
                    zone: z,
                })
            )
        )
        console.log(`✓ ${zones.length} zones créées`)

        // Créer les colis pour "meubles"
        console.log('📝 Création des colis...')
        const colis = await Promise.all(
            colisInitiaux.map((c, idx) =>
                Colis.create({
                    id: `colis-${idx + 1}`,
                    departementId: meublesDept._id,
                    titre: c.code,
                    zone: c.emplacement.split('-')[0] || 'A',
                    position: c.emplacement,
                    description: c.description || '',
                })
            )
        )
        console.log(`✓ ${colis.length} colis créés`)

        console.log('✅ Initialisation terminée avec succès !')
        process.exit(0)
    } catch (err) {
        console.error('❌ Erreur:', err.message)
        process.exit(1)
    }
}

initializeDatabase()
