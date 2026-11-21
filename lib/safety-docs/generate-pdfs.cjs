const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'files');
fs.mkdirSync(outDir, { recursive: true });

function createPdfDocument({
  code,
  title,
  subtitle,
  lang,
  calOshaRef,
  sections,
}) {
  // Page Letter size: 612 x 792 pt
  // Stream instructions in PDF-1.4 format
  const stream = [];

  // Top Dark Navy Header Band
  stream.push(
    '0.04 0.11 0.17 rg', // #0B1B2B
    '0 720 612 72 re',
    'f',
    '0.18 0.62 0.89 rg', // #2F9FE3 blue accent
    '0 716 612 4 re',
    'f',
    '1 1 1 rg', // White
    'BT',
    '/F1 15 Tf',
    '36 760 Td',
    '(RISE UP ROOFING & CONSTRUCTION - OFFICIAL SAFETY PROGRAM) Tj',
    'ET',
    'BT',
    '/F2 9.5 Tf',
    '36 745 Td',
    '(CSLB #1096492 - 2182 S El Camino Real, Oceanside, CA 92054 - PRIVATE EMPLOYEE COPY) Tj',
    'ET',
    'BT',
    '/F2 9 Tf',
    '36 730 Td',
    '(Cal/OSHA Reference: ' + calOshaRef + ' | Last Revision: November 2026) Tj',
    'ET'
  );

  // Document Code & Title Banner
  stream.push(
    '0.04 0.11 0.17 rg',
    'BT',
    '/F1 18 Tf',
    '36 675 Td',
    '(' + code + ') Tj',
    'ET',
    '0.08 0.35 0.55 rg', // Ocean Navy
    'BT',
    '/F1 13 Tf',
    '36 655 Td',
    '(' + title.replace(/[\(\)]/g, '') + ') Tj',
    'ET',
    '0.4 0.45 0.5 rg',
    'BT',
    '/F2 9.5 Tf',
    '36 640 Td',
    '(' + subtitle.replace(/[\(\)]/g, '') + ' | Language: ' + lang + ') Tj',
    'ET',
    // Separator line
    '0.82 0.86 0.9 rg',
    '36 628 540 1.2 re',
    'f'
  );

  // Emergency & Operations Contacts Box
  stream.push(
    '0.96 0.98 1.0 rg', // Light surface fill
    '36 558 540 60 re',
    'f',
    '0.18 0.62 0.89 rg', // Blue left bar
    '36 558 4 60 re',
    'f',
    '0.04 0.11 0.17 rg',
    'BT',
    '/F1 10 Tf',
    '48 600 Td',
    '(SAFETY DIRECTORY & CONTACTS / DIRECTORIO DE SEGURIDAD Y CONTACTOS:) Tj',
    'ET',
    '0.83 0.14 0.15 rg', // Signal red
    'BT',
    '/F1 9.5 Tf',
    '48 586 Td',
    '(EMERGENCY: CALL 911 IMMEDIATELY / EMERGENCIA: LLAME AL 911 DE INMEDIATO) Tj',
    'ET',
    '0.15 0.22 0.3 rg',
    'BT',
    '/F2 9 Tf',
    '48 572 Td',
    '(Christian Lavalle, Director of Operations: [760] 557-0981   |   Marc Sarellano, Head of Ops: [760] 622-1230) Tj',
    'ET'
  );

  // Sections
  let currentY = 530;
  for (const sec of sections) {
    if (currentY < 120) break; // Keep within page bounds
    stream.push(
      '0.04 0.11 0.17 rg',
      'BT',
      '/F1 10.5 Tf',
      '36 ' + currentY + ' Td',
      '(' + sec.heading.replace(/[\(\)]/g, '') + ') Tj',
      'ET'
    );
    currentY -= 16;

    stream.push(
      '0.18 0.25 0.32 rg',
      'BT',
      '/F2 8.5 Tf',
      '12 TL',
      '36 ' + currentY + ' Td'
    );

    for (const paragraph of sec.paragraphs) {
      const escaped = paragraph.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
      stream.push('(' + escaped + ') \'');
      currentY -= 12;
    }
    stream.push('ET');
    currentY -= 10;
  }

  // Non-Retaliation Policy Footer Bar
  stream.push(
    '0.94 0.98 0.95 rg', // Green tint
    '36 36 540 44 re',
    'f',
    '0.09 0.64 0.29 rg', // Green bar
    '36 78 540 2 re',
    'f',
    '0.06 0.45 0.2 rg',
    'BT',
    '/F1 9 Tf',
    '46 62 Td',
    '(CAL/OSHA NON-RETALIATION POLICY / POLITICA DE NO REPRESALIAS:) Tj',
    'ET',
    '0.15 0.25 0.2 rg',
    'BT',
    '/F2 8 Tf',
    '46 48 Td',
    '(No one will be punished for reporting a hazard or an injury. Nadie sera castigado por reportar un peligro o lesion.) Tj',
    'ET'
  );

  const streamContent = stream.join('\n');
  const streamBytes = Buffer.from(streamContent, 'latin1');

  const objects = [];
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');
  objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj');
  objects.push('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj');
  objects.push('4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj');
  objects.push('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj');
  objects.push('6 0 obj\n<< /Length ' + streamBytes.length + ' >>\nstream\n' + streamContent + '\nendstream\nendobj');

  let offset = 9; // length of '%PDF-1.4\n'
  const xrefEntries = ['0000000000 65535 f \r\n'];
  const bodyParts = ['%PDF-1.4\n'];

  for (let i = 0; i < objects.length; i++) {
    const objStr = objects[i] + '\n';
    const objBytes = Buffer.from(objStr, 'latin1');
    const padded = offset.toString().padStart(10, '0') + ' 00000 n \r\n';
    xrefEntries.push(padded);
    bodyParts.push(objStr);
    offset += objBytes.length;
  }

  const startXref = offset;
  bodyParts.push(
    'xref\r\n',
    '0 ' + (objects.length + 1) + '\r\n',
    xrefEntries.join(''),
    'trailer\r\n',
    '<< /Size ' + (objects.length + 1) + ' /Root 1 0 R >>\r\n',
    'startxref\r\n',
    startXref.toString() + '\r\n',
    '%%EOF\r\n'
  );

  return Buffer.from(bodyParts.join(''), 'latin1');
}

