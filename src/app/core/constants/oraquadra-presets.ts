// Nomi dei 19 preset del firmware Oraquadra (indice = valore inviato via BLE).
// Corrispondono a Presets::apply() nel firmware; i nomi degli effetti restano
// in italiano come nel progetto originale.
export interface OqPresetEntry {
  id: number;
  name: string;
}

export const OQ_PRESETS: OqPresetEntry[] = [
  { id: 0,  name: 'Lento Casuale' },
  { id: 1,  name: 'Sfumato Blu' },
  { id: 2,  name: 'Matrix Verde' },
  { id: 3,  name: 'Lento Arancione' },
  { id: 4,  name: 'Matrix Blu' },
  { id: 5,  name: 'Matrix Giallo' },
  { id: 6,  name: 'Sfumato Verde' },
  { id: 7,  name: 'Lento Blu' },
  { id: 8,  name: 'Matrix Ciano' },
  { id: 9,  name: 'Sfumato Rosa' },
  { id: 10, name: 'Veloce Giallo' },
  { id: 11, name: 'Veloce Bianco' },
  { id: 12, name: 'Veloce Ciano' },
  { id: 13, name: 'Effetto TRON' },
  { id: 14, name: 'Effetto Goccia' },
  { id: 15, name: 'Effetto Moto' },
  { id: 16, name: 'Effetto Galaga' },
  { id: 17, name: 'Effetto Pacman' },
  { id: 18, name: 'Digitale' },
];
