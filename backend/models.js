import mongoose from 'mongoose'

const departementSchema = new mongoose.Schema(
    {
        _id: String,
        nom: { type: String, required: true, unique: true },
        couleur: { type: String, default: 'slate' },
        actif: { type: Boolean, default: true },
    },
    { timestamps: true }
)

export const Departement = mongoose.model('Departement', departementSchema)

const zoneSchema = new mongoose.Schema(
    {
        departementId: { type: String, required: true },
        zone: { type: String, required: true },
    },
    { timestamps: true }
)

zoneSchema.index({ departementId: 1, zone: 1 }, { unique: true })

export const Zone = mongoose.model('Zone', zoneSchema)

const colisSchema = new mongoose.Schema(
    {
        id: { type: String, unique: true, sparse: true },
        departementId: { type: String, required: true },
        titre: { type: String, required: true },
        zone: { type: String, required: true },
        position: String,
        description: String,
    },
    { timestamps: true }
)

export const Colis = mongoose.model('Colis', colisSchema)
