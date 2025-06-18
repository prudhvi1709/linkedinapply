# LinkedIn Easy Apply Bookmarklet

🚀 A one-click bookmarklet to automate LinkedIn "Easy Apply" job applications with real-time progress tracking.

## 🌐 Live Demo

**Try it now:** [https://prudhvi.github.io/linkedinapply/](https://prudhvi.github.io/linkedinapply/)

## ⚠️ Important Disclaimer

This tool is for **educational purposes only**. Use at your own risk and ensure compliance with LinkedIn's Terms of Service. Automated job applications may violate LinkedIn's policies and could result in account suspension.

## ✨ Features

- 🎯 **Smart Detection** - Automatically detects "Easy Apply" jobs and skips others
- 📊 **Real-time Progress** - Live tracking with detailed counts and visual feedback
- ⏹️ **Stop Anytime** - Built-in stop button for safe cancellation
- 🔄 **Multi-step Forms** - Handles complex application forms automatically
- 📝 **Detailed Logging** - Console logs for each application attempt
- 🎨 **Clean UI** - Non-intrusive overlay interface

## 📋 Quick Start

### 1. Install the Bookmarklet
- Visit [the live demo page](https://prudhvi.github.io/linkedinapply/)
- Drag the "LinkedIn Easy Apply Bot" button to your bookmarks bar
- Or right-click and select "Add to Bookmarks"

### 2. Use on LinkedIn
1. **Login** to LinkedIn and navigate to job search results
2. **Search** for jobs using keywords, location, etc.
3. **Click** the bookmarklet in your bookmarks bar
4. **Monitor** progress in the popup modal
5. **Stop** anytime using the built-in stop button

## 📊 What You'll See

The bookmarklet provides detailed visual feedback:

- **Total Found** - Number of job cards detected on the page
- **Eligible** - Jobs with "Easy Apply" button available
- **Applied** - Successfully submitted applications  
- **Skipped** - Jobs without Easy Apply or incomplete applications
- **Errors** - Failed applications due to technical issues

## 🛠️ Development

### Local Setup

```bash
git clone https://github.com/yourusername/linkedinapply.git
cd linkedinapply
```

Open `index.html` in your browser to test locally.

### File Structure

```
linkedinapply/
├── index.html              # Main installation page
├── linkedin-easy-apply.js   # Core bookmarklet code
├── bookmarklet.js          # Source code (unminified)
├── README.md               # This file
├── LICENSE                 # MIT License
└── encoded-bookmarklet.txt # URL-encoded version
```

### Building

To regenerate the encoded bookmarklet:

```bash
node -e "
const fs = require('fs');
const code = fs.readFileSync('bookmarklet.js', 'utf8');
console.log('javascript:' + encodeURIComponent(code));
" > encoded-bookmarklet.txt
```

## 🔧 How It Works

1. **Detection** - Finds job cards using `[data-occludable-job-id]` selectors
2. **Filtering** - Checks each job for "Easy Apply" button availability
3. **Navigation** - Handles multi-step application forms automatically
4. **Submission** - Completes applications and tracks success/failure
5. **Reporting** - Provides detailed summary of all actions taken

## ⚠️ Important Notes

- **LinkedIn Terms** - This tool may violate LinkedIn's Terms of Service
- **Rate Limiting** - Includes delays to avoid spam detection
- **Required Fields** - Applications with required fields will be skipped
- **Profile Setup** - Ensure your LinkedIn profile is complete before use
- **Account Safety** - Excessive use may result in account restrictions

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| No jobs found | Ensure you're on a LinkedIn job search results page |
| Applications failing | Check that your LinkedIn profile is complete |
| Bookmarklet not working | Try refreshing the page and running again |
| Modal not appearing | Check if popup blockers are preventing the overlay |

## 🚀 GitHub Pages Deployment

This project is automatically deployed to GitHub Pages. To deploy your own version:

1. **Fork** this repository
2. **Enable** GitHub Pages in repository settings
3. **Set** source to "Deploy from a branch" 
4. **Choose** "main" branch and "/ (root)" folder
5. **Access** your site at `https://yourusername.github.io/linkedinapply/`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern JavaScript (ES6+)
- UI styled with Bootstrap 5
- Icons from Bootstrap Icons
- Hosted on GitHub Pages

## ⚖️ Legal

This software is provided for educational purposes only. Users are responsible for ensuring compliance with LinkedIn's Terms of Service and applicable laws in their jurisdiction. The authors are not responsible for any consequences resulting from the use of this software.

---

**Made with ❤️ for job seekers everywhere**