const docs = [
  // 1. RU SAF 00 (English)
  {
    filename: 'RU_SAF_00_Injury_and_Illness_Prevention_Program_IIPP.pdf',
    code: 'RU SAF 00',
    title: 'Injury and Illness Prevention Program (IIPP)',
    subtitle: 'Comprehensive Safety Management & Hazard Correction Standard',
    lang: 'English',
    calOshaRef: 'Cal/OSHA Title 8 CCR Section 1509 & Section 3203',
    sections: [
      {
        heading: '1. Management Commitment & Safety Responsibility',
        paragraphs: [
          'Rise Up Roofing & Construction is committed to providing a safe and healthful work environment for all employees.',
          'Christian Lavalle, Director of Operations, is designated as the primary safety program administrator.',
          'Supervisors, foremen, and crew leads have authority and responsibility for enforcing safe work practices on every jobsite.',
        ],
      },
      {
        heading: '2. Hazard Identification, Periodic Inspections & Correction',
        paragraphs: [
          'Pre-job safety audits and daily tailgates are conducted prior to rooftop access, tear-off, and heavy equipment staging.',
          'Unsafe conditions, defective ladders, faulty harnesses, or structural roof deck hazards must be corrected immediately.',
          'Employees have the right and duty to stop work whenever an imminent danger or unmitigated hazard is observed.',
        ],
      },
      {
        heading: '3. Employee Communication & Tailgate Safety Meetings',
        paragraphs: [
          'Mandatory tailgate safety meetings are held every 10 working days as required by Title 8 CCR Section 1509(e).',
          'Anonymous hazard reporting is available 24/7 on the private safety portal at riseuprac.com/team/safety.',
          'No employee shall be retaliated against, disciplined, or discharged for reporting safety hazards, injuries, or near misses.',
        ],
      },
      {
        heading: '4. Fall Protection, Heat Illness Prevention & Incident Response',
        paragraphs: [
          '100 percent tie-off is required for all work at or above 6 feet, including slide guards, harness anchorage, and safety nets.',
          'Cal/OSHA Heat Illness standard (Section 3395) mandates 1 quart of fresh drinking water per worker/hour and shaded recovery.',
          'All occupational injuries must be reported immediately to dispatch and operations leadership for prompt medical response.',
        ],
      },
    ],
  },

  // 2. RU SAF 10 (English)
  {
    filename: 'RU_SAF_10_Emergency_Action_and_Fire_Prevention_Plan.pdf',
    code: 'RU SAF 10',
    title: 'Emergency Action and Fire Prevention Plan',
    subtitle: 'Rooftop Evacuation, Hot-Work Safeguards & Emergency Medical Response',
    lang: 'English',
    calOshaRef: 'Cal/OSHA Title 8 CCR Section 3220 & Section 3221',
    sections: [
      {
        heading: '1. Emergency Reporting & Initial Evacuation Procedures',
        paragraphs: [
          'In any life-threatening emergency, call 911 immediately from a secure ground location.',
          'Evacuation routes and roof access ladders must be kept clear of roofing debris, bundles, and electrical cables.',
          'The jobsite foreman shall conduct a head count at the designated ground muster point immediately following evacuation.',
        ],
      },
      {
        heading: '2. Fire Prevention, Torch-Applied Roofing & Hot-Work Controls',
        paragraphs: [
          'Open-flame torch work or hot asphalt application requires an active hot-work permit and certified 20-lb ABC extinguisher on the roof.',
          'A mandatory 2-hour continuous fire watch is conducted after torching operations cease, utilizing infrared thermal cameras.',
          'Combustible roof decks must be protected with approved thermal barrier underlayment prior to torch application.',
        ],
      },
      {
        heading: '3. Severe Weather, High Wind & Lightning Shutdown Thresholds',
        paragraphs: [
          'All rooftop operations must halt when sustained wind speeds exceed 25 mph or during thunderstorm warnings.',
          'Loose synthetic underlayment, insulation boards, and metal flashings must be mechanically secured before site abandonment.',
        ],
      },
      {
        heading: '4. First-Aid Kits & Trauma Equipment Onsite',
        paragraphs: [
          'Every service vehicle and installation rig is equipped with Cal/OSHA compliant Class B first-aid and trauma burn kits.',
          'Designated ground lead coordinates emergency vehicle arrival and provides exact gate/address coordinates to first responders.',
        ],
      },
    ],
  },

  // 3. RU SAF 11 (English)
  {
    filename: 'RU_SAF_11_Hazard_Communication_Program.pdf',
    code: 'RU SAF 11',
    title: 'Hazard Communication Program',
    subtitle: 'Chemical Safety, SDS Protocols & Global Harmonized System Compliance',
    lang: 'English',
    calOshaRef: 'Cal/OSHA Title 8 CCR Section 5194 (GHS / HazCom)',
    sections: [
      {
        heading: '1. Chemical Inventory & Safety Data Sheets (SDS)',
        paragraphs: [
          'A master safety chemical inventory is maintained covering all asphalt primers, mastics, single-ply adhesives, and silicone coatings.',
          'Safety Data Sheets are available to every crew member via digital portal and physical binder on every work truck.',
          'Chemical products must never be transferred into unlabeled secondary containers.',
        ],
      },
      {
        heading: '2. GHS Pictograms, Labeling & Container Handling',
        paragraphs: [
          'All manufacturer labels must display GHS hazard pictograms, signal words, hazard statements, and manufacturer contact details.',
          'Solvent containers must remain sealed tightly when not in active use to prevent organic vapor accumulation and ignition.',
        ],
      },
      {
        heading: '3. Personal Protective Equipment (PPE) & Respiratory Protection',
        paragraphs: [
          'Nitrile or neoprene chemical-resistant gloves and safety goggles are mandatory during coating, mastic, and solvent application.',
          'Organic vapor cartridge respirators (NIOSH approved) are required when working in low-ventilation parapet corners or indoor staging.',
        ],
      },
      {
        heading: '4. Hazardous Spill Containment & Emergency Decontamination',
        paragraphs: [
          'Spill kits containing neutralizer and absorbent pads are staged in the hazardous materials transport bay of every utility truck.',
          'Emergency eyewash bottles (buffered saline) must be checked daily and kept accessible within 25 feet of chemical work.',
        ],
      },
    ],
  },

  // 4. RU SAF 12 (English)
  {
    filename: 'RU_SAF_12_Silica_Exposure_Control_Plan.pdf',
    code: 'RU SAF 12',
    title: 'Silica Exposure Control Plan',
    subtitle: 'Cal/OSHA Title 8 Respirable Crystalline Silica Standard for Roofing',
    lang: 'English',
    calOshaRef: 'Cal/OSHA Title 8 CCR Section 1532.3 (Table 1 Compliance)',
    sections: [
      {
        heading: '1. Scope & Roofing Operations Involving Crystalline Silica',
        paragraphs: [
          'This plan governs all operations involving cutting, grinding, or chipping concrete roof tiles, clay tiles, and mortar ridge caps.',
          'Respirable crystalline silica exposure can cause irreversible lung damage (silicosis) and is strictly controlled at Rise Up Roofing.',
        ],
      },
      {
        heading: '2. Cal/OSHA Table 1 Engineering Controls & Wet Cutting Methods',
        paragraphs: [
          'Dry cutting of concrete or clay roof tiles with handheld saws is strictly prohibited on all Rise Up Roofing worksites.',
          'Saws equipped with integrated water delivery systems providing continuous stream to the blade must be utilized at all times.',
          'When wet cutting is physically impossible, HEPA-filtered vacuum shrouds with 99.97 percent capture efficiency are required.',
        ],
      },
      {
        heading: '3. Respiratory Protection & Worker Training',
        paragraphs: [
          'Operators cutting tiles for more than 4 hours per shift must wear NIOSH-certified N95 or half-mask elastomeric respirators.',
          'All cutting crew members receive annual silica safety training covering Table 1 methods, maintenance, and medical surveillance.',
        ],
      },
      {
        heading: '4. Regulated Cutting Areas & Slurry Housekeeping',
        paragraphs: [
          'Tile cutting stations must be established on ground level or in designated, barricaded rooftop zones away from downwind crews.',
          'Wet slurry must be cleaned up before drying out into airborne dust, using wet sweeping or HEPA vacuuming methods only.',
        ],
      },
    ],
  },

  // 5. RU SAF 00 ES (Spanish)
  {
    filename: 'RU_SAF_00_ES_Programa_de_Prevencion_de_Lesiones_y_Enfermedades.pdf',
    code: 'RU SAF 00 ES',
    title: 'Programa de Prevencion de Lesiones y Enfermedades',
    subtitle: 'Norma Integral de Gestion de Seguridad y Correccion de Peligros',
    lang: 'Espanol / Spanish',
    calOshaRef: 'Cal/OSHA Titulo 8 CCR Seccion 1509 y Seccion 3203',
    sections: [
      {
        heading: '1. Compromiso de la Direccion y Responsabilidades de Seguridad',
        paragraphs: [
          'Rise Up Roofing & Construction tiene el compromiso absoluto de brindar un entorno de trabajo seguro y saludable para todos.',
          'Christian Lavalle, Director de Operaciones, es el administrador principal del programa de seguridad de la empresa.',
          'Los mayordomos, supervisores y lideres de cuadrilla tienen la autoridad y el deber de exigir practicas de trabajo seguras.',
        ],
      },
      {
        heading: '2. Identificacion de Peligros, Inspecciones Periodicas y Correccion',
        paragraphs: [
          'Se realizan inspecciones de seguridad antes de comenzar la jornada y platicas de seguridad previas al acceso a techos.',
          'Condiciones inseguras, escaleras defectuosas, arneses danados o maderas podridas deben corregirse de inmediato.',
          'Cada trabajador tiene el derecho y la obligacion de detener el trabajo si detecta una condicion de peligro inminente.',
        ],
      },
      {
        heading: '3. Comunicacion de Seguridad y Platicas Diarias (Tailgates)',
        paragraphs: [
          'Se imparten platicas obligatorias de seguridad cada 10 dias laborables segun Cal/OSHA Titulo 8 CCR Seccion 1509(e).',
          'El reporte anonimo de peligros esta disponible 24/7 en el portal de seguridad: riseuprac.com/team/safety.',
          'Nadie sera castigado, sancionado ni despedido por reportar un peligro, lesion o incidente en el trabajo.',
        ],
      },
      {
        heading: '4. Proteccion Contra Caidas, Prevencion de Calor y Emergencias',
        paragraphs: [
          'Se exige 100 por ciento amarre seguro en todo trabajo a 6 pies o mas de altura, con arnes y lineas de vida certificadas.',
          'La norma de calor (Seccion 3395) exige 1 cuarto de agua fresca por hora por trabajador y areas con sombra para descanso.',
          'Toda lesion laboral debe reportarse inmediatamente a la direccion de operaciones para atencion medica oportuna.',
        ],
      },
    ],
  },

  // 6. RU SAF 10 ES (Spanish)
  {
    filename: 'RU_SAF_10_ES_Plan_de_Accion_en_Emergencias_y_Prevencion_de_Incendios.pdf',
    code: 'RU SAF 10 ES',
    title: 'Plan de Accion en Emergencias y Prevencion de Incendios',
    subtitle: 'Evacuacion en Techos, Medidas de Fuego y Respuesta Medica de Emergencia',
    lang: 'Espanol / Spanish',
    calOshaRef: 'Cal/OSHA Titulo 8 CCR Seccion 3220 y Seccion 3221',
    sections: [
      {
        heading: '1. Reporte de Emergencias y Procedimiento de Evacuacion',
        paragraphs: [
          'En cualquier situacion de emergencia con riesgo a la vida, llame al 911 de inmediato desde un lugar seguro.',
          'Las rutas de escape y escaleras de acceso al techo deben mantenerse libres de escombros, paquetes de teja y cables.',
          'El mayordomo contara a todo el personal en el punto de reunion en tierra inmediatamente despues de evacuar.',
        ],
      },
      {
        heading: '2. Prevencion de Incendios y Trabajo con Soplete / Asfalto Caliente',
        paragraphs: [
          'El uso de soplete requiere permiso de trabajo en caliente y extintor ABC de 20 libras en el techo.',
          'Se realiza una guardia de fuego obligatoria de 2 horas tras concluir el uso de soplete, usando camara termica infrarroja.',
          'Las superficies de madera combustible deben cubrirse con membrana base ignifuga antes de aplicar soplete.',
        ],
      },
      {
        heading: '3. Condiciones Climatologicas Severas y Vientos Fuertes',
        paragraphs: [
          'Todo trabajo en techo debe suspenderse si los vientos sostenidos superan las 25 millas por hora o hay alerta de tormenta.',
          'Materiales sueltos y piezas de metal deben fijarse mecanicamente antes de abandonar el sitio de trabajo.',
        ],
      },
      {
        heading: '4. Botiquines de Primeros Auxilios y Quemaduras en Obra',
        paragraphs: [
          'Cada vehiculo de cuadrilla cuenta con botiquin certificado Cal/OSHA Clase B para traumatismos y quemaduras.',
          'El responsable en tierra guiara a los servicios de emergencia (ambulancia / bomberos) hacia el punto exacto de la obra.',
        ],
      },
    ],
  },

  // 7. RU SAF 11 ES (Spanish)
  {
    filename: 'RU_SAF_11_ES_Programa_de_Comunicacion_de_Peligros.pdf',
    code: 'RU SAF 11 ES',
    title: 'Programa de Comunicacion de Peligros',
    subtitle: 'Seguridad Quimica, Hojas SDS y Sistema Globalmente Armonizado',
    lang: 'Espanol / Spanish',
    calOshaRef: 'Cal/OSHA Titulo 8 CCR Seccion 5194 (SGA / HazCom)',
    sections: [
      {
        heading: '1. Inventario Quimico y Hojas de Datos de Seguridad (SDS)',
        paragraphs: [
          'Se mantiene un inventario de seguridad de todos los selladores, imprimadores de asfalto, adhesivos y recubrimientos de silicon.',
          'Las Hojas SDS estan disponibles en formato digital en el portal y en carpetas fisicas en cada camion de trabajo.',
          'Queda estrictamente prohibido colocar quimicos o solventes en envases secundarios sin su etiqueta correspondiente.',
        ],
      },
      {
        heading: '2. Pictogramas del SGA y Manejo Seguro de Recipientes',
        paragraphs: [
          'Todas las etiquetas de fabricantes deben incluir pictogramas de peligro, palabras de advertencia e instrucciones de primeros auxilios.',
          'Los recipientes de solventes deben permanecer bien cerrados cuando no se usen para evitar acumulacion de vapores.',
        ],
      },
      {
        heading: '3. Equipo de Proteccion Personal (EPP) y Respiradores',
        paragraphs: [
          'Guantes resistentes a quimicos (nitrilo o neopreno) y lentes de seguridad son obligatorios al manipular adhesivos o selladores.',
          'Se requiere respirador de cartucho para vapores organicos (aprobado por NIOSH) en areas con ventilacion limitada.',
        ],
      },
      {
        heading: '4. Control de Derrames y Estaciones de Lavado de Ojos',
        paragraphs: [
          'Kits para derrames con absorbentes estan ubicados en el area de almacenamiento de cada camioneta de cuadrilla.',
          'Las botellas de lavado de ojos de emergencia deben verificarse diariamente y estar a no mas de 25 pies de la zona de aplicacion.',
        ],
      },
    ],
  },

  // 8. RU SAF 12 ES (Spanish)
  {
    filename: 'RU_SAF_12_ES_Plan_de_Control_de_Exposicion_a_la_Silice.pdf',
    code: 'RU SAF 12 ES',
    title: 'Plan de Control de Exposicion a la Silice',
    subtitle: 'Norma Cal/OSHA Titulo 8 de Silice Cristalina Respirable en Techos',
    lang: 'Espanol / Spanish',
    calOshaRef: 'Cal/OSHA Titulo 8 CCR Seccion 1532.3 (Cumplimiento Tabla 1)',
    sections: [
      {
        heading: '1. Alcance y Operaciones con Silice en Techos',
        paragraphs: [
          'Este plan rige todas las labores de corte, esmerilado o demolicion de tejas de concreto, barro y mortero para caballetes.',
          'La exposicion a la silice cristalina respirable causa danos pulmonares irreversibles (silicosis) y esta estrictamente controlada.',
        ],
      },
      {
        heading: '2. Controles de Ingenieria y Corte Humedo Obligatorio (Tabla 1)',
        paragraphs: [
          'El corte en seco de tejas de concreto o barro con sierra manual esta estrictamente prohibido en toda obra de Rise Up Roofing.',
          'Las sierras deben contar con sistema integrado de suministro continuo de agua al disco en todo momento.',
          'Si el corte humedo es imposible, se debe usar cubierta con aspiradora y filtro HEPA con 99.97 por ciento de eficiencia.',
        ],
      },
      {
        heading: '3. Proteccion Respiratoria y Capacitacion de Cuadrillas',
        paragraphs: [
          'Trabajadores que corten teja por mas de 4 horas por turno deben portar respirador N95 o elastomerico de media cara certificado.',
          'Todo el personal de corte recibe capacitacion anual sobre metodos seguros de la Tabla 1 y mantenimiento de equipo.',
        ],
      },
      {
        heading: '4. Areas Reguladas de Corte y Limpieza de Lodos',
        paragraphs: [
          'Las estaciones de corte de teja deben ubicarse en tierra o en zonas delimitadas del techo, lejos del resto de la cuadrilla.',
          'El lodo humedo de corte debe limpiarse antes de secarse y convertirse en polvo en el aire, usando barrido humedo o aspiradora HEPA.',
        ],
      },
    ],
  },
];

for (const doc of docs) {
  const pdfBytes = createPdfDocument(doc);
  const targetPath = path.join(outDir, doc.filename);
  fs.writeFileSync(targetPath, pdfBytes);
  console.log(`Generated: ${doc.filename} (${pdfBytes.length} bytes)`);
}
console.log('All 8 safety PDFs successfully generated in:', outDir);
