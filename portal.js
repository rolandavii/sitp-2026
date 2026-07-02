/* ═══════════════════════════════════════════════════
   SITP - PORTAL RUNTIME ENGINE (VERSION 3)
═══════════════════════════════════════════════════ */

// Initialize Supabase Client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://giqcnpvvvxjpqbibkuoy.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_fMomDPx7d-u1oSa4hkE6zw_oDsY93m4';
let supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

if (!supabase) {
  console.error('Supabase client failed to initialize. Please check CDN script in index.html.');
}

/* ═══════════════════════════════════════════════════
   MUTABLE STATE & STATIC DEFAULTS
═══════════════════════════════════════════════════ */
let currentLang = 'en';
let EMPLOYEES = {
  tp: [
    { id:'SOM-2018-047', name:'Maria Santos',    initials:'MS', dept:'Math Department',    type:'tp' },
    { id:'SOM-2016-023', name:'Jose dela Cruz',  initials:'JD', dept:'English Department', type:'tp' },
    { id:'SOM-2019-055', name:'Ana Reyes',        initials:'AR', dept:'Science Department', type:'tp' },
    { id:'SOM-2020-068', name:'Carlos Tan',       initials:'CT', dept:'Filipino Department', type:'tp' },
    { id:'SOM-2017-039', name:'Lucia Mendoza',    initials:'LM', dept:'Social Studies',     type:'tp' },
  ],
  ntp: [
    { id:'SOM-2020-112', name:'Roberto Flores',  initials:'RF', dept:'Admin Office',  type:'ntp' },
    { id:'SOM-2021-118', name:'Elena Castillo',  initials:'EC', dept:'Registrar',      type:'ntp' },
    { id:'SOM-2019-099', name:'Miguel Santos',   initials:'MS', dept:'Maintenance',    type:'ntp' },
    { id:'SOM-2022-130', name:'Grace Navarro',   initials:'GN', dept:'Library',        type:'ntp' },
  ],
};

let PERIODS = {
  jun1: {
    label:'June 1–15, 2026', paydate:'June 16, 2026', pubdate:'June 16, 2026',
    ref:'SMSAI-2026-00124',
    earnings: [
      { code:'MED',   name:'Medical Allowance',    amount:500,  explain:'Semi-monthly medical allowance.', evidence:null },
      { code:'RETRO', name:'Retro Active',          amount:1200, explain:'Retroactive salary adjustment for a salary rate correction.', evidence:{type:'Salary Correction',periodCovered:'May 1–31, 2026',approvedBy:'Ms. R. Dela Cruz',status:'Verified'} },
      { code:'ATT',   name:'Attendance Incentives', amount:750,  explain:'Perfect attendance for June 1–15, 2026 — no absences and no tardiness.', evidence:{type:'Attendance Incentive',date:'June 1–15, 2026',result:'Incentive awarded',status:'Verified'} },
    ],
    deductions: [
      { code:'ABS',    name:'Absent / Adjustments', amount:-800, isCredit:true, explain:'CORRECTION CREDIT — you were incorrectly marked absent on May 14, 2026. This is money being returned to you.', evidence:{type:'Correction Credit',originalDate:'May 14, 2026',correctedBy:'Ms. A. Reyes (HR)',status:'Verified Correction'} },
      { code:'SSS-L',  name:'SSS Loan',             amount:1000, explain:'Monthly amortization for your SSS salary loan. Payment 7 of 12.', evidence:{type:'Loan Repayment',lender:'SSS',loanRef:'SSS-2024-881234',monthlyAmt:'₱1,000',paymentNo:'7 of 12'} },
      { code:'SSS-P',  name:'SSS Premium',          amount:900,  explain:'Mandatory SSS employee contribution.', evidence:{type:'Government Contribution',agency:'SSS',status:'Mandatory'} },
      { code:'HDMF-L', name:'PAG-IBIG Loan',        amount:500,  explain:'Monthly PAG-IBIG Multi-Purpose Loan repayment.', evidence:{type:'Loan Repayment',lender:'PAG-IBIG',loanRef:'HDMF-2025-004421',monthlyAmt:'₱500'} },
      { code:'HDMF',   name:'PAG-IBIG Fund',        amount:200,  explain:'Mandatory PAG-IBIG contribution.', evidence:{type:'Government Contribution',agency:'PAG-IBIG',status:'Mandatory'} },
      { code:'PHIC',   name:'PhilHealth',           amount:550,  explain:'Mandatory PhilHealth premium.', evidence:{type:'Government Contribution',agency:'PhilHealth',status:'Mandatory'} },
      { code:'TAX',    name:'Withholding Tax',      amount:843,  explain:'Income tax withheld per TRAIN Law (RA 10963).', evidence:{type:'Tax Computation',law:'TRAIN Law (RA 10963)',status:'Verified'} },
    ],
    grossPay:14450, taxableIncome:9707,
  },
  jun2: {
    label:'June 16–30, 2026', paydate:'June 30, 2026', pubdate:'June 30, 2026',
    ref:'SMSAI-2026-00126',
    earnings: [
      { code:'MED', name:'Medical Allowance', amount:500, explain:'Semi-monthly medical allowance.', evidence:null },
      { code:'ATT', name:'Attendance Incentives', amount:750, explain:'Perfect attendance for June 16–30, 2026.', evidence:{type:'Attendance Incentive',date:'June 16–30, 2026',result:'Incentive awarded',status:'Verified'} },
    ],
    deductions: [
      { code:'SSS-P', name:'SSS Premium',  amount:900, explain:'Mandatory SSS contribution.',  evidence:{type:'Government Contribution',agency:'SSS',status:'Mandatory'} },
      { code:'PHIC',  name:'PhilHealth',   amount:550, explain:'Mandatory PhilHealth premium.', evidence:{type:'Government Contribution',agency:'PhilHealth',status:'Mandatory'} },
      { code:'HDMF',  name:'PAG-IBIG Fund',amount:200, explain:'Mandatory PAG-IBIG.',           evidence:{type:'Government Contribution',agency:'PAG-IBIG',status:'Mandatory'} },
      { code:'TAX',   name:'Withholding Tax',amount:843,explain:'Income tax per TRAIN Law.',    evidence:{type:'Tax Computation',law:'TRAIN Law',status:'Verified'} },
    ],
    grossPay:13250, taxableIncome:10757,
  },
  may2: {
    label:'May 16–31, 2026', paydate:'May 31, 2026', pubdate:'May 31, 2026',
    ref:'SMSAI-2026-00122',
    earnings: [
      { code:'MED', name:'Medical Allowance', amount:500, explain:'Semi-monthly medical allowance.', evidence:null },
      { code:'VL',  name:'Unused Vacation Leave', amount:1909, explain:'1 VL day converted to cash.', evidence:{type:'Unused Leave',daysConverted:'1 day',status:'Verified'} },
    ],
    deductions: [
      { code:'ABS',  name:'Absent / Adjustments', amount:1909, explain:'Absent May 14, 2026 — no approved leave.', evidence:{type:'Absent Deduction',date:'May 14, 2026',status:'Verified'} },
      { code:'SSS-P',name:'SSS Premium',  amount:900, explain:'Mandatory SSS.', evidence:{type:'Government Contribution',agency:'SSS',status:'Mandatory'} },
      { code:'PHIC', name:'PhilHealth',   amount:550, explain:'Mandatory PhilHealth.', evidence:{type:'Government Contribution',agency:'PhilHealth',status:'Mandatory'} },
      { code:'HDMF', name:'PAG-IBIG Fund',amount:200, explain:'Mandatory PAG-IBIG.', evidence:{type:'Government Contribution',agency:'PAG-IBIG',status:'Mandatory'} },
      { code:'TAX',  name:'Withholding Tax',amount:843,explain:'Income tax per TRAIN Law.', evidence:{type:'Tax Computation',status:'Verified'} },
    ],
    grossPay:12409, taxableIncome:7007,
  },
  may1: {
    label:'May 1–15, 2026', paydate:'May 15, 2026', pubdate:'May 15, 2026',
    ref:'SMSAI-2026-00120',
    earnings: [
      { code:'MED', name:'Medical Allowance', amount:500, explain:'Semi-monthly medical allowance.', evidence:null },
      { code:'ATT', name:'Attendance Incentives', amount:750, explain:'Perfect attendance May 1–15.', evidence:{type:'Attendance Incentive',status:'Verified'} },
    ],
    deductions: [
      { code:'SSS-P',name:'SSS Premium',  amount:900, explain:'Mandatory SSS.', evidence:{type:'Government Contribution',agency:'SSS',status:'Mandatory'} },
      { code:'PHIC', name:'PhilHealth',   amount:550, explain:'Mandatory PhilHealth.', evidence:{type:'Government Contribution',agency:'PhilHealth',status:'Mandatory'} },
      { code:'HDMF', name:'PAG-IBIG Fund',amount:200, explain:'Mandatory PAG-IBIG.', evidence:{type:'Government Contribution',agency:'PAG-IBIG',status:'Mandatory'} },
      { code:'TAX',  name:'Withholding Tax',amount:843,explain:'Income tax per TRAIN Law.', evidence:{type:'Tax Computation',status:'Verified'} },
    ],
    grossPay:13250, taxableIncome:9757,
  },
};

