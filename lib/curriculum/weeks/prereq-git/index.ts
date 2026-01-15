// Phase 0, Week 5: Git 기초 (버전 관리, 브랜치, 협업)
import type { Week, Day } from '../../types'

const day1: Day = {
  slug: 'git-basics',
  title: 'Git 소개 & 기본 명령어',
  totalDuration: 180,
  tasks: [
    {
      id: 'git-why',
      type: 'reading',
      title: 'Git이란?',
      duration: 30,
      content: {
        objectives: [
          '버전 관리의 필요성을 이해한다',
          'Git의 특징과 장점을 파악한다',
          'Git의 기본 개념(저장소, 커밋, 스테이징)을 이해한다'
        ],
        markdown: `
## Git이란?

### 버전 관리가 필요한 이유

\`\`\`
버전 관리 없이 코드 관리하면?

project/
├── main.py
├── main_v2.py
├── main_v2_final.py
├── main_v2_final_진짜최종.py
├── main_v2_final_진짜최종_수정.py
└── main_backup_0101.py

😱 어떤 파일이 최신인지 모름!
\`\`\`

### Git의 특징

\`\`\`
Git 핵심 특징:
├── 분산 버전 관리
│   └── 모든 개발자가 전체 히스토리 보유
├── 브랜치 기반 개발
│   └── 독립적인 작업 공간
├── 스냅샷 방식
│   └── 파일 변경사항을 스냅샷으로 저장
└── 오프라인 작업 가능
    └── 로컬에서 커밋 후 나중에 푸시
\`\`\`

### Git vs 다른 버전 관리 시스템

| 특성 | Git | SVN | CVS |
|------|-----|-----|-----|
| 방식 | 분산형 | 중앙집중형 | 중앙집중형 |
| 브랜치 | 가벼움 | 무거움 | 제한적 |
| 오프라인 | ✅ 가능 | ❌ 불가 | ❌ 불가 |
| 속도 | 빠름 | 중간 | 느림 |
| 현재 | 표준 | 레거시 | 레거시 |

### Git의 3가지 영역

\`\`\`
┌─────────────────────────────────────────────────────┐
│                   Working Directory                 │
│                   (작업 디렉토리)                     │
│                                                     │
│   수정된 파일들이 있는 곳                             │
│   아직 Git이 추적하지 않는 상태                       │
└─────────────────────────────────────────────────────┘
                         │
                    git add
                         ▼
┌─────────────────────────────────────────────────────┐
│                   Staging Area                      │
│                   (스테이징 영역)                     │
│                                                     │
│   다음 커밋에 포함될 파일들                          │
│   "이 파일들을 저장할 준비 완료!"                     │
└─────────────────────────────────────────────────────┘
                         │
                   git commit
                         ▼
┌─────────────────────────────────────────────────────┐
│                    Repository                       │
│                    (저장소)                          │
│                                                     │
│   커밋된 스냅샷들이 저장된 곳                        │
│   .git 폴더에 모든 히스토리 보관                     │
└─────────────────────────────────────────────────────┘
\`\`\`

### FDE가 Git을 알아야 하는 이유

\`\`\`
FDE의 Git 활용:

1. 코드 협업
   ├── 팀원과 코드 공유
   ├── 변경 이력 추적
   └── 코드 리뷰 (PR)

2. 데이터 파이프라인
   ├── dbt 모델 버전 관리
   ├── Airflow DAG 관리
   └── Terraform IaC

3. CI/CD
   ├── GitHub Actions
   ├── 자동 테스트
   └── 자동 배포

4. Palantir Foundry
   └── Code Repositories = Git!
\`\`\`
        `,
        externalLinks: [
          { title: 'Git 공식 문서', url: 'https://git-scm.com/doc' },
          { title: 'Git 무료 책', url: 'https://git-scm.com/book/ko/v2' }
        ]
      }
    },
    {
      id: 'git-install',
      type: 'code',
      title: 'Git 설치 & 설정',
      duration: 30,
      content: {
        objectives: [
          'Git을 설치할 수 있다',
          'Git 사용자 정보를 설정할 수 있다',
          'Git 설정을 확인할 수 있다'
        ],
        instructions: `
## Git 설치 & 설정

### 1. Git 설치

**macOS:**
\`\`\`bash
# Homebrew로 설치
brew install git

# 또는 Xcode Command Line Tools
xcode-select --install
\`\`\`

**Windows:**
- [Git for Windows](https://gitforwindows.org/) 다운로드
- 또는 winget: \`winget install Git.Git\`

**Linux (Ubuntu/Debian):**
\`\`\`bash
sudo apt update
sudo apt install git
\`\`\`

### 2. 설치 확인

\`\`\`bash
git --version
# git version 2.43.0
\`\`\`

### 3. 사용자 정보 설정 (필수!)

\`\`\`bash
# 이름 설정
git config --global user.name "홍길동"

# 이메일 설정
git config --global user.email "hong@example.com"
\`\`\`

### 4. 추가 설정 (권장)

\`\`\`bash
# 기본 브랜치 이름을 main으로
git config --global init.defaultBranch main

# 컬러 출력 활성화
git config --global color.ui auto

# 기본 에디터 설정 (VS Code)
git config --global core.editor "code --wait"
\`\`\`

### 5. 설정 확인

\`\`\`bash
# 모든 설정 보기
git config --list

# 특정 설정 보기
git config user.name
git config user.email
\`\`\`

### 설정 범위

\`\`\`
Git 설정 범위:

--system    시스템 전체 (모든 사용자)
--global    현재 사용자 전체 (~/.gitconfig)
--local     현재 저장소만 (.git/config)

우선순위: local > global > system
\`\`\`
        `,
        starterCode: `# 터미널에서 실행해보세요

# 1. Git 버전 확인
git --version

# 2. 사용자 정보 설정
git config --global user.name "여러분 이름"
git config --global user.email "your@email.com"

# 3. 설정 확인
git config --list`,
        solutionCode: `# Git 설정 예시

# 버전 확인
$ git --version
git version 2.43.0

# 사용자 설정
$ git config --global user.name "Kelly Kim"
$ git config --global user.email "kelly@fde-academy.com"

# 추가 설정
$ git config --global init.defaultBranch main
$ git config --global color.ui auto

# 설정 확인
$ git config --list
user.name=Kelly Kim
user.email=kelly@fde-academy.com
init.defaultbranch=main
color.ui=auto`
      }
    },
    {
      id: 'git-init-add-commit',
      type: 'code',
      title: '첫 번째 커밋 만들기',
      duration: 45,
      content: {
        objectives: [
          'git init으로 저장소를 생성할 수 있다',
          'git add로 파일을 스테이징할 수 있다',
          'git commit으로 변경사항을 저장할 수 있다'
        ],
        instructions: `
## 첫 번째 커밋 만들기

### 1. 저장소 생성 (git init)

\`\`\`bash
# 프로젝트 폴더 생성
mkdir my-project
cd my-project

# Git 저장소 초기화
git init
# Initialized empty Git repository in /my-project/.git/
\`\`\`

### 2. 파일 생성

\`\`\`bash
# README 파일 생성
echo "# My Project" > README.md

# Python 파일 생성
echo "print('Hello Git!')" > main.py
\`\`\`

### 3. 상태 확인 (git status)

\`\`\`bash
git status

# On branch main
# Untracked files:
#   README.md
#   main.py
\`\`\`

### 4. 스테이징 (git add)

\`\`\`bash
# 특정 파일 추가
git add README.md

# 모든 파일 추가
git add .

# 상태 다시 확인
git status
# Changes to be committed:
#   new file: README.md
#   new file: main.py
\`\`\`

### 5. 커밋 (git commit)

\`\`\`bash
# 커밋 메시지와 함께 저장
git commit -m "Initial commit: Add README and main.py"

# [main (root-commit) abc1234] Initial commit: Add README and main.py
# 2 files changed, 2 insertions(+)
\`\`\`

### 커밋 메시지 작성법

\`\`\`
좋은 커밋 메시지:

✅ feat: Add user login feature
✅ fix: Fix database connection error
✅ docs: Update README with examples
✅ refactor: Simplify data processing logic

❌ update
❌ fix bug
❌ asdf
❌ wip

형식: <타입>: <제목>

타입:
- feat: 새 기능
- fix: 버그 수정
- docs: 문서
- refactor: 리팩토링
- test: 테스트
- chore: 기타
\`\`\`

### 6. 히스토리 확인 (git log)

\`\`\`bash
# 커밋 히스토리 보기
git log

# 한 줄로 보기
git log --oneline

# 그래프로 보기
git log --oneline --graph
\`\`\`
        `,
        starterCode: `# 실습: 첫 번째 커밋 만들기

# 1. 폴더 생성 및 이동
mkdir git-practice
cd git-practice

# 2. Git 저장소 초기화
git init

# 3. 파일 생성
echo "# Git 연습" > README.md

# 4. 상태 확인
git status

# 5. 스테이징
git add README.md

# 6. 커밋
git commit -m "docs: Add README"

# 7. 히스토리 확인
git log --oneline`,
        solutionCode: `$ mkdir git-practice && cd git-practice
$ git init
Initialized empty Git repository in .git/

$ echo "# Git 연습" > README.md
$ git status
On branch main

Untracked files:
  README.md

$ git add README.md
$ git status
Changes to be committed:
  new file:   README.md

$ git commit -m "docs: Add README"
[main (root-commit) a1b2c3d] docs: Add README
 1 file changed, 1 insertion(+)
 create mode 100644 README.md

$ git log --oneline
a1b2c3d (HEAD -> main) docs: Add README`
      }
    },
    {
      id: 'git-diff-restore',
      type: 'code',
      title: '변경사항 확인 & 되돌리기',
      duration: 45,
      content: {
        objectives: [
          'git diff로 변경사항을 확인할 수 있다',
          'git restore로 변경사항을 취소할 수 있다',
          'git reset으로 커밋을 되돌릴 수 있다'
        ],
        instructions: `
## 변경사항 확인 & 되돌리기

### 1. 변경사항 확인 (git diff)

\`\`\`bash
# 파일 수정
echo "print('Updated!')" >> main.py

# Working Directory 변경사항 확인
git diff

# Staging Area 변경사항 확인
git diff --staged

# 특정 파일만 확인
git diff main.py
\`\`\`

### git diff 출력 이해하기

\`\`\`diff
diff --git a/main.py b/main.py
index abc1234..def5678 100644
--- a/main.py
+++ b/main.py
@@ -1 +1,2 @@
 print('Hello Git!')
+print('Updated!')      <-- 추가된 줄 (녹색)
\`\`\`

### 2. 변경사항 취소 (git restore)

\`\`\`bash
# Working Directory 변경 취소 (스테이징 전)
git restore main.py

# Staging Area에서 제거 (add 취소)
git restore --staged main.py

# 특정 커밋으로 파일 복원
git restore --source=HEAD~1 main.py
\`\`\`

### 3. 커밋 되돌리기 (git reset)

\`\`\`
reset 종류:

--soft   커밋만 취소, 변경사항 유지 (Staging)
--mixed  커밋 취소, 변경사항 유지 (Working) [기본값]
--hard   커밋 취소, 변경사항도 삭제 ⚠️ 주의!
\`\`\`

\`\`\`bash
# 마지막 커밋 취소 (변경사항 유지)
git reset --soft HEAD~1

# 마지막 커밋 취소 (스테이징 해제)
git reset HEAD~1

# 완전히 되돌리기 (⚠️ 변경사항 삭제!)
git reset --hard HEAD~1
\`\`\`

### 4. 커밋 수정 (git commit --amend)

\`\`\`bash
# 마지막 커밋 메시지 수정
git commit --amend -m "새로운 커밋 메시지"

# 마지막 커밋에 파일 추가
git add forgotten-file.py
git commit --amend --no-edit
\`\`\`

### 되돌리기 요약

\`\`\`
상황별 되돌리기:

파일 수정 취소 (add 전)
└── git restore <file>

스테이징 취소 (commit 전)
└── git restore --staged <file>

커밋 취소 (변경 유지)
└── git reset --soft HEAD~1

커밋 취소 (변경 삭제)
└── git reset --hard HEAD~1 ⚠️

커밋 메시지 수정
└── git commit --amend
\`\`\`
        `,
        starterCode: `# 실습: 변경사항 확인 및 되돌리기

# 1. 기존 프로젝트로 이동 (또는 새로 생성)
cd git-practice

# 2. 파일 수정
echo "새로운 내용" >> README.md

# 3. 변경사항 확인
git diff

# 4. 변경 취소
git restore README.md

# 5. 확인
cat README.md
git status`,
        solutionCode: `$ cd git-practice
$ echo "새로운 내용" >> README.md
$ cat README.md
# Git 연습
새로운 내용

$ git diff
diff --git a/README.md b/README.md
--- a/README.md
+++ b/README.md
@@ -1 +1,2 @@
 # Git 연습
+새로운 내용

$ git restore README.md
$ cat README.md
# Git 연습

$ git status
On branch main
nothing to commit, working tree clean`
      }
    },
    {
      id: 'git-day1-quiz',
      type: 'quiz',
      title: 'Day 1 퀴즈',
      duration: 30,
      content: {
        questions: [
          {
            question: 'Git의 3가지 영역 중 "다음 커밋에 포함될 파일들"이 있는 곳은?',
            options: ['Working Directory', 'Staging Area', 'Repository', 'Remote'],
            answer: 1,
            explanation: 'Staging Area(스테이징 영역)는 git add로 추가된 파일들이 있는 곳으로, 다음 커밋에 포함될 변경사항들이 대기합니다.'
          },
          {
            question: '새로운 Git 저장소를 생성하는 명령어는?',
            options: ['git create', 'git new', 'git init', 'git start'],
            answer: 2,
            explanation: 'git init은 현재 디렉토리를 Git 저장소로 초기화합니다. .git 폴더가 생성됩니다.'
          },
          {
            question: 'Working Directory의 변경사항을 취소하는 명령어는?',
            options: ['git reset', 'git restore', 'git revert', 'git undo'],
            answer: 1,
            explanation: 'git restore <file>은 Working Directory의 변경사항을 취소하고 마지막 커밋 상태로 되돌립니다.'
          },
          {
            question: '다음 중 올바른 커밋 메시지 형식은?',
            options: ['update', 'fix: Fix login bug', 'asdf', 'changes'],
            answer: 1,
            explanation: '좋은 커밋 메시지는 "타입: 제목" 형식을 따릅니다. fix, feat, docs 등의 타입과 명확한 설명을 포함해야 합니다.'
          },
          {
            question: 'git reset --hard HEAD~1 명령의 결과는?',
            options: [
              '마지막 커밋만 취소, 변경사항은 Staging에 유지',
              '마지막 커밋만 취소, 변경사항은 Working에 유지',
              '마지막 커밋 취소, 변경사항도 삭제',
              '아무 변화 없음'
            ],
            answer: 2,
            explanation: '--hard 옵션은 커밋뿐 아니라 변경사항도 완전히 삭제합니다. 주의해서 사용해야 합니다!'
          }
        ]
      }
    }
  ]
}

