
// ظهور العناصر تدريجيًا عند التمرير
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  revealElements.forEach(element => observer.observe(element));
} else {
  revealElements.forEach(element => element.classList.add("visible"));
}


// تفاصيل الخدمات
const serviceDetails = {
  phishing: {
    title: "كشف التصيّد الإلكتروني",
    text: "التصيّد الإلكتروني أسلوب احتيالي يحاول من خلاله المهاجم خداع المستخدم للحصول على بياناته أو دفعه إلى اتخاذ إجراء غير آمن.",
    list: [
      "تحقق من عنوان المرسل قبل التفاعل.",
      "انتبه للرسائل التي تستخدم التهديد أو الاستعجال.",
      "لا تشارك كلمات المرور أو رموز التحقق.",
      "افتح المواقع الرسمية بنفسك بدل الضغط على روابط مجهولة."
    ]
  },

  privacy: {
    title: "حماية الخصوصية الرقمية",
    text: "معلوماتك الشخصية جزء من هويتك الرقمية، وحمايتها تبدأ من طريقة مشاركتها وإعدادات حساباتك.",
    list: [
      "استخدم كلمات مرور قوية وفريدة.",
      "فعّل المصادقة متعددة العوامل عند توفرها.",
      "راجع أذونات التطبيقات.",
      "تجنب مشاركة بياناتك الخاصة في المواقع غير الموثوقة."
    ]
  },

  news: {
    title: "التحقق من الأخبار والمعلومات",
    text: "قد تنتشر معلومات غير دقيقة بسرعة، لذلك من المهم التحقق من مصدر الخبر وسياقه قبل تصديقه أو مشاركته.",
    list: [
      "ابحث عن الخبر في مصدر رسمي.",
      "تحقق من تاريخ النشر.",
      "قارن الخبر مع أكثر من مصدر موثوق.",
      "لا تعتمد على العناوين المثيرة وحدها."
    ]
  },

  safety: {
    title: "التصرف الآمن عند الاشتباه",
    text: "عندما تواجه رسالة أو رابطًا مريبًا، فإن التوقف والتحقق وطلب المساعدة من جهة موثوقة خطوات مهمة.",
    list: [
      "لا تتفاعل مع الرابط أو المرسل المشبوه.",
      "لا ترسل معلومات إضافية.",
      "احتفظ بالمعلومات اللازمة لتوضيح الموقف دون إعادة نشرها.",
      "اطلب المساعدة من شخص موثوق أو الجهة المختصة."
    ]
  },

  law: {
    title: "مكافحة الجرائم المعلوماتية",
    text: "تسهم الأنظمة في حماية الأفراد والمجتمع من إساءة استخدام التقنية، ومن المهم معرفة الحقوق والمسؤوليات الرقمية.",
    list: [
      "احترم خصوصية الآخرين وبياناتهم.",
      "لا تستخدم التقنية للإساءة أو التهديد أو الاحتيال.",
      "اطلع على نظام مكافحة جرائم المعلوماتية من المصدر الرسمي.",
      "ارجع للجهات المختصة عند الحاجة."
    ]
  }
};

const serviceCards = document.querySelectorAll(".service-card");
const serviceDetail = document.getElementById("serviceDetail");
const detailTitle = document.getElementById("detailTitle");
const detailText = document.getElementById("detailText");
const detailList = document.getElementById("detailList");
const closeDetail = document.getElementById("closeDetail");

serviceCards.forEach(card => {
  card.addEventListener("click", () => {
    const key = card.dataset.service;
    const details = serviceDetails[key];

    if (!details) return;

    const isAlreadyOpen =
      card.classList.contains("selected") && !serviceDetail.hidden;

    serviceCards.forEach(item => item.classList.remove("selected"));

    if (isAlreadyOpen) {
      serviceDetail.hidden = true;
      return;
    }

    card.classList.add("selected");
    detailTitle.textContent = details.title;
    detailText.textContent = details.text;
    detailList.innerHTML = "";

    details.list.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      detailList.appendChild(li);
    });

    serviceDetail.hidden = false;
    serviceDetail.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  });
});