const FAQ_EN = [
  ['Why is my take-home pay lower than my basic salary?', 'Mandatory government deductions for SSS, PhilHealth, and PAG-IBIG are applied each payroll period. Withholding tax may also apply. These amounts are remitted to the government on your behalf — not kept by the school.'],
  ['Does SMSAI pay overtime?', 'SMSAI payroll policy does not currently include overtime compensation. Employees are compensated through the salary structure, attendance incentives, unused leave conversions, and allowances specified in your payslip.'],
  ['What is an "Absent / Adjustments" correction credit?', 'A positive Absent/Adjustments value means a prior absence deduction was found to be incorrect, and the amount is being returned to you. It is labeled "Correction Credit" to avoid confusion.'],
  ['How do I verify a deduction?', 'Click the (?) icon beside any payslip line item to see the Deduction Evidence — the evidence, explanation, and computation.'],
  ['Who prepared my payslip?', 'The preparer, reviewer, and approver all appear in the Signatures section at the bottom of your payslip, along with a reference number.'],
  ['When is salary released?', 'Salary is released semi-monthly. The exact schedule is determined by the Accounting Office and shown in the Publication Notice.'],
  ['I think there is a mistake. What do I do?', 'Click (?) to review the evidence first. If you still believe there is an error, contact the Accounting Office within 30 days of the pay date.'],
];

const FAQ_FIL = [
  ['Bakit mas mababa ang aking sahod kaysa sa basic salary?', 'Ang mga mandatoryong bawas para sa SSS, PhilHealth, at PAG-IBIG ay inilalapat bawat panahon ng sahod. Ang mga halagang ito ay ipinapadala sa gobyerno sa inyong ngalan — hindi pinapanatili ng paaralan.'],
  ['Nagbabayad ba ang SMSAI ng overtime?', 'Ang patakaran ng SMSAI sa sahod ay kasalukuyang hindi nagsasama ng overtime compensation. Ang mga empleyado ay binibigyan ng kabayaran sa pamamagitan ng istruktura ng sahod, insentibo sa presensya, at mga allowance.'],
  ['Ano ang "Absent / Adjustments" correction credit?', 'Ang positibong halaga ng Absent/Adjustments ay nangangahulugang ang isang nakaraang bawas para sa kawalan ay natuklasan na mali, at ang halaga ay ibinalik sa inyo. Ito ay may label na "Correction Credit."'],
  ['Paano ko mabe-verify ang isang bawas?', 'I-click ang (?) icon sa tabi ng anumang linya ng payslip upang makita ang Deduction Evidence — ang ebidensya, paliwanag, at komputasyon.'],
  ['Sino ang naghanda ng aking payslip?', 'Ang nagprepara, reviewer, at approver ay lahat ay lumalabas sa seksyong Signatures sa ibaba ng inyong payslip, kasama ang reference number.'],
  ['Kailan inilalabas ang sahod?', 'Ang sahod ay inilalabas sa semi-monthly na batayan. Ang eksaktong iskedyul ay tinutukoy ng Accounting Office at ipinapakita sa Publication Notice.'],
  ['Palagay ko may pagkakamali. Ano ang gagawin ko?', 'I-click ang (?) upang suriin ang ebidensya muna. Kung naniniwala pa rin kayong may pagkakamali, makipag-ugnayan sa Accounting Office sa loob ng 30 araw mula sa petsa ng bayad.'],
];

