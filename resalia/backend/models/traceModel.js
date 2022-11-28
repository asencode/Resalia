import mongoose from 'mongoose';

export const traceSchema = new mongoose.Schema(
  {
    isGluten: { type: Boolean, default: false, required: true },
    isMarisco: { type: Boolean, default: false, required: true },
    isHuevos: { type: Boolean, default: false, required: true },
    isPescado: { type: Boolean, default: false, required: true },
    isCacahuetes: { type: Boolean, default: false, required: true },
    isSoja: { type: Boolean, default: false, required: true },
    isLacteos: { type: Boolean, default: false, required: true },
    isFrutosSecos: { type: Boolean, default: false, required: true },
    isApio: { type: Boolean, default: false, required: true },
    isMostaza: { type: Boolean, default: false, required: true },
    isGranosSesamo: { type: Boolean, default: false, required: true },
    isSulfitos: { type: Boolean, default: false, required: true },
    isAltramuces: { type: Boolean, default: false, required: true },
    isMoluscos: { type: Boolean, default: false, required: true },
  },
  {
    timestamp: true,
  }
);

const Trace = new mongoose.model('Trace', traceSchema);
export default Trace;