if (closeDetail) {
  closeDetail.addEventListener("click", () => {
    serviceDetail.hidden = true;
    serviceCards.forEach(item => item.classList.remove("selected"));
  });
}


// أداة فحص المحتوى
let currentTab = "message";

const scanInput = document.getElementById("scanInput");
const scanLabel = document.getElementById("scanLabel");
const scanButton = document.getElementById("scanButton");
const scanResult = document.getElementById("scanResult");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");
const resultList = document.getElementById("resultList");

const tabLabels = {
  message: {
    label: "أدخل الرسالة هنا",
    placeholder: "الصق الرسالة التي تريد فحصها..."
  },
  link: {
    label: "أدخل الرابط هنا",
    placeholder: "https://example.com"
  },
  content: {
    label: "أدخل الخبر أو النص هنا",
    placeholder: "الصق الخبر أو المعلومة التي تريد التحقق منها..."
  }
};

document.querySelectorAll(".scanner-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    currentTab = tab.dataset.tab;

    document.querySelectorAll(".scanner-tab").forEach(item => {
      item.classList.remove("active");
    });

    tab.classList.add("active");

    scanLabel.textContent = tabLabels[currentTab].label;
    scanInput.placeholder = tabLabels[currentTab].placeholder;
    scanInput.value = "";
    scanResult.hidden = true;
  });
});

function showResult(title, text, items) {
  resultTitle.textContent = title;
  resultText.textContent = text;
  resultList.innerHTML = "";

  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    resultList.appendChild(li);
  });

  scanResult.hidden = false;
}

function inspectMessage(value) {
  const indicators = [];

  const patterns = [
    {
      regex: /عاجل|فوراً|خلال دقائق|خلال ساعات|بسرعة|آخر فرصة|سيتم إغلاق/i,
      text: "استخدام الاستعجال أو التهديد لدفعك إلى التصرف بسرعة."
    },
    {
      regex: /رمز التحقق|كلمة المرور|بياناتك البنكية|رقم البطاقة|الرقم السري/i,
      text: "طلب معلومات حساسة أو بيانات خاصة."
    },
    {
      regex: /مبروك|ربحت|جائزة|هدية مجانية|سحب/i,
      text: "وعد بجائزة أو مكافأة قد يكون وسيلة للإغراء."
    },
    {
      regex: /اضغط هنا|انقر هنا|تسجيل الدخول|تحديث بياناتك/i,
      text: "دعوة لاتخاذ إجراء أو فتح رابط."
    },
    {
      regex: /https?:\/\/|www\./i,
      text: "تحتوي الرسالة على رابط يستحق التحقق قبل فتحه."
    }
  ];

  patterns.forEach(pattern => {
    if (pattern.regex.test(value)) {
      indicators.push(pattern.text);
    }
  });

  if (indicators.length > 0) {
    showResult(
      "تم رصد مؤشرات تستحق الانتباه",
      "ظهرت بعض الأنماط التي قد تستخدم في الرسائل الاحتيالية. لا تتخذ أي إجراء قبل التحقق من المصدر.",
      indicators
    );
  } else {
    showResult(
      "لم تظهر مؤشرات واضحة في الفحص المبدئي",
      "هذا لا يعني أن الرسالة آمنة؛ فقد تحتوي على أساليب لا يستطيع هذا الفحص البسيط اكتشافها.",
      [
        "تحقق من هوية المرسل.",
        "لا تشارك رموز التحقق أو كلمات المرور.",
        "تأكد من أي طلب عبر القنوات الرسمية."
      ]
    );
  }
}

