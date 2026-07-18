import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Departement, Zone, Colis } from './models.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const PIN_GESTION = process.env.PIN_GESTION || '1234'

// Middleware
app.use(cors())
app.use(express.json())

// Serialize dates properly
app.use((req, res, originalJson) => {
    const json = res.json
    res.json = function (data) {
        return json.call(this, JSON.parse(JSON.stringify(data)))
    }
    originalJson.call(this)
})

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('✓ Connecté à MongoDB')
}).catch((err) => {
    console.error('✗ Erreur MongoDB:', err.message)
    process.exit(1)
})

// === AUTHENTIFICATION ===
app.post('/api/auth/login', (req, res) => {
    const { pin } = req.body
    if (pin === PIN_GESTION) {
        res.json({ ok: true, message: 'Authentification réussie' })
    } else {
        res.status(401).json({ ok: false, message: 'PIN incorrect' })
    }
})

// === DÉPARTEMENTS ===
app.get('/api/departements', async (req, res) => {
    try {
        const depts = await Departement.find({ actif: true }).sort({ nom: 1 })
        res.json(depts)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.post('/api/departements', async (req, res) => {
    try {
        const { nom, couleur } = req.body
        const existe = await Departement.findOne({ nom })
        if (existe) {
            return res.status(400).json({ ok: false, erreur: 'exists' })
        }
        const id = `dept-${Date.now()}`
        const dept = await Departement.create({ _id: id, nom, couleur: couleur || 'slate' })
        res.json({ ok: true, dept })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
})

app.patch('/api/departements/:id', async (req, res) => {
    try {
        const updates = {}

        if (req.body.nom !== undefined) {
            const nomNettoye = String(req.body.nom).trim()
            if (!nomNettoye) {
                return res.status(400).json({ ok: false, erreur: 'empty' })
            }
            const existe = await Departement.findOne({
                nom: nomNettoye,
                _id: { $ne: req.params.id }
            })
            if (existe) {
                return res.status(400).json({ ok: false, erreur: 'exists' })
            }
            updates.nom = nomNettoye
        }

        if (req.body.couleur !== undefined) {
            updates.couleur = req.body.couleur
        }

        const dept = await Departement.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        )
        res.json({ ok: true, dept })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
})

app.delete('/api/departements/:id', async (req, res) => {
    try {
        await Departement.updateOne({ _id: req.params.id }, { actif: false })
        res.json({ ok: true })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// === ZONES ===
app.get('/api/zones/:departementId', async (req, res) => {
    try {
        const zones = await Zone.find({ departementId: req.params.departementId })
            .sort({ zone: 1 })
        res.json(zones.map(z => z.zone))
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.post('/api/zones', async (req, res) => {
    try {
        const { departementId, zone } = req.body
        const valeur = zone.trim().toUpperCase().replace(/[^A-Z]/g, '')

        if (!valeur) {
            return res.status(400).json({ ok: false, erreur: 'empty' })
        }

        const existe = await Zone.findOne({ departementId, zone: valeur })
        if (existe) {
            return res.status(400).json({ ok: false, erreur: 'exists' })
        }

        await Zone.create({ departementId, zone: valeur })
        res.json({ ok: true })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
})

app.delete('/api/zones/:departementId/:zone', async (req, res) => {
    try {
        await Zone.deleteOne({
            departementId: req.params.departementId,
            zone: req.params.zone
        })
        res.json({ ok: true })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// === COLIS ===
app.get('/api/colis/:departementId', async (req, res) => {
    try {
        const colis = await Colis.find({ departementId: req.params.departementId })
            .sort({ createdAt: -1 })
        res.json(colis)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.post('/api/colis', async (req, res) => {
    try {
        const { departementId, titre, zone, position, description } = req.body
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

        const colis = await Colis.create({
            id,
            departementId,
            titre,
            zone,
            position,
            description
        })
        res.json(colis)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.patch('/api/colis/:id', async (req, res) => {
    try {
        const { zone, position, description } = req.body
        const colis = await Colis.findByIdAndUpdate(
            req.params.id,
            { zone, position, description },
            { new: true }
        )
        res.json(colis)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.delete('/api/colis/:id', async (req, res) => {
    try {
        await Colis.findByIdAndDelete(req.params.id)
        res.json({ ok: true })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`)
})

