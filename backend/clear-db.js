import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Departement, Zone, Colis } from './models.js'

dotenv.config()

async function clearDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('✓ Connecté à MongoDB')

        await Departement.deleteMany({})
        console.log('✓ Départements supprimés')

        await Zone.deleteMany({})
        console.log('✓ Zones supprimées')

        await Colis.deleteMany({})
        console.log('✓ Colis supprimés')

        console.log('✅ Base de données vidée avec succès!')
        process.exit(0)
    } catch (err) {
        console.error('✗ Erreur:', err.message)
        process.exit(1)
    }
}

clearDatabase()