let AUDIT_LOG = [
  { time:'June 16, 2026 09:41', action:'Payslip published', who:'Ms. R. Dela Cruz', detail:'Maria Santos · Jun 1–15' },
  { time:'June 16, 2026 09:38', action:'Payslip published', who:'Ms. R. Dela Cruz', detail:'Jose dela Cruz · Jun 1–15' },
  { time:'June 16, 2026 09:31', action:'Payslip published', who:'Ms. R. Dela Cruz', detail:'Ana Reyes · Jun 1–15' },
  { time:'June 15, 2026 16:22', action:'Payslip draft saved', who:'Ms. R. Dela Cruz', detail:'Roberto Flores · Jun 1–15' },
  { time:'June 15, 2026 15:10', action:'Employee login', who:'Maria Santos', detail:'SOM-2018-047 · TP' },
  { time:'June 15, 2026 14:45', action:'Payslip viewed', who:'Maria Santos', detail:'Jun 1–15, 2026' },
  { time:'June 14, 2026 10:00', action:'Attendance correction applied', who:'Ms. A. Reyes (HR)', detail:'Maria Santos · May 14 absence voided' },
];

/* ═══════════════════════════════════════════════════
   PAGE ROUTING & UTILS
═══════════════════════════════════════════════════ */
window.goto = function(id) {
  document.querySelectorAll('.page-screen').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('flex');
    target.classList.add('active');
  }
  window.scrollTo(0,0);
}

window.setLang = function(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-en]').forEach(el => {
    const txt = el.getAttribute('data-' + lang);
    if(txt) el.textContent = txt;
  });
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.textContent===lang.toUpperCase()));
}

/* ═══════════════════════════════════════════════════
   AUTHENTICATION LOGIC (Supabase Integration)
═══════════════════════════════════════════════════ */
let currentUserType = 'tp';
window.otpReturnTo = 'pg-tp-login';
window.otpDest = 'pg-emp-dash';

window.doLogin = async function(type) {
  const errEl = document.getElementById(type + '-login-error');
  const idEl = document.getElementById(type === 'admin' ? 'admin-id' : type + '-empid');
  const pwEl = document.getElementById(type === 'admin' ? 'admin-pw' : type + '-pw');
  
  if (!idEl || !pwEl || !errEl) return;
  
  const rawInput = idEl.value.trim();
  const password = pwEl.value;
  
  if (!rawInput || !password) {
    errEl.textContent = 'Please enter both your credentials and password.';
    errEl.style.display = 'block';
    return;
  }
  
  const btn = document.querySelector(`#pg-${type}-login .form-btn`);
  const originalText = btn ? btn.textContent : 'Sign In →';
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Authenticating...';
  }
  
  try {
    let resolvedEmail = rawInput;
    
    // Support Employee ID login by looking up email in profiles table first
    if (!rawInput.includes('@')) {
      const { data: matchedProfile, error: lookupErr } = await supabase
        .from('profiles')
        .select('email')
        .eq('employee_id', rawInput)
        .maybeSingle();
        
      if (matchedProfile && matchedProfile.email) {
        resolvedEmail = matchedProfile.email;
      } else {
        // Fallback: also check if rawInput matches 'id' directly
        const { data: matchedProfile2 } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', rawInput)
          .maybeSingle();
          
        if (matchedProfile2 && matchedProfile2.email) {
          resolvedEmail = matchedProfile2.email;
        } else {
          // If neither found, we can fail early or let Supabase fail on invalid email format
          errEl.textContent = `Employee ID "${rawInput}" is not registered. Please use your registered email address.`;
          errEl.style.display = 'block';
          if (btn) {
            btn.disabled = false;
            btn.textContent = originalText;
          }
          return;
        }
      }
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: resolvedEmail,
      password: password
    });
    
    if (error) {
      errEl.textContent = error.message;
      errEl.style.display = 'block';
      if (btn) {
        btn.disabled = false;
        btn.textContent = originalText;
      }
      return;
    }
    
    const user = data.user;
    
    // Fetch or verify user profile
    let { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .or(`id.eq.${user.id},email.eq.${user.email}`)
      .maybeSingle();
      
    // Auto-create profile if missing (self-healing / first-time login)
    if (!profile && !profileErr) {
      const emailParts = user.email.split('@')[0].split('.');
      const firstName = emailParts[0] ? emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1) : 'User';
      const lastName = emailParts[1] ? emailParts[1].charAt(0).toUpperCase() + emailParts[1].slice(1) : '';
      const generatedName = lastName ? `${firstName} ${lastName}` : firstName;
      const generatedInitials = (firstName.charAt(0) + (lastName ? lastName.charAt(0) : '')).toUpperCase();
      
      let dept = 'Academic Office';
      if (type === 'ntp') dept = 'Admin Office';
      if (type === 'admin') dept = 'Accounting Office';
      
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const empId = `SOM-2026-${randomNum}`;
      
      const newProfile = {
        id: user.id,
        email: user.email,
        employee_id: empId,
        name: generatedName,
        initials: generatedInitials,
        dept: dept,
        role: type,
        type: type
      };
      
      const { data: insertedProfile, error: insertErr } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .maybeSingle();
        
      if (!insertErr && insertedProfile) {
        profile = insertedProfile;
      } else {
        console.warn('Profile auto-creation issues:', insertErr?.message);
        // Fallback to local representation if table insertion is restricted
        profile = newProfile;
      }
    }
    
    if (profile) {
      const resolvedRole = profile.role || profile.type || 'tp';
      if (type === 'admin' && resolvedRole !== 'admin') {
        errEl.textContent = 'Access Denied. Authorized accounting/admin personnel only.';
        errEl.style.display = 'block';
        await supabase.auth.signOut();
        if (btn) {
          btn.disabled = false;
          btn.textContent = originalText;
        }
        return;
      } else if (type !== 'admin' && resolvedRole === 'admin') {
        errEl.textContent = 'Please use the Admin login panel.';
        errEl.style.display = 'block';
        await supabase.auth.signOut();
        if (btn) {
          btn.disabled = false;
          btn.textContent = originalText;
        }
        return;
      }
    }
    
    errEl.style.display = 'none';
    currentUserType = type;
    window.otpReturnTo = 'pg-' + type + '-login';
    window.otpDest = type === 'admin' ? 'pg-admin-dash' : 'pg-emp-dash';
    
    buildOtpInputs('otp-grid');
    window.goto('pg-otp');
  } catch (err) {
    console.error('Login Error:', err);
    errEl.textContent = 'An unexpected error occurred. Please try again.';
    errEl.style.display = 'block';
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  }
}

