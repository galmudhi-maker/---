// قائمة الجوال
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});

// إغلاق القائمة بعد اختيار صفحة
document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});

// تبويبات أداة الفحص
const tabs = document.querySelectorAll(".tab");
const scanInput = document.getElementById("scanInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const scanResult = document.getElementById("scanResult");

let currentMode = "message";

const placeholders = {
  message: "الصق الرسالة التي وصلتك هنا...",
  link: "الصق الرابط الذي تريد فحصه هنا...",
  content: "اكتب الخبر أو المعلومة التي تريد التحقق منها..."
};

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(item => item.classList.remove("active"));
    tab.classList.add("active");

    currentMode = tab.dataset.mode;
    scanInput.placeholder = placeholders[currentMode];

    scanInput.value = "";

    scanResult.className = "result";
    scanResult.innerHTML = `
      <strong>مساحة التحليل</strong>
      <p>أدخل المحتوى لبدء التحليل الإرشادي.</p>
    `;
  });
});

// كلمات وعبارات قد تدل على محاولة احتيال
const suspiciousWords = [
  "اربح جائزة",
  "مبروك ربحت",
  "حسابك موقوف",
  "تحديث بياناتك",
  "اضغط هنا",
  "بشكل عاجل",
  "أرسل رمز التحقق",
  "رمز التحقق",
  "بياناتك البنكية",
  "أدخل كلمة المرور",
  "جائزة مجانية",
  "فرصة أخيرة",
  "حسابك سيتم إغلاقه",
  "تحويل مبلغ",
  "تم تعليق حسابك"
];

// تحليل النص
function analyzeMessage(text) {
  const found = suspiciousWords.filter(word =>
    text.toLowerCase().includes(word.toLowerCase())
  );

  const hasLink = /https?:\/\/|www\./i.test(text);
  const hasUrgency = /عاجل|فوراً|فورا|الآن|حالاً|حالًا/i.test(text);
  const asksForData = /كلمة المرور|رقم البطاقة|رمز التحقق|بياناتك البنكية/i.test(text);

  let reasons = [];

  if (found.length > 0) {
    reasons.push("ظهرت عبارات تستحق الانتباه: " + found.join("، "));
  }

  if (hasLink) {
    reasons.push("يحتوي النص على رابط؛ تحقق من النطاق قبل فتحه.");
  }

  if (hasUrgency) {
    reasons.push("توجد صياغة تستعجل اتخاذ القرار.");
  }

  if (asksForData) {
    reasons.push("النص يطلب بيانات حساسة أو معلومات حساب.");
  }

  return {
    found,
    hasLink,
    hasUrgency,
    asksForData,
    reasons
  };
}

// إظهار النتيجة
function showResult(type, title, message, reasons = []) {
  scanResult.className = "result " + type;

  let list = "";

  if (reasons.length) {
    list = `
      <ul style="padding-right:20px;margin-top:10px">
        ${reasons.map(reason => `<li>${escapeHTML(reason)}</li>`).join("")}
      </ul>
    `;
  }

  scanResult.innerHTML = `
    <strong>${title}</strong>
    <p>${message}</p>
    ${list}
    <p style="margin-top:12px;font-size:12px">
      هذه نتيجة إرشادية وليست حكمًا أمنيًا نهائيًا.
    </p>
  `;
}

// منع عرض النص المدخل كـ HTML
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

// فحص الرابط بشكل مبدئي
function checkLink(text) {
  const match = text.match(/https?:\/\/[^\s]+|www\.[^\s]+/i);

  if (!match) {
    showResult(
      "info",
      "لم يتم العثور على رابط",
      "تأكد من لصق رابط كامل يبدأ بـ https:// أو www."
    );
    return;
  }

  let url;

  try {
    url = new URL(
      match[0].startsWith("www.") ? "https://" + match[0] : match[0]
    );
  } catch {
    showResult(
      "warning",
      "تعذر قراءة الرابط",
      "صيغة الرابط غير واضحة. لا تفتحه قبل التأكد من مصدره."
    );
    return;
  }

  const host = url.hostname.toLowerCase();
  const suspiciousPatterns = [
    /@/,
    /xn--/,
    /\d+\.\d+\.\d+\.\d+/,
    /secure.*login/,
    /login.*verify/,
    /account.*update/
  ];

  const found = suspiciousPatterns.some(pattern => pattern.test(host + url.pathname));

  const reasons = [];

  if (url.protocol !== "https:") {
    reasons.push("الرابط لا يستخدم اتصال HTTPS.");
  }

  if (host.startsWith("xn--") || host.includes("xn--")) {
    reasons.push("اسم النطاق يستخدم ترميزًا يستحق التحقق.");
  }

  if (/@/.test(match[0])) {
    reasons.push("يحتوي الرابط على علامة قد تُستخدم لإخفاء الوجهة.");
  }

  if (found && reasons.length === 0) {
    reasons.push("توجد خصائص في الرابط تستحق المراجعة.");
  }

  if (reasons.length) {
    showResult(
      "warning",
      "انتبه قبل فتح الرابط",
      "ظهرت مؤشرات تستدعي التحقق من الرابط عبر مصدر موثوق.",
      reasons
    );
  } else {
    showResult(
      "info",
      "لم تظهر مؤشرات واضحة في الفحص المبدئي",
      "هذا لا يعني أن الرابط آمن. تحقق من اسم النطاق والجهة المالكة له عبر قناة رسمية."
    );
  }
}

// زر التحليل
analyzeBtn.addEventListener("click", () => {
  const text = scanInput.value.trim();

  if (!text) {
    showResult(
      "info",
      "لم تدخلي أي محتوى بعد",
      "اكتبي رسالة أو الصقي رابطًا أولًا."
    );
    scanInput.focus();
    return;
  }

  if (currentMode === "link") {
    checkLink(text);
    return;
  }

  if (currentMode === "content") {
    showResult(
      "info",
      "خطوات التحقق من المحتوى",
      "لا يمكن إثبات صحة الخبر من النص وحده. راجعي مصدره الأصلي وتاريخه، وابحثي عن تأكيد من جهات موثوقة.",
      [
        "تحققي من الجهة الناشرة.",
        "ابحثي عن المصدر الأصلي للمعلومة.",
        "قارني الخبر بمصادر مستقلة.",
        "تحققي من تاريخ الصورة أو الخبر وسياقه."
      ]
    );
    return;
  }

  const result = analyzeMessage(text);

  if (result.reasons.length > 0) {
    showResult(
      "warning",
      "ظهرت مؤشرات تستحق الانتباه",
      "وجد التحليل التجريبي بعض العلامات التي تستدعي الحذر والتحقق.",
      result.reasons
    );
  } else {
    showResult(
      "info",
      "لم تظهر مؤشرات واضحة",
      "لم يجد الفحص التجريبي العبارات التي يبحث عنها، لكن هذا لا يثبت أن الرسالة موثوقة."
    );
  }
});

// زر العودة إلى أعلى الصفحة
const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {
  topBtn.classList.toggle("show", window.scrollY > 350);
});

topBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// تحديث رابط القسم النشط
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav a");

window.addEventListener("scroll", () => {
  let current = "home";

  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 150) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === "#" + current
    );
  });
});