function inspectLink(value) {
  const indicators = [];

  try {
    const url = new URL(value);

    if (url.protocol !== "https:") {
      indicators.push("الرابط لا يستخدم اتصال HTTPS المشفر.");
    }

    if (url.username || url.password) {
      indicators.push("يحتوي عنوان الرابط على بيانات دخول مضمّنة.");
    }

    if (url.hostname.startsWith("xn--")) {
      indicators.push("اسم النطاق يستخدم ترميزًا قد يخفي شكل الحروف.");
    }

    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(url.hostname)) {
      indicators.push("الرابط يستخدم عنوان IP بدل اسم نطاق مألوف.");
    }

    if (url.hostname.length > 60) {
      indicators.push("اسم النطاق طويل بشكل يستحق التحقق.");
    }

    if (indicators.length > 0) {
      showResult(
        "توجد مؤشرات تستحق التحقق",
        "لاحظ الفحص بعض الخصائص في الرابط. لا تفتح الرابط لمجرد أن الفحص تعرف عليها.",
        indicators
      );
    } else {
      showResult(
        "لم تظهر مؤشرات تقنية واضحة",
        "لم يكتشف الفحص خصائص مريبة من القواعد البسيطة المستخدمة، لكن هذا لا يثبت أن الموقع موثوق.",
        [
          "تحقق من اسم النطاق حرفًا بحرف.",
          "ابحث عن الموقع من خلال مصدر رسمي.",
          "لا تدخل بياناتك الشخصية إلا بعد التأكد."
        ]
      );
    }
  } catch {
    showResult(
      "صيغة الرابط غير مكتملة أو غير صحيحة",
      "تأكد من إدخال رابط كامل يبدأ بـ https:// أو http://.",
      [
        "راجع كتابة الرابط.",
        "لا تفتح الروابط المختصرة أو المجهولة قبل التحقق منها."
      ]
    );
  }
}

function inspectContent(value) {
  const indicators = [];

  const patterns = [
    {
      regex: /عاجل|انشر قبل الحذف|انشر تؤجر|لا تخبر أحداً|مصدر خاص/i,
      text: "عبارات تحاول دفع القارئ إلى النشر أو إثارة الانفعال."
    },
    {
      regex: /الجميع|دائماً|أبداً|مؤكد 100%|بلا شك/i,
      text: "تعميمات أو تأكيدات مطلقة تحتاج إلى دليل."
    },
    {
      regex: /يقولون|تداولت حسابات|مصادر غير مؤكدة|وصلني/i,
      text: "المصدر غير واضح أو غير محدد."
    }
  ];

  patterns.forEach(pattern => {
    if (pattern.regex.test(value)) {
      indicators.push(pattern.text);
    }
  });

  if (indicators.length > 0) {
    showResult(
      "هناك مؤشرات تستدعي التحقق",
      "قد يحتوي النص على صياغات تجعل التحقق من مصدره أمرًا مهمًا.",
      indicators.concat([
        "ابحث عن أصل الخبر وتاريخ نشره.",
        "قارن المعلومات بمصدر رسمي.",
        "لا تعِد نشر الخبر قبل التأكد."
      ])
    );
  } else {
    showResult(
      "لا توجد مؤشرات واضحة ضمن القواعد المستخدمة",
      "لا يمكن لهذا الفحص تحديد صحة الخبر أو كذبه بشكل تلقائي.",
      [
        "تحقق من الجهة الناشرة.",
        "ابحث عن أدلة مستقلة.",
        "راجع التاريخ والسياق."
      ]
    );
  }
}

if (scanButton) {
  scanButton.addEventListener("click", () => {
    const value = scanInput.value.trim();

    if (!value) {
      showResult(
        "أدخل المحتوى أولًا",
        "اكتب رسالة أو رابطًا أو نصًا حتى نتمكن من فحصه.",
        []
      );
      return;
    }

    if (currentTab === "message") {
      inspectMessage(value);
    } else if (currentTab === "link") {
      inspectLink(value);
    } else {
      inspectContent(value);
    }
  });
}


// نموذج التواصل
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    if (!name || !email || !message) return;

    const subject = encodeURIComponent("رسالة من موقع وَعْي");
    const body = encodeURIComponent(
      `الاسم: ${name}\nالبريد الإلكتروني: ${email}\n\nالرسالة:\n${message}`
    );

    window.location.href =
      `mailto:galmudhi@gmail.com?subject=${subject}&body=${body}`;
  });
}


// زر العودة للأعلى
const backToTop = document.getElementById("backToTop");

if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 450);
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}