window.verifyOtp = async function() {
  const inputs = document.querySelectorAll('#otp-grid .otp-input');
  const code = Array.from(inputs).map(i => i.value).join('');
  if (code === '123456') {
    document.getElementById('otp-error').style.display = 'none';
    
    const btn = document.querySelector('#pg-otp .form-btn');
    const originalText = btn ? btn.textContent : 'Verify & Continue →';
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Securing Portal...';
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        showToast('Session expired. Please sign in again.', 'error');
        window.goto(window.otpReturnTo);
        if (btn) {
          btn.disabled = false;
          btn.textContent = originalText;
        }
        return;
      }
      
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .or(`id.eq.${user.id},email.eq.${user.email}`)
        .maybeSingle();
        
      if (profileErr) {
        console.error('Error fetching profile:', profileErr.message);
      }
      
      const resolvedProfile = {
        id: (profile && (profile.employee_id || profile.id)) || 'SOM-DEMO-123',
        name: (profile && (profile.name || profile.full_name)) || user.email.split('@')[0],
        initials: (profile && (profile.initials)) || user.email.slice(0, 2).toUpperCase(),
        dept: (profile && (profile.dept || profile.department)) || 'Academic Office',
        role: (profile && (profile.role || profile.type)) || currentUserType
      };
      
      window.currentUserProfile = resolvedProfile;
      
      if (window.otpDest === 'pg-emp-dash') {
        document.getElementById('dash-avatar').textContent = resolvedProfile.initials;
        document.getElementById('dash-name').textContent = resolvedProfile.name;
        document.getElementById('dash-dept').textContent = resolvedProfile.dept;
        document.getElementById('dash-role-badge').textContent = resolvedProfile.role === 'tp' ? 'Teaching Personnel' : 'Non-Teaching Personnel';
        document.getElementById('prof-type').value = resolvedProfile.role === 'tp' ? 'Teaching Personnel' : 'Non-Teaching Personnel';
        document.getElementById('prof-name').value = resolvedProfile.name;
        document.getElementById('prof-dept').value = resolvedProfile.dept;
        
        await loadAndRenderEmployeeDashboard(resolvedProfile, user);
      } else {
        await loadAndRenderAdminDashboard(resolvedProfile);
      }
      window.goto(window.otpDest);
      showToast('Portal Login Verified!', 'success');
    } catch (err) {
      console.error('Portal Verification Error:', err);
      showToast('Error loading workspace: ' + err.message, 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = originalText;
      }
    }
  } else {
    document.getElementById('otp-error').style.display = 'block';
  }
}

window.doLogout = async function() {
  await supabase.auth.signOut();
  window.goto('pg-home');
  showToast('You have been logged out.', 'success');
}

/* ═══════════════════════════════════════════════════
   OTP FIELDS BUILDER
═══════════════════════════════════════════════════ */
function buildOtpInputs(containerId){
  const c = document.getElementById(containerId);
  if (!c) return;
  c.innerHTML = '';
  for(let i=0;i<6;i++){
    const inp = document.createElement('input');
    inp.type = 'text'; inp.maxLength = 1; inp.className = 'otp-input';
    inp.addEventListener('input', e => {
      if(e.target.value && e.target.nextElementSibling) e.target.nextElementSibling.focus();
    });
    inp.addEventListener('keydown', e => {
      if(e.key==='Backspace' && !e.target.value && e.target.previousElementSibling) e.target.previousElementSibling.focus();
    });
    c.appendChild(inp);
  }
}

/* ═══════════════════════════════════════════════════
   DATABASE DATA SYNCHRONIZATION
═══════════════════════════════════════════════════ */
async function loadAndRenderEmployeeDashboard(profile, user) {
  try {
    const { data: payrollRows, error: payrollErr } = await supabase
      .from('payrolls')
      .select('*');
      
    if (payrollErr) throw payrollErr;
    
    const empId = profile.id;
    const userPayrolls = (payrollRows || []).filter(p => {
      return p.employee_id === empId || 
             p.user_id === user.id || 
             p.profile_id === profile.id || 
             p.email === user.email ||
             p.employee_id === profile.id;
    });
    
    const dbPeriods = {};
    for (const p of userPayrolls) {
      const pKey = p.period_key || `period_${p.id}`;
      
      const { data: earnRows } = await supabase
        .from('payroll_earnings')
        .select('*')
        .eq('payroll_id', p.id);
        
      const { data: dedRows } = await supabase
        .from('payroll_deductions')
        .select('*')
        .eq('payroll_id', p.id);
        
      const earnings = (earnRows || []).map(e => ({
        code: e.code || 'EARN',
        name: e.name || e.item_name || 'Earning Row',
        amount: parseFloat(e.amount) || 0,
        explain: e.explain || e.explanation || e.description || '',
        evidence: typeof e.evidence === 'string' ? JSON.parse(e.evidence) : (e.evidence || null)
      }));
      
      const deductions = (dedRows || []).map(d => ({
        code: d.code || 'DED',
        name: d.name || d.item_name || 'Deduction Row',
        amount: parseFloat(d.amount) || 0,
        isCredit: d.is_credit || d.isCredit || d.amount < 0 || false,
        explain: d.explain || d.explanation || d.description || '',
        evidence: typeof d.evidence === 'string' ? JSON.parse(d.evidence) : (d.evidence || null)
      }));
      
      dbPeriods[pKey] = {
        label: p.label || p.period_label || 'Payroll Period',
        paydate: p.paydate || p.pay_date || '',
        pubdate: p.pubdate || p.publish_date || '',
        ref: p.ref || p.reference_number || p.reference || '',
        earnings: earnings,
        deductions: deductions,
        grossPay: parseFloat(p.gross_pay || p.grosspay) || 0,
        taxableIncome: parseFloat(p.taxable_income || p.taxableincome) || 0,
        status: p.status || 'Published'
      };
    }
    
    if (Object.keys(dbPeriods).length > 0) {
      PERIODS = dbPeriods;
    }
    
    const selectors = document.querySelectorAll('.tbl-filter');
    selectors.forEach(sel => {
      if (sel.getAttribute('onchange') && sel.getAttribute('onchange').includes('loadEmpPeriod')) {
        sel.innerHTML = Object.keys(PERIODS).map((pk, idx) => {
          const p = PERIODS[pk];
          return `<option value="${pk}" ${idx === 0 ? 'selected' : ''}>${p.label}</option>`;
        }).join('');
      }
    });
    
    const firstPeriod = Object.keys(PERIODS)[0];
    if (firstPeriod) {
      window.loadEmpPeriod(firstPeriod);
      buildHistory();
      buildFAQ();
      buildBreakdown(firstPeriod);
    }
  } catch (err) {
    console.warn('Using default mock-up data due to DB sync bypass:', err.message);
    window.loadEmpPeriod('jun1');
    buildHistory();
    buildFAQ();
    buildBreakdown('jun1');
  }
}

