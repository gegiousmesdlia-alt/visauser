// ============================================================
// decision-pdf.js — Generates an official-style Decision Letter PDF
// Covers: Approved, Approved (Action Needed), Declined/Rejected
// Uses jsPDF (loaded via CDN). Sandbox disclaimers on every page.
// ============================================================

window.generateDecisionLetterPDF = function(d){
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

  // Decision config
  const decisionConfig = isApproved
    ? { label:'APPROVED',          color:GREEN, icon:'✓' }
    : isActionNeeded
    ? { label:'CONDITIONALLY APPROVED — ACTION REQUIRED', color:AMBER, icon:'⚠' }
    : { label:'DECLINED / REJECTED', color:RED,   icon:'✕' };

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
    doc.text('SANDBOX DOCUMENT — NOT FOR REAL USE', 50, H-40);
    doc.setFont('helvetica','normal');
    doc.setFontSize(7.5);
    doc.text('This is a demonstration document for a student web development contest. Not an official government document.', 50, H-28);
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
  doc.text('U.S. VISA APPLICATION DECISION LETTER', W/2, 52, {align:'center'});
  doc.setFont('helvetica','normal');
  doc.setFontSize(10);
  doc.setTextColor(201,168,76);
  doc.text('U.S. Department of State — Consular Services Division (SANDBOX)', W/2, 70, {align:'center'});
  doc.setFontSize(9);
  doc.setTextColor(200,210,230);
  doc.text(`Issued: ${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}`, W/2, 86, {align:'center'});

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
    ['Reference Number', d.ref || '—'],
    ['Applicant Name',   d.fullName || '—'],
    ['Nationality',      d.citizenship || '—'],
  ];
  const infoRight = [
    ['Passport Number',  d.passportNum || (d.hasPassport===false?'Not provided':'—')],
    ['Visa Category',    d.visaType || '—'],
    ['Decision Date',    new Date().toLocaleDateString('en-US')],
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
  doc.text(`DECISION: ${decisionConfig.label}`, W/2, y+28, {align:'center'});

  y += 60;

  // Salutation
  doc.setFont('helvetica','normal');
  doc.setFontSize(11);
  setColor(TEXT);
  const firstName = d.firstName || (d.fullName||'Applicant').split(' ')[0];
  doc.text(`Dear ${d.fullName || 'Applicant'},`, 50, y);
  y += 22;

  // Intro paragraph
  const introText = isApproved
    ? `We are pleased to inform you that your nonimmigrant visa application (Reference: ${d.ref}) has been reviewed and APPROVED by the U.S. Consular Officer. Your visa document will be prepared and delivered to the address on file.`
    : isActionNeeded
    ? `Your nonimmigrant visa application (Reference: ${d.ref}) has been conditionally approved. However, before your visa can be issued, you are required to take the action(s) described in the decision notes below. Please read carefully and respond promptly.`
    : `After careful review of your nonimmigrant visa application (Reference: ${d.ref}), the U.S. Consular Officer has determined that your application does not meet the requirements for visa issuance at this time. Your application has been DECLINED.`;

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
  doc.text('REASON / NOTES FROM CONSULAR OFFICER:', 50, y);
  y += 16;

  const reason = d.decisionReason || 'No additional notes provided by the consular officer.';
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
    doc.setFont('helvetica','bold');
    doc.setFontSize(10.5);
    setColor(BLUE);
    doc.text('DELIVERY ADDRESS:', 50, y);
    y += 14;
    doc.setFont('helvetica','normal');
    setColor(TEXT);
    const addrLines = doc.splitTextToSize(d.deliveryAddress, W-100);
    doc.text(addrLines, 50, y);
    y += addrLines.length*14 + 14;
  }

  // Payment summary
  if(d.amountPaid || d.feePaid){
    hRule(y, MUTED);
    y += 18;
    doc.setFont('helvetica','bold');
    doc.setFontSize(10.5);
    setColor(BLUE);
    doc.text('PAYMENT SUMMARY:', 50, y);
    y += 14;
    doc.setFont('helvetica','normal');
    setColor(TEXT);
    doc.text(`Amount Paid: $${d.amountPaid || (d.feePaid ? 'Paid in full' : '0')}`, 50, y);
    if(d.amountRemaining && Number(d.amountRemaining) > 0){
      y += 14;
      doc.setTextColor(191,10,48);
      doc.text(`Remaining Balance: $${d.amountRemaining}`, 50, y);
      setColor(TEXT);
    }
    y += 18;
  }

  // Closing paragraph
  if(y < H-160){
    hRule(y, MUTED);
    y += 18;
    doc.setFont('helvetica','normal');
    doc.setFontSize(10);
    setColor(MUTED);
    const closingText = isDenied
      ? 'If you believe this decision was made in error or your circumstances have changed, you may reapply. Please note that reapplication does not guarantee approval. For queries, contact our consular services office.'
      : 'Thank you for your application. For any queries regarding this decision, please reference your application number in all correspondence with our consular services office.';
    const closingLines = doc.splitTextToSize(closingText, W-100);
    doc.text(closingLines, 50, y);
    y += closingLines.length*14 + 24;
  }

  // Signature block
  if(y < H-120){
    hRule(y, MUTED);
    y += 22;
    doc.setFont('helvetica','bold');
    doc.setFontSize(10);
    setColor(TEXT);
    doc.text('Consular Officer', 50, y);
    y += 14;
    doc.setFont('helvetica','normal');
    setColor(MUTED);
    doc.text('U.S. Visa Processing Division (SANDBOX)', 50, y);
    y += 12;
    doc.text(`Date: ${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}`, 50, y);
    // Right side
    doc.setFont('helvetica','bold');
    setColor(TEXT);
    doc.text('For Official Use', W-170, y-26);
    doc.setFont('helvetica','normal');
    setColor(MUTED);
    doc.text(`Ref: ${d.ref||'—'}`, W-170, y-12);
    doc.text(`Status: ${decisionConfig.label}`, W-170, y);
  }

  tileWatermark();
  sandboxFooter(1);

  // ── PAGE 2: Summary & Rights ─────────────────────────────
  doc.addPage();
  sandboxBanner();

  let y2 = 50;
  doc.setFont('helvetica','bold');
  doc.setFontSize(14);
  setColor(BLUE);
  doc.text('APPLICATION SUMMARY — FOR YOUR RECORDS', W/2, y2, {align:'center'});
  y2 += 10;
  hRule(y2);
  y2 += 20;

  // Full details table
  const summaryRows = [
    ['Reference Number',    d.ref||'—'],
    ['Full Name',           d.fullName||'—'],
    ['First Name',          d.firstName||'—'],
    ['Last Name',           d.lastName||'—'],
    ['Date of Birth',       d.dob||'—'],
    ['Nationality',         d.citizenship||'—'],
    ['Passport Number',     d.passportNum||(d.hasPassport===false?'Not provided':'—')],
    ['Passport Expiry',     d.passportExpiry||'—'],
    ['Visa Category',       d.visaType||'—'],
    ['Purpose of Visit',    d.purpose||'—'],
    ['Intended Arrival',    d.arrivalDate||'—'],
    ['Intended Departure',  d.departureDate||'—'],
    ['Biometric Status',    d.biometricScheduled?`Scheduled — ${d.biometricLocation||''}`:'Not scheduled'],
    ['Payment Status',      d.feePaid?'Paid in full':(d.amountPaid?`Partial — $${d.amountPaid} paid`:'Not paid')],
    ['Decision',            decisionConfig.label],
    ['Decision Date',       new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})],
  ];

  summaryRows.forEach(([k,v],i)=>{
    const rowY = y2 + i*22;
    if(i%2===0){ setFill(LIGHT); doc.rect(50, rowY-12, W-100, 22, 'F'); }
    doc.setFont('helvetica','bold'); doc.setFontSize(9.5); setColor(BLUE);
    doc.text(k, 58, rowY);
    doc.setFont('helvetica','normal'); setColor(TEXT);
    doc.text(String(v).substring(0,60), 210, rowY);
  });

  y2 += summaryRows.length*22+18;
  hRule(y2);
  y2 += 18;

  // Important notice box
  setFill([255,243,205]);
  doc.rect(50, y2, W-100, 72, 'F');
  setStroke(GOLD);
  doc.setLineWidth(1);
  doc.rect(50, y2, W-100, 72, 'S');
  doc.setFont('helvetica','bold'); doc.setFontSize(10); setColor([120,80,0]);
  doc.text('IMPORTANT NOTICE', 60, y2+16);
  doc.setFont('helvetica','normal'); doc.setFontSize(9); setColor([100,60,0]);
  const notice = 'This document is issued as part of a sandbox web development project. It is not a real visa or official U.S. Government document and confers no legal status. It must not be used for travel, identification, or any official purpose.';
  const noticeLines = doc.splitTextToSize(notice, W-120);
  doc.text(noticeLines, 60, y2+30);

  tileWatermark();
  sandboxFooter(2);

  doc.save(`Decision_Letter_${d.ref||'sandbox'}.pdf`);
};
