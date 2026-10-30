-- Sudan via Weslat International (quote: from their Omdurman branch; first 2 kg 37,500 SDG
-- + 4,500 per extra kg; one jar is well under 2 kg). Customers pay first on WhatsApp.
update public.markets set
  delivery_options = '[{"key":"omdurman","name_en":"Inside Omdurman","name_ar":"داخل أم درمان","fee":20000},
                       {"key":"port_sudan","name_en":"Port Sudan","name_ar":"بورتسودان","fee":39000},
                       {"key":"kassala","name_en":"Kassala","name_ar":"كسلا","fee":39000},
                       {"key":"atbara","name_en":"Atbara","name_ar":"عطبرة","fee":39000},
                       {"key":"madani","name_en":"Wad Madani","name_ar":"ود مدني","fee":39000}]'::jsonb,
  whatsapp = '249901951971', pay_cod = false, pay_bank = true
where code = 'SD';
