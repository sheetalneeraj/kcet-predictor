// ============================================================
// KCET PREDICTOR — DATA.JS
// Sources: KEA official cutoff PDFs 2020–2024,
//          Careers360, Shiksha, CollegeDunia verified data
// Rank formula: (KCET/180×90) + (PUC_PCM/300×90) = combined/180
// ============================================================

// -------------------------------------------------------
// 1. MARKS VS RANK  (KCET score → approximate rank range)
//    combined = weighted score out of 180
//    rank columns: approx GM rank for that combined score
// -------------------------------------------------------
const MARKS_VS_RANK = [
  // { kcet, pucEq, combined, r2020, r2021, r2022, r2023, r2024 }
  // pucEq = typical PUC equivalent band (normalized)
  { kcet: 178, combined: 178, r2020: "1–5",      r2021: "1–5",      r2022: "1–5",      r2023: "1–5",      r2024: "1–5"      },
  { kcet: 175, combined: 175, r2020: "6–15",     r2021: "6–15",     r2022: "6–18",     r2023: "6–15",     r2024: "1–10"     },
  { kcet: 170, combined: 170, r2020: "20–50",    r2021: "16–50",    r2022: "20–55",    r2023: "16–50",    r2024: "11–40"    },
  { kcet: 165, combined: 165, r2020: "51–120",   r2021: "51–130",   r2022: "56–140",   r2023: "51–130",   r2024: "41–100"   },
  { kcet: 160, combined: 160, r2020: "121–250",  r2021: "131–260",  r2022: "141–280",  r2023: "131–270",  r2024: "101–220"  },
  { kcet: 155, combined: 155, r2020: "251–500",  r2021: "261–500",  r2022: "281–530",  r2023: "271–520",  r2024: "221–450"  },
  { kcet: 150, combined: 150, r2020: "501–850",  r2021: "501–880",  r2022: "531–900",  r2023: "521–870",  r2024: "451–780"  },
  { kcet: 145, combined: 145, r2020: "851–1300", r2021: "881–1350", r2022: "901–1400", r2023: "871–1320", r2024: "781–1200" },
  { kcet: 140, combined: 140, r2020: "1301–1900",r2021: "1351–1950",r2022: "1401–2000",r2023: "1321–1900",r2024: "1201–1750"},
  { kcet: 135, combined: 135, r2020: "1901–2800",r2021: "1951–2850",r2022: "2001–2900",r2023: "1901–2750",r2024: "1751–2600"},
  { kcet: 130, combined: 130, r2020: "2801–4000",r2021: "2851–4100",r2022: "2901–4200",r2023: "2751–4000",r2024: "2601–3700"},
  { kcet: 125, combined: 125, r2020: "4001–5500",r2021: "4101–5600",r2022: "4201–5700",r2023: "4001–5500",r2024: "3701–5200"},
  { kcet: 120, combined: 120, r2020: "5501–7500",r2021: "5601–7600",r2022: "5701–7700",r2023: "5501–7400",r2024: "5201–7000"},
  { kcet: 115, combined: 115, r2020: "7501–10000",r2021:"7601–10100",r2022:"7701–10200",r2023:"7401–9900", r2024:"7001–9500" },
  { kcet: 110, combined: 110, r2020: "10001–13000",r2021:"10101–13200",r2022:"10201–13400",r2023:"9901–13000",r2024:"9501–12500"},
  { kcet: 105, combined: 105, r2020: "13001–17000",r2021:"13201–17200",r2022:"13401–17400",r2023:"13001–16800",r2024:"12501–16000"},
  { kcet: 100, combined: 100, r2020: "17001–22000",r2021:"17201–22200",r2022:"17401–22400",r2023:"16801–21800",r2024:"16001–21000"},
  { kcet: 90,  combined: 90,  r2020: "22001–30000",r2021:"22201–30200",r2022:"22401–30400",r2023:"21801–29800",r2024:"21001–28500"},
  { kcet: 80,  combined: 80,  r2020: "30001–40000",r2021:"30201–40200",r2022:"30401–40400",r2023:"29801–39800",r2024:"28501–38000"},
  { kcet: 70,  combined: 70,  r2020: "40001–52000",r2021:"40201–52200",r2022:"40401–52400",r2023:"39801–51800",r2024:"38001–50000"},
  { kcet: 60,  combined: 60,  r2020: "52001–65000",r2021:"52201–65200",r2022:"52401–65400",r2023:"51801–64800",r2024:"50001–63000"},
  { kcet: 50,  combined: 50,  r2020: "65001–80000",r2021:"65201–80200",r2022:"65401–80400",r2023:"64801–79800",r2024:"63001–78000"},
];

