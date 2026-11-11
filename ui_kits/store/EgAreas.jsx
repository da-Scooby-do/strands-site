/* Egypt areas for checkout, from Flextock's bulk-import template (Geography sheet).
   Keyed by our governorate names (window.EG_GOVERNORATES). Each area is
   [Flextock's exact area name — what the order saves and sends, Arabic label].
   FLEXTOCK_CITY maps our governorate name to Flextock's city name where they differ. */
window.EG_FLEXTOCK_CITY = {
  Qalyubia: "El Kalioubia", Beheira: "Behira", "Kafr El Sheikh": "Kafr Alsheikh", Faiyum: "Fayoum",
  "Beni Suef": "Bani Suif", Minya: "Menya", Asyut: "Assuit",
};
window.EG_AREAS = {
  Cairo: [
    ["15th of May", "مدينة 15 مايو"], ["Abdeen", "عابدين"], ["Al-Azbakeya", "الأزبكية"], ["Al-Basatin", "البساتين"],
    ["Al-Gamaliya", "الجمالية"], ["Al-Marg", "المرج"], ["Al-Matareya", "المطرية"], ["AL Mokattam", "المقطم"],
    ["Al-Nozha", "النزهة"], ["Al-Sayeda Zainab", "السيدة زينب"], ["Al-Sharabiya", "الشرابية"], ["Al-Shorouk", "الشروق"],
    ["Al-Tahrir", "التحرير"], ["Al-Tibbin", "التبين"], ["Al-Zawya Al-Hamra", "الزاوية الحمراء"], ["Azhar", "الأزهر"],
    ["Bab Al-Sharia", "باب الشعرية"], ["Badr City", "مدينة بدر"], ["Boulak Abo Al-Eila", "بولاق أبو العلا"], ["Daher", "الظاهر"],
    ["Ein Shams", "عين شمس"], ["EL Rehab", "الرحاب"], ["Elsahel", "الساحل"], ["Garden City", "جاردن سيتي"],
    ["Hadaiq Al-Qobbah", "حدائق القبة"], ["Heliopolis", "مصر الجديدة"], ["Helwan", "حلوان"], ["Maadi", "المعادي"],
    ["Madinaty", "مدينتي"], ["Manial Al Rodah", "منيل الروضة"], ["Minshat Nasir", "منشأة ناصر"], ["Misr Al-Qadimah", "مصر القديمة"],
    ["Nasr City", "مدينة نصر"], ["New Cairo", "القاهرة الجديدة"], ["New Capital", "العاصمة الإدارية"], ["Qasr Al-Nile", "قصر النيل"],
    ["Qism Al-Khalifa", "قسم الخليفة"], ["Rod Al-Farag", "روض الفرج"], ["Sheraton", "شيراتون"], ["Shubra", "شبرا"],
    ["Tura", "طرة"], ["Zamalek", "الزمالك"], ["Zeitoun", "الزيتون"], ["Al-Darb Al-Ahmar", "الدرب الأحمر"],
    ["Al-Khalifa", "الخليفة"], ["Al-Salam First", "السلام أول"], ["Al-Waili", "الوايلي"], ["Dar El Salam", "دار السلام"],
    ["Abbaseya", "العباسية"], ["Second New Cairo", "القاهرة الجديدة الثانية"], ["Gesr El Suez", "جسر السويس"],
  ],
  Giza: [
    ["6th of October City", "مدينة 6 أكتوبر"], ["Abo Al-Numros", "أبو النمرس"], ["Agouza", "العجوزة"], ["Al-Ayat", "العياط"],
    ["Al-Badrashein", "البدرشين"], ["Al Bahr Al Aazam", "البحر الأعظم"], ["Al-Hawamdeyah", "الحوامدية"], ["Al-Manawat", "المناوات"],
    ["Al-Munib", "المنيب"], ["Al-Omraniya", "العمرانية"], ["Al-Saf", "الصف"], ["Al-Wahat Al-Baharia", "الواحات البحرية"],
    ["Al-Warraq", "الوراق"], ["Atfih", "أطفيح"], ["Awsim", "أوسيم"], ["Bolak Al-Dakrour", "بولاق الدكرور"],
    ["Dokki", "الدقي"], ["Faisal", "فيصل"], ["Gazirat Al-Dahab", "جزيرة الدهب"], ["Hadayek Al Ahram", "حدائق الأهرام"],
    ["Imbaba", "إمبابة"], ["Manil Shihah", "منيل شيحة"], ["Mit Qadous", "ميت قادوس"], ["Mit Shammas", "ميت شماس"],
    ["Mohandseen", "المهندسين"], ["Nazlet Al-Ashtar", "نزلة الأشطر"], ["Pyramids", "الهرم"], ["Saft Al-Laban", "صفط اللبن"],
    ["Saqiyet Mekki", "ساقية مكي"], ["Sheikh Zayed City", "الشيخ زايد"], ["Smart Village / Alex Desert Rd", "القرية الذكية / طريق مصر إسكندرية الصحراوي"], ["Tamwah", "طموه"],
    ["EL Khamayel", "الخمائل"], ["Hadayek October", "حدائق أكتوبر"], ["Manshiyat al-Qanater", "منشأة القناطر"], ["Saqqara and Shubramant", "سقارة وشبرامنت"],
    ["Motamiez and Garb Somid", "المتميز وغرب سوميد"], ["Al Manashi", "المناشي"], ["Kerdasa", "كرداسة"],
  ],
  Alexandria: [
    ["Al-Amaria First", "العامرية أول"], ["Al-Daerah Al-Gomrokeyah", "الدائرة الجمركية"], ["Al-Gomrok", "الجمرك"], ["Dekhela", "الدخيلة"],
    ["Karmouz", "كرموز"], ["King Maryout", "كينج مريوط"], ["Qesm Al-Attarin", "العطارين"], ["Qesm Bab Sharqi", "باب شرقي"],
    ["Qesm Borg Al-Arab", "برج العرب"], ["Qetaa Al-Tarik Al-Sahrawi", "قطاع الطريق الصحراوي"], ["Qism Al-Labban", "اللبان"], ["Qism Al-Mansheya", "المنشية"],
    ["Qism Al-Montaza", "المنتزه"], ["Qism Al-Raml 1", "الرمل أول"], ["Qism Al-Raml 2", "الرمل ثان"], ["Qism Mina Al-Basal", "مينا البصل"],
    ["Qism Moharram Bek", "محرم بك"], ["Qism Sidi Gabir", "سيدي جابر"],
  ],
  Qalyubia: [
    ["Shoubra El Kheima", "شبرا الخيمة"], ["Al-Khankah", "الخانكة"], ["Al-Obour City", "مدينة العبور"], ["Al-Qanater Al-Khayreyah", "القناطر الخيرية"],
    ["Benha", "بنها"], ["Kafr Shokr", "كفر شكر"], ["Qalyoub", "قليوب"], ["Shibin Al-Qanater", "شبين القناطر"], ["Toukh", "طوخ"],
  ],
  Sharqia: [
    ["10th of Ramadan City", "مدينة العاشر من رمضان"], ["Abo Hammad", "أبو حماد"], ["Abo Kebir", "أبو كبير"], ["Al-Husseiniya", "الحسينية"],
    ["Al-Ibrahimiya", "الإبراهيمية"], ["Al-Qanayat", "القنايات"], ["Al-Qurayn", "القرين"], ["Awlad Saqr", "أولاد صقر"],
    ["Bilbeis", "بلبيس"], ["Diyarb Negm", "ديرب نجم"], ["Faqous", "فاقوس"], ["Hihya", "ههيا"],
    ["Kafr Saqr", "كفر صقر"], ["Mashtool Al-Souk", "مشتول السوق"], ["Minya Al-Qamh", "منيا القمح"], ["Zakazik", "الزقازيق"],
  ],
  Dakahlia: [
    ["Aga", "أجا"], ["Al-Mansourah", "المنصورة"], ["Al-Manzalah", "المنزلة"], ["Al-Senbellawein", "السنبلاوين"],
    ["Belkas", "بلقاس"], ["Dekernes", "دكرنس"], ["Menyet Al-Nasr", "منية النصر"], ["Mit Ghamr", "ميت غمر"],
    ["Sherbeen", "شربين"], ["Talkha", "طلخا"], ["Tamai El-Amadid", "تمي الأمديد"],
  ],
  Gharbia: [
    ["Al-Mahala Al-Kobra", "المحلة الكبرى"], ["Al-Santah", "السنطة"], ["Basioun", "بسيون"], ["Kafr Al-Zayat", "كفر الزيات"],
    ["Qotour", "قطور"], ["Samannoud", "سمنود"], ["Tanta", "طنطا"], ["Zefta", "زفتى"],
  ],
  Monufia: [
    ["Al-Bagour", "الباجور"], ["Al-Sadat City", "مدينة السادات"], ["Ashmoun", "أشمون"], ["Birket Al-Sab", "بركة السبع"],
    ["Menouf City", "منوف"], ["Quweisna", "قويسنا"], ["Shebeen Al-Kom", "شبين الكوم"], ["Shuhada", "الشهداء"], ["Tala", "تلا"],
  ],
  Beheira: [
    ["Al-Mahmmoudeya", "المحمودية"], ["Al-Natron Valley", "وادي النطرون"], ["Cairo Alex Desert RD", "طريق مصر إسكندرية الصحراوي"], ["El Sadat", "السادات"],
    ["Gharb Al-Noubareya", "غرب النوبارية"], ["Markaz Abo Al-Matamir", "أبو المطامير"], ["Markaz Abo Humus", "أبو حمص"], ["Markaz Al-Delingat", "الدلنجات"],
    ["Markaz Al-Rahmaneyah", "الرحمانية"], ["Markaz Damanhour", "دمنهور"], ["Markaz Edko", "إدكو"], ["Markaz Housh Eissa", "حوش عيسى"],
    ["Markaz Itay Al-Baroud", "إيتاي البارود"], ["Markaz Kafr Al-Dawar", "كفر الدوار"], ["Markaz Kom Hamada", "كوم حمادة"], ["Markaz Shubrakhat", "شبراخيت"],
    ["Metobas", "مطوبس"], ["Rashid", "رشيد"],
  ],
  "Kafr El Sheikh": [
    ["Kafr Alsheikh", "كفر الشيخ"], ["Al-Burlos", "البرلس"], ["Al-Reyad", "الرياض"], ["Bila", "بيلا"], ["Desouk", "دسوق"],
    ["Fowah", "فوه"], ["l-Hamoul", "الحامول"], ["Qillin", "قلين"], ["Sidi Salem", "سيدي سالم"],
  ],
  Damietta: [
    ["Damietta", "دمياط"], ["Al-Zarqa", "الزرقا"], ["Damietta First", "دمياط أول"], ["Damietta second", "دمياط ثان"],
    ["Damietta Port", "ميناء دمياط"], ["Dumyat", "مركز دمياط"], ["Faraskour", "فارسكور"], ["Kafr Saad", "كفر سعد"],
    ["New Damietta City", "دمياط الجديدة"], ["Ras al-Bar", "رأس البر"],
  ],
  "Port Said": [
    ["Al-Manasrah", "المناصرة"], ["Port Fouad", "بورفؤاد"], ["Qesm Al-Dawahi", "الضواحي"], ["Qesm Al-Manakh", "المناخ"],
    ["Qesm Al-Sharq", "الشرق"], ["Qesm Awal Al-Ganoub", "الجنوب أول"], ["Qesm Than Al-Ganoub", "الجنوب ثان"], ["Qism Al-Arab", "العرب"],
    ["Qism Al-Zohour", "الزهور"], ["Sharq Al-Tafriah", "شرق التفريعة"],
  ],
  Ismailia: [
    ["Isamilia center", "مركز الإسماعيلية"], ["Ismailia First", "الإسماعيلية أول"], ["Ismailia Second", "الإسماعيلية ثان"], ["Ismailia Third", "الإسماعيلية ثالث"],
    ["Al-Qantarah Gharb", "القنطرة غرب"], ["Al-Qantarah Sharq", "القنطرة شرق"], ["Al-Tall Al-Kabir", "التل الكبير"], ["Fayed", "فايد"],
    ["Outside Ismailia", "خارج الإسماعيلية"],
  ],
  Suez: [
    ["Al-Galalah", "الجلالة"], ["Arbeen", "الأربعين"], ["Ataqa", "عتاقة"], ["Faysal", "فيصل"], ["Port Tawfik", "بور توفيق"], ["Rudeis", "رديس"],
  ],
  Faiyum: [
    ["Fayoum", "الفيوم"], ["Al-Fayoum Al-Gadida City", "الفيوم الجديدة"], ["Atsa", "إطسا"], ["Ebsheway", "إبشواي"],
    ["Sinnuris", "سنورس"], ["Tamya", "طامية"], ["Yousef Elsedeq", "يوسف الصديق"],
  ],
  "Beni Suef": [
    ["Beni Suef", "بني سويف"], ["Beni Suef center", "مركز بني سويف"], ["New Beni Suef", "بني سويف الجديدة"], ["Biba", "ببا"],
    ["Elfashn", "الفشن"], ["Elwasty", "الواسطى"], ["Ihnasya", "إهناسيا"], ["Nasser", "ناصر"],
  ],
  Minya: [
    ["Al-Minya", "المنيا"], ["New Minya", "المنيا الجديدة"], ["Abo Kerkas", "أبو قرقاص"], ["Bani Mazar", "بني مزار"],
    ["Der Mwas", "دير مواس"], ["Eladwa", "العدوة"], ["Maghagha", "مغاغة"], ["Mallawi", "ملوي"], ["Metay", "مطاي"], ["Samalout", "سمالوط"],
  ],
  Asyut: [
    ["Asyut", "أسيوط"], ["Asyut First", "أسيوط أول"], ["Asyut Second", "أسيوط ثان"], ["New Assuit", "أسيوط الجديدة"],
    ["Abanoub", "أبنوب"], ["Abo Teg", "أبو تيج"], ["Elbadary", "البداري"], ["Elfath", "الفتح"], ["Elghanaym", "الغنايم"],
    ["ElQawsaia", "القوصية"], ["Manfalout", "منفلوط"], ["Sadfa", "صدفا"], ["Sahil Silim", "ساحل سليم"],
  ],
  Sohag: [
    ["Sohag", "سوهاج"], ["Sohag First", "سوهاج أول"], ["Sohag Second", "سوهاج ثان"], ["New Sohag City", "سوهاج الجديدة"],
    ["Al-Osirat", "العسيرات"], ["Dar al-Salam", "دار السلام"], ["Elbalina", "البلينا"], ["Elmanshaa'a", "المنشأة"],
    ["Girga", "جرجا"], ["Juhaynah", "جهينة"], ["Markaz Akhmim", "أخميم"], ["Markaz Al-Maraghah", "المراغة"],
    ["Saqultah", "ساقلتة"], ["Tahta City", "طهطا"], ["Tama", "طما"],
  ],
  Qena: [
    ["Qena", "قنا"], ["Qena City", "مدينة قنا"], ["Qena Al-Gadida City", "قنا الجديدة"], ["Abo Tesht", "أبو تشت"],
    ["Arment", "أرمنت"], ["Deshna", "دشنا"], ["Elwagf", "الوقف"], ["Esna", "إسنا"], ["Farshot", "فرشوط"],
    ["Nagaa Hammadi", "نجع حمادي"], ["Naqadah", "نقادة"], ["Qeft", "قفط"], ["Qos", "قوص"],
  ],
  Luxor: [
    ["Luxor", "الأقصر"], ["Elbyadia", "البياضية"], ["Elqarna", "القرنة"], ["Eltod", "الطود"], ["Elzenia", "الزينية"], ["Tiba", "طيبة"],
  ],
  Aswan: [
    ["Aswan Center", "مركز أسوان"], ["Qesm Aswan", "قسم أسوان"], ["Abo Simbel", "أبو سمبل"], ["Daraw", "دراو"],
    ["Edfu", "إدفو"], ["Kom Ombo", "كوم أمبو"], ["Kom Ombo Desert", "صحراوي كوم أمبو"],
  ],
  "Red Sea": [
    ["Hurghada First", "الغردقة أول"], ["Hurghada Second", "الغردقة ثان"], ["Al-Qoseir", "القصير"], ["Marsa Alam", "مرسى علم"],
    ["Ras Gharib", "رأس غارب"], ["Safaga", "سفاجا"], ["Shalateen", "الشلاتين"],
  ],
  "New Valley": [
    ["Al-Kharga Oasis", "الخارجة"], ["A-Dakhla Oasis", "الداخلة"], ["Al Farafra Oasis", "الفرافرة"], ["Paris Paris", "باريس"],
  ],
  Matrouh: [
    ["Marsa Matrouh", "مرسى مطروح"], ["Al-Alamein", "العلمين"], ["Al-Dabaa", "الضبعة"], ["Al-Hamam", "الحمام"],
    ["Al-Negaila", "النجيلة"], ["Ras Al-hekma", "رأس الحكمة"],
  ],
  "North Sinai": [["Al-Arish", "العريش"]],
  "South Sinai": [["Sharm Sheikh", "شرم الشيخ"], ["Abu Rudeis", "أبو رديس"], ["Ras Sidr", "رأس سدر"]],
};
