
// ===== NEW MODAL SYSTEM =====
function openWindow(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('active');
        document.getElementById('modal-overlay').classList.add('active');
    }
}
function closeWindow(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('active');
    }
    if (document.querySelectorAll('.modal.active').length === 0) {
        document.getElementById('modal-overlay').classList.remove('active');
    }
}
function closeAllWindows() {
    document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
    document.getElementById('modal-overlay').classList.remove('active');
}

// ===== FLOATING AI ASSISTANT =====
let aiFloatOpen = false;
function toggleFloatingAI() {
    aiFloatOpen = !aiFloatOpen;
    const panel = document.getElementById('ai-float-panel');
    if (aiFloatOpen) {
        panel.style.opacity = '1';
        panel.style.pointerEvents = 'auto';
        panel.style.transform = 'translateY(0) scale(1)';
        document.getElementById('ai-float-input').focus();
    } else {
        panel.style.opacity = '0';
        panel.style.pointerEvents = 'none';
        panel.style.transform = 'translateY(15px) scale(0.97)';
    }
}

async function sendFloatMessage() {
    const input = document.getElementById('ai-float-input');
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';

    const display = document.getElementById('ai-float-display');
    // User bubble
    const userBubble = document.createElement('div');
    userBubble.style.cssText = 'background:var(--accent); border-radius:12px 12px 4px 12px; padding:10px 14px; font-size:0.87rem; color:#fff; max-width:85%; align-self:flex-end; margin-left:auto;';
    userBubble.textContent = msg;
    display.appendChild(userBubble);
    display.scrollTop = display.scrollHeight;

    // Typing indicator
    const typingBubble = document.createElement('div');
    typingBubble.style.cssText = 'background:rgba(59,130,246,0.1); border-radius:12px 12px 12px 4px; padding:10px 14px; font-size:0.87rem; color:var(--text-muted); max-width:85%;';
    typingBubble.textContent = '...';
    display.appendChild(typingBubble);
    display.scrollTop = display.scrollHeight;

    const prompt = currentLang === 'en'
        ? `You are a professional Freelance Advisor and business consultant. Answer concisely and practically. User asks: "${msg}". Reply in English.`
        : `أنت مساعد ذكي محترف لمستقلي الأعمال الحرة. أجب بإيجاز وبشكل عملي. المستخدم يسأل: ${msg}`;

    try {
        const reply = await callGemini(prompt);
        typingBubble.style.cssText = 'background:rgba(59,130,246,0.1); border-radius:12px 12px 12px 4px; padding:10px 14px; font-size:0.87rem; color:var(--text-main); max-width:85%; white-space:pre-wrap;';
        typingBubble.textContent = reply;
    } catch(e) {
        typingBubble.textContent = currentLang === 'en' ? 'Error: Could not connect.' : 'خطأ: تعذّر الاتصال.';
        typingBubble.style.color = 'var(--danger)';
    }
    display.scrollTop = display.scrollHeight;
}