async function loadAndRenderAdminDashboard(profile) {
  try {
    const { data: dbProfiles, error: err } = await supabase
      .from('profiles')
      .select('*');
      
    if (err) throw err;
    
    if (dbProfiles && dbProfiles.length > 0) {
      const tpList = [];
      const ntpList = [];
      
      dbProfiles.forEach(p => {
        const role = p.role || p.type || 'tp';
        const emp = {
          id: p.employee_id || p.id,
          name: p.name || p.full_name || 'Unnamed Employee',
          initials: p.initials || (p.name || p.full_name || 'U').split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase(),
          dept: p.dept || p.department || 'Academic Dept',
          type: role === 'admin' ? 'admin' : role
        };
        if (role === 'tp') {
          tpList.push(emp);
        } else if (role === 'ntp') {
          ntpList.push(emp);
        }
      });
      
      EMPLOYEES = {
        tp: tpList.length > 0 ? tpList : [...EMPLOYEES.tp],
        ntp: ntpList.length > 0 ? ntpList : [...EMPLOYEES.ntp]
      };
    }
    
    buildAdminOverview();
    buildEmpTable('tp', EMPLOYEES.tp);
    buildEmpTable('ntp', EMPLOYEES.ntp);
    buildAuditLog();
  } catch (err) {
    console.error('Admin loading failed, falling back to static lists:', err);
    buildAdminOverview();
    buildEmpTable('tp', EMPLOYEES.tp);
    buildEmpTable('ntp', EMPLOYEES.ntp);
    buildAuditLog();
  }
}

async function savePayslipToDatabase() {
  const empId = window.currentEditingEmployeeId;
  if (!empId) return;
  
  const gross = parseFloat(document.getElementById('edit-gross').value) || 0;
  const taxable = parseFloat(document.getElementById('edit-taxable').value) || 0;
  
  const earnRows = document.querySelectorAll('#edit-earnings-rows .edit-row');
  const earnings = [];
  earnRows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    if (inputs.length >= 2) {
      earnings.push({
        name: inputs[0].value,
        amount: parseFloat(inputs[1].value) || 0
      });
    }
  });
  
  const dedRows = document.querySelectorAll('#edit-deductions-rows .edit-row');
  const deductions = [];
  dedRows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    if (inputs.length >= 2) {
      deductions.push({
        name: inputs[0].value,
        amount: parseFloat(inputs[1].value) || 0
      });
    }
  });
  
  try {
    const payrollRecord = {
      employee_id: empId,
      period_key: 'jun1',
      label: 'June 1–15, 2026',
      paydate: 'June 16, 2026',
      pubdate: 'June 16, 2026',
      ref: 'SMSAI-2026-00124',
      gross_pay: gross,
      taxable_income: taxable,
      status: 'Published'
    };
    
    const { data, error } = await supabase
      .from('payrolls')
      .upsert(payrollRecord, { onConflict: 'employee_id,period_key' })
      .select();
      
    if (error) {
      console.warn('Could not save payroll payload:', error.message);
    } else if (data && data[0]) {
      const payrollId = data[0].id;
      
      await supabase.from('payroll_earnings').delete().eq('payroll_id', payrollId);
      await supabase.from('payroll_deductions').delete().eq('payroll_id', payrollId);
      
      if (earnings.length > 0) {
        await supabase.from('payroll_earnings').insert(
          earnings.map(e => ({
            payroll_id: payrollId,
            name: e.name,
            amount: e.amount,
            code: 'VAR'
          }))
        );
      }
      
      if (deductions.length > 0) {
        await supabase.from('payroll_deductions').insert(
          deductions.map(d => ({
            payroll_id: payrollId,
            name: d.name,
            amount: -Math.abs(d.amount),
            code: 'VAR'
          }))
        );
      }
    }
  } catch (err) {
    console.error('Error saving updated payslip to DB:', err);
  }
}

window.saveProfileChanges = async function() {
  const pwInput = document.getElementById('change-pw-input');
  const newPassword = pwInput ? pwInput.value : '';
  
  if (newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      showToast('Error changing password: ' + error.message, 'error');
    } else {
      showToast('Password updated successfully!', 'success');
      if (pwInput) pwInput.value = '';
    }
  } else {
    showToast('Profile information saved.', 'success');
  }
}

/* ═══════════════════════════════════════════════════
   PAYSLIP RENDER LOGIC
═══════════════════════════════════════════════════ */
function peso(n){
  const abs = Math.abs(n);
  const f = '₱'+abs.toLocaleString('en-PH',{minimumFractionDigits:2,maximumFractionDigits:2});
  return n<0 ? '('+f+')' : f;
}

let currentPeriodKey = 'jun1';