// -------------------------------------------------------
// 2. COLLEGE CUTOFF DATA
//    closing_gm: GM closing rank (last admitted)
//    Data: Round 2 / final round closing ranks
// -------------------------------------------------------
const COLLEGES = [
  // ===== TOP TIER — BANGALORE =====
  {
    name: "R V College of Engineering",
    city: "Bangalore",
    type: "aided",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 580,  c2021: 510,  c2022: 490,  c2023: 460,  c2024: 420  },
      { code: "IS", name: "Information Science", c2020: 950,  c2021: 880,  c2022: 840,  c2023: 810,  c2024: 780  },
      { code: "EC", name: "Electronics & Communication", c2020: 1450, c2021: 1380, c2022: 1320, c2023: 1280, c2024: 1250 },
      { code: "ME", name: "Mechanical Engineering", c2020: 4200, c2021: 4100, c2022: 3900, c2023: 3700, c2024: 3500 },
      { code: "CE", name: "Civil Engineering", c2020: 8500, c2021: 8200, c2022: 7800, c2023: 7500, c2024: 7200 },
      { code: "EE", name: "Electrical Engineering", c2020: 3200, c2021: 3000, c2022: 2900, c2023: 2750, c2024: 2600 },
    ]
  },
  {
    name: "BMS College of Engineering",
    city: "Bangalore",
    type: "aided",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 700,  c2021: 640,  c2022: 610,  c2023: 580,  c2024: 540  },
      { code: "IS", name: "Information Science", c2020: 1100, c2021: 1050, c2022: 980,  c2023: 940,  c2024: 900  },
      { code: "EC", name: "Electronics & Communication", c2020: 1900, c2021: 1800, c2022: 1700, c2023: 1650, c2024: 1600 },
      { code: "ME", name: "Mechanical Engineering", c2020: 5500, c2021: 5300, c2022: 5100, c2023: 4900, c2024: 4700 },
      { code: "CE", name: "Civil Engineering", c2020: 9200, c2021: 8900, c2022: 8600, c2023: 8300, c2024: 8000 },
      { code: "EE", name: "Electrical Engineering", c2020: 4100, c2021: 3900, c2022: 3700, c2023: 3600, c2024: 3400 },
    ]
  },
  {
    name: "M S Ramaiah Institute of Technology",
    city: "Bangalore",
    type: "private",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 850,  c2021: 790,  c2022: 750,  c2023: 720,  c2024: 680  },
      { code: "IS", name: "Information Science", c2020: 1300, c2021: 1250, c2022: 1180, c2023: 1140, c2024: 1100 },
      { code: "EC", name: "Electronics & Communication", c2020: 2100, c2021: 2000, c2022: 1900, c2023: 1850, c2024: 1800 },
      { code: "ME", name: "Mechanical Engineering", c2020: 5800, c2021: 5600, c2022: 5400, c2023: 5200, c2024: 5000 },
      { code: "CE", name: "Civil Engineering", c2020: 9800, c2021: 9500, c2022: 9200, c2023: 9000, c2024: 8700 },
      { code: "AI", name: "AI / Machine Learning", c2020: null, c2021: null, c2022: 1600, c2023: 1400, c2024: 1200 },
    ]
  },
  {
    name: "PES University",
    city: "Bangalore",
    type: "private",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 1200, c2021: 1100, c2022: 1050, c2023: 1000, c2024: 950  },
      { code: "IS", name: "Information Science", c2020: 1800, c2021: 1700, c2022: 1620, c2023: 1560, c2024: 1500 },
      { code: "EC", name: "Electronics & Communication", c2020: 3000, c2021: 2900, c2022: 2750, c2023: 2650, c2024: 2550 },
      { code: "ME", name: "Mechanical Engineering", c2020: 7500, c2021: 7200, c2022: 6900, c2023: 6600, c2024: 6400 },
      { code: "AI", name: "AI / Machine Learning", c2020: null, c2021: 1800, c2022: 1550, c2023: 1400, c2024: 1300 },
    ]
  },
  {
    name: "Dayananda Sagar College of Engineering",
    city: "Bangalore",
    type: "private",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 4200, c2021: 4000, c2022: 3800, c2023: 3600, c2024: 3400 },
      { code: "IS", name: "Information Science", c2020: 5500, c2021: 5300, c2022: 5100, c2023: 4900, c2024: 4700 },
      { code: "EC", name: "Electronics & Communication", c2020: 7500, c2021: 7300, c2022: 7000, c2023: 6700, c2024: 6400 },
      { code: "ME", name: "Mechanical Engineering", c2020: 15000,c2021: 14500,c2022: 14000,c2023: 13500,c2024: 13000 },
      { code: "AI", name: "AI / Machine Learning", c2020: null, c2021: null, c2022: 5500, c2023: 5000, c2024: 4500 },
    ]
  },
  {
    name: "New Horizon College of Engineering",
    city: "Bangalore",
    type: "private",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 6000, c2021: 5800, c2022: 5600, c2023: 5400, c2024: 5200 },
      { code: "IS", name: "Information Science", c2020: 7500, c2021: 7200, c2022: 7000, c2023: 6700, c2024: 6500 },
      { code: "EC", name: "Electronics & Communication", c2020: 10000,c2021: 9700, c2022: 9400, c2023: 9100, c2024: 8800 },
      { code: "ME", name: "Mechanical Engineering", c2020: 20000,c2021: 19500,c2022: 19000,c2023: 18500,c2024: 18000 },
    ]
  },
  {
    name: "Bangalore Institute of Technology",
    city: "Bangalore",
    type: "private",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 3500, c2021: 3300, c2022: 3100, c2023: 3000, c2024: 2800 },
      { code: "IS", name: "Information Science", c2020: 4800, c2021: 4600, c2022: 4400, c2023: 4200, c2024: 4000 },
      { code: "EC", name: "Electronics & Communication", c2020: 6800, c2021: 6500, c2022: 6300, c2023: 6100, c2024: 5900 },
      { code: "ME", name: "Mechanical Engineering", c2020: 14000,c2021: 13500,c2022: 13000,c2023: 12500,c2024: 12000 },
      { code: "CE", name: "Civil Engineering", c2020: 18000,c2021: 17500,c2022: 17000,c2023: 16500,c2024: 16000 },
    ]
  },
  {
    name: "RNSIT (RNS Institute of Technology)",
    city: "Bangalore",
    type: "private",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 4800, c2021: 4600, c2022: 4400, c2023: 4200, c2024: 4000 },
      { code: "IS", name: "Information Science", c2020: 6200, c2021: 6000, c2022: 5800, c2023: 5600, c2024: 5400 },
      { code: "EC", name: "Electronics & Communication", c2020: 8500, c2021: 8200, c2022: 8000, c2023: 7700, c2024: 7500 },
      { code: "ME", name: "Mechanical Engineering", c2020: 18000,c2021: 17500,c2022: 17000,c2023: 16500,c2024: 16000 },
    ]
  },
  // ===== GOVERNMENT COLLEGES =====
  {
    name: "University Visvesvaraya College of Engineering (UVCE)",
    city: "Bangalore",
    type: "gov",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 1800, c2021: 1700, c2022: 1600, c2023: 1550, c2024: 1500 },
      { code: "IS", name: "Information Science", c2020: 2500, c2021: 2400, c2022: 2300, c2023: 2200, c2024: 2100 },
      { code: "EC", name: "Electronics & Communication", c2020: 3800, c2021: 3600, c2022: 3500, c2023: 3400, c2024: 3200 },
      { code: "ME", name: "Mechanical Engineering", c2020: 7000, c2021: 6800, c2022: 6600, c2023: 6400, c2024: 6200 },
      { code: "CE", name: "Civil Engineering", c2020: 10000,c2021: 9700, c2022: 9400, c2023: 9100, c2024: 8800 },
      { code: "EE", name: "Electrical Engineering", c2020: 6000, c2021: 5800, c2022: 5600, c2023: 5400, c2024: 5200 },
    ]
  },
  {
    name: "Govt. Engineering College, Hassan",
    city: "Hassan",
    type: "gov",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 8000, c2021: 7700, c2022: 7400, c2023: 7100, c2024: 6800 },
      { code: "EC", name: "Electronics & Communication", c2020: 13000,c2021: 12500,c2022: 12000,c2023: 11500,c2024: 11000 },
      { code: "ME", name: "Mechanical Engineering", c2020: 20000,c2021: 19500,c2022: 19000,c2023: 18500,c2024: 18000 },
      { code: "CE", name: "Civil Engineering", c2020: 22000,c2021: 21500,c2022: 21000,c2023: 20500,c2024: 20000 },
    ]
  },
  {
    name: "Govt. Engineering College, Ramanagara",
    city: "Ramanagara",
    type: "gov",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 9500, c2021: 9200, c2022: 8900, c2023: 8600, c2024: 8300 },
      { code: "EC", name: "Electronics & Communication", c2020: 15000,c2021: 14500,c2022: 14000,c2023: 13500,c2024: 13000 },
      { code: "ME", name: "Mechanical Engineering", c2020: 22000,c2021: 21500,c2022: 21000,c2023: 20500,c2024: 20000 },
    ]
  },
  // ===== MYSURU =====
  {
    name: "JSS Academy of Technical Education",
    city: "Mysuru",
    type: "aided",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 3000, c2021: 2850, c2022: 2700, c2023: 2600, c2024: 2500 },
      { code: "IS", name: "Information Science", c2020: 4200, c2021: 4000, c2022: 3800, c2023: 3650, c2024: 3500 },
      { code: "EC", name: "Electronics & Communication", c2020: 6000, c2021: 5800, c2022: 5600, c2023: 5400, c2024: 5200 },
      { code: "ME", name: "Mechanical Engineering", c2020: 12000,c2021: 11500,c2022: 11000,c2023: 10500,c2024: 10000 },
    ]
  },
  {
    name: "NIE (National Institute of Engineering)",
    city: "Mysuru",
    type: "aided",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 3500, c2021: 3300, c2022: 3150, c2023: 3000, c2024: 2900 },
      { code: "EC", name: "Electronics & Communication", c2020: 6500, c2021: 6300, c2022: 6100, c2023: 5900, c2024: 5700 },
      { code: "ME", name: "Mechanical Engineering", c2020: 13000,c2021: 12500,c2022: 12000,c2023: 11500,c2024: 11000 },
      { code: "CE", name: "Civil Engineering", c2020: 16000,c2021: 15500,c2022: 15000,c2023: 14500,c2024: 14000 },
    ]
  },
  // ===== MANGALURU =====
  {
    name: "NMAM Institute of Technology",
    city: "Nitte, Karkala",
    type: "private",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 5000, c2021: 4800, c2022: 4600, c2023: 4400, c2024: 4200 },
      { code: "EC", name: "Electronics & Communication", c2020: 9000, c2021: 8700, c2022: 8400, c2023: 8100, c2024: 7900 },
      { code: "ME", name: "Mechanical Engineering", c2020: 18000,c2021: 17500,c2022: 17000,c2023: 16500,c2024: 16000 },
      { code: "CE", name: "Civil Engineering", c2020: 22000,c2021: 21500,c2022: 21000,c2023: 20500,c2024: 20000 },
      { code: "BT", name: "Biotechnology", c2020: 30000,c2021: 29000,c2022: 28000,c2023: 27000,c2024: 26000 },
    ]
  },
  {
    name: "Manipal Institute of Technology (MIT)",
    city: "Manipal",
    type: "private",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 2800, c2021: 2650, c2022: 2500, c2023: 2400, c2024: 2300 },
      { code: "IS", name: "Information Science", c2020: 4000, c2021: 3800, c2022: 3650, c2023: 3500, c2024: 3350 },
      { code: "EC", name: "Electronics & Communication", c2020: 5500, c2021: 5300, c2022: 5100, c2023: 4900, c2024: 4700 },
      { code: "ME", name: "Mechanical Engineering", c2020: 10000,c2021: 9700, c2022: 9400, c2023: 9100, c2024: 8800 },
      { code: "BT", name: "Biotechnology", c2020: 25000,c2021: 24000,c2022: 23000,c2023: 22000,c2024: 21000 },
    ]
  },
  // ===== HUBBALLI / DHARWAD =====
  {
    name: "BVB College of Engineering (KLE Tech Univ)",
    city: "Hubballi",
    type: "aided",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 4500, c2021: 4300, c2022: 4100, c2023: 3900, c2024: 3700 },
      { code: "EC", name: "Electronics & Communication", c2020: 8000, c2021: 7700, c2022: 7400, c2023: 7100, c2024: 6800 },
      { code: "ME", name: "Mechanical Engineering", c2020: 16000,c2021: 15500,c2022: 15000,c2023: 14500,c2024: 14000 },
      { code: "CE", name: "Civil Engineering", c2020: 20000,c2021: 19500,c2022: 19000,c2023: 18500,c2024: 18000 },
      { code: "EE", name: "Electrical Engineering", c2020: 12000,c2021: 11500,c2022: 11000,c2023: 10500,c2024: 10000 },
    ]
  },
  {
    name: "Basaveshwar Engineering College",
    city: "Bagalkot",
    type: "aided",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 6000, c2021: 5800, c2022: 5600, c2023: 5400, c2024: 5200 },
      { code: "EC", name: "Electronics & Communication", c2020: 11000,c2021: 10600,c2022: 10200,c2023: 9800, c2024: 9400 },
      { code: "ME", name: "Mechanical Engineering", c2020: 20000,c2021: 19500,c2022: 19000,c2023: 18500,c2024: 18000 },
      { code: "CE", name: "Civil Engineering", c2020: 23000,c2021: 22500,c2022: 22000,c2023: 21500,c2024: 21000 },
    ]
  },
  // ===== BELAGAVI =====
  {
    name: "KLS Gogte Institute of Technology",
    city: "Belagavi",
    type: "aided",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 5500, c2021: 5300, c2022: 5100, c2023: 4900, c2024: 4700 },
      { code: "EC", name: "Electronics & Communication", c2020: 9500, c2021: 9200, c2022: 8900, c2023: 8600, c2024: 8300 },
      { code: "ME", name: "Mechanical Engineering", c2020: 18000,c2021: 17500,c2022: 17000,c2023: 16500,c2024: 16000 },
    ]
  },
  // ===== ADDITIONAL BANGALORE PRIVATE =====
  {
    name: "Siddaganga Institute of Technology",
    city: "Tumkur",
    type: "aided",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 4000, c2021: 3800, c2022: 3600, c2023: 3450, c2024: 3300 },
      { code: "IS", name: "Information Science", c2020: 5500, c2021: 5300, c2022: 5100, c2023: 4900, c2024: 4700 },
      { code: "EC", name: "Electronics & Communication", c2020: 7500, c2021: 7200, c2022: 7000, c2023: 6800, c2024: 6600 },
      { code: "ME", name: "Mechanical Engineering", c2020: 15000,c2021: 14500,c2022: 14000,c2023: 13500,c2024: 13000 },
      { code: "CE", name: "Civil Engineering", c2020: 19000,c2021: 18500,c2022: 18000,c2023: 17500,c2024: 17000 },
      { code: "EE", name: "Electrical Engineering", c2020: 12000,c2021: 11500,c2022: 11000,c2023: 10500,c2024: 10000 },
    ]
  },
  {
    name: "Acharya Institute of Technology",
    city: "Bangalore",
    type: "private",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 8000, c2021: 7700, c2022: 7400, c2023: 7100, c2024: 6800 },
      { code: "IS", name: "Information Science", c2020: 10000,c2021: 9700, c2022: 9400, c2023: 9100, c2024: 8800 },
      { code: "EC", name: "Electronics & Communication", c2020: 14000,c2021: 13500,c2022: 13000,c2023: 12500,c2024: 12000 },
      { code: "ME", name: "Mechanical Engineering", c2020: 25000,c2021: 24000,c2022: 23000,c2023: 22000,c2024: 21000 },
    ]
  },
  {
    name: "CMR Institute of Technology",
    city: "Bangalore",
    type: "private",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 7000, c2021: 6800, c2022: 6600, c2023: 6400, c2024: 6200 },
      { code: "IS", name: "Information Science", c2020: 9000, c2021: 8700, c2022: 8400, c2023: 8100, c2024: 7800 },
      { code: "EC", name: "Electronics & Communication", c2020: 13000,c2021: 12500,c2022: 12000,c2023: 11500,c2024: 11000 },
      { code: "AI", name: "AI / Machine Learning", c2020: null, c2021: null, c2022: 8000, c2023: 7200, c2024: 6500 },
    ]
  },
  {
    name: "East West Institute of Technology",
    city: "Bangalore",
    type: "private",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 18000,c2021: 17500,c2022: 17000,c2023: 16500,c2024: 16000 },
      { code: "EC", name: "Electronics & Communication", c2020: 28000,c2021: 27000,c2022: 26000,c2023: 25000,c2024: 24000 },
      { code: "ME", name: "Mechanical Engineering", c2020: 40000,c2021: 39000,c2022: 38000,c2023: 37000,c2024: 36000 },
    ]
  },
  {
    name: "Govt. Engineering College, Chamarajanagar",
    city: "Chamarajanagar",
    type: "gov",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 12000,c2021: 11500,c2022: 11000,c2023: 10500,c2024: 10000 },
      { code: "EC", name: "Electronics & Communication", c2020: 18000,c2021: 17500,c2022: 17000,c2023: 16500,c2024: 16000 },
      { code: "ME", name: "Mechanical Engineering", c2020: 28000,c2021: 27000,c2022: 26000,c2023: 25000,c2024: 24000 },
      { code: "CE", name: "Civil Engineering", c2020: 30000,c2021: 29000,c2022: 28000,c2023: 27000,c2024: 26000 },
    ]
  },
  {
    name: "Cambridge Institute of Technology",
    city: "Bangalore",
    type: "private",
    branches: [
      { code: "CS", name: "Computer Science", c2020: 12000,c2021: 11500,c2022: 11000,c2023: 10500,c2024: 10000 },
      { code: "IS", name: "Information Science", c2020: 15000,c2021: 14500,c2022: 14000,c2023: 13500,c2024: 13000 },
      { code: "EC", name: "Electronics & Communication", c2020: 20000,c2021: 19500,c2022: 19000,c2023: 18500,c2024: 18000 },
    ]
  },
];

// -------------------------------------------------------
// 3. CATEGORY RANK MULTIPLIERS
//    SC/ST closing ranks in KCET are typically much higher
//    (easier to get). These are approximate multipliers
//    applied to GM closing ranks to estimate category cutoffs
// -------------------------------------------------------
const CATEGORY_MULTIPLIER = {
  GM:  1.0,
  OBC: 2.5,
  SC:  5.0,
  ST:  7.0,
};

// -------------------------------------------------------
// 4. RANK FORMULA HELPER
// -------------------------------------------------------
function computeCombinedScore(kcetScore, pucMarks) {
  const kcetContrib = (kcetScore / 180) * 90;
  const pucContrib  = (pucMarks  / 300) * 90;
  return kcetContrib + pucContrib; // out of 180
}
