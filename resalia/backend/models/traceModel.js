import mongoose from 'mongoose';

export const traceSchema = new mongoose.Schema(
  {
    isGlutenTraza: { type: Boolean, default: false, required: true },
    isMariscoTraza: { type: Boolean, default: false, required: true },
    isHuevosTraza: { type: Boolean, default: false, required: true },
    isPescadoTraza: { type: Boolean, default: false, required: true },
    isCacahuetesTraza: { type: Boolean, default: false, required: true },
    isSojaTraza: { type: Boolean, default: false, required: true },
    isLacteosTraza: { type: Boolean, default: false, required: true },
    isFrutosSecosTraza: { type: Boolean, default: false, required: true },
    isApioTraza: { type: Boolean, default: false, required: true },
    isMostazaTraza: { type: Boolean, default: false, required: true },
    isGranosSesamoTraza: { type: Boolean, default: false, required: true },
    isSulfitosTraza: { type: Boolean, default: false, required: true },
    isAltramucesTraza: { type: Boolean, default: false, required: true },
    isMoluscosTraza: { type: Boolean, default: false, required: true },
  },
  {
    timestamp: true,
  }
);

const Trace = new mongoose.model('Trace', traceSchema);
export default Trace;
