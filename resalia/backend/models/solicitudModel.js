import mongoose from 'mongoose';

const solicitudSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefono: { type: String, required: true },
    infoAdicional: { type: String },
  },
  {
    timestamp: true,
  }
);

const Solicitud = new mongoose.model('Solicitud', solicitudSchema);
export default Solicitud;