window.loadEmpPeriod = function(key) {
  currentPeriodKey = key;
  const p = PERIODS[key];
  if (!p) return;
  const totalE  = p.earnings.reduce((s,r)=>s+r.amount,0);
  const totalD  = p.deductions.reduce((s,r)=>s+Math.abs(r.amount),0);
  const credits = p.deductions.filter(r=>r.isCredit).reduce((s,r)=>s+Math.abs(r.amount),0);
  const netD    = totalD - credits;
  const netPay  = p.grossPay - netD + credits;

  document.getElementById('period-label-emp').textContent = p.label+' · Pay Date: '+p.paydate;
  document.getElementById('e-gross').textContent = peso(p.grossPay);
  document.getElementById('e-deduct').textContent = peso(netD);
  document.getElementById('e-net').textContent = peso(netPay);
  document.getElementById('e-net-sub').textContent = 'Take-home · '+p.paydate;

  let html = '';

  html += `<div style="background:var(--navy);color:#fff;padding:16px 20px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px">
    <div><div style="font-size:15px;font-weight:700" id="ps-emp-name">${window.currentUserProfile?.name || 'Maria Santos'}</div><div style="font-size:12px;opacity:.6" id="ps-emp-role">${window.currentUserProfile?.role === 'tp' ? 'Faculty' : 'Staff'} · ${window.currentUserProfile?.dept || 'Math Department'}</div></div>
    <div style="text-align:right;font-size:12px;opacity:.65;line-height:1.75">
      Employee No: ${window.currentUserProfile?.id || 'SOM-2018-047'}<br>Period: ${p.label}<br>Pay Date: ${p.paydate}
    </div>
  </div>`;

  html += `<div style="border-bottom:1px solid var(--border)">
    <div style="padding:8px 20px;background:#F7FBFB;border-bottom:1px solid var(--border);font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)">Earnings</div>`;
  p.earnings.forEach((r,i)=>{ html += buildPsLine(r,'earn',key,i); });
  html += `<div class="total-row"><div style="font-size:13px;font-weight:700;color:var(--green)">Total Earnings</div><div style="font-size:13px;font-weight:700;color:var(--green)">${peso(totalE)}</div></div>`;
  html += `</div>`;

  html += `<div style="border-bottom:1px solid var(--border)">
    <div style="padding:8px 20px;background:#F7FBFB;border-bottom:1px solid var(--border);font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)">Deductions</div>`;
  p.deductions.forEach((r,i)=>{ html += buildPsLine(r, r.isCredit?'credit':'deduct', key, i); });
  html += `<div class="total-row"><div style="font-size:13px;font-weight:700;color:var(--red)">Total Deductions</div><div style="font-size:13px;font-weight:700;color:var(--red)">${peso(netD)}</div></div>`;
  html += `</div>`;

  html += `<div style="padding:12px 20px;background:var(--gold-pale);border-bottom:1px solid var(--border);display:grid;grid-template-columns:1fr auto">
    <div style="font-size:13px;font-weight:600;color:var(--amber)">Taxable Income<div style="font-size:11px;font-weight:400;color:var(--muted)">Gross pay less gov't contributions</div></div>
    <div style="font-size:14px;font-weight:700;color:var(--amber)">${peso(p.taxableIncome)}</div>
  </div>`;
  html += `<div class="net-row">
    <div class="net-row-label">Net Pay (Take-Home)<span>Credited on ${p.paydate}</span></div>
    <div class="net-row-amount">${peso(netPay)}</div>
  </div>`;

  html += `<div class="sig-block">
    <div class="sig-title">Official Signatures &amp; Approval</div>
    <div class="sig-grid">
      <div><div class="sig-role">Prepared By</div><div class="sig-line">Ms. R. Dela Cruz</div><div class="sig-name">Ms. R. Dela Cruz</div><div class="sig-date">Accountant · June 15, 2026</div></div>
      <div><div class="sig-role">Reviewed By</div><div class="sig-line">Ms. A. Reyes</div><div class="sig-name">Ms. A. Reyes</div><div class="sig-date">HR Officer · June 15, 2026</div></div>
      <div><div class="sig-role">Approved By</div><div class="sig-line">Sr. M. Gonzales</div><div class="sig-name">Sr. M. Gonzales</div><div class="sig-date">Administrator · June 16, 2026</div></div>
    </div>
    <div class="verified-banner">✓ <strong>Official SMSAI Payroll Record</strong> <span>· Ref: ${p.ref} · Published ${p.pubdate}</span></div>
  </div>`;

  const payslipMain = document.getElementById('payslip-main');
  if (payslipMain) {
    payslipMain.innerHTML = html;
  }
  buildBreakdown(key);
}

function buildPsLine(r, type, pkey, idx){
  const uid = `ev-${pkey}-${type}-${idx}`;
  const dotCls = type==='earn'?'earn-dot':type==='credit'?'credit-dot':'ded-dot';
  const amtCls = type==='earn'?'earn-amt':type==='credit'?'credit-amt':'ded-amt';
  const dispAmt = type==='credit' ? '+'+peso(Math.abs(r.amount)) : peso(Math.abs(r.amount));
  const label = type==='credit'
    ? r.name+' <em style="font-size:11px;color:var(--blue);font-style:normal;font-weight:600">(Correction Credit)</em>'
    : r.name;

  let ev = '';
  if(r.evidence){
    ev = '<table style="width:100%;border-collapse:collapse;font-size:12.5px">';
    Object.entries(r.evidence).forEach(([k,v])=>{
      const lbl = k.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase());
      ev += `<tr><td class="ev-detail-key" style="padding:3px 0;width:45%;color:var(--muted)">${lbl}</td><td class="ev-detail-val" style="padding:3px 0;font-weight:600">${v}</td></tr>`;
    });
    ev += '</table>';
  }

  const badgeCls = type==='credit'?'credit':type==='earn'?'verified':'deduct';
  const badgeTxt = type==='credit'?'↑ Correction Credit — money returned':'✓ Verified';

  return `<div>
    <div class="ps-line" onclick="toggleEv('${uid}')">
      <div class="ps-line-label">
        <span class="ps-dot ${dotCls}"></span>
        <span>${label}</span>
        <button class="info-pill" tabindex="-1">?</button>
      </div>
      <div class="ps-amount ${amtCls}">${dispAmt}</div>
    </div>
    <div class="ev-drawer" id="${uid}">
      <div class="ev-tag">${r.code} — ${r.name}</div>
      <p style="margin-bottom:8px">${r.explain}</p>
      ${ev}
      <div class="ev-badge ${badgeCls}">${badgeTxt}</div>
    </div>
  </div>`;
}

window.toggleEv = function(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const open = el.classList.contains('open');
  document.querySelectorAll('.ev-drawer.open').forEach(d=>d.classList.remove('open'));
  if(!open) el.classList.add('open');
}

/* ═══════════════════════════════════════════════════
   HISTORY
═══════════════════════════════════════════════════ */
function buildHistory(){
  const rows = Object.keys(PERIODS).map(pk=>{
    const p=PERIODS[pk];
    const e=p.earnings.reduce((s,r)=>s+r.amount,0);
    const d=p.deductions.reduce((s,r)=>s+Math.abs(r.amount),0);
    const c=p.deductions.filter(r=>r.isCredit).reduce((s,r)=>s+Math.abs(r.amount),0);
    const net=p.grossPay-(d-c)+c;
    const isCurr=pk===currentPeriodKey;
    return `<div class="hist-row" onclick="loadEmpPeriod('${pk}');showEmpTabById('emp-tab-payslip')">
      <div class="hist-period">${p.label}<span>Pay Date: ${p.paydate}</span></div>
      <div class="hist-amount">${peso(net)}</div>
      <span class="badge ${isCurr?'badge-curr':'badge-pub'}">${isCurr?'Current':'Published'}</span>
    </div>`;
  });
  const histContainer = document.getElementById('emp-history-rows');
  if (histContainer) {
    histContainer.innerHTML = rows.join('');
  }
}

/* ═══════════════════════════════════════════════════
   BREAKDOWN BAR CHART
═══════════════════════════════════════════════════ */
function buildBreakdown(key){
  const p = PERIODS[key];
  if (!p) return;
  const credits=p.deductions.filter(r=>r.isCredit).reduce((s,r)=>s+Math.abs(r.amount),0);
  const netD=p.deductions.reduce((s,r)=>s+Math.abs(r.amount),0)-credits;
  const net=p.grossPay-netD+credits;
  const items = [
    ...p.earnings.map(r=>({label:r.name,amount:r.amount,color:'#22C55E'})),
    ...p.deductions.map(r=>({label:r.name,amount:Math.abs(r.amount),color:r.isCredit?'#3B82F6':'#F97316'})),
    {label:'Net Pay',amount:net,color:'#0B2545'},
  ];
  const max=Math.max(...items.map(r=>r.amount));
  const el = document.getElementById('breakdown-bars');
  if(el){
    el.innerHTML = items.map(item=>{
      const pct=Math.max(4,Math.round(item.amount/max*100));
      return `<div style="display:grid;grid-template-columns:160px 1fr 110px;align-items:center;gap:12px;margin-bottom:11px;font-size:13px">
        <div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text)">${item.label}</div>
        <div style="background:#E8F4F4;border-radius:4px;height:10px;overflow:hidden"><div style="width:${pct}%;height:100%;border-radius:4px;background:${item.color};transition:width .7s ease"></div></div>
        <div style="text-align:right;color:var(--muted)">${peso(item.amount)}</div>
      </div>`;
    }).join('');
  }
}

