// ============================================================
// decision-pdf.js — Generates an official-style Decision Letter PDF
// Covers: Approved, Approved (Action Needed), Declined/Rejected
// Uses jsPDF (loaded via CDN). Sandbox disclaimers on every page.
// Pass a language code as second arg: 'en' (default), 'pt', 'es'
// ============================================================

const DECISION_STRINGS = {
  en:{
    title:'U.S. VISA APPLICATION DECISION LETTER',
    dept:'U.S. Department of State — Consular Services Division (SANDBOX)',
    issued:'Issued:',
    refNum:'Reference Number', appName:'Applicant Name', nationality:'Nationality',
    passportNum:'Passport Number', visaCategory:'Visa Category', decisionDate:'Decision Date',
    decision:'DECISION',
    approved:'APPROVED',
    actionNeeded:'CONDITIONALLY APPROVED — ACTION REQUIRED',
    denied:'DECLINED / REJECTED',
    dear:'Dear',
    introApproved:(ref)=>`We are pleased to inform you that your nonimmigrant visa application (Reference: ${ref}) has been reviewed and APPROVED by the U.S. Consular Officer. Your visa document will be prepared and delivered to the address on file.`,
    introAction:(ref)=>`Your nonimmigrant visa application (Reference: ${ref}) has been conditionally approved. However, before your visa can be issued, you are required to take the action(s) described in the decision notes below. Please read carefully and respond promptly.`,
    introDenied:(ref)=>`After careful review of your nonimmigrant visa application (Reference: ${ref}), the U.S. Consular Officer has determined that your application does not meet the requirements for visa issuance at this time. Your application has been DECLINED.`,
    reasonTitle:'REASON / NOTES FROM CONSULAR OFFICER:',
    noReason:'No additional notes provided by the consular officer.',
    deliveryTitle:'DELIVERY ADDRESS:',
    paymentTitle:'PAYMENT SUMMARY:',
    amountPaid:'Amount Paid:',
    remaining:'Remaining Balance:',
    closingApproved:'Thank you for your application. For any queries regarding this decision, please reference your application number in all correspondence with our consular services office.',
    closingDenied:'If you believe this decision was made in error or your circumstances have changed, you may reapply. Please note that reapplication does not guarantee approval. For queries, contact our consular services office.',
    officer:'Consular Officer',
    division:'U.S. Visa Processing Division (SANDBOX)',
    date:'Date:',
    forOfficial:'For Official Use',
    page2Title:'APPLICATION SUMMARY — FOR YOUR RECORDS',
    fields:['Reference Number','Full Name','First Name','Last Name','Date of Birth','Nationality','Passport Number','Passport Expiry','Visa Category','Purpose of Visit','Intended Arrival','Intended Departure','Biometric Status','Payment Status','Decision','Decision Date'],
    bioScheduled:(loc)=>`Scheduled — ${loc}`, bioNot:'Not scheduled',
    payFull:'Paid in full', payPartial:(n)=>`Partial — $${n} paid`, payNone:'Not paid',
    notice:'IMPORTANT NOTICE',
    noticeText:'This document is issued as part of a sandbox web development project. It is not a real visa or official U.S. Government document and confers no legal status. It must not be used for travel, identification, or any official purpose.',
    sandbox:'SANDBOX DOCUMENT — NOT FOR REAL USE',
    sandboxSub:'This is a demonstration document for a student web development contest. Not an official government document.',
  },
  pt:{
    title:'CARTA DE DECISÃO — SOLICITAÇÃO DE VISTO EUA',
    dept:'Departamento de Estado dos EUA — Divisão de Serviços Consulares (SANDBOX)',
    issued:'Emitido:',
    refNum:'Número de Referência', appName:'Nome do Solicitante', nationality:'Nacionalidade',
    passportNum:'Número do Passaporte', visaCategory:'Categoria de Visto', decisionDate:'Data da Decisão',
    decision:'DECISÃO',
    approved:'APROVADO',
    actionNeeded:'APROVADO CONDICIONALMENTE — AÇÃO NECESSÁRIA',
    denied:'RECUSADO / REJEITADO',
    dear:'Prezado(a)',
    introApproved:(ref)=>`Temos o prazer de informar que sua solicitação de visto de não imigrante (Referência: ${ref}) foi analisada e APROVADA pelo Oficial Consular dos EUA. Seu documento de visto será preparado e entregue no endereço registrado.`,
    introAction:(ref)=>`Sua solicitação de visto de não imigrante (Referência: ${ref}) foi aprovada condicionalmente. No entanto, antes que seu visto possa ser emitido, você deve tomar as medidas descritas nas notas de decisão abaixo. Por favor, leia atentamente e responda prontamente.`,
    introDenied:(ref)=>`Após análise cuidadosa de sua solicitação de visto de não imigrante (Referência: ${ref}), o Oficial Consular dos EUA determinou que sua solicitação não atende aos requisitos para emissão de visto neste momento. Sua solicitação foi RECUSADA.`,
    reasonTitle:'MOTIVO / OBSERVAÇÕES DO OFICIAL CONSULAR:',
    noReason:'Nenhuma observação adicional foi fornecida pelo oficial consular.',
    deliveryTitle:'ENDEREÇO DE ENTREGA:',
    paymentTitle:'RESUMO DO PAGAMENTO:',
    amountPaid:'Valor Pago:',
    remaining:'Saldo Restante:',
    closingApproved:'Obrigado pela sua solicitação. Para quaisquer dúvidas sobre esta decisão, referencie seu número de solicitação em toda correspondência com nosso escritório de serviços consulares.',
    closingDenied:'Se acredita que esta decisão foi tomada por engano ou suas circunstâncias mudaram, você pode reaplica. Observe que a reaplicação não garante aprovação. Para dúvidas, entre em contato com nosso escritório consular.',
    officer:'Oficial Consular',
    division:'Divisão de Processamento de Vistos dos EUA (SANDBOX)',
    date:'Data:',
    forOfficial:'Para Uso Oficial',
    page2Title:'RESUMO DA SOLICITAÇÃO — PARA SEUS REGISTROS',
    fields:['Número de Referência','Nome Completo','Primeiro Nome','Sobrenome','Data de Nascimento','Nacionalidade','Número do Passaporte','Validade do Passaporte','Categoria de Visto','Propósito da Visita','Chegada Prevista','Partida Prevista','Status Biométrico','Status do Pagamento','Decisão','Data da Decisão'],
    bioScheduled:(loc)=>`Agendado — ${loc}`, bioNot:'Não agendado',
    payFull:'Pago integralmente', payPartial:(n)=>`Parcial — $${n} pago`, payNone:'Não pago',
    notice:'AVISO IMPORTANTE',
    noticeText:'Este documento foi emitido como parte de um projeto de desenvolvimento web acadêmico. Não é um visto real nem um documento oficial do Governo dos EUA e não confere status legal. Não deve ser usado para viagens, identificação ou qualquer finalidade oficial.',
    sandbox:'DOCUMENTO SANDBOX — NÃO PARA USO REAL',
    sandboxSub:'Este é um documento de demonstração para um concurso estudantil de desenvolvimento web. Não é um documento governamental oficial.',
  },
  es:{
    title:'CARTA DE DECISIÓN — SOLICITUD DE VISA EE.UU.',
    dept:'Departamento de Estado de EE.UU. — División de Servicios Consulares (SANDBOX)',
    issued:'Emitido:',
    refNum:'Número de Referencia', appName:'Nombre del Solicitante', nationality:'Nacionalidad',
    passportNum:'Número de Pasaporte', visaCategory:'Categoría de Visa', decisionDate:'Fecha de Decisión',
    decision:'DECISIÓN',
    approved:'APROBADA',
    actionNeeded:'APROBADA CONDICIONALMENTE — SE REQUIERE ACCIÓN',
    denied:'DENEGADA / RECHAZADA',
    dear:'Estimado/a',
    introApproved:(ref)=>`Nos complace informarle que su solicitud de visa de no inmigrante (Referencia: ${ref}) ha sido revisada y APROBADA por el Oficial Consular de EE.UU. Su documento de visa será preparado y entregado en la dirección registrada.`,
    introAction:(ref)=>`Su solicitud de visa de no inmigrante (Referencia: ${ref}) ha sido aprobada condicionalmente. Sin embargo, antes de que su visa pueda ser emitida, debe tomar las acciones descritas en las notas de decisión a continuación. Por favor léalas con atención y responda prontamente.`,
    introDenied:(ref)=>`Tras una revisión cuidadosa de su solicitud de visa de no inmigrante (Referencia: ${ref}), el Oficial Consular de EE.UU. ha determinado que su solicitud no cumple con los requisitos para la emisión de visa en este momento. Su solicitud ha sido DENEGADA.`,
    reasonTitle:'MOTIVO / NOTAS DEL OFICIAL CONSULAR:',
    noReason:'No se proporcionaron notas adicionales por parte del oficial consular.',
    deliveryTitle:'DIRECCIÓN DE ENTREGA:',
    paymentTitle:'RESUMEN DE PAGO:',
    amountPaid:'Monto Pagado:',
    remaining:'Saldo Pendiente:',
    closingApproved:'Gracias por su solicitud. Para cualquier consulta sobre esta decisión, haga referencia a su número de solicitud en toda correspondencia con nuestra oficina de servicios consulares.',
    closingDenied:'Si cree que esta decisión fue tomada por error o sus circunstancias han cambiado, puede volver a solicitar. Tenga en cuenta que la nueva solicitud no garantiza la aprobación. Para consultas, contacte nuestra oficina consular.',
    officer:'Oficial Consular',
    division:'División de Procesamiento de Visas de EE.UU. (SANDBOX)',
    date:'Fecha:',
    forOfficial:'Para Uso Oficial',
    page2Title:'RESUMEN DE SOLICITUD — PARA SUS REGISTROS',
    fields:['Número de Referencia','Nombre Completo','Primer Nombre','Apellido','Fecha de Nacimiento','Nacionalidad','Número de Pasaporte','Vencimiento del Pasaporte','Categoría de Visa','Propósito de la Visita','Llegada Prevista','Salida Prevista','Estado Biométrico','Estado de Pago','Decisión','Fecha de Decisión'],
    bioScheduled:(loc)=>`Programado — ${loc}`, bioNot:'No programado',
    payFull:'Pagado en su totalidad', payPartial:(n)=>`Parcial — $${n} pagado`, payNone:'No pagado',
    notice:'AVISO IMPORTANTE',
    noticeText:'Este documento fue emitido como parte de un proyecto académico de desarrollo web. No es una visa real ni un documento oficial del Gobierno de EE.UU. y no confiere estado legal. No debe usarse para viajes, identificación ni ningún propósito oficial.',
    sandbox:'DOCUMENTO SANDBOX — NO PARA USO REAL',
    sandboxSub:'Este es un documento de demostración para un concurso estudiantil de desarrollo web. No es un documento gubernamental oficial.',
  }
};

