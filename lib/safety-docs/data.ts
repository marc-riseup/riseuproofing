export interface SafetyDocument {
  id: string;
  code: string;
  lang: 'en' | 'es';
  titleEn: string;
  titleEs: string;
  calOshaRef: string;
  descriptionEn: string;
  descriptionEs: string;
  filename: string;
  fileSizeKb: number;
  lastUpdated: string;
}

export const SAFETY_DOCUMENTS: SafetyDocument[] = [
  // English Documents
  {
    id: 'ru-saf-00-iipp-en',
    code: 'RU SAF 00',
    lang: 'en',
    titleEn: 'Injury and Illness Prevention Program (IIPP)',
    titleEs: 'Programa de Prevención de Lesiones y Enfermedades',
    calOshaRef: 'Cal/OSHA Title 8 CCR §1509 & §3203',
    descriptionEn: 'Core safety management system: management commitment, hazard identification, safety communications, crew training, and incident investigation.',
    descriptionEs: 'Sistema central de seguridad: compromiso administrativo, identificación de peligros, comunicación, capacitación de cuadrillas e investigación de incidentes.',
    filename: 'RU_SAF_00_Injury_and_Illness_Prevention_Program_IIPP.pdf',
    fileSizeKb: 142,
    lastUpdated: 'November 2026',
  },
  {
    id: 'ru-saf-10-emergency-en',
    code: 'RU SAF 10',
    lang: 'en',
    titleEn: 'Emergency Action and Fire Prevention Plan',
    titleEs: 'Plan de Acción en Emergencias y Prevención de Incendios',
    calOshaRef: 'Cal/OSHA Title 8 CCR §3220 & §3221',
    descriptionEn: 'Emergency response protocols: rooftop evacuation, fire prevention, burn/fall emergencies, severe weather shutdowns, and first-aid dispatch.',
    descriptionEs: 'Protocolos de emergencia: evacuación en techos, prevención de incendios, emergencias por caídas/quemaduras y despacho de primeros auxilios.',
    filename: 'RU_SAF_10_Emergency_Action_and_Fire_Prevention_Plan.pdf',
    fileSizeKb: 118,
    lastUpdated: 'November 2026',
  },
  {
    id: 'ru-saf-11-hazcom-en',
    code: 'RU SAF 11',
    lang: 'en',
    titleEn: 'Hazard Communication Program',
    titleEs: 'Programa de Comunicación de Peligros',
    calOshaRef: 'Cal/OSHA Title 8 CCR §5194 (GHS / HazCom)',
    descriptionEn: 'Chemical safety program: chemical inventories, SDS access, container labeling, asphalt/silicone fumes, solvent handling, and required PPE.',
    descriptionEs: 'Seguridad química: inventarios de productos, acceso a SDS, etiquetado de envases, vapores de asfalto/silicona y equipo de protección.',
    filename: 'RU_SAF_11_Hazard_Communication_Program.pdf',
    fileSizeKb: 124,
    lastUpdated: 'November 2026',
  },
  {
    id: 'ru-saf-12-silica-en',
    code: 'RU SAF 12',
    lang: 'en',
    titleEn: 'Silica Exposure Control Plan',
    titleEs: 'Plan de Control de Exposición a la Sílice',
    calOshaRef: 'Cal/OSHA Title 8 CCR §1532.3 (Respirable Crystalline Silica)',
    descriptionEn: 'Respirable crystalline silica plan: tile cutting wet methods, vacuum shrouds, HEPA filtration, respiratory protection, and exposure monitoring.',
    descriptionEs: 'Plan de sílice cristalina: corte húmedo de tejas, aspiradoras con filtro HEPA, protección respiratoria y monitoreo de exposición.',
    filename: 'RU_SAF_12_Silica_Exposure_Control_Plan.pdf',
    fileSizeKb: 130,
    lastUpdated: 'November 2026',
  },

  // Spanish Documents
  {
    id: 'ru-saf-00-iipp-es',
    code: 'RU SAF 00 ES',
    lang: 'es',
    titleEn: 'Injury and Illness Prevention Program (IIPP) - Spanish',
    titleEs: 'Programa de Prevención de Lesiones y Enfermedades',
    calOshaRef: 'Cal/OSHA Título 8 CCR §1509 y §3203',
    descriptionEn: 'Spanish version: Core safety management system, hazard recognition, crew safety communications, and incident response.',
    descriptionEs: 'Versión en español: Sistema central de gestión de seguridad, reconocimiento de peligros, comunicación en cuadrillas y respuesta a incidentes.',
    filename: 'RU_SAF_00_ES_Programa_de_Prevencion_de_Lesiones_y_Enfermedades.pdf',
    fileSizeKb: 145,
    lastUpdated: 'Noviembre 2026',
  },
  {
    id: 'ru-saf-10-emergency-es',
    code: 'RU SAF 10 ES',
    lang: 'es',
    titleEn: 'Emergency Action and Fire Prevention Plan - Spanish',
    titleEs: 'Plan de Acción en Emergencias y Prevención de Incendios',
    calOshaRef: 'Cal/OSHA Título 8 CCR §3220 y §3221',
    descriptionEn: 'Spanish version: Rooftop evacuation procedures, fire prevention, emergency contacts, and jobsite medical response.',
    descriptionEs: 'Versión en español: Procedimientos de evacuación en techos, prevención de incendios, contactos de emergencia y respuesta médica en obra.',
    filename: 'RU_SAF_10_ES_Plan_de_Accion_en_Emergencias_y_Prevencion_de_Incendios.pdf',
    fileSizeKb: 120,
    lastUpdated: 'Noviembre 2026',
  },
  {
    id: 'ru-saf-11-hazcom-es',
    code: 'RU SAF 11 ES',
    lang: 'es',
    titleEn: 'Hazard Communication Program - Spanish',
    titleEs: 'Programa de Comunicación de Peligros',
    calOshaRef: 'Cal/OSHA Título 8 CCR §5194 (SGA / HazCom)',
    descriptionEn: 'Spanish version: Handling chemical hazards, primers, adhesives, safety data sheets, and mandatory respiratory protection.',
    descriptionEs: 'Versión en español: Manejo de químicos, selladores, adhesivos, hojas de datos de seguridad y equipo de protección respiratoria obligatorio.',
    filename: 'RU_SAF_11_ES_Programa_de_Comunicacion_de_Peligros.pdf',
    fileSizeKb: 126,
    lastUpdated: 'Noviembre 2026',
  },
  {
    id: 'ru-saf-12-silica-es',
    code: 'RU SAF 12 ES',
    lang: 'es',
    titleEn: 'Silica Exposure Control Plan - Spanish',
    titleEs: 'Plan de Control de Exposición a la Sílice',
    calOshaRef: 'Cal/OSHA Título 8 CCR §1532.3 (Sílice Cristalina Respirable)',
    descriptionEn: 'Spanish version: Methods for concrete/clay roof tile cutting, engineering controls, water delivery systems, and N95/half-mask standards.',
    descriptionEs: 'Versión en español: Métodos de corte de tejas de concreto y barro, controles de ingeniería con agua, y respiradores N95/media cara certificados.',
    filename: 'RU_SAF_12_ES_Plan_de_Control_de_Exposicion_a_la_Silice.pdf',
    fileSizeKb: 132,
    lastUpdated: 'Noviembre 2026',
  },
];
