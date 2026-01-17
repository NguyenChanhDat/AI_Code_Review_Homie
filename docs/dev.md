# AI_Coding_Review_Homie

## 📦 project info

- **name**: `Pablo Debugcasso`
- **description**: ai server for coding review (slave) :)))
- **author**: [NguyenChanhDat](https://github.com/NguyenChanhDat)
- **license**: isc

---

## ⚙️ prerequisites

make sure you have installed:

- [node.js](https://nodejs.org/) (>= 18)
- [typescript](https://www.typescriptlang.org/) no need to say much about this thing :))
- [ollama](https://ollama.ai/) installed locally for llm inference
- [docker](https://www.docker.com/) 2nd option, run ollama and chosen model on docker container if u want

---

## 🛠️ installation

clone the repo:

```bash
git clone https://github.com/NguyenChanhDat/AI_Coding_Review_Homie.git
cd AI_Coding_Review_Homie
```

install dependencies:

```bash
npm install
```

---

## 🚀 usage

start development server:

```bash
npm run dev
```

install [ollama](https://ollama.ai/) ur-self locally or
run ollama on Docker container by helper script:

```bash
npm run ollama
```

---

## 📂 project structure

```bash
.
├── src/
│   └── index.js          # main server entry
├── tools/
│   └── runOllama.sh      # helper script to run ollama container
├── package.json
└── README.md
```

---

## 🔑 environment variables

create a .env file in project root. common variables include:

```bash
OLLAMA_URL=http://127.0.0.1:11434  # (default ollama running url, u can also bind depend on ur personal favor)
PORT_SERVER=your_chosen_port
REPO_OWNER=your_repo_owner_name
REPOSITORY_NAME=your_repo_name
AI_MODEL=your_chosen_ai_model # (ex: codellama:7b)
```

---

## 🧪 scripts

script description

```bash
npm run dev	            # run the express server
npm run ollama	        # run setup ollama container script
```

---

## 📡 api usage

the server exposes a POST /review endpoint.

### request:

```http
POST /review HTTP/1.1
Content-Type: application/json
```

body:

```json
{
  "pullNumber": "42",
  "secretToken": "ghp_xxx_your_github_token"
}
```

- pullNumber: the pr number to review
- secretToken: github token for authentication

### response:

```json
{
  "status": "success",
  "message": "review has been submitted to pull request #42"
}
```

## 🤝 contributing

- fork the project

- create your feature branch (git checkout -b feature/foo)

- commit your changes (git commit -m 'add foo')

- push to branch (git push origin feature/foo)

- open a pull request

## 🐛 issues

if you encounter any bug or unexpected behavior, please open an issue here:
[issue tracker](https://github.com/NguyenChanhDat/AI_Code_Review_Homie/issues)