/* ═══════════════════════════════════════════════════
   FAQ RENDER
═══════════════════════════════════════════════════ */
function buildFAQ(){
  const faqEnEl = document.getElementById('faq-en-items');
  const faqFilEl = document.getElementById('faq-fil-items');
  if (faqEnEl) {
    faqEnEl.innerHTML = FAQ_EN.map((q,i)=>`
      <div class="faq-item">
        <div class="faq-q" onclick="this.parentElement.classList.toggle('open')">${q[0]}<span class="faq-chevron">⌄</span></div>
        <div class="faq-ans">${q[1]}</div>
      </div>`).join('');
  }
  if (faqFilEl) {
    faqFilEl.innerHTML = FAQ_FIL.map((q,i)=>`
      <div class="faq-item">
        <div class="faq-q" onclick="this.parentElement.classList.toggle('open')">${q[0]}<span class="faq-chevron">⌄</span></div>
        <div class="faq-ans">${q[1]}</div>
      </div>`).join('');
  }
}

/* ═══════════════════════════════════════════════════
   TABS SYSTEMS
═══════════════════════════════════════════════════ */
window.showEmpTab = function(name, btn) {
  document.querySelectorAll('#pg-emp-dash .stab-pane').forEach(p=>p.classList.remove('active'));
  const targetTab = document.getElementById('emp-tab-'+name);
  if (targetTab) targetTab.classList.add('active');
  document.querySelectorAll('#pg-emp-dash .nav-item').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  const titles={payslip:'My Payslip',history:'Payroll History',breakdown:'Salary Breakdown',govcontrib:'About Deductions',faq:'FAQ & Policies',profile:'My Profile'};
  document.getElementById('dash-page-title').textContent = titles[name]||name;
}

window.showEmpTabById = function(id) {
  document.querySelectorAll('#pg-emp-dash .stab-pane').forEach(p=>p.classList.remove('active'));
  const targetPane = document.getElementById(id);
  if (targetPane) targetPane.classList.add('active');
}

window.showAdminTab = function(name, btn) {
  document.querySelectorAll('#pg-admin-dash .stab-pane').forEach(p=>p.classList.remove('active'));
  const targetTab = document.getElementById('admin-tab-'+name);
  if (targetTab) targetTab.classList.add('active');
  document.querySelectorAll('#pg-admin-dash .nav-item').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  const titles={'overview':'Admin Overview','tp-list':'Teaching Personnel','ntp-list':'Non-Teaching Personnel','audit':'Audit Log','announcements':'Announcements'};
  document.getElementById('admin-page-title').textContent = titles[name]||name;
}

function buildAdminOverview(){
  const acts = AUDIT_LOG.slice(0,5).map(a=>`
    <div style="display:grid;grid-template-columns:180px 1fr auto;gap:12px;padding:11px 18px;border-bottom:1px solid #F0F7F7;font-size:13px;align-items:center">
      <div style="color:var(--muted)">${a.time}</div>
      <div><strong style="color:var(--navy)">${a.action}</strong><span style="color:var(--muted)"> — ${a.detail}</span></div>
      <div style="color:var(--muted)">${a.who}</div>
    </div>`).join('');
  const activityList = document.getElementById('admin-activity-list');
  if (activityList) activityList.innerHTML = acts;
}

function buildEmpTable(type, emps){
  const tbody = document.getElementById(type+'-tbody');
  if (!tbody) return;
  const statuses = ['Published','Published','Published','Draft','Published'];
  tbody.innerHTML = emps.map((e,i)=>{
    const netP = peso(11000+i*500);
    const stat = statuses[i]||'Published';
    return `<tr>
      <td><div class="emp-name-cell"><div class="emp-avatar">${e.initials}</div><div><div class="emp-name-text">${e.name}</div><div class="emp-id">${e.id}</div></div></div></td>
      <td>${e.dept}</td>
      <td style="font-size:13px">June 1–15, 2026</td>
      <td style="font-weight:700;color:var(--navy)">${netP}</td>
      <td><span class="tbl-badge ${stat==='Published'?'pub':'draft'}">${stat}</span></td>
      <td><button class="tbl-action" onclick="openEditor('${e.id}','${e.name}','${e.dept}','${type}')">Edit / Publish</button></td>
    </tr>`;
  }).join('');
}

window.openEditor = function(id, name, dept, type) {
  window.currentEditingEmployeeId = id;
  document.getElementById('edit-page-title').textContent = 'Edit Payslip — '+name;
  document.getElementById('edit-emp-label').textContent = name+' · '+dept+' · '+id;
  buildEditorRows();
  buildOtpInputs('vm-otp-grid');
  window.goto('pg-admin-edit');
}

function buildEditorRows(){
  const p = PERIODS['jun1'];
  if (!p) return;
  const earn = document.getElementById('edit-earnings-rows');
  if (earn) {
    earn.innerHTML = p.earnings.map((r,i)=>`
      <div class="edit-row" id="earn-row-${i}">
        <input class="edit-input" value="${r.name}" placeholder="Item name"/>
        <input class="edit-input" type="number" value="${r.amount}" placeholder="Amount" oninput="recalcNet()"/>
        <button class="edit-remove" onclick="this.closest('.edit-row').remove();recalcNet()">✕</button>
      </div>`).join('');
  }
  const ded = document.getElementById('edit-deductions-rows');
  if (ded) {
    ded.innerHTML = p.deductions.map((r,i)=>`
      <div class="edit-row" id="ded-row-${i}">
        <input class="edit-input" value="${r.name}" placeholder="Item name"/>
        <input class="edit-input" type="number" value="${Math.abs(r.amount)}" placeholder="Amount" oninput="recalcNet()"/>
        <button class="edit-remove" onclick="this.closest('.edit-row').remove();recalcNet()">✕</button>
      </div>`).join('');
  }
  document.getElementById('edit-gross').value = p.grossPay;
  document.getElementById('edit-taxable').value = p.taxableIncome;
  window.recalcNet();
}

