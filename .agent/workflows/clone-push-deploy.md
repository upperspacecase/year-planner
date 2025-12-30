---
description: Clone a repo, push to GitHub, and connect to Vercel for auto-deploy
---

# Clone, Push & Deploy Workflow

## Prerequisites
- Have an empty GitHub repo created (e.g., `https://github.com/USERNAME/REPO-NAME.git`)
- Know the source repo URL to clone from

## Steps

### 1. Clone source repo directly into working directory
```bash
cd /path/to/your/project-folder
git clone SOURCE_REPO_URL .
```
**Important:** Use `.` to clone directly into the current folder, not a subdirectory.

### 2. Update the remote to YOUR GitHub repo
```bash
git remote set-url origin https://github.com/USERNAME/REPO-NAME.git
```

### 3. Push to GitHub
```bash
git push -u origin main --force
```

### 4. Connect Vercel to GitHub (do this ONCE per project)
Go to https://vercel.com/new and:
1. Click "Import Git Repository"
2. Select your `USERNAME/REPO-NAME` repo
3. Click "Deploy"

**DO NOT use `vercel --prod` CLI command.** Let Vercel auto-deploy from GitHub.

## Future Deployments
Just push to GitHub:
```bash
git add .
git commit -m "Your message"
git push origin main
```
Vercel will auto-deploy within ~60 seconds.