window.generateDecisionLetterPDF = function(d, lang){
  const s = DECISION_STRINGS[lang] || DECISION_STRINGS.en;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:'pt', format:'letter' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  const BLUE   = [0,  40, 104];
  const RED    = [191, 10,  48];
  const GOLD   = [201,168,  76];
  const TEXT   = [30,  30,  46];
  const MUTED  = [110,120,140];
  const GREEN  = [22, 160,  80];
  const AMBER  = [201,150,   0];
  const LIGHT  = [245,246,250];

  const review = d.reviewStatus || 'pending';
  const isApproved     = review === 'approved';
  const isActionNeeded = review === 'action_needed';
  const isDenied       = review === 'denied';

  // Decision config — labels from language strings
  const decisionConfig = isApproved
    ? { label:s.approved,     color:GREEN }
    : isActionNeeded
    ? { label:s.actionNeeded, color:AMBER }
    : { label:s.denied,       color:RED   };

  // ── helpers ──────────────────────────────────────────────
  function setColor(c){ doc.setTextColor(c[0],c[1],c[2]); }
  function setFill(c){  doc.setFillColor(c[0],c[1],c[2]); }
  function setStroke(c){ doc.setDrawColor(c[0],c[1],c[2]); }

  function wrapText(text, x, y, maxW, lineH){
    const lines = doc.splitTextToSize(String(text||'—'), maxW);
    doc.text(lines, x, y);
    return y + lines.length * lineH;
  }

  function hRule(y, color){
    setStroke(color||GOLD);
    doc.setLineWidth(0.75);
    doc.line(50, y, W-50, y);
  }

  function sandboxBanner(){
    setFill(RED);
    doc.rect(0, 0, W, 20, 'F');
    doc.setFont('helvetica','bold');
    doc.setFontSize(8);
    doc.setTextColor(255,255,255);
    doc.text('SANDBOX CONTEST PROJECT — NOT AN OFFICIAL U.S. GOVERNMENT DOCUMENT', W/2, 13.5, {align:'center'});
  }

  function sandboxFooter(pageNum){
    setFill([255,243,205]);
    doc.rect(40, H-54, W-80, 42, 'F');
    setStroke(GOLD);
    doc.setLineWidth(0.75);
    doc.rect(40, H-54, W-80, 42, 'S');
    doc.setFont('helvetica','bold');
    doc.setFontSize(8);
    doc.setTextColor(120,80,0);
    doc.text(s.sandbox, 50, H-40);
    doc.setFont('helvetica','normal');
    doc.setFontSize(7.5);
    doc.text(s.sandboxSub, 50, H-28);
    setColor(MUTED);
    doc.text(`Page ${pageNum}`, W-60, H-28);
  }

  function tileWatermark(){
    doc.setFont('helvetica','bold');
    doc.setFontSize(11);
    doc.setTextColor(200,200,200);
    const stepX=220, stepY=90;
    for(let y=50;y<H+40;y+=stepY)
      for(let x=-60;x<W+60;x+=stepX){
        doc.text('SANDBOX — NOT FOR REAL USE', x, y, {angle:30});
      }
  }

  // ── PAGE 1 ───────────────────────────────────────────────
  sandboxBanner();

  // Letterhead block
  setFill(BLUE);
  doc.rect(0, 20, W, 90, 'F');

  // Seal placeholder circle
  doc.setDrawColor(201,168,76);
  doc.setLineWidth(2);
  doc.setFillColor(255,255,255,0.05);
  doc.circle(80, 65, 30, 'S');
  doc.setFont('helvetica','bold');
  doc.setFontSize(9);
  doc.setTextColor(201,168,76);
  doc.text('SANDBOX', 80, 60, {align:'center'});
  doc.text('SEAL', 80, 71, {align:'center'});

  doc.setFont('helvetica','bold');
  doc.setFontSize(17);
  doc.setTextColor(255,255,255);
  doc.text(s.title, W/2, 52, {align:'center'});
  doc.setFont('helvetica','normal');
  doc.setFontSize(10);
  doc.setTextColor(201,168,76);
  doc.text(s.dept, W/2, 70, {align:'center'});
  doc.setFontSize(9);
  doc.setTextColor(200,210,230);
  doc.text(`${s.issued} ${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}`, W/2, 86, {align:'center'});

  // Reference + Applicant info block
  let y = 130;
  doc.setFont('helvetica','normal');
  doc.setFontSize(10);

  setFill(LIGHT);
  doc.rect(50, y-14, W-100, 72, 'F');
  setStroke(GOLD);
  doc.setLineWidth(0.5);
  doc.rect(50, y-14, W-100, 72, 'S');

  const infoLeft = [
    [s.refNum,       d.ref || '—'],
    [s.appName,      d.fullName || '—'],
    [s.nationality,  d.citizenship || '—'],
  ];
  const infoRight = [
    [s.passportNum,   d.passportNum || (d.hasPassport===false?'Not provided':'—')],
    [s.visaCategory,  d.visaType || '—'],
    [s.decisionDate,  new Date().toLocaleDateString('en-US')],
  ];
  infoLeft.forEach(([k,v],i)=>{
    doc.setFont('helvetica','bold'); setColor(BLUE);
    doc.text(k+':', 60, y+i*20);
    doc.setFont('helvetica','normal'); setColor(TEXT);
    doc.text(String(v), 185, y+i*20);
  });
  infoRight.forEach(([k,v],i)=>{
    doc.setFont('helvetica','bold'); setColor(BLUE);
    doc.text(k+':', W/2+10, y+i*20);
    doc.setFont('helvetica','normal'); setColor(TEXT);
    doc.text(String(v), W/2+135, y+i*20);
  });

  y += 80;
  hRule(y);
  y += 22;

  // Decision banner
  doc.setFillColor(decisionConfig.color[0], decisionConfig.color[1], decisionConfig.color[2]);
  doc.rect(50, y, W-100, 44, 'F');
  doc.setFont('helvetica','bold');
  doc.setFontSize(15);
  doc.setTextColor(255,255,255);
  doc.text(`${s.decision}: ${decisionConfig.label}`, W/2, y+28, {align:'center'});

  y += 60;

  // Salutation
  doc.setFont('helvetica','normal');
  doc.setFontSize(11);
  setColor(TEXT);
  doc.text(`${s.dear} ${d.fullName || 'Applicant'},`, 50, y);
  y += 22;

  // Intro paragraph
  const introText = isApproved
    ? s.introApproved(d.ref)
    : isActionNeeded
    ? s.introAction(d.ref)
    : s.introDenied(d.ref);

  doc.setFontSize(10.5);
  const introLines = doc.splitTextToSize(introText, W-100);
  doc.text(introLines, 50, y);
  y += introLines.length * 15 + 16;

  hRule(y, MUTED);
  y += 20;

  // Decision reason block
  doc.setFont('helvetica','bold');
  doc.setFontSize(11);
  setColor(BLUE);
  doc.text(s.reasonTitle, 50, y);
  y += 16;

  const reason = d.decisionReason || s.noReason;
  setFill([248,249,252]);
  const reasonLines = doc.splitTextToSize(reason, W-120);
  const reasonBoxH = reasonLines.length * 15 + 24;
  doc.rect(50, y, W-100, reasonBoxH, 'F');
  doc.setDrawColor(decisionConfig.color[0], decisionConfig.color[1], decisionConfig.color[2]);
  doc.setLineWidth(3);
  doc.line(50, y, 50, y+reasonBoxH);
  doc.setLineWidth(0.5);
  setStroke([220,225,235]);
  doc.rect(53, y, W-103, reasonBoxH, 'S');
  doc.setFont('helvetica','normal');
  doc.setFontSize(10.5);
  setColor(TEXT);
  doc.text(reasonLines, 65, y+16);
  y += reasonBoxH + 18;

  // Delivery address (if approved)
  if((isApproved || isActionNeeded) && d.deliveryAddress){
    hRule(y, MUTED);
    y += 18;
    doc.setFont('helvetica','bold'); doc.setFontSize(10.5); setColor(BLUE);
    doc.text(s.deliveryTitle, 50, y); y += 14;
    doc.setFont('helvetica','normal'); setColor(TEXT);
    const addrLines = doc.splitTextToSize(d.deliveryAddress, W-100);
    doc.text(addrLines, 50, y);
    y += addrLines.length*14 + 14;
  }

  // Payment summary
  if(d.amountPaid || d.feePaid){
    hRule(y, MUTED); y += 18;
    doc.setFont('helvetica','bold'); doc.setFontSize(10.5); setColor(BLUE);
    doc.text(s.paymentTitle, 50, y); y += 14;
    doc.setFont('helvetica','normal'); setColor(TEXT);
    doc.text(`${s.amountPaid} $${d.amountPaid || (d.feePaid ? s.payFull : '0')}`, 50, y);
    if(d.amountRemaining && Number(d.amountRemaining) > 0){
      y += 14;
      doc.setTextColor(191,10,48);
      doc.text(`${s.remaining} $${d.amountRemaining}`, 50, y);
      setColor(TEXT);
    }
    y += 18;
  }

  // Closing paragraph
  if(y < H-160){
    hRule(y, MUTED); y += 18;
    doc.setFont('helvetica','normal'); doc.setFontSize(10); setColor(MUTED);
    const closingLines = doc.splitTextToSize(isDenied ? s.closingDenied : s.closingApproved, W-100);
    doc.text(closingLines, 50, y);
    y += closingLines.length*14 + 24;
  }

  // Signature block
  if(y < H-120){
    hRule(y, MUTED); y += 22;
    doc.setFont('helvetica','bold'); doc.setFontSize(10); setColor(TEXT);
    doc.text(s.officer, 50, y); y += 14;
    doc.setFont('helvetica','normal'); setColor(MUTED);
    doc.text(s.division, 50, y); y += 12;
    doc.text(`${s.date} ${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}`, 50, y);
    doc.setFont('helvetica','bold'); setColor(TEXT);
    doc.text(s.forOfficial, W-170, y-26);
    doc.setFont('helvetica','normal'); setColor(MUTED);
    doc.text(`Ref: ${d.ref||'—'}`, W-170, y-12);
    doc.text(`${s.decision}: ${decisionConfig.label}`, W-170, y);
  }

  sandboxFooter(1);

  // ── PAGE 2: Summary & Rights ─────────────────────────────
  doc.addPage();
  sandboxBanner();

  let y2 = 50;
  doc.setFont('helvetica','bold');
  doc.setFontSize(14);
  setColor(BLUE);
  doc.text(s.page2Title, W/2, y2, {align:'center'});
  y2 += 10;
  hRule(y2);
  y2 += 20;

  // Full details table
  const bioVal = d.biometricScheduled ? s.bioScheduled(d.biometricLocation||'') : s.bioNot;
  const payVal = d.feePaid ? s.payFull : (d.amountPaid ? s.payPartial(d.amountPaid) : s.payNone);
  const summaryVals = [
    d.ref||'—', d.fullName||'—', d.firstName||'—', d.lastName||'—',
    d.dob||'—', d.citizenship||'—',
    d.passportNum||(d.hasPassport===false?'Not provided':'—'),
    d.passportExpiry||'—', d.visaType||'—', d.purpose||'—',
    d.arrivalDate||'—', d.departureDate||'—',
    bioVal, payVal, decisionConfig.label,
    new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})
  ];

  s.fields.forEach((fieldLabel, i)=>{
    const rowY = y2 + i*22;
    if(i%2===0){ setFill(LIGHT); doc.rect(50, rowY-12, W-100, 22, 'F'); }
    doc.setFont('helvetica','bold'); doc.setFontSize(9.5); setColor(BLUE);
    doc.text(fieldLabel, 58, rowY);
    doc.setFont('helvetica','normal'); setColor(TEXT);
    doc.text(String(summaryVals[i]||'—').substring(0,60), 210, rowY);
  });

  y2 += s.fields.length*22+18;
  hRule(y2);
  y2 += 18;

  // Important notice box
  setFill([255,243,205]);
  doc.rect(50, y2, W-100, 80, 'F');
  setStroke(GOLD);
  doc.setLineWidth(1);
  doc.rect(50, y2, W-100, 80, 'S');
  doc.setFont('helvetica','bold'); doc.setFontSize(10); setColor([120,80,0]);
  doc.text(s.notice, 60, y2+16);
  doc.setFont('helvetica','normal'); doc.setFontSize(9); setColor([100,60,0]);
  const noticeLines = doc.splitTextToSize(s.noticeText, W-120);
  doc.text(noticeLines, 60, y2+30);

  sandboxFooter(2);

  const langSuffix = lang && lang !== 'en' ? `_${lang.toUpperCase()}` : '';
  doc.save(`Decision_Letter_${d.ref||'sandbox'}${langSuffix}.pdf`);
};
