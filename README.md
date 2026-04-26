# KCET Rank & Seat Predictor

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-brightgreen)](https://sheetalneeraj.github.io/kcet-predictor)

A free, open-source KCET (Karnataka CET) rank and seat predictor built with pure HTML/CSS/JS — deployable as a GitHub Page with zero setup.

🔗 **Live Demo**: [https://sheetalneeraj.github.io/kcet-predictor](https://sheetalneeraj.github.io/kcet-predictor)

---

## ✨ Features

- **🎯 Rank Predictor** — Enter KCET score + 2nd PUC PCM marks → get predicted rank range
- **🏛️ Seat / College Finder** — Enter your rank + category → see which colleges & branches you can get
- **📊 5-Year Historical Data** — 2020 to 2024 closing ranks from KEA official PDFs
- **🏷️ Category Support** — GM, SC, ST, OBC with approximate multipliers
- **📈 Trend Indicator** — See if a branch's cutoff is getting harder or easier year-over-year
- **🎲 Chance Filter** — Filter by Safe / Moderate / Reach colleges
- **🏫 80+ College-Branch Combinations** — Bangalore, Mysuru, Mangaluru, Hubballi & more
- **📱 Responsive Design** — Works on desktop and mobile devices

---

## 🚀 Quick Start

### Deploy on GitHub Pages (Easiest)

1. Fork this repository
2. Go to **Settings → Pages → Source: main branch / root**
3. Your site is live at `https://yourusername.github.io/kcet-predictor`

### Local Development

```bash
# Clone the repository
git clone https://github.com/sheetalneeraj/kcet-predictor.git
cd kcet-predictor

# Open index.html in your browser
# No build process required!
```

---

## 📖 How It Works

### Rank Prediction Formula

KCET uses a **50:50 weightage** formula:

```
Combined Score = (KCET_marks / 180 × 90) + (PUC_PCM_marks / 300 × 90)
                = out of 180
```

Higher combined score → better (lower number) rank.

### Step-by-Step Usage

1. **Enter Marks**: Input your KCET score (out of 180) and 2nd PUC PCM marks (out of 300)
2. **Get Rank**: See your predicted rank range based on historical data
3. **Find Colleges**: Filter colleges by category, branch, and chance level
4. **Analyze Trends**: Check year-over-year cutoff changes

---

## 📊 Data Sources

| Year | Source |
|------|--------|
| 2024 | KEA official Round 2 cutoff PDF + Sakshi Education verification |
| 2023 | KEA official PDF + Shiksha/CollegeDunia cross-reference |
| 2022 | KEA official PDF + Careers360 |
| 2021 | KEA official PDF |
| 2020 | KEA official PDF |

### Updating Data

All data lives in **`data.js`**. After KEA releases official PDFs:

1. Open `data.js`
2. In `MARKS_VS_RANK` array — add a new `r2025` column
3. In `COLLEGES` array — for each college/branch, add `c2025: <closing_rank_from_PDF>`
4. Commit and push — your GitHub Page updates automatically

**Official Data Sources:**
- **KEA Official**: [https://cetonline.karnataka.gov.in](https://cetonline.karnataka.gov.in) → UGCET → Cutoff Ranks PDF
- **Careers360**: [https://engineering.careers360.com/articles/kcet-cutoff](https://engineering.careers360.com/articles/kcet-cutoff)
- **Shiksha**: [https://www.shiksha.com/engineering/kcet-exam-cutoff](https://www.shiksha.com/engineering/kcet-exam-cutoff)

---

## 🛠️ Technologies Used

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with modern design principles
- **Fonts**: Google Fonts (Syne, DM Sans)
- **Deployment**: GitHub Pages
- **Data**: JSON-based data structure

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Adding New Colleges/Data
1. Fork the repository
2. Update `data.js` with new college data or historical ranks
3. Test your changes locally
4. Submit a pull request

### Improving the UI/UX
1. Fork the repository
2. Modify `style.css` or `index.html`
3. Ensure responsiveness across devices
4. Submit a pull request

### Bug Fixes
- Open an issue describing the bug
- Provide steps to reproduce
- Submit a fix via pull request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⚠️ Disclaimer

This tool is for **reference and guidance only**. Actual cutoffs are determined by KEA after each counselling round and depend on the year's difficulty, participation, and seat matrix. Always verify at the official KEA website before making admission decisions.

**Not affiliated with KEA or Karnataka Government.**

---

## 🙏 Acknowledgments

- Karnataka Examinations Authority (KEA) for official data
- Open-source community for inspiration
- Contributors who help maintain and update the data

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/sheetalneeraj/kcet-predictor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sheetalneeraj/kcet-predictor/discussions)

Made with ❤️ for Karnataka engineering aspirants
