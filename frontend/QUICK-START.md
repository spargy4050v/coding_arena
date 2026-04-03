# Quick Start Guide

## 🚀 Get Running in 2 Minutes

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# http://localhost:3000
```

## 📁 What You'll See

- **Home Page** (`/`): Landing page
- **Problems List** (`/problems`): Browse all coding challenges
- **Problem Editor** (`/problem/two-sum`): Solve a specific problem

## 🎯 Try It Out

1. Go to http://localhost:3000/problems
2. Click on "Two Sum" problem
3. Select a language (Python, C++, Java, or C)
4. Write your solution
5. Click "Submit Code"
6. See "Accepted" in the console!

## 📚 Documentation

- **Setup & Usage**: `frontend/README.md`
- **Project Overview**: `PROJECT-SUMMARY.md`

## ⚠️ Known Issues

Monaco Editor shows console warnings:
```
[browser] Monaco initialization: error: [object Event]
```

**Don't worry!** This is cosmetic and doesn't affect functionality. The editor works perfectly.

## 🛠️ Common Tasks

### Add a New Problem
Edit `frontend/public/data/problems.json`

### Change Starter Code
Edit `frontend/public/data/starter-code.json`

### Build for Production
```bash
npm run build
npm start
```

## 💡 Tips

- Use the language selector to switch between C, C++, Java, Python
- Resize panels by dragging the dividers
- Filter problems by difficulty or category
- Check the console panel for submission results

## 🐛 Troubleshooting

**Monaco won't load?**
- Clear browser cache
- Check console for errors
- Ensure port 3000 is available

**Problems not showing?**
- Check `frontend/public/data/problems.json` exists
- Verify JSON is valid

**Submission not working?**
- Check browser console
- Verify `/api/submit` endpoint is running

## 📞 Need Help?

1. Read `frontend/README.md` for detailed docs
2. Review `PROJECT-SUMMARY.md` for architecture

## ✅ What Works

- ✅ Browse problems
- ✅ View problem details
- ✅ Write code in Monaco Editor
- ✅ Switch languages
- ✅ Submit solutions
- ✅ View results
- ✅ Resize panels
- ✅ Filter problems

## 🎉 You're Ready!

The application is fully functional. Enjoy coding!