// Ensure clicking modal content doesn't close it
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.modal').forEach(m => {
        m.addEventListener('click', (e) => e.stopPropagation());
    });
});


    'use strict';

    // --- i18n (Translations) ---
    const translations = {
        'ar': {

            'win_platforms': '💼 إيجاد فرص العمل.exe',
            'plat_intro': 'عشان تلاقي شغل، لازم تروح للمكان اللي العميل بيبحث فيه عنك. الشغل نوعين: منصات مباشرة، وتواصل مباشر.',
            'tab_global': 'المنصات العالمية 🌐',
            'tab_arabic': 'المنصات العربية 🇸🇦',
            'tab_direct': 'التواصل المباشر 🎯',
            'plat_global_desc': 'للمستقلين الذين يمتلكون لغة إنجليزية جيدة:',
            'plat_upwork': 'المنصة الأكبر عالمياً. ممتاز جداً للعقود الطويلة والمشاريع الكبيرة ذات الميزانيات المرتفعة.',
            'plat_fiverr': 'قائم على فكرة "المبيعات السلبية". أنت تعرض خدماتك الجاهزة، والعميل يشتريها مباشرة.',
            'plat_freelancer': 'منصة ممتازة للمسابقات والمشاريع، ولكن المنافسة فيها بالسعر شرسة جداً وتتطلب صبراً كبيراً.',
            'plat_ar_desc': 'ممتازة جداً كبداية إذا كنت تفضل التعامل باللغة العربية وتخشى حاجز اللغة الإنجليزية:',
            'plat_mostaql': 'أكبر منصة عربية للمشاريع الكبيرة. يضع العميل مشروعه وتفاصيله، وأنت تقدم عرضاً احترافياً.',
            'plat_khamsat': 'النسخة العربية من Fiverr. ركز هنا على تقديم خدمات مصغرة ذات سعر منخفض وسرعة تنفيذ عالية.',
            'plat_direct_desc': '🎯 التواصل البارد والمباشر (Cold Outreaching):',
            'plat_direct_text': 'ابحث عن الشركات الناشئة أو أصحاب البيزنس المحليين والعالميين الذين يعانون من نقص واضح في مجال تخصصك. مثلاً: صفحة مطعم نشطة ولكن تصاميمها سيئة، أو مدونة تحتاج إلى كتابة محتوى محسن.',
            'plat_secret_title': 'السر الذهبي:',
            'plat_secret_text': 'لا ترسل "أنا مصمم وأريد عملاً". أرسل "أنا مصمم، لاحظت أن منشوراتكم لا تحصل على التفاعل الكافي، قمت بإعادة تصميم نموذج يعبر عن علامتكم التجارية لزيادة تفاعل الجمهور بنسبة 30%".',
            'plat_open_outreach': '💻 افتح أداة كتابة الرسائل الباردة الآن',
            'win_portfolio': '📁 مرتب_البورتفوليو_الذكي.bat',
            'port_rules_title': 'القوانين الذهبية لبورتفوليو يبيع خدماتك بدلاً منك:',
            'port_rule1': '<strong style="color:var(--cp-yellow);">الجودة قبل الكمية:</strong> اختر أفضل 3 إلى 5 مشاريع فقط.',
            'port_rule2': '<strong style="color:var(--cp-yellow);">المشاريع الوهمية (Fake Projects):</strong> لو لم يكن لديك عملاء، قم بإنشاء مشاريع افتراضية لعلامات تجارية شهيرة.',
            'port_rule3': '<strong style="color:var(--cp-yellow);">الذكاء الاصطناعي ككاتب محترف:</strong> اكتب المعطيات البسيطة وسيقوم الذكاء بصياغتها بأسلوب تسويقي رائع.',
            'port_sim_title': '💡 محاكي كتابة دراسة حالة احترافية (Case Study):',
            'port_sim_desc': 'املأ الحقول التالية ثم اختر الصياغة التقليدية أو التوليد المتطور عبر الذكاء الاصطناعي:',
            'port_lbl_title': 'اسم المشروع / المجال:',
            'port_lbl_client': 'العميل المستهدف أو الافتراضي:',
            'port_lbl_problem': 'المشكلة (ما هي المشكلة التي كان يعاني منها العميل؟):',
            'port_lbl_solution': 'الحل (كيف قمت بحل المشكلة خطوة بخطوة؟):',
            'port_lbl_result': 'النتيجة بالأرقام (ما الفائدة والأثر الحقيقي؟):',
            'port_btn_trad': 'صياغة تقليدية 📝',
            'port_btn_ai': '🤖 توليد احترافي بـ Gemini AI',
            'port_btn_clear': 'إعادة تعيين',
            'port_res_ready': 'جاهز للعرض في بورتفوليو الخاص بك!',
            'port_res_copy': 'نسخ النص 📋',
            'win_outreach': '✉️ مولد_الرسائل_المغناطيسية.exe',
            'out_intro_title': 'كيف تستخدم التواصل البارد لزيادة مبيعاتك؟',
            'out_intro_desc': 'تحديد العميل ومشاكله بدقة وتقديم حل فوري ومجاني كبداية، هو الطريقة الوحيدة ليرد العميل على رسالتك.',
            'out_lbl_niche': 'مجالك التقني:',
            'out_opt_design': 'تصميم جرافيك وهوية بصرية',
            'out_opt_copy': 'كتابة محتوى وإعلانات',
            'out_opt_web': 'برمجة وتطوير مواقع ويب',
            'out_opt_vid': 'مونتاج وصناعة الفيديوهات',
            'out_lbl_client': 'اسم العميل / اسم البراند المستهدف:',
            'out_lbl_prob': 'المشكلة التي لاحظتها على عملهم:',
            'out_lbl_offer': 'عرضك المجاني السريع لجذب انتباههم:',
            'out_btn_fast': 'صيغة سريعة 🚀',
            'out_btn_ai': '🤖 توليد رسالة مخصصة بـ Gemini AI',
            'out_res_title': 'تفضل صيغة الإرسال الجاهزة للنسخ:',
            'out_res_copy': 'نسخ الرسالة 📋',
            'win_linkedin': '🧲 مقياس_مغناطيس_لينكدإن.dll',
            'li_intro_title': 'اجعل بروفايلك مغناطيس يطارد العميل بدلاً من مطاردته!',
            'li_intro_desc': 'العميل عندما يدخل حسابك يحتاج لمعرفة مهاراتك وقدرتك على حل مشاكله في أول 5 ثوانٍ فقط.',
            'li_test_title': '📊 اختبار التقييم التفاعلي لبروفايلك:',
            'li_test_desc': 'ضع علامة صح أمام الخطوات التي قمت بتجهيزها حالياً في ملفك الشخصي:',
            'li_chk_1': '1. الصورة الشخصية والـ Banner',
            'li_chk_2': '2. العنوان الوظيفي (Headline)',
            'li_chk_3': '3. قسم الإنجازات المميزة (Featured Section)',
            'li_chk_4': '4. نبذة "عني" (About Section) صائدة للعملاء',
            'li_chk_5': '5. النشر المنتظم لصناعة الهوية الشخصية',
            'li_score_lbl': 'مجموع نقاط المغناطيسية:',
            'li_eval_weak': 'ضعيف جداً ❌',
            'li_ai_title': '🤖 مولد بايو وعنوان لينكدإن الذكي:',
            'li_ai_desc': 'ادخل مهاراتك الأساسية وسيقوم الذكاء بكتابة عنوان ونبذة احترافية تجذب مدراء التوظيف والعملاء:',
            'li_btn_ai': 'توليد بايو احترافي 🚀',
            'login_title': 'نظام إدارة العمل الحر',
            'login_subtitle': 'منصة إدارة العمل الحر الاحترافية',
            'login_btn': 'تسجيل الدخول',
            'login_new': 'مستخدم جديد',
            'login_user_ph': 'اسم المستخدم',
            'login_pass_ph': 'كلمة المرور',
            'logout': 'تسجيل الخروج',
            'ai_float_title': 'المساعد الذكي',
            'ai_float_ph': 'اسألني أي شيء...',
            'audio_on': 'الصوت: مفعل',
            'audio_off': 'الصوت: معطل',
            'user_offline': 'المستخدم: غير متصل',
            'memory': 'الذاكرة: 8TB',
            'app_ai': 'المساعد الذكي',
            'app_eval': 'مقيّم الأعمال',
            'app_crm': 'إدارة العملاء',
            'app_calc': 'توقع الراتب',
            'app_gig_pricer': 'تقييم العمل وتسعيره',
            'app_notes': 'الملاحظات',
            'app_settings': 'البصريات',
            'app_platforms': 'دليل المنصات',
            'app_portfolio': 'دليل البورتفوليو',
            'app_outreach': 'رسائل التواصل',
            'app_linkedin': 'تحسين لينكدإن',
            'win_platforms': 'دليل المنصات الحرة',
            'win_portfolio': 'دليل بناء البورتفوليو',
            'win_outreach': 'قوالب رسائل التواصل',
            'win_linkedin': 'تحسين حساب لينكدإن',
            'platforms_desc': 'استكشف أفضل منصات العمل الحر، أو دع الذكاء الاصطناعي يقارن الفرص بناءً على مهاراتك!',
            'plat_global': 'منصات عالمية:',
            'plat_local': 'منصات عربية:',
            'plat_ai_title': 'مقارنة الذكاء الاصطناعي',
            'plat_ai_ph': 'أدخل رابط معرض أعمالك أو مهاراتك...',
            'plat_ai_btn': 'قارن الفرص الآن',
            'port_title1': 'كيف تبني معرض أعمال يجذب العملاء؟',
            'port_tip1': 'الجودة وليس الكمية: اعرض أفضل 3-5 مشاريع لك فقط.',
            'port_tip2': 'دراسات الحالة (Case Studies): لا تعرض صورة فقط، اشرح المشكلة والحل والنتائج.',
            'port_tip3': 'الجمهور المستهدف: صمم معرض أعمالك ليخاطب نوعية العملاء التي تريدها.',
            'port_tip4': 'تحديث مستمر: أزل الأعمال القديمة التي لا تعكس مستواك الحالي.',
            'outreach_desc': 'استخدم هذه القوالب كبداية للتواصل مع العملاء المحتملين (Cold Outreach):',
            'outreach_t1_title': 'رسالة تعارف مباشرة:',
            'outreach_t1_body': 'مرحباً [الاسم]، لاحظت إطلاق مشروعكم الجديد. بصفتي متخصص في [المجال]، يمكنني مساعدتكم في تحسين [نتيجة محددة]...',
            'outreach_t2_title': 'رسالة متابعة (Follow-up):',
            'outreach_t2_body': 'مرحباً [الاسم]، أردت فقط التأكد مما إذا كانت رسالتي السابقة قد وصلتكم. هل لا زلتم تبحثون عن مساعدة في [المشروع]؟',
            'li_title': 'أسرار لينكدإن للمستقلين',
            'li_tip1': 'العنوان (Headline): استخدم كلمات مفتاحية يبحث عنها العملاء (مثال: UI/UX Designer | Helping SaaS Startups...).',
            'li_tip2': 'الملخص (About): اكتبه كرسالة مبيعات، ما هي المشاكل التي تحلها للعميل؟',
            'li_tip3': 'الخبرة: اربط كل خبرة بإنجازات ملموسة وأرقام بدلاً من سرد المسؤوليات.',
            'li_tip4': 'النشاط: تفاعل مع منشورات صناع القرار في مجالك لجذب الانتباه.',
            'win_ai': 'مساعد الذكاء الاصطناعي',
            'win_eval': 'مقيّم معرض الأعمال',
            'win_crm': 'إدارة بيانات العملاء',
            'win_calc': 'أداة توقع الراتب',
            'win_gig_pricer': 'مُقيّم العمل والتسعير',
            'win_notes': 'الملاحظات السريعة',
            'win_settings': 'إعدادات العرض (البصريات)',
            'ai_welcome': 'المساعد الذكي متصل. كيف يمكنني مساعدتك؟',
            'ai_send': 'إرسال',
            'eval_title': 'قم بلصق رابط معرض أعمالك (Behance, Dribbble, GitHub...):',
            'eval_btn': 'قيم المعرض الآن',
            'crm_client': 'اسم العميل / الشركة',
            'crm_project': 'وصف المشروع',
            'crm_add': 'إضافة العميل',
            'crm_status_lead': 'محتمل',
            'crm_status_active': 'جاري',
            'crm_status_done': 'مكتمل',
            'calc_hours': 'عدد الساعات المتوقعة:',
            'calc_rate': 'سعر الساعة ($):',
            'calc_cost': 'تكاليف إضافية ($):',
            'calc_btn': 'احسب السعر النهائي',
            'calc_result': 'السعر النهائي:',
            'notes_ph': 'اكتب ملاحظاتك، أفكارك، أو مسوداتك هنا...',
            'notes_save': 'حفظ الملاحظات',
            
            
            
            
            
        },
        'en': {

            'win_platforms': '💼 Find Work.exe',
            'plat_intro': 'To find work, you must go where clients search for you. There are two types: direct platforms and direct outreach.',
            'tab_global': 'Global Platforms 🌐',
            'tab_arabic': 'Arabic Platforms 🇸🇦',
            'tab_direct': 'Direct Outreach 🎯',
            'plat_global_desc': 'For freelancers with good English:',
            'plat_upwork': 'The largest global platform. Great for long-term contracts and high-budget projects.',
            'plat_fiverr': 'Based on "passive sales". You showcase ready-made services, and clients buy them directly.',
            'plat_freelancer': 'Excellent for contests and projects, but price competition is fierce.',
            'plat_ar_desc': 'Excellent starting point if you prefer Arabic and want to avoid the English barrier:',
            'plat_mostaql': 'The largest Arabic platform for big projects. Clients post projects, and you submit proposals.',
            'plat_khamsat': 'The Arabic version of Fiverr. Focus on micro-services with low prices and fast delivery.',
            'plat_direct_desc': '🎯 Cold & Direct Outreach:',
            'plat_direct_text': 'Search for startups or local/global businesses suffering from a clear lack in your field (e.g. active restaurant with bad designs).',
            'plat_secret_title': 'Golden Secret:',
            'plat_secret_text': 'Don\'t send "I am a designer and I want work". Send "I noticed your posts lack engagement. I redesigned a template for your brand to increase engagement by 30%".',
            'plat_open_outreach': '💻 Open Cold Outreach Generator Now',
            'win_portfolio': '📁 Smart_Portfolio_Builder.bat',
            'port_rules_title': 'Golden Rules for a Portfolio that Sells:',
            'port_rule1': '<strong style="color:var(--cp-yellow);">Quality over Quantity:</strong> Choose only 3 to 5 best projects.',
            'port_rule2': '<strong style="color:var(--cp-yellow);">Fake Projects:</strong> If you have no clients, create virtual projects for famous brands.',
            'port_rule3': '<strong style="color:var(--cp-yellow);">AI as a Pro Writer:</strong> Provide basic info, and AI will draft it persuasively.',
            'port_sim_title': '💡 Professional Case Study Simulator:',
            'port_sim_desc': 'Fill in the fields, then choose traditional or advanced AI generation:',
            'port_lbl_title': 'Project Name / Niche:',
            'port_lbl_client': 'Target or Virtual Client:',
            'port_lbl_problem': 'Problem (What issue did the client have?):',
            'port_lbl_solution': 'Solution (How did you solve it step by step?):',
            'port_lbl_result': 'Result in Numbers (What is the real impact?):',
            'port_btn_trad': 'Traditional Draft 📝',
            'port_btn_ai': '🤖 Pro Generation by Gemini AI',
            'port_btn_clear': 'Reset',
            'port_res_ready': 'Ready to showcase in your portfolio!',
            'port_res_copy': 'Copy Text 📋',
            'win_outreach': '✉️ Magnetic_Messages_Generator.exe',
            'out_intro_title': 'How to use Cold Outreach to increase sales?',
            'out_intro_desc': 'Identifying the client and their problems accurately and offering a quick, free solution is the only way to get a reply.',
            'out_lbl_niche': 'Your Tech Niche:',
            'out_opt_design': 'Graphic & Visual Identity Design',
            'out_opt_copy': 'Copywriting & Ads',
            'out_opt_web': 'Web Programming & Development',
            'out_opt_vid': 'Video Editing & Production',
            'out_lbl_client': 'Target Client / Brand Name:',
            'out_lbl_prob': 'Problem you noticed in their work:',
            'out_lbl_offer': 'Your quick free offer to grab attention:',
            'out_btn_fast': 'Quick Draft 🚀',
            'out_btn_ai': '🤖 Custom Message by Gemini AI',
            'out_res_title': 'Here is your ready-to-send template:',
            'out_res_copy': 'Copy Message 📋',
            'win_linkedin': '🧲 LinkedIn_Magnet_Meter.dll',
            'li_intro_title': 'Make your profile a magnet that chases clients instead of you chasing them!',
            'li_intro_desc': 'When clients visit your account, they need to know your skills and problem-solving ability in the first 5 seconds.',
            'li_test_title': '📊 Interactive Profile Assessment:',
            'li_test_desc': 'Check the steps you currently have set up in your profile:',
            'li_chk_1': '1. Profile Picture and Banner',
            'li_chk_2': '2. Headline',
            'li_chk_3': '3. Featured Section',
            'li_chk_4': '4. Client-catching "About" Section',
            'li_chk_5': '5. Regular posting for personal branding',
            'li_score_lbl': 'Magnetism Score Total:',
            'li_eval_weak': 'Very Weak ❌',
            'li_ai_title': '🤖 Smart LinkedIn Bio & Headline Generator:',
            'li_ai_desc': 'Enter your core skills and AI will write an attractive headline and bio:',
            'li_btn_ai': 'Generate Pro Bio 🚀',
            'login_title': 'Freelance OS',
            'login_subtitle': 'Professional Freelance Management Platform',
            'login_btn': 'Login',
            'login_new': 'Register',
            'login_user_ph': 'Username',
            'login_pass_ph': 'Password',
            'logout': 'Logout',
            'ai_float_title': 'AI Assistant',
            'ai_float_ph': 'Ask anything...',
            'audio_on': 'Audio: ON',
            'audio_off': 'Audio: OFF',
            'user_offline': 'User: Offline',
            'memory': 'RAM: 8TB',
            'app_ai': 'AI Assistant',
            'app_eval': 'Portfolio Evaluator',
            'app_crm': 'CRM',
            'app_calc': 'Paycheck Estimator',
            'app_gig_pricer': 'Work Evaluator & Pricer',
            'app_notes': 'Notes',
            'app_settings': 'Settings',
            'app_platforms': 'Platforms Guide',
            'app_portfolio': 'Portfolio Guide',
            'app_outreach': 'Outreach Templates',
            'app_linkedin': 'LinkedIn SEO',
            'win_platforms': 'Freelance Platforms Guide',
            'win_portfolio': 'Portfolio Building Guide',
            'win_outreach': 'Client Outreach Templates',
            'win_linkedin': 'LinkedIn Optimization',
            'platforms_desc': 'Explore top platforms or let AI compare opportunities based on your skills!',
            'plat_global': 'Global Platforms:',
            'plat_local': 'Local Platforms:',
            'plat_ai_title': 'AI Comparison',
            'plat_ai_ph': 'Enter your portfolio link or skills...',
            'plat_ai_btn': 'Compare Opportunities Now',
            'port_title1': 'How to build a client-magnet portfolio?',
            'port_tip1': 'Quality over Quantity: Showcase only your top 3-5 projects.',
            'port_tip2': 'Case Studies: Explain the problem, solution, and results. Don\'t just post images.',
            'port_tip3': 'Target Audience: Design your portfolio for the specific clients you want.',
            'port_tip4': 'Keep it updated: Remove old work that doesn\'t reflect your current skills.',
            'outreach_desc': 'Use these templates to cold pitch potential clients:',
            'outreach_t1_title': 'Direct Intro:',
            'outreach_t1_body': 'Hi [Name], saw your new project launch. As a [Niche] expert, I can help you improve [Specific Result]...',
            'outreach_t2_title': 'Follow-up:',
            'outreach_t2_body': 'Hi [Name], just checking to see if my previous email came through. Are you still looking for help with [Project]?',
            'li_title': 'LinkedIn Secrets for Freelancers',
            'li_tip1': 'Headline: Use SEO keywords clients search for (e.g., UI/UX Designer | Helping SaaS Startups...).',
            'li_tip2': 'About Section: Write it like a sales page. What problems do you solve?',
            'li_tip3': 'Experience: Link experiences to tangible achievements and metrics, not just responsibilities.',
            'li_tip4': 'Activity: Engage with decision-makers in your industry to gain visibility.',
            'win_ai': 'AI Assistant',
            'win_eval': 'Portfolio Evaluator',
            'win_crm': 'CRM System',
            'win_calc': 'Paycheck Estimator',
            'win_gig_pricer': 'Work Evaluator & Pricer',
            'win_notes': 'Quick Notes',
            'win_settings': 'Display Settings',
            'ai_welcome': 'AI Assistant connected. How can I help you?',
            'ai_send': 'Send',
            'eval_title': 'Paste your portfolio link (Behance, GitHub...):',
            'eval_btn': 'Evaluate Now',
            'crm_client': 'Client Name',
            'crm_project': 'Project Description',
            'crm_add': 'Add Client',
            'crm_status_lead': 'Lead',
            'crm_status_active': 'Active',
            'crm_status_done': 'Done',
            'calc_hours': 'Estimated Hours:',
            'calc_rate': 'Hourly Rate ($):',
            'calc_cost': 'Additional Costs ($):',
            'calc_btn': 'Calculate Total',
            'calc_result': 'Final Price:',
            'notes_ph': 'Write your notes, ideas, drafts here...',
            'notes_save': 'Save Notes',
            
            
            
            
            
        }
    };

    let currentLang = localStorage.getItem('app_lang') || 'ar';

    function toggleLanguage() {
        currentLang = currentLang === 'ar' ? 'en' : 'ar';
        localStorage.setItem('app_lang', currentLang);
        // Update all language button labels
        const langBtns = document.querySelectorAll('#lang-btn, #login-lang-btn');
        langBtns.forEach(btn => { btn.textContent = currentLang === 'ar' ? 'English' : 'عربي'; });
        applyLanguage();
    }

    function applyLanguage() {
        const root = document.documentElement;
        if (currentLang === 'ar') {
            root.setAttribute('lang', 'ar');
            root.setAttribute('dir', 'rtl');
        } else {
            root.setAttribute('lang', 'en');
            root.setAttribute('dir', 'ltr');
        }

        const t = translations[currentLang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = t[key];
                } else {
                    el.textContent = t[key];
                }
            }
        });
        
        // Re-apply dynamic states safely
        const audInd = document.getElementById('audio-indicator');
        if (audInd && typeof audioEnabled !== 'undefined') {
            audInd.textContent = audioEnabled ? t['audio_on'] : t['audio_off'];
        }
        const usr = document.getElementById('hud-user');
        if (usr && typeof authToken !== 'undefined' && authToken) {
            usr.textContent = (currentLang === 'ar' ? 'المستخدم: ' : 'User: ') + localStorage.getItem('xp_username');
        }
    }
    
    document.addEventListener('DOMContentLoaded', () => { applyLanguage(); });

    // ===== AUDIO LOGIC =====
    let audioEnabled = true;
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    function playSound(type) {
        if (!audioEnabled) return;
        try { initAudio(); } catch(e) { return; }
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain); gain.connect(audioCtx.destination);

        if (type === 'startup') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.5);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.1, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
            osc.start(now); osc.stop(now + 0.8);
        } else if (type === 'open') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now); osc.stop(now + 0.1);
        } else if (type === 'close') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(500, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now); osc.stop(now + 0.1);
        } else if (type === 'error') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.setValueAtTime(250, now + 0.15);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
            gain.gain.linearRampToValueAtTime(0, now + 0.15);
            gain.gain.linearRampToValueAtTime(0.1, now + 0.2);
            gain.gain.linearRampToValueAtTime(0, now + 0.3);
            osc.start(now); osc.stop(now + 0.3);
        }
    }

    function toggleAudio() {
        audioEnabled = !audioEnabled;
        document.getElementById('audio-indicator').textContent = audioEnabled ? 'الصوت: مفعل' : 'الصوت: معطل';
    }

    // ===== AUTH STATE =====
    let authToken = localStorage.getItem('xp_auth_token') || null;
    let currentUser = localStorage.getItem('xp_username') || null;
    let currentAuthTab = 'login';

    function switchAuthTab(tab) {
        currentAuthTab = tab;
        const loginTab = document.getElementById('tab-login');
        const registerTab = document.getElementById('tab-register');
        const btn = document.getElementById('auth-submit-btn');
        if (tab === 'login') {
            loginTab.style.color = 'var(--accent)';
            loginTab.style.borderBottom = '2px solid var(--accent)';
            loginTab.style.fontWeight = '600';
            registerTab.style.color = 'var(--text-muted)';
            registerTab.style.borderBottom = '2px solid transparent';
            registerTab.style.fontWeight = '400';
            btn.textContent = 'Login';
        } else {
            registerTab.style.color = 'var(--accent)';
            registerTab.style.borderBottom = '2px solid var(--accent)';
            registerTab.style.fontWeight = '600';
            loginTab.style.color = 'var(--text-muted)';
            loginTab.style.borderBottom = '2px solid transparent';
            loginTab.style.fontWeight = '400';
            btn.textContent = 'Create Account';
        }
    }

    function checkAuth() {
        if (authToken && currentUser) {
            document.getElementById('login-screen').style.display = 'none';
            const welcomeEl = document.getElementById('welcome-msg');
            if (welcomeEl) welcomeEl.textContent = currentUser;
            initUserSession();
        }
    }

    async function performAuth(action) {
        const user = document.getElementById('login-username').value.trim();
        const pass = document.getElementById('login-password').value;
        const errDiv = document.getElementById('login-error');
        errDiv.textContent = '';

        if (!user || !pass) { errDiv.textContent = 'Error: Please fill in all fields.'; return; }

        try {
            const res = await fetch('/api/' + action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user, password: pass })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Authentication failed');

            localStorage.setItem('xp_auth_token', data.token);
            localStorage.setItem('xp_username', data.username);
            authToken = data.token; currentUser = data.username;
            
            document.getElementById('login-screen').style.display = 'none';
            const welcomeEl = document.getElementById('welcome-msg');
            if (welcomeEl) welcomeEl.textContent = currentUser;
            playSound('startup');
            initUserSession();
        } catch (err) {
            errDiv.textContent = 'Error: ' + err.message;
            playSound('error');
        }
    }

    async function initUserSession() {
        try {
            const res = await fetch('/api/settings', { headers: { 'Authorization': 'Bearer ' + authToken } });
            if (res.ok) {
                const data = await res.json();
                const notepadEl = document.getElementById('notepad-text');
                if (notepadEl) notepadEl.value = data.notepad_text || '';
            }
        } catch (e) { console.error(e); }
        loadCrmTable();
    }

    function logout() {
        localStorage.removeItem('xp_auth_token');
        localStorage.removeItem('xp_username');
        location.reload();
    }

    // ===== NOTEPAD =====
    let notepadTimeout;
    function saveNotepad() {
        const val = document.getElementById('notepad-text').value;
        clearTimeout(notepadTimeout);
        notepadTimeout = setTimeout(async () => {
            if (authToken) {
                await fetch('/api/settings/notepad', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
                    body: JSON.stringify({ text: val })
                });
            }
        }, 500);
    }

    // ===== AI CALLS =====
    const api_key = 'AIzaSyCYis-S-G8dMWIKbaM31y_dOV0dGNl50NE';
    async function callGemini(prompt, fileParts = []) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${api_key}`;
        const parts = [{ text: prompt }, ...fileParts];
        const body = {
            contents: [{ role: "user", parts: parts }]
        };
        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    // AI FIXER (CHAT)
    async function sendChatMessage() {
        const input = document.getElementById('ai-chat-input');
        const msg = input.value.trim();
        if (!msg) return;
        input.value = '';
        
        const display = document.getElementById('ai-chat-display');
        display.innerHTML += `<div style="color:#fff;"><span style="color:var(--cp-blue)">[أنت]</span> ${msg}</div>`;
        
        const btn = document.getElementById('ai-send-btn');
        btn.disabled = true; btn.textContent = '...';

        const prompt = currentLang === 'en' 
            ? `You are a professional Freelance Advisor. Act as an expert consultant to the user. User says: "${msg}". Reply in English. Keep it concise, professional, and practical.`
            : `أنت مساعد ذكي ومحترف تعمل كمستشار مستقل. قدم نصيحة احترافية وعملية بأسلوب احترافي بناءً على طلب المستقل (Freelancer) أو سؤاله: ${msg}`;

        try {
            const reply = await callGemini(prompt);
            display.innerHTML += `<div style="color:var(--cp-yellow);"><span style="color:var(--cp-red)">[المُصلّح]</span> ${reply}</div>`;
            playSound('open');
        } catch(e) {
            display.innerHTML += `<div style="color:var(--cp-red);">[خطأ] فُقد الاتصال</div>`;
            playSound('error');
        } finally {
            btn.disabled = false; btn.textContent = 'إرسال';
            display.scrollTop = display.scrollHeight;
        }
    }

    // AI GIG PRICER
    async function generateGigPriceAI() {
        const jobType = document.getElementById('gig-job-type').value.trim();
        const experience = document.getElementById('gig-experience').value.trim();
        const location = document.getElementById('gig-location').value.trim();
        const tools = document.getElementById('gig-tools').value.trim();
        const fileInput = document.getElementById('gig-upload');
        
        if (!jobType || !experience || !location) {
            alert(currentLang === 'ar' ? 'يرجى ملء جميع الحقول الأساسية!' : 'Please fill in all required fields!');
            return;
        }

        const btn = document.getElementById('btn-estimate-gig');
        const panel = document.getElementById('gig-result-panel');
        const textEl = document.getElementById('gig-result-text');

        btn.disabled = true; 
        btn.textContent = currentLang === 'ar' ? '🤖 جاري الحساب...' : '🤖 Calculating...';
        panel.style.display = 'block'; 
        textEl.textContent = currentLang === 'ar' ? 'يتم تحليل معطيات المشروع...' : 'Analyzing project details...';

        let fileParts = [];
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            try {
                const base64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result.split(',')[1]);
                    reader.onerror = error => reject(error);
                    reader.readAsDataURL(file);
                });
                fileParts.push({
                    inline_data: {
                        mime_type: file.type,
                        data: base64
                    }
                });
            } catch (err) {
                console.error("Error reading file:", err);
            }
        }

        const prompt = currentLang === 'en'
            ? `Act as an expert freelance pricing advisor. A freelancer is bidding for a specific gig:\nJob Type: ${jobType}\nExperience: ${experience} years\nClient Location: ${location}\nTools Used: ${tools}\n\nI have also provided a file (e.g. image, document, design) of my work for this gig (if available). Please evaluate the visual/content quality of the uploaded work. Based on these details and the quality of my work, how much should I ask for this specific job? Provide an estimated price range (in USD), a brief reasoning for this price (value-based considering my quality), 1 quick tip on how to pitch this price to the client, a section highlighting the strong points (pros) of the uploaded work, and finally, a section identifying any weak points along with constructive suggestions for improvement. Write your response clearly in English.`
            : `Act as an expert freelance pricing advisor. A freelancer is bidding for a specific gig:\nJob Type: ${jobType}\nExperience: ${experience} years\nClient Location: ${location}\nTools Used: ${tools}\n\nI have also provided a file (e.g. image, document, design) of my work for this gig (if available). Please evaluate the visual/content quality of the uploaded work. Based on these details and the quality of my work, how much should I ask for this specific job? Provide an estimated price range (in USD), a brief reasoning for this price (value-based considering my quality), 1 quick tip on how to pitch this price to the client, a section highlighting the strong points (pros) of the uploaded work, and finally, a section identifying any weak points along with constructive suggestions for improvement. Write your response clearly in Arabic.`;

        try {
            textEl.textContent = await callGemini(prompt, fileParts);
            playSound('open');
        } catch(e) {
            textEl.textContent = currentLang === 'ar' ? '[خطأ] فشل الحساب' : '[Error] Calculation failed';
            playSound('error');
        } finally {
            btn.disabled = false; 
            btn.textContent = currentLang === 'ar' ? 'احسب التسعيرة المقترحة (Calculate Price)' : 'Calculate Price';
        }
    }

    async function estimatePaycheckAI() {
        const field = document.getElementById('calc-field').value.trim();
        const exp = document.getElementById('calc-experience').value.trim();
        const country = document.getElementById('calc-country').value.trim();
        const intro = document.getElementById('calc-intro').value.trim();
        if (!field || !exp || !country || !intro) {
            alert(currentLang === 'ar' ? 'يرجى ملء جميع الحقول!' : 'Please fill in all fields!');
            return;
        }

        const btn = document.getElementById('btn-estimate-pay');
        const panel = document.getElementById('calc-result-panel');
        const textEl = document.getElementById('calc-result-text');

        btn.disabled = true; 
        btn.textContent = currentLang === 'ar' ? '🤖 جاري التوقع...' : '🤖 Estimating...';
        panel.style.display = 'block'; 
        textEl.textContent = currentLang === 'ar' ? 'يتم تحليل بيانات السوق...' : 'Analyzing market data...';

        const prompt = currentLang === 'en'
            ? `Act as an expert career and salary advisor. A professional has the following profile:\nField: ${field}\nYears of Experience: ${exp}\nCountry/Region: ${country}\nIntroduction & Skills: ${intro}\n\nPlease estimate their expected monthly paycheck/salary and average hourly rate in USD. Provide a brief analysis of their market value and 1-2 quick tips to increase their income. Write your response clearly in English.`
            : `Act as an expert career and salary advisor. A professional has the following profile:\nField: ${field}\nYears of Experience: ${exp}\nCountry/Region: ${country}\nIntroduction & Skills: ${intro}\n\nPlease estimate their expected monthly paycheck/salary and average hourly rate in USD. Provide a brief analysis of their market value and 1-2 quick tips to increase their income. Write your response clearly in Arabic.`;

        try {
            textEl.textContent = await callGemini(prompt);
            playSound('open');
        } catch(e) {
            textEl.textContent = currentLang === 'ar' ? '[خطأ] فشل التوقع' : '[Error] Estimation failed';
            playSound('error');
        } finally {
            btn.disabled = false; 
            btn.textContent = currentLang === 'ar' ? 'توقع راتبي (Estimate My Paycheck)' : 'Estimate My Paycheck';
        }
    }

    // AI PORTFOLIO EVALUATOR
    
    // ===== CRM =====
    let crmData = [];

    async function loadCrmTable() {
        if (!authToken) return;
        try {
            const res = await fetch('/api/crm', { headers: { 'Authorization': 'Bearer ' + authToken } });
            if (res.ok) {
                crmData = await res.json();
                renderCrmTable();
            }
        } catch(e) { console.error(e); }
    }

    async function addCrmClient() {
        const client = document.getElementById('crm-client').value.trim();
        const project = document.getElementById('crm-project').value.trim();
        const status = document.getElementById('crm-status').value;
        if (!client || !authToken) return;
        try {
            const res = await fetch('/api/crm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
                body: JSON.stringify({ client, project, status })
            });
            if (res.ok) {
                document.getElementById('crm-client').value = '';
                document.getElementById('crm-project').value = '';
                loadCrmTable();
            }
        } catch(e) { console.error(e); }
    }

    async function deleteCrmClient(id) {
        if (!confirm('حذف بيانات العميل؟')) return;
        if (!authToken) return;
        try {
            await fetch('/api/crm/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + authToken } });
            loadCrmTable();
        } catch(e) {}
    }

    async function updateCrmStatus(id, newStatus) {
        if (!authToken) return;
        try {
            await fetch('/api/crm/' + id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + authToken },
                body: JSON.stringify({ status: newStatus })
            });
            loadCrmTable();
        } catch(e) {}
    }

    function renderCrmTable() {
        const tbody = document.getElementById('crm-tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        const statusColors = { 'Lead': 'var(--cp-text)', 'Negotiating': 'var(--cp-blue)', 'Won': 'var(--cp-yellow)', 'Lost': 'var(--cp-red)' };

        crmData.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="border-bottom:1px solid rgba(0,240,255,0.2);padding:8px;">${c.client}</td>
                <td style="border-bottom:1px solid rgba(0,240,255,0.2);padding:8px;">${c.project}</td>
                <td style="border-bottom:1px solid rgba(0,240,255,0.2);padding:8px;text-align:center;">
                    <select onchange="updateCrmStatus(${c.id}, this.value)" style="background:transparent; border:none; color:${statusColors[c.status]}; font-family:'Cairo'; outline:none; font-weight:bold;">
                        <option value="Lead" ${c.status==='Lead'?'selected':''} style="color:#000">محتمل</option>
                        <option value="Negotiating" ${c.status==='Negotiating'?'selected':''} style="color:#000">تفاوض</option>
                        <option value="Won" ${c.status==='Won'?'selected':''} style="color:#000">تم</option>
                        <option value="Lost" ${c.status==='Lost'?'selected':''} style="color:#000">مرفوض</option>
                    </select>
                </td>
                <td style="border-bottom:1px solid rgba(0,240,255,0.2);padding:8px;text-align:center;">
                    <button class="cp-btn red" style="padding:4px 8px; font-size:12px;" onclick="deleteCrmClient(${c.id})">حذف</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // BOOT
    checkAuth();
    applyLanguage();
    
    async function comparePlatformsAI() {
        const val = document.getElementById('plat-portfolio-input').value.trim();
        if (!val) return;

        const btn = document.getElementById('btn-plat-ai');
        const panel = document.getElementById('plat-result-panel');
        const textEl = document.getElementById('plat-result-text');

        btn.disabled = true; 
        btn.textContent = currentLang === 'en' ? 'Analyzing opportunities...' : 'جاري مقارنة الفرص...';
        panel.style.display = 'block'; 
        textEl.textContent = currentLang === 'en' ? 'Thinking...' : 'جاري التحليل...';

        const prompt = currentLang === 'en'
            ? `You are an expert Freelance Strategist. Based on this freelancer's profile/skills: "${val}", compare the top 3 best platforms for them (e.g., Upwork vs Fiverr vs Toptal vs Local). Explain WHY these platforms fit their specific skills and give a strategy to succeed on each. Reply entirely in English.`
            : `أنت خبير استراتيجي في العمل الحر. بناءً على هذا الملف/المهارات للمستقل: "${val}"، قارن بين أفضل 3 منصات عمل حر تناسبه (مثال: Upwork vs مستقل vs Toptal). اشرح لماذا هذه المنصات تناسب مهاراته تحديداً وأعطه استراتيجية للنجاح فيها. اكتب الرد باللغة العربية.`;

        try {
            textEl.textContent = await callGemini(prompt);
            playSound('open');
        } catch(e) {
            textEl.textContent = currentLang === 'en' ? 'Error: ' + e.message : 'خطأ: ' + e.message;
            playSound('error');
        }
        
        btn.disabled = false;
        const t = translations[currentLang];
        btn.textContent = t['plat_ai_btn'];
    }


    // ===== PLATFORMS GUIDE — TAB SWITCHER =====
    function switchWorkTab(tab) {
        ['global', 'arabic', 'direct'].forEach(t => {
            const el = document.getElementById('tab-' + t);
            const btn = document.getElementById('tab-btn-' + t);
            if (el) el.style.display = (t === tab) ? 'block' : 'none';
            if (btn) {
                btn.style.background = (t === tab) ? 'var(--accent)' : 'var(--bg-card)';
                btn.style.color = (t === tab) ? '#fff' : 'var(--text-main)';
            }
        });
    }

    // ===== PORTFOLIO BUILDER =====
    function generateCaseStudy() {
        const title    = document.getElementById('cs-title').value.trim();
        const client   = document.getElementById('cs-client').value.trim();
        const problem  = document.getElementById('cs-problem').value.trim();
        const solution = document.getElementById('cs-solution').value.trim();
        const result   = document.getElementById('cs-result').value.trim();

        if (!title || !problem || !solution) {
            alert(currentLang === 'ar' ? 'يرجى ملء جميع الحقول الأساسية.' : 'Please fill in all required fields.');
            return;
        }

        const isAr = currentLang === 'ar';
        const text = isAr
            ? `📁 دراسة الحالة: ${title}\n👤 العميل: ${client || 'غير محدد'}\n\n🔴 المشكلة:\n${problem}\n\n✅ الحل:\n${solution}\n\n📊 النتيجة:\n${result || 'قيد القياس'}`
            : `📁 Case Study: ${title}\n👤 Client: ${client || 'Undisclosed'}\n\n🔴 Problem:\n${problem}\n\n✅ Solution:\n${solution}\n\n📊 Result:\n${result || 'Pending measurement'}`;

        document.getElementById('cs-formatted-text').textContent = text;
        document.getElementById('cs-result-panel').style.display = 'block';
    }

    async function generateCaseStudyAI() {
        const title    = document.getElementById('cs-title').value.trim();
        const client   = document.getElementById('cs-client').value.trim();
        const problem  = document.getElementById('cs-problem').value.trim();
        const solution = document.getElementById('cs-solution').value.trim();
        const result   = document.getElementById('cs-result').value.trim();

        if (!title || !problem || !solution) {
            alert(currentLang === 'ar' ? 'يرجى ملء الحقول الأساسية أولاً.' : 'Please fill in the required fields first.');
            return;
        }

        const btn = document.getElementById('ai-cs-btn-text');
        const panel = document.getElementById('cs-result-panel');
        const textEl = document.getElementById('cs-formatted-text');

        btn.disabled = true;
        btn.textContent = currentLang === 'ar' ? '🤖 جاري الكتابة...' : '🤖 Writing...';
        panel.style.display = 'block';
        textEl.textContent = currentLang === 'ar' ? 'يقوم الذكاء الاصطناعي بصياغة دراسة الحالة...' : 'AI is crafting your case study...';

        const prompt = currentLang === 'ar'
            ? `أنت كاتب محتوى تسويقي محترف. اكتب دراسة حالة (Case Study) احترافية وجذابة للمستقل بناءً على هذه البيانات:\nالمشروع: ${title}\nالعميل: ${client}\nالمشكلة: ${problem}\nالحل: ${solution}\nالنتيجة: ${result}\n\nاجعل النص تسويقياً ومقنعاً يبرز قيمة المستقل ومهاراته. استخدم رموز وعناوين واضحة. اكتب باللغة العربية.`
            : `You are a professional marketing copywriter. Write an impressive, client-facing Case Study for this freelancer based on:\nProject: ${title}\nClient: ${client}\nProblem: ${problem}\nSolution: ${solution}\nResult: ${result}\n\nMake it persuasive, highlight the freelancer's value clearly. Use emojis and clear headings. Reply in English.`;

        try {
            const reply = await callGemini(prompt);
            textEl.textContent = reply;
        } catch(e) {
            textEl.textContent = currentLang === 'ar' ? 'خطأ: فشل الاتصال بالذكاء الاصطناعي.' : 'Error: AI connection failed.';
        } finally {
            btn.disabled = false;
            btn.textContent = currentLang === 'ar' ? '🤖 توليد احترافي بـ Gemini AI' : '🤖 Pro Generation by Gemini AI';
        }
    }

    function clearCaseStudyForm() {
        ['cs-title','cs-client','cs-problem','cs-solution','cs-result'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        document.getElementById('cs-result-panel').style.display = 'none';
        document.getElementById('cs-formatted-text').textContent = '';
    }

    function copyCaseStudyToClipboard() {
        const text = document.getElementById('cs-formatted-text').textContent;
        navigator.clipboard.writeText(text).then(() => {
            const btn = event.target;
            btn.textContent = currentLang === 'ar' ? '✓ تم النسخ!' : '✓ Copied!';
            setTimeout(() => { btn.textContent = currentLang === 'ar' ? 'نسخ النص 📋' : 'Copy Text 📋'; }, 2000);
        });
    }

    // ===== OUTREACH GENERATOR =====
    const outreachTemplates = {
        design: {
            ar: (client, problem, offer) => `السلام عليكم ${client}،\n\nلاحظت أن ${problem}، وأعتقد أن هذا يؤثر على تفاعل جمهوركم.\n\nأنا مصمم متخصص في الهوية البصرية، وقد أعددت لكم ${offer} مجاناً لتجربة أسلوب عملي.\n\nهل يسعدكم الاطلاع عليه؟`,
            en: (client, problem, offer) => `Hi ${client},\n\nI noticed that ${problem}, which likely affects your audience engagement.\n\nI'm a visual identity designer, and I've prepared ${offer} for free so you can experience my work style.\n\nWould you like to take a look?`
        },
        copywriting: {
            ar: (client, problem, offer) => `مرحباً ${client}،\n\nألاحظ أن ${problem}. المحتوى القوي هو ما يحول المتابعين إلى مشترين.\n\nقمت بإعداد ${offer} خاص بكم مجاناً.\n\nهل يمكنني إرساله لكم لتجربة الفرق؟`,
            en: (client, problem, offer) => `Hi ${client},\n\nI've noticed that ${problem}. Strong copy is what converts followers into customers.\n\nI've prepared ${offer} for you at no charge.\n\nCan I send it over so you can see the difference?`
        },
        webdev: {
            ar: (client, problem, offer) => `مرحباً ${client}،\n\nلاحظت أن ${problem}. في عالم اليوم، سرعة الموقع وتجربة المستخدم تحدد نسبة المبيعات مباشرة.\n\nأنا مطور مواقع، وأعددت ${offer} لإظهار ما يمكن تحسينه.\n\nهل تودّ الاطلاع؟`,
            en: (client, problem, offer) => `Hi ${client},\n\nI noticed that ${problem}. In today's market, site speed and UX directly determine conversion rates.\n\nI'm a web developer and I've prepared ${offer} to show what could be improved.\n\nWould you like to see it?`
        },
        video: {
            ar: (client, problem, offer) => `السلام عليكم ${client}،\n\nبصراحة، لاحظت أن ${problem}، والفيديو الاحترافي هو أسرع طريقة لتغيير هذه المعادلة.\n\nقمت بتجهيز ${offer} مجانية لإثبات ذلك لكم.\n\nهل يسمح وقتكم للاطلاع عليها؟`,
            en: (client, problem, offer) => `Hi ${client},\n\nHonestly, I noticed that ${problem} — and professional video is the fastest way to change that equation.\n\nI put together ${offer} for free to prove it.\n\nDo you have a moment to check it out?`
        }
    };

    function generateOutreachTemplate() {
        const niche = document.getElementById('out-niche').value;
        const client = document.getElementById('out-client-name').value.trim() || (currentLang === 'ar' ? 'العميل' : 'the client');
        const problem = document.getElementById('out-observed-problem').value.trim() || (currentLang === 'ar' ? 'هناك نقطة يمكن تحسينها' : 'there is room for improvement');
        const offer = document.getElementById('out-free-offer').value.trim() || (currentLang === 'ar' ? 'نموذج مجاني' : 'a free sample');

        const template = outreachTemplates[niche] || outreachTemplates.design;
        const text = currentLang === 'ar' ? template.ar(client, problem, offer) : template.en(client, problem, offer);

        document.getElementById('outreach-output-text').value = text;
        document.getElementById('outreach-result-panel').style.display = 'block';
    }

    async function generateOutreachAI() {
        const niche = document.getElementById('out-niche').value;
        const client = document.getElementById('out-client-name').value.trim();
        const problem = document.getElementById('out-observed-problem').value.trim();
        const offer = document.getElementById('out-free-offer').value.trim();

        if (!client || !problem) {
            alert(currentLang === 'ar' ? 'يرجى ملء اسم العميل والمشكلة.' : 'Please fill in the client name and observed problem.');
            return;
        }

        const btn = document.getElementById('ai-out-btn-text');
        const panel = document.getElementById('outreach-result-panel');
        const textEl = document.getElementById('outreach-output-text');

        btn.disabled = true;
        btn.textContent = currentLang === 'ar' ? '🤖 جاري الكتابة...' : '🤖 Crafting...';
        panel.style.display = 'block';
        textEl.value = currentLang === 'ar' ? 'يقوم الذكاء الاصطناعي بكتابة رسالتك...' : 'AI is crafting your message...';

        const prompt = currentLang === 'ar'
            ? `أنت خبير في التواصل البارد (Cold Outreach) للمستقلين. اكتب رسالة تواصل بارد قصيرة وجذابة ومقنعة جداً لمستقل في مجال "${niche}".\nبيانات الرسالة:\n- اسم العميل: ${client}\n- المشكلة الملاحظة: ${problem}\n- العرض المجاني: ${offer}\n\nاجعل الرسالة قصيرة (5-7 أسطر)، شخصية، وتركز على قيمة العميل لا على المستقل. اكتب باللغة العربية.`
            : `You are a Cold Outreach expert for freelancers. Write a short, highly compelling cold outreach message for a "${niche}" freelancer.\nDetails:\n- Target client: ${client}\n- Observed problem: ${problem}\n- Free offer: ${offer}\n\nKeep it under 7 lines, personal, and focused on the client's value, not the freelancer. Reply in English.`;

        try {
            textEl.value = await callGemini(prompt);
        } catch(e) {
            textEl.value = currentLang === 'ar' ? 'خطأ: فشل الاتصال.' : 'Error: Connection failed.';
        } finally {
            btn.disabled = false;
            btn.textContent = currentLang === 'ar' ? '🤖 توليد رسالة مخصصة بـ Gemini AI' : '🤖 Custom Message by Gemini AI';
        }
    }

    function updateOutreachExamples() {
        // Placeholder examples update per niche — no-op but prevents console errors
    }

    function copyOutreachToClipboard() {
        const text = document.getElementById('outreach-output-text').value;
        navigator.clipboard.writeText(text).then(() => {
            const btn = event.target;
            btn.textContent = currentLang === 'ar' ? '✓ تم النسخ!' : '✓ Copied!';
            setTimeout(() => { btn.textContent = currentLang === 'ar' ? 'نسخ الرسالة 📋' : 'Copy Message 📋'; }, 2000);
        });
    }

    // ===== LINKEDIN SEO =====
    function calculateLinkedInScore() {
        const checks = ['li-check-photo','li-check-headline','li-check-featured','li-check-about','li-check-activity'];
        const checked = checks.filter(id => document.getElementById(id)?.checked).length;
        const percent = Math.round((checked / checks.length) * 100);

        document.getElementById('li-score-fill').style.width = percent + '%';
        document.getElementById('li-score-percent').textContent = percent + '%';

        const label = document.getElementById('li-evaluation-label');
        const isAr = currentLang === 'ar';
        if (percent === 100) {
            label.textContent = isAr ? 'مغناطيس قوي جداً 🔥' : 'Very Strong Magnet 🔥';
            label.style.color = '#10b981';
        } else if (percent >= 60) {
            label.textContent = isAr ? 'جيد — يمكن تحسينه ⚡' : 'Good — room to improve ⚡';
            label.style.color = 'var(--warning)';
        } else {
            label.textContent = isAr ? 'ضعيف جداً ❌' : 'Very Weak ❌';
            label.style.color = 'var(--danger)';
        }

        // Dynamic color of the fill bar
        document.getElementById('li-score-fill').style.background =
            percent >= 80 ? '#10b981' : percent >= 40 ? 'var(--warning)' : 'var(--danger)';
    }

    async function generateLinkedInBioAI() {
        const skills = document.getElementById('li-input-skills').value.trim();
        if (!skills) {
            alert(currentLang === 'ar' ? 'يرجى إدخال مهاراتك أولاً.' : 'Please enter your skills first.');
            return;
        }

        const btn = document.getElementById('li-bio-btn-text');
        const resultEl = document.getElementById('li-bio-result');

        btn.disabled = true;
        btn.textContent = currentLang === 'ar' ? '🤖 جاري التوليد...' : '🤖 Generating...';
        resultEl.style.display = 'block';
        resultEl.textContent = currentLang === 'ar' ? 'يقوم الذكاء الاصطناعي بكتابة ملفك...' : 'AI is writing your profile...';

        const prompt = currentLang === 'ar'
            ? `أنت خبير في تحسين ملفات لينكدإن للمستقلين. بناءً على هذه المهارات: "${skills}"، اكتب:\n1. عنوان Headline مميز (أقل من 220 حرف) يجذب العملاء ومدراء التوظيف\n2. نبذة About مقنعة (فقرة واحدة) تبرز كيف يحل هذا الشخص مشاكل العملاء\nاكتب باللغة العربية ثم بالإنجليزية.`
            : `You are a LinkedIn profile optimization expert for freelancers. Based on these skills: "${skills}", write:\n1. An eye-catching Headline (under 220 chars) targeting clients and recruiters\n2. A compelling About section (1-2 paragraphs) focused on how this person solves client problems\nReply in English only.`;

        try {
            resultEl.textContent = await callGemini(prompt);
        } catch(e) {
            resultEl.textContent = currentLang === 'ar' ? 'خطأ: فشل الاتصال.' : 'Error: Connection failed.';
        } finally {
            btn.disabled = false;
            btn.textContent = currentLang === 'ar' ? 'توليد بايو احترافي 🚀' : 'Generate Pro Bio 🚀';
        }
    }

// Inject new UI translations
translations.en.hero_title = "Elevate Your Freelance Business";
translations.ar.hero_title = "ارتقِ بعملك الحر إلى القمة";
translations.en.hero_desc = "The all-in-one smart operating system designed exclusively for top-tier freelancers. Manage clients, generate outreach, and evaluate your portfolio with advanced AI.";
translations.ar.hero_desc = "نظام التشغيل الذكي والمتكامل المصمم خصيصاً للمستقلين المحترفين. أدر عملائك، اكتب رسائلك التسويقية، وحلل بورتفوليو أعمالك باستخدام أحدث تقنيات الذكاء الاصطناعي.";
translations.en.desc_ai = "Your personal intelligent copilot.";
translations.ar.desc_ai = "مساعدك الشخصي الذكي للعمل.";
translations.en.desc_crm = "Manage clients and project statuses.";
translations.ar.desc_crm = "إدارة العملاء وحالة المشاريع.";
translations.en.desc_portfolio = "Generate professional case studies.";
translations.ar.desc_portfolio = "توليد دراسات حالة احترافية.";
translations.en.desc_outreach = "Draft magnetic cold emails.";
translations.ar.desc_outreach = "كتابة رسائل تواصل بارد مغناطيسية.";
translations.en.desc_linkedin = "Optimize your profile for recruiters.";
translations.ar.desc_linkedin = "تهيئة حسابك لاصطياد أصحاب العمل.";
translations.en.desc_platforms = "Find the best freelance networks.";
translations.ar.desc_platforms = "ابحث عن أفضل منصات العمل الحر.";
translations.en.desc_evaluator = "Assess your pricing & growth.";
translations.ar.desc_evaluator = "تقييم تسعيرك ونموك في السوق.";
translations.en.desc_calc = "Estimate your market value and paycheck.";
translations.ar.desc_calc = "توقع قيمتك السوقية وراتبك بسهولة.";
translations.en.desc_gig_pricer = "Evaluate your work quality and estimate prices.";
translations.ar.desc_gig_pricer = "تقييم جودة عملك وتسعيره بدقة.";
translations.en.desc_notes = "Quickly jot down your ideas.";
translations.ar.desc_notes = "تدوين سريع وسهل لأفكارك.";


window.clearWindowInputs = function(btn) {
    const modal = btn.closest('.modal');
    if (!modal) return;
    modal.querySelectorAll('input, textarea').forEach(i => {
        if (i.type === 'checkbox') i.checked = false;
        else i.value = '';
    });
    modal.querySelectorAll('[id$="-panel"], [id$="-result"]').forEach(p => p.style.display = 'none');
    const chatDisplay = modal.querySelector('#ai-chat-display');
    if (chatDisplay) {
        chatDisplay.innerHTML = '<div style="color:var(--warning); font-weight:700;" data-i18n="ai_welcome">' + (currentLang === 'ar' ? 'المساعد الذكي متصل. كيف يمكنني مساعدتك؟' : 'AI Assistant connected. How can I help you?') + '</div>';
    }
};
translations.ar.nav_about = 'عن المنصة';
translations.ar.about_title = 'A2Z Studio';

translations.ar.about_version = 'الإصدار 2.5.0 - النسخة الاحترافية';
translations.en.nav_about = 'About Us';
translations.en.about_title = 'A2Z Studio';

translations.en.about_version = 'Version 2.5.0 - Professional Edition';
translations.ar.about_p1 = 'A2Z Studio هو نظام التشغيل الذكي الشامل المصمم خصيصاً للمستقلين المحترفين. نحن نمكّن المستقلين من إدارة العملاء، تعزيز حملاتهم التسويقية، وتقييم أعمالهم بفضل الذكاء الاصطناعي المتطور المدعوم من Gemini.';
translations.ar.about_p2 = 'تم بناء هذه المنصة بشغف بواسطة A2Z Studio، وهدفنا هو تبسيط سير عملك بالكامل كمستقل لتتفرغ تماماً لما تبرع فيه.';
translations.ar.about_links = 'روابط سريعة:';
translations.ar.about_copy = '© 2026 A2Z Studio. جميع الحقوق محفوظة.';
translations.en.about_p1 = 'A2Z Studio is the all-in-one smart operating system designed exclusively for top-tier freelancers. We empower independent professionals to manage clients, supercharge their outreach, and evaluate their portfolios with advanced AI powered by Gemini.';
translations.en.about_p2 = 'Built with passion by A2Z Studio, our goal is to streamline your entire freelance workflow so you can focus entirely on what you do best.';
translations.en.about_links = 'Quick Links:';
translations.en.about_copy = '© 2026 A2Z Studio. All rights reserved.';