const day2: Day = {
  slug: 'git-branch',
  title: '브랜치와 협업',
  totalDuration: 180,
  tasks: [
    {
      id: 'git-branch-concept',
      type: 'reading',
      title: '브랜치란?',
      duration: 30,
      content: {
        objectives: [
          '브랜치의 개념과 필요성을 이해한다',
          'main/feature/hotfix 브랜치 전략을 이해한다',
          '브랜치 워크플로우를 파악한다'
        ],
        markdown: `
## 브랜치란?

### 브랜치의 필요성

\`\`\`
브랜치 없이 협업하면?

개발자A: "내가 수정 중이니 건드리지 마!"
개발자B: "나도 수정해야 하는데..."
개발자C: "충돌나서 다 날아갔어!"

😱 동시 작업 불가능!
\`\`\`

### 브랜치 = 독립적인 작업 공간

\`\`\`
          feature/login
             ↗
main ──●──●──●──●──●──● (안정된 코드)
             ↘
          feature/signup

각자 독립적으로 작업 후 나중에 합치기!
\`\`\`

### 브랜치 전략 (Git Flow)

\`\`\`
브랜치 종류:

main (master)
├── 항상 배포 가능한 상태
├── 직접 커밋 금지 (PR로만!)
└── 태그로 버전 관리

develop
├── 개발 중인 코드
├── feature 브랜치 병합 대상
└── 다음 릴리즈 준비

feature/*
├── 새 기능 개발
├── develop에서 분기
└── 완료 후 develop에 병합

hotfix/*
├── 긴급 버그 수정
├── main에서 분기
└── main과 develop 둘 다 병합

release/*
├── 릴리즈 준비
├── develop에서 분기
└── 테스트 후 main에 병합
\`\`\`

### 간단한 브랜치 전략 (GitHub Flow)

\`\`\`
작은 팀에서는 간단하게:

main ──●──●──●──●──● (배포)
          ↖
      feature/xxx ──●──●

1. main에서 feature 분기
2. 작업 & 커밋
3. PR 생성
4. 코드 리뷰
5. main에 병합
\`\`\`

### HEAD란?

\`\`\`
HEAD = "지금 내가 보고 있는 커밋"

     main
       ↓
──●──●──●──●
             ↑
            HEAD

브랜치를 바꾸면 HEAD도 이동!
\`\`\`
        `,
        externalLinks: [
          { title: 'Git Flow 설명', url: 'https://nvie.com/posts/a-successful-git-branching-model/' },
          { title: 'GitHub Flow', url: 'https://docs.github.com/en/get-started/quickstart/github-flow' }
        ]
      }
    },
    {
      id: 'git-branch-commands',
      type: 'code',
      title: '브랜치 명령어',
      duration: 45,
      content: {
        objectives: [
          'git branch로 브랜치를 생성/삭제할 수 있다',
          'git checkout/switch로 브랜치를 전환할 수 있다',
          '브랜치 목록을 확인할 수 있다'
        ],
        instructions: `
## 브랜치 명령어

### 1. 브랜치 목록 확인

\`\`\`bash
# 로컬 브랜치 목록
git branch

# 원격 브랜치 포함
git branch -a

# 마지막 커밋 정보와 함께
git branch -v
\`\`\`

### 2. 브랜치 생성

\`\`\`bash
# 브랜치 생성 (전환 X)
git branch feature/login

# 브랜치 생성 + 전환
git checkout -b feature/login
# 또는 (Git 2.23+)
git switch -c feature/login
\`\`\`

### 3. 브랜치 전환

\`\`\`bash
# 브랜치 전환
git checkout feature/login
# 또는 (Git 2.23+)
git switch feature/login

# 이전 브랜치로 돌아가기
git checkout -
git switch -
\`\`\`

### 4. 브랜치 삭제

\`\`\`bash
# 병합된 브랜치 삭제
git branch -d feature/login

# 강제 삭제 (병합 안 된 경우)
git branch -D feature/login
\`\`\`

### 5. 브랜치 이름 변경

\`\`\`bash
# 현재 브랜치 이름 변경
git branch -m new-name

# 다른 브랜치 이름 변경
git branch -m old-name new-name
\`\`\`

### checkout vs switch

\`\`\`
Git 2.23+ 에서 checkout을 분리:

checkout (만능)
├── 브랜치 전환: git checkout branch
├── 브랜치 생성: git checkout -b branch
└── 파일 복원: git checkout -- file

switch (브랜치 전용)
├── 브랜치 전환: git switch branch
└── 브랜치 생성: git switch -c branch

restore (복원 전용)
└── 파일 복원: git restore file

더 명확한 명령어 사용 권장!
\`\`\`
        `,
        starterCode: `# 실습: 브랜치 생성 및 전환

# 1. 브랜치 목록 확인
git branch

# 2. 새 브랜치 생성
git branch feature/hello

# 3. 브랜치 전환
git switch feature/hello

# 4. 파일 생성 & 커밋
echo "Hello from feature branch!" > hello.txt
git add hello.txt
git commit -m "feat: Add hello.txt"

# 5. main으로 돌아가기
git switch main

# 6. hello.txt 확인 (없어야 함!)
ls`,
        solutionCode: `$ git branch
* main

$ git branch feature/hello
$ git branch
  feature/hello
* main

$ git switch feature/hello
Switched to branch 'feature/hello'

$ echo "Hello from feature branch!" > hello.txt
$ git add hello.txt
$ git commit -m "feat: Add hello.txt"
[feature/hello abc1234] feat: Add hello.txt

$ git switch main
Switched to branch 'main'

$ ls
README.md
# hello.txt가 없음! (feature 브랜치에만 존재)`
      }
    },
    {
      id: 'git-merge',
      type: 'code',
      title: '브랜치 병합 (Merge)',
      duration: 45,
      content: {
        objectives: [
          'git merge로 브랜치를 병합할 수 있다',
          'Fast-forward와 3-way merge를 이해한다',
          '병합 충돌을 해결할 수 있다'
        ],
        instructions: `
## 브랜치 병합 (Merge)

### 1. 기본 병합

\`\`\`bash
# main 브랜치로 이동
git switch main

# feature 브랜치 병합
git merge feature/hello
\`\`\`

### 2. Fast-forward Merge

\`\`\`
main에서 분기 후 main에 변화가 없을 때:

Before:
main ──●──●
          ↘
      feature ──●──●

After (Fast-forward):
main ──●──●──●──●
               (단순히 포인터만 이동)
\`\`\`

### 3. 3-way Merge

\`\`\`
main에서도 변경이 있을 때:

Before:
main ──●──●──●
          ↘
      feature ──●──●

After (Merge Commit 생성):
main ──●──●──●──────●
          ↘       ↗
      feature ──●──●
\`\`\`

### 4. 병합 충돌 (Conflict)

\`\`\`
같은 파일의 같은 부분을 수정하면 충돌!

<<<<<<< HEAD
main에서 수정한 내용
=======
feature에서 수정한 내용
>>>>>>> feature/xxx
\`\`\`

### 5. 충돌 해결 과정

\`\`\`bash
# 1. 충돌 발생
git merge feature/hello
# CONFLICT (content): Merge conflict in file.txt

# 2. 충돌 파일 확인
git status
# both modified: file.txt

# 3. 파일 열어서 직접 수정
# <<<, ===, >>> 마커 제거하고 원하는 내용으로 수정

# 4. 해결 완료 표시
git add file.txt

# 5. 병합 커밋
git commit -m "Merge feature/hello, resolve conflicts"
\`\`\`

### 6. 병합 취소

\`\`\`bash
# 충돌 중 병합 취소
git merge --abort

# 병합 커밋 후 되돌리기
git reset --hard HEAD~1
\`\`\`

### 병합 전략 옵션

\`\`\`bash
# Fast-forward만 허용 (충돌 시 실패)
git merge --ff-only feature/hello

# 항상 병합 커밋 생성
git merge --no-ff feature/hello

# Squash (하나의 커밋으로)
git merge --squash feature/hello
git commit -m "feat: Add hello feature"
\`\`\`
        `,
        starterCode: `# 실습: 브랜치 병합

# 1. main에서 feature 브랜치 병합
git switch main
git merge feature/hello

# 2. 결과 확인
git log --oneline --graph
ls  # hello.txt가 있어야 함

# 3. 병합된 브랜치 삭제
git branch -d feature/hello`,
        solutionCode: `$ git switch main
Already on 'main'

$ git merge feature/hello
Updating abc1234..def5678
Fast-forward
 hello.txt | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 hello.txt

$ git log --oneline --graph
* def5678 (HEAD -> main) feat: Add hello.txt
* abc1234 docs: Add README

$ ls
README.md  hello.txt

$ git branch -d feature/hello
Deleted branch feature/hello (was def5678).`
      }
    },
    {
      id: 'git-remote',
      type: 'code',
      title: 'GitHub 원격 저장소',
      duration: 45,
      content: {
        objectives: [
          'GitHub에서 저장소를 생성할 수 있다',
          'git remote로 원격 저장소를 연결할 수 있다',
          'git push/pull로 코드를 동기화할 수 있다'
        ],
        instructions: `
## GitHub 원격 저장소

### 1. GitHub 저장소 생성

1. github.com 로그인
2. New Repository 클릭
3. 이름 입력, Create 클릭

### 2. 원격 저장소 연결

\`\`\`bash
# 원격 저장소 추가
git remote add origin https://github.com/username/repo.git

# 원격 저장소 확인
git remote -v
# origin  https://github.com/username/repo.git (fetch)
# origin  https://github.com/username/repo.git (push)
\`\`\`

### 3. Push (업로드)

\`\`\`bash
# 첫 번째 push (-u로 upstream 설정)
git push -u origin main

# 이후 push
git push
\`\`\`

### 4. Pull (다운로드)

\`\`\`bash
# 원격 변경사항 가져오기 + 병합
git pull

# 가져오기만 (병합 X)
git fetch
\`\`\`

### 5. Clone (복제)

\`\`\`bash
# 원격 저장소 복제
git clone https://github.com/username/repo.git

# 다른 이름으로 복제
git clone https://github.com/username/repo.git my-folder
\`\`\`

### Push/Pull/Fetch 차이

\`\`\`
┌──────────┐                  ┌──────────┐
│  Local   │                  │  Remote  │
│  (내 PC)  │                  │ (GitHub) │
└──────────┘                  └──────────┘
      │                             │
      │────── git push ──────────▶│
      │        (업로드)             │
      │                             │
      │◀───── git pull ───────────│
      │     (다운로드 + 병합)        │
      │                             │
      │◀───── git fetch ──────────│
      │      (다운로드만)           │
      │                             │
\`\`\`

### SSH 설정 (선택)

\`\`\`bash
# SSH 키 생성
ssh-keygen -t ed25519 -C "your@email.com"

# 공개키 복사
cat ~/.ssh/id_ed25519.pub
# GitHub Settings > SSH Keys에 등록

# SSH로 clone
git clone git@github.com:username/repo.git
\`\`\`

### 원격 브랜치

\`\`\`bash
# 원격 브랜치 목록
git branch -r

# 원격 브랜치 가져오기
git fetch origin feature/xxx
git checkout feature/xxx

# 로컬 브랜치를 원격에 push
git push -u origin feature/new
\`\`\`
        `,
        starterCode: `# 실습: GitHub 연동

# 1. GitHub에서 새 저장소 생성 (웹에서)

# 2. 원격 저장소 연결
git remote add origin https://github.com/YOUR_USERNAME/git-practice.git

# 3. 확인
git remote -v

# 4. Push
git push -u origin main

# 5. GitHub에서 확인!`,
        solutionCode: `# GitHub 저장소 생성 후:

$ git remote add origin https://github.com/kelly/git-practice.git
$ git remote -v
origin  https://github.com/kelly/git-practice.git (fetch)
origin  https://github.com/kelly/git-practice.git (push)

$ git push -u origin main
Enumerating objects: 6, done.
Counting objects: 100% (6/6), done.
Compressing objects: 100% (4/4), done.
Writing objects: 100% (6/6), 523 bytes | 523.00 KiB/s, done.
Total 6 (delta 0), reused 0 (delta 0)
To https://github.com/kelly/git-practice.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.`
      }
    },
    {
      id: 'git-day2-quiz',
      type: 'quiz',
      title: 'Day 2 퀴즈',
      duration: 15,
      content: {
        questions: [
          {
            question: '새 브랜치를 생성하면서 동시에 전환하는 명령어는?',
            options: ['git branch new-branch', 'git switch -c new-branch', 'git checkout new-branch', 'git merge new-branch'],
            answer: 1,
            explanation: 'git switch -c (또는 git checkout -b)는 새 브랜치를 생성하면서 동시에 전환합니다.'
          },
          {
            question: 'main에서 분기 후 main에 변화가 없을 때 발생하는 병합 유형은?',
            options: ['3-way merge', 'Fast-forward merge', 'Squash merge', 'Rebase merge'],
            answer: 1,
            explanation: 'Fast-forward merge는 main에 추가 커밋이 없을 때 단순히 포인터만 이동시키는 방식입니다.'
          },
          {
            question: '원격 저장소의 변경사항을 가져오되 병합하지 않는 명령어는?',
            options: ['git pull', 'git fetch', 'git clone', 'git push'],
            answer: 1,
            explanation: 'git fetch는 원격 저장소의 변경사항만 다운로드하고, 병합은 하지 않습니다. git pull = git fetch + git merge입니다.'
          },
          {
            question: '병합 충돌 발생 시 병합을 취소하는 명령어는?',
            options: ['git reset', 'git restore', 'git merge --abort', 'git revert'],
            answer: 2,
            explanation: 'git merge --abort는 진행 중인 병합을 취소하고 병합 전 상태로 되돌립니다.'
          },
          {
            question: '로컬 브랜치를 처음 원격에 push할 때 upstream을 설정하는 옵션은?',
            options: ['-f', '-u', '-a', '-m'],
            answer: 1,
            explanation: 'git push -u origin branch는 upstream을 설정하여 이후 git push만으로 같은 원격 브랜치에 push할 수 있게 합니다.'
          }
        ]
      }
    }
  ]
}

