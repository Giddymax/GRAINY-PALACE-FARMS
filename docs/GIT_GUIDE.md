# Git for Beginners: The Complete Guide

This guide teaches Git from scratch — plain-language explanations, step-by-step commands, and dedicated error-handling sections after every topic. Read it top to bottom if you're new, or jump to a section using the table of contents.

## Table of Contents

1. [What Git Actually Is](#1-what-git-actually-is)
2. [Setup: Installing & Configuring Git](#2-setup-installing--configuring-git)
3. [Starting a Project: init vs clone](#3-starting-a-project-init-vs-clone)
4. [The Core Loop: status, add, commit](#4-the-core-loop-status-add-commit)
5. [Viewing History: log, diff, show](#5-viewing-history-log-diff-show)
6. [Branches: Working in Parallel](#6-branches-working-in-parallel)
7. [Merging Branches](#7-merging-branches)
8. [Remotes: Connecting to GitHub](#8-remotes-connecting-to-github)
9. [Pushing Your Changes](#9-pushing-your-changes)
10. [Pulling & Fetching Updates](#10-pulling--fetching-updates)
11. [Undoing Things](#11-undoing-things)
12. [Stashing: Temporary Shelving](#12-stashing-temporary-shelving)
13. [.gitignore: Excluding Files](#13-gitignore-excluding-files)
14. [Common Errors & How to Fix Them (Master List)](#14-common-errors--how-to-fix-them-master-list)
15. [Quick Reference Cheat Sheet](#15-quick-reference-cheat-sheet)

---

## 1. What Git Actually Is

Git is a **version control system**: a tool that saves snapshots of your project over time so you can look back, compare, undo, and collaborate without overwriting each other's work.

Key vocabulary, in plain terms:

| Term | Plain-language meaning |
|---|---|
| **Repository (repo)** | A project folder Git is tracking. Marked by a hidden `.git` folder inside it. |
| **Commit** | A saved snapshot with a message describing what changed. |
| **Working tree** | The actual files you see and edit right now. |
| **Staging area (index)** | A holding area where you pick exactly what goes into the next commit. |
| **Branch** | An independent line of work/history. The default is usually `main` (or older repos: `master`). |
| **Remote** | A copy of the repo hosted elsewhere (e.g. GitHub). Usually nicknamed `origin`. |
| **Clone** | Download a full copy of a remote repo, once. |
| **Push** | Upload your local commits to a remote. |
| **Pull** | Download and merge a remote's latest commits into your local branch. |
| **Merge conflict** | When Git can't automatically combine two changes to the same lines and asks you to decide. |

**Mental model:** think of Git as a series of numbered photographs (commits) of your project folder. You can jump to any photo, compare two photos, or create a new photo. Branches are separate photo albums that can later be merged into one.

---

## 2. Setup: Installing & Configuring Git

### Step 1: Check if Git is installed

```bash
git --version
```

If you see a version number, you're set. If not, install Git from [git-scm.com](https://git-scm.com/downloads).

### Step 2: Tell Git who you are

Every commit records an author. Set this once per computer:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

### Step 3: Verify your settings

```bash
git config --list
```

### Error-handling

**"git: command not found" / "'git' is not recognized"**
Git isn't installed, or isn't on your system `PATH`. Reinstall from git-scm.com and restart your terminal.

**Commits show the wrong name/email**
You set config in the wrong scope. `--global` applies to all repos on your machine; without `--global` it only applies to the current repo. Re-run the command with the correct scope.

---

## 3. Starting a Project: init vs clone

Two ways to get a Git-tracked folder:

- **`git init`** — turn an existing folder into a brand-new, empty repo (no history yet).
- **`git clone`** — download a full copy of an *existing* repo (with all its history) from somewhere like GitHub.

### Option A: Starting fresh

```bash
cd path/to/your/project
git init
```

This creates a hidden `.git` folder. Your project is now tracked, but has zero commits.

### Option B: Copying an existing repo

```bash
git clone https://github.com/<owner>/<repo-name>.git
cd <repo-name>
```

This downloads everything and automatically sets up a remote called `origin`.

### Error-handling

**"fatal: destination path '<repo-name>' already exists and is not an empty directory"**
A folder with that name already exists and has files in it. Either delete/rename that folder, or clone into a new name:
```bash
git clone <url> a-different-folder-name
```

**"fatal: repository not found" (during clone)**
The URL is wrong, the repo was renamed/deleted, or it's private and you're not authenticated. Recheck the URL via GitHub's green **Code** button.

**"git init" run inside a folder that's already a repo**
You'll see `Reinitialized existing Git repository in ...`. This is harmless but usually means you're in the wrong folder — check with `git status` first.

---

## 4. The Core Loop: status, add, commit

This three-step loop is 90% of daily Git use.

### Step 1: Check what changed

```bash
git status
```

Shows modified, new (untracked), and staged files.

### Step 2: Stage the files you want to save

```bash
git add <file-name>       # stage one file
git add .                 # stage everything in the current folder
git add -p                # interactively choose which changes to stage
```

Staging is a preview step — it lets you build a commit out of only some of your changes.

### Step 3: Commit (save the snapshot)

```bash
git commit -m "Short description of what changed"
```

### Full example

```bash
git status
git add index.html styles.css
git commit -m "Add homepage layout and styling"
```

### Error-handling

**"nothing to commit, working tree clean"**
There are no changes to save — you're already up to date locally. Nothing is wrong.

**"Please tell me who you are" (during commit)**
You skipped [Section 2, Step 2](#2-setup-installing--configuring-git). Set `user.name` and `user.email`, then commit again.

**Committed with a typo in the message**
Fix the most recent commit's message (only if you haven't pushed it yet):
```bash
git commit --amend -m "Corrected message"
```

**Accidentally staged a file you didn't mean to**
Unstage it (this does NOT delete your changes, just removes it from the staging area):
```bash
git restore --staged <file-name>
```

---

## 5. Viewing History: log, diff, show

### See commit history

```bash
git log
```

A condensed one-line-per-commit view:

```bash
git log --oneline
```

A visual branch graph:

```bash
git log --oneline --graph --all
```

### See what changed but isn't staged yet

```bash
git diff
```

### See what's staged, compared to the last commit

```bash
git diff --staged
```

### See the full details of a specific commit

```bash
git show <commit-hash>
```

### Error-handling

**Stuck in the log viewer, can't type new commands**
`git log` opens a pager. Press `q` to quit it.

**"fatal: bad object <hash>"**
The commit hash you typed doesn't exist (typo, or it belongs to a different repo/branch you haven't fetched). Double check with `git log --oneline`.

---

## 6. Branches: Working in Parallel

A branch lets you work on something (a feature, a fix) without touching the main line of code until you're ready.

### See existing branches

```bash
git branch          # local branches
git branch -a       # local + remote-known branches
```

### Create a new branch

```bash
git branch feature-login
```

### Switch to a branch

```bash
git switch feature-login
```

### Create and switch in one step

```bash
git switch -c feature-login
```

*(Older tutorials use `git checkout -b feature-login` — same effect, older syntax.)*

### Rename the current branch

```bash
git branch -m new-name
```

### Delete a branch (after it's merged)

```bash
git branch -d feature-login
```

### Error-handling

**"error: pathspec 'feature-login' did not match any file(s) known to git"**
You tried to `switch` to a branch that doesn't exist yet. Either it's misspelled, or you meant to create it with `git switch -c feature-login`.

**"error: Your local changes to the following files would be overwritten by checkout"**
You have unsaved changes that conflict with the branch you're switching to. Either commit them, or stash them first (see [Section 12](#12-stashing-temporary-shelving)).

**"error: The branch 'feature-login' is not fully merged"** (when deleting)
Git is warning you that deleting this branch would lose commits not present elsewhere. If you're sure, force-delete:
```bash
git branch -D feature-login
```
Only do this if you're certain you don't need that work.

---

## 7. Merging Branches

Merging brings the changes from one branch into another.

### Step 1: Switch to the branch you want to merge INTO

```bash
git switch main
```

### Step 2: Merge the other branch in

```bash
git merge feature-login
```

If the changes don't overlap, Git merges automatically. If they do, you get a **merge conflict**.

### Resolving a merge conflict

1. Run `git status` to see which files are conflicted.
2. Open each conflicted file. Git marks conflicts like this:

```
<<<<<<< HEAD
version currently on your branch
=======
version being merged in
>>>>>>> feature-login
```

3. Edit the file to keep the correct content (you can keep one side, the other, or blend both), then delete the `<<<<<<<`, `=======`, `>>>>>>>` marker lines.
4. Mark it resolved and finish the merge:

```bash
git add <the-file>
git commit
```

### Error-handling

**Don't understand the conflict, want to back out entirely**
```bash
git merge --abort
```
This safely returns you to how things were before you started the merge.

**"fatal: You have not concluded your merge (MERGE_HEAD exists)"**
You started a merge, hit a conflict, and tried to run another Git command before finishing it. Either finish resolving and commit, or abort with `git merge --abort`.

**Merged the wrong branch**
If you haven't pushed yet:
```bash
git reset --hard HEAD~1
```
⚠️ This discards the merge commit. Only use it if you're sure, and never on a branch others are already using.

---

## 8. Remotes: Connecting to GitHub

A remote is a saved nickname + URL pointing to another copy of the repo (usually on GitHub).

### See your remotes

```bash
git remote -v
```

### Add a remote

```bash
git remote add origin https://github.com/<owner>/<repo>.git
```

### Change a remote's URL

```bash
git remote set-url origin https://github.com/<owner>/<new-repo>.git
```

### Remove a remote

```bash
git remote remove origin
```

### Error-handling

**"fatal: remote origin already exists"**
You tried to `add` a remote named `origin` but one already exists. Either `remove` it first, or use `set-url` to update it instead.

**"fatal: 'origin' does not appear to be a git repository"**
No remote named `origin` exists. Check the exact name with `git remote -v` and use that name instead.

---

## 9. Pushing Your Changes

Pushing uploads your local commits to a remote so others (or GitHub) can see them.

### Basic push

```bash
git push origin main
```

### First push of a new local branch (sets up tracking)

```bash
git push -u origin main
```

After `-u` once, plain `git push` works for that branch going forward.

### Error-handling

**"fatal: The current branch main has no upstream branch"**
Git doesn't know where to push. Run:
```bash
git push -u origin main
```

**"! [rejected] main -> main (fetch first)"** or **"Updates were rejected because the remote contains work that you do not have locally"**
Someone else (or another one of your devices) pushed changes you don't have yet. Pull first, then push:
```bash
git pull origin main
git push origin main
```

**"Permission denied" / "403" / authentication failure**
You're not authenticated, or don't have write access. For HTTPS remotes, GitHub requires a Personal Access Token instead of your password — see [GitHub's authentication docs](https://docs.github.com/en/authentication). For SSH remotes, make sure your SSH key is added to your GitHub account.

**Tempted to use `git push --force`**
Force-pushing overwrites remote history and can destroy other people's work. Avoid it unless you fully understand the consequences and are certain no one else is relying on what you're overwriting. Prefer pulling and merging instead.

---

## 10. Pulling & Fetching Updates

### The difference

- **`git fetch`** downloads the latest remote data but does **not** touch your working files.
- **`git pull`** = `git fetch` + `git merge` — it downloads AND merges into your current branch immediately.

### Basic pull

```bash
git pull
```

If Git doesn't know which remote/branch to use:

```bash
git pull origin main
```

### Safer two-step version (recommended for beginners)

```bash
git fetch origin
git log origin/main --oneline   # preview what's new before merging
git merge origin/main
```

### Error-handling

**"error: Your local changes to the following files would be overwritten by merge"**
You have uncommitted edits conflicting with incoming changes. Either commit them first, or temporarily shelve them:
```bash
git stash
git pull
git stash pop
```

**"There is no tracking information for the current branch"**
Be explicit about where to pull from:
```bash
git pull origin main
```
Or set up tracking permanently:
```bash
git branch -u origin/main
```

**Pull results in a merge conflict**
Follow the conflict-resolution steps in [Section 7](#7-merging-branches).

**"fatal: couldn't find remote ref main"**
The branch name is wrong — the remote's default branch might be `master`, not `main` (or vice versa). Check with:
```bash
git remote show origin
```

---

## 11. Undoing Things

Git has different undo commands depending on *how far* the change has gone.

| I want to... | Command |
|---|---|
| Discard uncommitted changes to a file | `git restore <file>` |
| Unstage a file (keep the edits) | `git restore --staged <file>` |
| Edit the message of the last commit | `git commit --amend -m "new message"` |
| Undo the last commit, keep the changes unstaged | `git reset HEAD~1` |
| Undo the last commit, discard the changes entirely | `git reset --hard HEAD~1` ⚠️ |
| Create a new commit that reverses a past commit (safe for shared history) | `git revert <commit-hash>` |

### Error-handling

**Used `git reset --hard` and lost work you needed**
If it was at least committed at some point, it's often still recoverable for a while via:
```bash
git reflog
```
Find the commit hash from before the reset, then:
```bash
git reset --hard <that-hash>
```

**Reverted the wrong commit**
`git revert` creates a new commit — just revert the revert:
```bash
git revert <the-revert-commit-hash>
```

**"error: cannot revert... conflict"**
Same as a merge conflict — resolve the marked files, then:
```bash
git add <file>
git revert --continue
```

---

## 12. Stashing: Temporary Shelving

Use `git stash` to set aside uncommitted changes temporarily — useful when you need a clean working tree (e.g. to switch branches or pull) but aren't ready to commit.

### Stash your current changes

```bash
git stash
```

### See your stashes

```bash
git stash list
```

### Bring the most recent stash back

```bash
git stash pop
```

### Apply a stash without removing it from the list

```bash
git stash apply
```

### Error-handling

**"error: Your local changes... would be overwritten"** (even after stashing)
The stash didn't include everything — untracked new files aren't stashed by default. Use:
```bash
git stash -u
```

**Conflict when popping a stash**
Resolve it like a merge conflict (Section 7), then:
```bash
git stash drop
```
(Popping normally removes the stash automatically once applied cleanly; if it conflicted, drop it manually after resolving.)

**Forgot what's in a stash before dropping it**
```bash
git stash show -p stash@{0}
```

---

## 13. .gitignore: Excluding Files

Some files shouldn't be tracked — build output, dependency folders (`node_modules`), secrets (`.env`), OS files (`.DS_Store`). List them in a file named `.gitignore` in your project root.

### Example `.gitignore`

```
node_modules/
.env
.DS_Store
dist/
*.log
```

### Error-handling

**A file is still being tracked even though it's in `.gitignore`**
`.gitignore` only prevents *new* files from being tracked — it doesn't untrack files Git already knows about. Remove it from tracking (this keeps it on disk):
```bash
git rm --cached <file-name>
git commit -m "Stop tracking <file-name>"
```

**Accidentally committed a secret (API key, password)**
Rotate/revoke the secret immediately on the service it belongs to — treat it as compromised, since removing it from Git history later doesn't undo any exposure that already happened. Then remove it from tracking going forward as above. Fully purging it from *history* requires specialized tools (`git filter-repo` or BFG Repo-Cleaner) — ask for help before attempting that on a shared repo.

---

## 14. Common Errors & How to Fix Them (Master List)

A quick lookup table for the most frequent beginner errors, wherever they occur:

| Error message | Likely cause | Fix |
|---|---|---|
| `fatal: not a git repository` | You're not inside a folder Git is tracking | `cd` into the right folder, or `git init` / `git clone` |
| `fatal: repository not found` | Wrong URL, private repo, or deleted repo | Recheck the URL; confirm access |
| `Please tell me who you are` | Git identity not configured | `git config --global user.name/user.email` (Section 2) |
| `nothing to commit, working tree clean` | No changes to save | Not an error — informational only |
| `Your local changes would be overwritten` | Uncommitted changes conflict with an incoming operation | Commit or `git stash` first |
| `no upstream branch` | Local branch isn't linked to a remote branch | `git push -u origin <branch>` |
| `Updates were rejected (fetch first)` | Remote has commits you don't have locally | `git pull` then `git push` |
| `Permission denied` / `403` | Not authenticated, or no write access | Set up a Personal Access Token or SSH key |
| `MERGE_HEAD exists` | Unfinished merge from earlier | Resolve conflicts and commit, or `git merge --abort` |
| `remote origin already exists` | A remote named `origin` is already set | `git remote set-url origin <url>` instead of `add` |
| `couldn't find remote ref main` | Wrong branch name (`main` vs `master`) | `git remote show origin` to check the real name |
| `bad object <hash>` | Typo'd or nonexistent commit hash | Recheck with `git log --oneline` |

**Universal safety habit:** run `git status` before and after any operation that touches your files. It costs nothing and tells you exactly what state you're in.

---

## 15. Quick Reference Cheat Sheet

| Task | Command |
|---|---|
| Check Git version | `git --version` |
| Set your identity | `git config --global user.name/user.email` |
| Start a new repo | `git init` |
| Copy an existing repo | `git clone <url>` |
| See current status | `git status` |
| Stage changes | `git add <file>` / `git add .` |
| Save a snapshot | `git commit -m "message"` |
| See history | `git log --oneline` |
| See unstaged changes | `git diff` |
| List branches | `git branch` |
| Create + switch branch | `git switch -c <name>` |
| Switch branch | `git switch <name>` |
| Merge a branch in | `git merge <name>` |
| Abort a messy merge | `git merge --abort` |
| See remotes | `git remote -v` |
| Add a remote | `git remote add origin <url>` |
| Upload commits | `git push origin <branch>` |
| First push of a branch | `git push -u origin <branch>` |
| Download without merging | `git fetch origin` |
| Download and merge | `git pull origin <branch>` |
| Shelve changes temporarily | `git stash` |
| Restore shelved changes | `git stash pop` |
| Discard uncommitted edits | `git restore <file>` |
| Unstage a file | `git restore --staged <file>` |
| Undo last commit, keep edits | `git reset HEAD~1` |
| Safely reverse a past commit | `git revert <hash>` |
| Recover "lost" commits | `git reflog` |

**Golden rule for beginners:** Git rarely deletes work permanently as long as it was committed at some point — `git reflog` is your safety net. The main things to truly avoid without understanding them first are `git push --force` and `git reset --hard`, since those can discard work irreversibly.
