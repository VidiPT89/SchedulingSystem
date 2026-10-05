export type Locale = 'pt' | 'en'

export type Dictionary = {
  brand: string
  book: string
  admin: string
  developed: string
  kicker: string
  hero: string
  lead: string
  services: string
  duration: string
  priceCents: string
  minutes: string
  pickDay: string
  pickSlot: string
  noSlots: string
  taken: string
  name: string
  email: string
  confirm: string
  success: string
  login: string
  password: string
  enter: string
  newService: string
  namePt: string
  nameEn: string
  descPt: string
  descEn: string
  save: string
  appointments: string
  outbox: string
  reminder: string
  confirmed: string
  cancelled: string
  cancel: string
  empty: string
  delivered: string
  stored: string
}

export const dictionaries: Record<Locale, Dictionary> = {
  pt: {
    brand: 'Atelier Slot',
    book: 'Marcar',
    admin: 'Admin',
    developed: 'Developed by David Arsénio Martins',
    kicker: 'Calendário de atelier',
    hero: 'Marca o teu bloco de luz.',
    lead: 'Serviços com duração fixa, slots livres no calendário, confirmação por e-mail e um lembrete uma hora antes.',
    services: 'Serviços',
    duration: 'Duração',
    priceCents: 'Preço (cêntimos)',
    minutes: 'min',
    pickDay: 'Escolhe o dia',
    pickSlot: 'Slots livres',
    noSlots: 'Neste dia já não há vagas para este serviço.',
    taken: 'Ocupado',
    name: 'Nome',
    email: 'E-mail',
    confirm: 'Confirmar marcação',
    success: 'Marcação confirmada. O e-mail de confirmação saiu (ou ficou na caixa de saída do admin).',
    login: 'Entrada do atelier',
    password: 'Palavra-passe',
    enter: 'Entrar',
    newService: 'Novo serviço',
    namePt: 'Nome (PT)',
    nameEn: 'Nome (EN)',
    descPt: 'Descrição (PT)',
    descEn: 'Descrição (EN)',
    save: 'Guardar',
    appointments: 'Marcações',
    outbox: 'Caixa de saída',
    reminder: 'Lembrete',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    cancel: 'Cancelar',
    empty: 'Ainda não há registos.',
    delivered: 'Enviado',
    stored: 'Guardado',
  },
  en: {
    brand: 'Atelier Slot',
    book: 'Book',
    admin: 'Admin',
    developed: 'Developed by David Arsénio Martins',
    kicker: 'Atelier calendar',
    hero: 'Book your block of light.',
    lead: 'Services with a fixed duration, open calendar slots, email confirmation and a reminder one hour before.',
    services: 'Services',
    duration: 'Duration',
    priceCents: 'Price (cents)',
    minutes: 'min',
    pickDay: 'Pick a day',
    pickSlot: 'Open slots',
    noSlots: 'No remaining slots for this service on this day.',
    taken: 'Taken',
    name: 'Name',
    email: 'Email',
    confirm: 'Confirm booking',
    success: 'Booking confirmed. The confirmation email was sent (or stored in the admin outbox).',
    login: 'Atelier desk',
    password: 'Password',
    enter: 'Sign in',
    newService: 'New service',
    namePt: 'Name (PT)',
    nameEn: 'Name (EN)',
    descPt: 'Description (PT)',
    descEn: 'Description (EN)',
    save: 'Save',
    appointments: 'Appointments',
    outbox: 'Outbox',
    reminder: 'Reminder',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    cancel: 'Cancel',
    empty: 'Nothing here yet.',
    delivered: 'Sent',
    stored: 'Stored',
  },
}