window.addEditRow = function(section) {
  const container = section==='earnings' ? document.getElementById('edit-earnings-rows') : document.getElementById('edit-deductions-rows');
  if (!container) return;
  const div = document.createElement('div');
  div.className = 'edit-row';
  div.innerHTML = `<input class="edit-input" placeholder="Item name"/><input class="edit-input" type="number" placeholder="Amount" oninput="recalcNet()"/><button class="edit-remove" onclick="this.closest('.edit-row').remove();recalcNet()">✕</button>`;
  container.appendChild(div);
}

window.recalcNet = function() {
  const grossEl = document.getElementById('edit-gross');
  if (!grossEl) return;
  const gross = parseFloat(grossEl.value)||0;
  const dedInputs = document.querySelectorAll('#edit-deductions-rows input[type=number]');
  let totalDed = 0;
  dedInputs.forEach(i=>totalDed+=parseFloat(i.value)||0);
  const net = gross - totalDed;
  document.getElementById('edit-net-preview').textContent = peso(net);
}

function buildAuditLog(){
  const auditList = document.getElementById('audit-list');
  if (auditList) {
    auditList.innerHTML = AUDIT_LOG.map(a=>`
      <div style="display:grid;grid-template-columns:200px 1fr auto;gap:12px;padding:12px 18px;border-bottom:1px solid #F0F7F7;font-size:13px;align-items:center">
        <div style="color:var(--muted)">${a.time}</div>
        <div><strong style="color:var(--navy)">${a.action}</strong><span style="color:var(--muted)"> — ${a.detail}</span></div>
        <div style="color:var(--muted)">${a.who}</div>
      </div>`).join('');
  }
}

window.filterTable = function(tableId, query) {
  const rows = document.querySelectorAll('#'+tableId+' tbody tr');
  const q = query.toLowerCase();
  rows.forEach(r=>{ r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none'; });
}

window.filterByStatus = function(tableId, status) {
  const rows = document.querySelectorAll('#'+tableId+' tbody tr');
  rows.forEach(r=>{
    r.style.display = !status || r.textContent.includes(status) ? '' : 'none';
  });
}

/* ═══════════════════════════════════════════════════
   VERIFY MODAL & EVENT HANDLING
═══════════════════════════════════════════════════ */
window.openVerifyModal = function() {
  document.getElementById('verify-modal').classList.add('open');
  document.getElementById('vm-form').style.display = '';
  document.getElementById('vm-success').style.display = 'none';
  document.getElementById('vm-error').style.display = 'none';
  buildOtpInputs('vm-otp-grid');
}

window.closeVerifyModal = function() {
  document.getElementById('verify-modal').classList.remove('open');
}

window.verifyPublish = async function() {
  const inputs = document.querySelectorAll('#vm-otp-grid .otp-input');
  const code = Array.from(inputs).map(i=>i.value).join('');
  if(code === '4321'){
    document.getElementById('vm-error').style.display = 'none';
    
    // Save live data back to Supabase
    await savePayslipToDatabase();
    
    document.getElementById('vm-form').style.display = 'none';
    document.getElementById('vm-success').style.display = 'block';
  } else {
    document.getElementById('vm-error').style.display = 'block';
  }
}

window.switchSTab = function(paneId, btn) {
  const parent = btn.closest('.stab-pane') || btn.closest('.dash-content');
  const allPanes = parent.querySelectorAll('.stab-pane');
  const allBtns = btn.closest('.section-tabs').querySelectorAll('.stab');
  allPanes.forEach(p=>p.classList.remove('active'));
  allBtns.forEach(b=>b.classList.remove('active'));
  const targetPane = document.getElementById(paneId);
  if (targetPane) targetPane.classList.add('active');
  btn.classList.add('active');
}

window.showToast = function(msg, type='success') {
  const t = document.getElementById('toast');
  const icon = document.getElementById('toast-icon');
  const msgEl = document.getElementById('toast-msg');
  if (!t || !icon || !msgEl) return;
  msgEl.textContent = msg;
  t.className = 'toast show '+type;
  icon.textContent = type==='success' ? '✓' : '⚠';
  setTimeout(()=>t.classList.remove('show'), 3000);
}

// Global Enter Key support
document.addEventListener('keydown', e=>{
  if(e.key==='Enter'){
    const active = document.querySelector('.page-screen.active');
    if(!active) return;
    const id = active.id;
    if(id==='pg-tp-login') window.doLogin('tp');
    else if(id==='pg-ntp-login') window.doLogin('ntp');
    else if(id==='pg-admin-login') window.doLogin('admin');
    else if(id==='pg-otp') window.verifyOtp();
  }
});

// Auto-login session restore check on load
(async function checkSessionOnLoad() {
  if (!supabase) return;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session && session.user) {
      const user = session.user;
      
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .or(`id.eq.${user.id},email.eq.${user.email}`)
        .maybeSingle();
        
      if (profile) {
        const resolvedRole = profile.role || profile.type || 'tp';
        const resolvedProfile = {
          id: profile.employee_id || profile.id || 'SOM-DEMO-123',
          name: profile.name || profile.full_name || user.email.split('@')[0],
          initials: profile.initials || user.email.slice(0, 2).toUpperCase(),
          dept: profile.dept || profile.department || 'Academic Office',
          role: resolvedRole
        };
        
        window.currentUserProfile = resolvedProfile;
        
        if (resolvedRole === 'admin') {
          await loadAndRenderAdminDashboard(resolvedProfile);
          window.goto('pg-admin-dash');
        } else {
          currentUserType = resolvedRole;
          document.getElementById('dash-avatar').textContent = resolvedProfile.initials;
          document.getElementById('dash-name').textContent = resolvedProfile.name;
          document.getElementById('dash-dept').textContent = resolvedProfile.dept;
          document.getElementById('dash-role-badge').textContent = resolvedRole === 'tp' ? 'Teaching Personnel' : 'Non-Teaching Personnel';
          document.getElementById('prof-type').value = resolvedRole === 'tp' ? 'Teaching Personnel' : 'Non-Teaching Personnel';
          document.getElementById('prof-name').value = resolvedProfile.name;
          document.getElementById('prof-dept').value = resolvedProfile.dept;
          
          await loadAndRenderEmployeeDashboard(resolvedProfile, user);
          window.goto('pg-emp-dash');
        }
        setTimeout(() => {
          window.showToast('Session restored: welcome back!', 'success');
        }, 800);
      }
    }
  } catch (err) {
    console.warn('Auto-login session check skipped:', err);
  }
})();

