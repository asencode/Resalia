import mongoose from 'mongoose';

export const allergenSchema = new mongoose.Schema(
  {
    isGlutenAlergeno: { type: Boolean, default: false, required: true },
    isMariscoAlergeno: { type: Boolean, default: false, required: true },
    isHuevosAlergeno: { type: Boolean, default: false, required: true },
    isPescadoAlergeno: { type: Boolean, default: false, required: true },
    isCacahuetesAlergeno: { type: Boolean, default: false, required: true },
    isSojaAlergeno: { type: Boolean, default: false, required: true },
    isLacteosAlergeno: { type: Boolean, default: false, required: true },
    isFrutosSecosAlergeno: { type: Boolean, default: false, required: true },
    isApioAlergeno: { type: Boolean, default: false, required: true },
    isMostazaAlergeno: { type: Boolean, default: false, required: true },
    isGranosSesamoAlergeno: { type: Boolean, default: false, required: true },
    isSulfitosAlergeno: { type: Boolean, default: false, required: true },
    isAltramucesAlergeno: { type: Boolean, default: false, required: true },
    isMoluscosAlergeno: { type: Boolean, default: false, required: true },
  },
  {
    timestamp: true,
  }
);

const Allergen = new mongoose.model('Allergen', allergenSchema);
export default Allergen;