const day3: Day = {
  slug: 'git-workflow',
  title: '실전 Git 워크플로우',
  totalDuration: 180,
  tasks: [
    {
      id: 'git-pr',
      type: 'reading',
      title: 'Pull Request (PR)',
      duration: 30,
      content: {
        objectives: [
          'Pull Request의 목적과 과정을 이해한다',
          'PR 작성법을 익힌다',
          '코드 리뷰 문화를 이해한다'
        ],
        markdown: `
## Pull Request (PR)

### PR이란?

\`\`\`
Pull Request = "내 코드를 검토하고 병합해주세요!"

개발자 A                 Reviewer
    │                       │
    │──── PR 생성 ────────▶│
    │                       │ 코드 검토
    │◀─── 코멘트 ──────────│
    │                       │
    │──── 수정 ───────────▶│
    │                       │
    │◀─── Approve ─────────│
    │                       │
    │──── Merge ──────────▶│
\`\`\`

### PR 워크플로우

\`\`\`
1. main에서 feature 브랜치 생성
   git switch -c feature/login

2. 코드 작성 & 커밋
   git add .
   git commit -m "feat: Add login"

3. 원격에 push
   git push -u origin feature/login

4. GitHub에서 PR 생성
   - Compare & pull request 클릭
   - 제목, 설명 작성
   - Reviewer 지정
   - Create pull request

5. 코드 리뷰 & 수정
   - 리뷰어 코멘트 확인
   - 필요시 추가 커밋

6. Approve & Merge
   - 리뷰어 승인
   - Merge pull request
   - Delete branch
\`\`\`

### 좋은 PR 작성법

\`\`\`markdown
## PR 제목
feat: Add user login with OAuth

## 설명
### 변경 사항
- Google OAuth 로그인 구현
- 로그인 상태 유지 (세션)
- 로그아웃 기능

### 테스트
- [x] 로컬 테스트 완료
- [x] 단위 테스트 통과

### 스크린샷
(UI 변경 시 첨부)

### 관련 이슈
Closes #123
\`\`\`

### 코드 리뷰 예절

\`\`\`
리뷰어로서:
✅ 구체적인 피드백
✅ 개선 제안과 함께 이유 설명
✅ 좋은 부분도 칭찬
❌ 비난이나 인신공격
❌ "이건 별로예요" (구체적 이유 없이)

작성자로서:
✅ 피드백 수용하는 자세
✅ 의견 차이는 토론으로
✅ 감사 표현
❌ 방어적 태도
\`\`\`

### PR Merge 전략

\`\`\`
1. Merge Commit (기본)
   - 모든 커밋 히스토리 유지
   - 병합 커밋 생성

2. Squash and Merge
   - 모든 커밋을 하나로 압축
   - 깔끔한 히스토리
   - feature 브랜치에 권장

3. Rebase and Merge
   - 커밋을 main 위에 재배치
   - 선형 히스토리
   - 충돌 해결 필요할 수 있음
\`\`\`
        `,
        externalLinks: [
          { title: 'GitHub PR 문서', url: 'https://docs.github.com/en/pull-requests' },
          { title: '효과적인 코드 리뷰', url: 'https://google.github.io/eng-practices/review/' }
        ]
      }
    },
    {
      id: 'git-gitignore',
      type: 'code',
      title: '.gitignore 설정',
      duration: 30,
      content: {
        objectives: [
          '.gitignore의 목적을 이해한다',
          '프로젝트에 맞는 .gitignore를 작성할 수 있다',
          '이미 추적 중인 파일을 제외할 수 있다'
        ],
        instructions: `
## .gitignore 설정

### .gitignore란?

\`\`\`
Git에서 무시할 파일/폴더 목록

추적하면 안 되는 것들:
├── 비밀 정보 (API 키, 비밀번호)
├── 빌드 결과물 (dist/, build/)
├── 의존성 폴더 (node_modules/, venv/)
├── 로그 파일 (*.log)
├── OS 파일 (.DS_Store, Thumbs.db)
└── IDE 설정 (.idea/, .vscode/)
\`\`\`

### .gitignore 문법

\`\`\`gitignore
# 주석

# 특정 파일
secrets.json
.env

# 특정 확장자
*.log
*.pyc

# 특정 폴더
node_modules/
__pycache__/
dist/

# 폴더 내 특정 파일
logs/*.log

# 예외 (! 사용)
!important.log

# 패턴 매칭
*.py[cod]  # .pyc, .pyo, .pyd
\`\`\`

### Python 프로젝트 .gitignore

\`\`\`gitignore
# 가상환경
venv/
.venv/
env/

# Python
__pycache__/
*.py[cod]
*.so
.Python

# 환경 변수
.env
.env.local

# IDE
.idea/
.vscode/
*.swp

# 빌드
dist/
build/
*.egg-info/

# 테스트
.pytest_cache/
.coverage
htmlcov/

# Jupyter
.ipynb_checkpoints/
\`\`\`

### Node.js 프로젝트 .gitignore

\`\`\`gitignore
# Dependencies
node_modules/

# Build
dist/
build/

# Environment
.env
.env.local
.env.*.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.idea/
.vscode/

# OS
.DS_Store
Thumbs.db
\`\`\`

### 이미 추적 중인 파일 제외

\`\`\`bash
# .gitignore에 추가 후에도 추적되는 경우

# 1. 캐시에서 제거
git rm --cached secrets.json

# 폴더인 경우
git rm -r --cached node_modules/

# 2. 커밋
git commit -m "chore: Remove secrets from tracking"
\`\`\`

### 전역 .gitignore

\`\`\`bash
# 전역 설정 (모든 프로젝트에 적용)
git config --global core.excludesfile ~/.gitignore_global

# ~/.gitignore_global 생성
.DS_Store
Thumbs.db
*.swp
.idea/
\`\`\`
        `,
        starterCode: `# 실습: .gitignore 만들기

# 1. .gitignore 파일 생성
cat > .gitignore << 'EOF'
# 환경 변수
.env

# Python
__pycache__/
*.pyc
venv/

# IDE
.vscode/
.idea/

# OS
.DS_Store
EOF

# 2. 테스트용 파일 생성
echo "API_KEY=secret123" > .env
mkdir __pycache__
touch __pycache__/test.pyc

# 3. 상태 확인 (.env와 __pycache__가 무시되는지)
git status`,
        solutionCode: `$ cat > .gitignore << 'EOF'
# 환경 변수
.env

# Python
__pycache__/
*.pyc
venv/

# IDE
.vscode/
.idea/

# OS
.DS_Store
EOF

$ echo "API_KEY=secret123" > .env
$ mkdir __pycache__
$ touch __pycache__/test.pyc

$ git status
On branch main
Untracked files:
  .gitignore

# .env와 __pycache__/가 목록에 없음 = 무시됨!

$ git add .gitignore
$ git commit -m "chore: Add .gitignore"`
      }
    },
    {
      id: 'git-stash',
      type: 'code',
      title: 'Git Stash',
      duration: 30,
      content: {
        objectives: [
          'git stash의 용도를 이해한다',
          '작업 중인 변경사항을 임시 저장할 수 있다',
          'stash를 관리할 수 있다'
        ],
        instructions: `
## Git Stash

### Stash가 필요한 상황

\`\`\`
상황: feature 작업 중 긴급 버그 수정 요청!

문제:
- 현재 작업 커밋하기엔 미완성
- 브랜치 전환하면 변경사항 충돌

해결:
- stash로 임시 저장
- 버그 수정
- stash에서 복원
\`\`\`

### 기본 사용법

\`\`\`bash
# 1. 현재 변경사항 임시 저장
git stash

# 2. 다른 브랜치로 이동해서 작업
git switch main
# ... 버그 수정 ...

# 3. 원래 브랜치로 돌아와서 복원
git switch feature/login
git stash pop
\`\`\`

### Stash 명령어

\`\`\`bash
# 메시지와 함께 저장
git stash push -m "WIP: Login form"

# 목록 확인
git stash list
# stash@{0}: WIP: Login form
# stash@{1}: On feature: API work

# 내용 확인
git stash show stash@{0}
git stash show -p stash@{0}  # 상세

# 복원 (삭제 X)
git stash apply stash@{0}

# 복원 + 삭제
git stash pop stash@{0}

# 삭제
git stash drop stash@{0}

# 전체 삭제
git stash clear
\`\`\`

### Stash 옵션

\`\`\`bash
# Untracked 파일도 포함
git stash -u
git stash --include-untracked

# Staged 상태 유지
git stash --keep-index

# 특정 파일만 stash
git stash push -m "message" path/to/file
\`\`\`

### Stash를 브랜치로

\`\`\`bash
# stash를 새 브랜치로 만들기
git stash branch new-feature stash@{0}

# 결과: new-feature 브랜치 생성 + stash 적용
\`\`\`

### Stash 활용 예시

\`\`\`
시나리오: feature 작업 중 hotfix 요청

1. git stash push -m "WIP: feature"
2. git switch main
3. git switch -c hotfix/urgent
4. ... 수정 & 커밋 ...
5. git switch main && git merge hotfix/urgent
6. git switch feature/xxx
7. git stash pop
8. 계속 작업!
\`\`\`
        `,
        starterCode: `# 실습: Stash 사용하기

# 1. 작업 중인 파일 생성
echo "작업 중..." > work-in-progress.txt
git status

# 2. Stash에 저장
git stash push -m "WIP: 진행중인 작업"

# 3. 상태 확인 (clean해야 함)
git status
ls  # work-in-progress.txt가 없어야 함

# 4. Stash 목록 확인
git stash list

# 5. Stash 복원
git stash pop

# 6. 파일 확인
ls  # work-in-progress.txt가 다시 생김
cat work-in-progress.txt`,
        solutionCode: `$ echo "작업 중..." > work-in-progress.txt
$ git status
Untracked files:
  work-in-progress.txt

$ git stash push -u -m "WIP: 진행중인 작업"
Saved working directory and index state On main: WIP: 진행중인 작업

$ git status
nothing to commit, working tree clean

$ ls
README.md  hello.txt

$ git stash list
stash@{0}: On main: WIP: 진행중인 작업

$ git stash pop
Already applied: 0
Dropped stash@{0}

$ ls
README.md  hello.txt  work-in-progress.txt

$ cat work-in-progress.txt
작업 중...`
      }
    },
    {
      id: 'git-best-practices',
      type: 'reading',
      title: 'Git 베스트 프랙티스',
      duration: 30,
      content: {
        objectives: [
          'Git 사용 시 주의사항을 이해한다',
          '팀 협업을 위한 규칙을 익힌다',
          '자주 하는 실수를 방지할 수 있다'
        ],
        markdown: `
## Git 베스트 프랙티스

### 커밋 규칙

\`\`\`
1. 작은 단위로 자주 커밋
   ✅ 기능 하나 완성될 때마다
   ❌ 하루치 작업 한 번에

2. 의미 있는 커밋 메시지
   ✅ "feat: Add email validation"
   ❌ "update", "fix", "wip"

3. 작동하는 코드만 커밋
   ✅ 테스트 통과 확인 후
   ❌ 에러나는 코드 커밋

4. 관련 없는 변경 분리
   ✅ 버그 수정과 기능 추가 별도 커밋
   ❌ 모든 변경 한 커밋에
\`\`\`

### 브랜치 규칙

\`\`\`
1. main 직접 커밋 금지
   → PR로만 변경

2. 브랜치 이름 규칙
   feature/기능명
   bugfix/버그명
   hotfix/긴급수정

3. 짧은 생명주기
   → 작업 완료 후 빠르게 병합
   → 오래된 브랜치 = 충돌 지옥

4. 병합 후 브랜치 삭제
   → 깔끔한 브랜치 목록 유지
\`\`\`

### 절대 하면 안 되는 것

\`\`\`
⚠️ 위험한 명령어:

1. git push --force (to main)
   → 다른 사람 커밋 날아감!
   → --force-with-lease 사용

2. git reset --hard (push 후)
   → 이미 공유된 히스토리 변경
   → revert 사용

3. 비밀 정보 커밋
   → .env, API 키 등
   → 한 번 푸시하면 히스토리에 영원히 남음!

4. node_modules 커밋
   → .gitignore 필수
   → 저장소 용량 폭발
\`\`\`

### 비밀 정보 실수로 커밋했을 때

\`\`\`bash
# 아직 push 전이라면:
git reset --soft HEAD~1
# .gitignore 추가 후 다시 커밋

# 이미 push 했다면:
# 1. 즉시 키 무효화 (가장 중요!)
# 2. git-filter-repo로 히스토리에서 제거
# 3. force push (위험, 팀과 협의 필수)

# 가장 좋은 방법: 처음부터 실수하지 않기!
# → .env를 .gitignore에 먼저 추가
\`\`\`

### 충돌 예방법

\`\`\`
1. main을 자주 pull
   git switch feature/xxx
   git pull origin main

2. 작은 PR
   → 큰 변경 = 큰 충돌

3. 같은 파일 동시 수정 피하기
   → 팀 커뮤니케이션

4. 병합 전 로컬에서 테스트
   git merge main (로컬에서)
   충돌 해결 후 push
\`\`\`

### 유용한 Git Alias

\`\`\`bash
# ~/.gitconfig에 추가
[alias]
  st = status
  co = checkout
  br = branch
  ci = commit
  lg = log --oneline --graph --all
  last = log -1 HEAD
  unstage = reset HEAD --

# 사용
git st  # git status
git lg  # 예쁜 로그
\`\`\`
        `,
        externalLinks: [
          { title: 'Conventional Commits', url: 'https://www.conventionalcommits.org/' },
          { title: 'Git Best Practices', url: 'https://sethrobertson.github.io/GitBestPractices/' }
        ]
      }
    },
    {
      id: 'git-practice',
      type: 'code',
      title: '종합 실습: PR 워크플로우',
      duration: 45,
      content: {
        objectives: [
          '실제 PR 워크플로우를 경험한다',
          '브랜치 생성부터 병합까지 전 과정을 수행한다',
          'Git 명령어를 종합적으로 활용한다'
        ],
        instructions: `
## 종합 실습: PR 워크플로우

### 시나리오

"git-practice 프로젝트에 새로운 기능 추가하기"

### 실습 단계

\`\`\`bash
# 1. 최신 main 가져오기
git switch main
git pull origin main

# 2. Feature 브랜치 생성
git switch -c feature/add-calculator

# 3. 코드 작성
cat > calculator.py << 'EOF'
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

if __name__ == "__main__":
    print(f"1 + 2 = {add(1, 2)}")
    print(f"5 - 3 = {subtract(5, 3)}")
EOF

# 4. 테스트
python calculator.py

# 5. .gitignore 확인
echo "__pycache__/" >> .gitignore

# 6. 스테이징 & 커밋
git add calculator.py .gitignore
git commit -m "feat: Add calculator with add and subtract"

# 7. 곱셈 기능 추가
cat >> calculator.py << 'EOF'

def multiply(a, b):
    return a * b
EOF

# 8. 추가 커밋
git add calculator.py
git commit -m "feat: Add multiply function"

# 9. Push
git push -u origin feature/add-calculator

# 10. GitHub에서 PR 생성
# - Compare & pull request 클릭
# - 제목: "feat: Add calculator module"
# - 설명 작성
# - Create pull request

# 11. (리뷰 후) main에 병합
# GitHub에서 Merge pull request

# 12. 로컬 정리
git switch main
git pull origin main
git branch -d feature/add-calculator
\`\`\`
        `,
        starterCode: `# 종합 실습: Calculator 기능 추가

# 1. main 최신화
git switch main

# 2. Feature 브랜치 생성
git switch -c feature/add-calculator

# 3. calculator.py 작성
cat > calculator.py << 'EOF'
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

if __name__ == "__main__":
    print(f"1 + 2 = {add(1, 2)}")
    print(f"5 - 3 = {subtract(5, 3)}")
EOF

# 4. 커밋
git add calculator.py
git commit -m "feat: Add calculator module"

# 5. 로그 확인
git log --oneline`,
        solutionCode: `$ git switch main
Switched to branch 'main'

$ git switch -c feature/add-calculator
Switched to a new branch 'feature/add-calculator'

$ cat > calculator.py << 'EOF'
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

if __name__ == "__main__":
    print(f"1 + 2 = {add(1, 2)}")
    print(f"5 - 3 = {subtract(5, 3)}")
EOF

$ python calculator.py
1 + 2 = 3
5 - 3 = 2

$ git add calculator.py
$ git commit -m "feat: Add calculator module"
[feature/add-calculator abc1234] feat: Add calculator module
 1 file changed, 10 insertions(+)
 create mode 100644 calculator.py

$ git log --oneline
abc1234 (HEAD -> feature/add-calculator) feat: Add calculator module
def5678 (origin/main, main) chore: Add .gitignore
...`
      }
    },
    {
      id: 'git-day3-quiz',
      type: 'quiz',
      title: 'Day 3 퀴즈 (최종)',
      duration: 15,
      content: {
        questions: [
          {
            question: 'Pull Request의 주요 목적이 아닌 것은?',
            options: ['코드 리뷰', '변경사항 논의', '직접 main에 커밋', '협업 기록'],
            answer: 2,
            explanation: 'PR의 목적은 코드 리뷰와 협업입니다. main에 직접 커밋하는 것이 아니라, 리뷰 후 병합하는 방식입니다.'
          },
          {
            question: '.gitignore에 추가해야 할 파일이 아닌 것은?',
            options: ['.env', 'node_modules/', 'README.md', '__pycache__/'],
            answer: 2,
            explanation: 'README.md는 프로젝트 문서로 반드시 버전 관리해야 합니다. 나머지는 비밀 정보, 의존성, 캐시 파일로 무시해야 합니다.'
          },
          {
            question: 'git stash의 용도는?',
            options: ['파일 삭제', '브랜치 생성', '변경사항 임시 저장', '원격 동기화'],
            answer: 2,
            explanation: 'git stash는 커밋하지 않은 변경사항을 임시로 저장하여 나중에 복원할 수 있게 합니다.'
          },
          {
            question: '다음 중 위험한 Git 명령어는?',
            options: ['git pull', 'git push --force', 'git status', 'git log'],
            answer: 1,
            explanation: 'git push --force는 원격 저장소의 히스토리를 덮어쓰므로 다른 사람의 커밋을 날릴 수 있습니다.'
          },
          {
            question: '이미 추적 중인 파일을 .gitignore에 추가해도 계속 추적될 때 해결 방법은?',
            options: ['git delete', 'git rm --cached', 'git ignore', 'git reset --force'],
            answer: 1,
            explanation: 'git rm --cached <file>은 Git 인덱스에서 파일을 제거하지만 실제 파일은 유지합니다. 이후 .gitignore가 적용됩니다.'
          }
        ]
      }
    }
  ]
}

export const prereqGitWeek: Week = {
  slug: 'prereq-git',
  week: 5,
  phase: 0,
  month: 0,
  access: 'free',
  title: 'Git 기초',
  topics: ['버전 관리', 'commit', 'branch', 'merge', 'GitHub', 'PR'],
  practice: 'GitHub PR 워크플로우',
  totalDuration: 540,
  days: [day1, day2, day3]
}
