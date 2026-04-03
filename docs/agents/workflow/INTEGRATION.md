# 🔌 OpenClaw 통합 가이드

버터봇 워크플로우 엔진을 OpenClaw에 실제로 연동하는 방법

---

## 🎯 목표

시뮬레이션 코드를 실제 OpenClaw API로 교체하여 진짜 서브에이전트가 작동하도록 만들기

---

## 📋 필요한 변경사항

### 1️⃣ TeamOrchestrator 수정

**현재 (시뮬레이션):**

```javascript
async simulateAgentExecution(team, prompt) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        team,
        status: 'completed',
        output: {
          deliverables: [`${team} 산출물`],
          notes: `${team} 팀 작업 완료`,
          files: [`/workspace/${team}-output.md`]
        },
        timestamp: new Date().toISOString()
      });
    }, 1000);
  });
}
```

**변경 후 (실제 OpenClaw):**

```javascript
async spawnTeamLeader(team, task, previousResults) {
  console.log(`  👤 ${team} 팀장 spawn 중...`);
  
  try {
    // 팀장 프롬프트 로드
    const promptPath = path.join(this.workspaceRoot, this.teamLeaderPrompts[team]);
    const promptContent = await fs.readFile(promptPath, 'utf-8');
    
    // 태스크 컨텍스트 생성
    const context = this.buildTeamContext(team, task, previousResults);
    
    // 서브에이전트 프롬프트 구성
    const agentPrompt = `${promptContent}

---

## 현재 태스크

${context}

위 태스크를 수행하고 결과를 다음 JSON 형식으로 보고하세요:

\`\`\`json
{
  "deliverables": ["산출물1", "산출물2"],
  "notes": "작업 내용 설명",
  "files": ["/workspace/파일경로1.md"]
}
\`\`\`
`;

    // ⭐ OpenClaw sessions_spawn 호출
    const spawnResult = await this.openclaw.sessions_spawn({
      runtime: 'agent:main',
      model: 'anthropic/claude-sonnet-4',
      prompt: agentPrompt,
      context: {
        taskId: task.id,
        team: team,
        workspace: `/workspace/tasks/${task.id}/${team}/`
      }
    });

    const sessionId = spawnResult.sessionId;
    console.log(`  📍 Session ID: ${sessionId}`);

    // ⭐ 서브에이전트 완료 대기
    await this.openclaw.sessions_yield({
      message: `${team} 팀장 작업 대기 중...`
    });

    // ⭐ 결과 수집
    const result = await this.openclaw.sessions_get_result(sessionId);
    
    console.log(`  ✓ ${team} 팀장 완료`);
    
    // JSON 파싱
    const output = this.parseAgentOutput(result.message);
    
    return {
      team,
      status: 'completed',
      output,
      sessionId,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error(`  ✗ ${team} 팀장 실패: ${error.message}`);
    throw error;
  }
}

/**
 * 에이전트 출력 파싱
 */
parseAgentOutput(message) {
  // JSON 블록 추출
  const jsonMatch = message.match(/```json\n([\s\S]*?)\n```/);
  
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch (e) {
      console.warn('JSON 파싱 실패, 원본 사용');
    }
  }
  
  // JSON 블록이 없으면 기본 구조
  return {
    deliverables: ['작업 완료'],
    notes: message,
    files: []
  };
}
```

**constructor에 OpenClaw 인스턴스 추가:**

```javascript
constructor(workspaceRoot, openclawInstance) {
  this.workspaceRoot = workspaceRoot;
  this.openclaw = openclawInstance;  // ⭐ 추가
  this.sessions = new Map();
  this.completedPhases = new Set();
  // ...
}
```

---

### 2️⃣ ReviewChecklist 수정

**현재 (랜덤 시뮬레이션):**

```javascript
async evaluateCheck(team, check, result) {
  const maxScore = check.weight * 20;
  const percentage = 0.7 + (Math.random() * 0.25);
  return Math.round(maxScore * percentage);
}
```

**변경 후 (실제 분석):**

```javascript
async evaluateCheck(team, check, result) {
  const maxScore = check.weight * 20;
  
  try {
    // 산출물 파일 읽기
    const files = result.output.files || [];
    if (files.length === 0) {
      return Math.round(maxScore * 0.5);  // 파일 없으면 50%
    }

    // 첫 번째 파일 내용 읽기
    const content = await fs.readFile(files[0], 'utf-8');

    // ⭐ AI로 품질 평가 (Oracle CLI 사용)
    const prompt = `다음 ${team} 팀 산출물을 "${check.name}" 기준으로 평가하세요.
    
체크 항목: ${check.name}
가중치: ${check.weight}
최대 점수: ${maxScore}

산출물:
${content}

${maxScore}점 만점으로 평가하고 점수만 숫자로 답변하세요.`;

    const scoreResult = await this.openclaw.exec({
      command: `echo "${prompt}" | oracle --engine claude-sonnet-4 --output-only`,
      capture: true
    });

    const score = parseInt(scoreResult.stdout.trim());
    
    if (isNaN(score)) {
      console.warn(`점수 파싱 실패: ${check.name}`);
      return Math.round(maxScore * 0.7);
    }

    return Math.min(score, maxScore);
    
  } catch (error) {
    console.error(`평가 실패: ${check.name}:`, error.message);
    return Math.round(maxScore * 0.6);
  }
}
```

**또는 간단하게 규칙 기반:**

```javascript
async evaluateCheck(team, check, result) {
  const maxScore = check.weight * 20;
  const files = result.output.files || [];
  
  if (files.length === 0) return Math.round(maxScore * 0.5);
  
  const content = await fs.readFile(files[0], 'utf-8');
  const wordCount = content.split(/\s+/).length;
  
  // 간단한 규칙
  let percentage = 0.6;  // 기본 60%
  
  if (check.id === 'key-message' && content.includes('UnButter')) {
    percentage += 0.2;
  }
  
  if (check.id === 'brand-tone' && /따뜻|자연/.test(content)) {
    percentage += 0.15;
  }
  
  if (wordCount > 500) percentage += 0.05;
  
  return Math.round(maxScore * Math.min(percentage, 1.0));
}
```

---

### 3️⃣ WorkflowEngine 수정

**constructor에 OpenClaw 전달:**

```javascript
const WorkflowEngine = require('./workflow-engine');

// OpenClaw 도구 컨텍스트에서 호출
class OpenClawWorkflowEngine extends WorkflowEngine {
  constructor(config, toolContext) {
    super(config);
    this.toolContext = toolContext;  // sessions_spawn, exec 등
    
    // Orchestrator에 전달
    this.orchestrator = new TeamOrchestrator(
      this.workspaceRoot,
      toolContext  // ⭐ OpenClaw API
    );
    
    // Reviewer에 전달
    this.reviewer = new ReviewChecklist(
      this.workspaceRoot,
      toolContext
    );
  }
}
```

---

## 🔧 실제 사용 예시

### OpenClaw 에이전트에서 호출

```javascript
// SOUL.md 또는 에이전트 코드에서

const WorkflowEngine = require('./unbutter-agents/workflow/workflow-engine');

// ⭐ this가 OpenClaw 에이전트 컨텍스트
const engine = new WorkflowEngine({
  workspaceRoot: '/Users/jeong-ing/.openclaw/workspace/unbutter-agents'
}, this);

const result = await engine.run("블로그 글 3편 작성해줘");

console.log(result.status);
```

### Slash 커맨드로 등록

`~/.openclaw/workspace/COMMANDS.md` 또는 커스텀 플러그인:

```javascript
// /workflow 커맨드
commands.register('workflow', async (args, context) => {
  const instruction = args.join(' ');
  
  const WorkflowEngine = require('./unbutter-agents/workflow/workflow-engine');
  const engine = new WorkflowEngine({}, context.agent);
  
  const result = await engine.run(instruction);
  
  return engine.generateFinalReport(result);
});
```

**사용:**
```
/workflow 블로그 글 3편 작성해줘
```

---

## 🧪 통합 테스트

### 1. 간단한 테스트

```javascript
const result = await engine.run("간단한 테스트 작업");
console.log('Task ID:', result.task.id);
console.log('Teams:', Object.keys(result.execution.results));
```

### 2. 실제 파일 확인

```bash
# 작업 디렉토리 확인
ls -la /workspace/tasks/task_xxx/

# 팀별 산출물
cat /workspace/tasks/task_xxx/planning/output.md
cat /workspace/tasks/task_xxx/design/mockup.png
```

### 3. 로그 확인

```bash
cat workflow/logs/task_xxx.json
cat workflow/reviews/task_xxx.json
cat workflow/retrospectives/task_xxx.json
```

---

## 📝 체크리스트

통합 완료 전 확인사항:

- [ ] `TeamOrchestrator.spawnTeamLeader()`에서 `sessions_spawn` 호출
- [ ] `sessions_yield()` 사용하여 서브에이전트 완료 대기
- [ ] 팀장 프롬프트 파일 경로 확인 (planning-lead-prompt.md 등)
- [ ] 서브에이전트 응답 JSON 파싱 로직 구현
- [ ] `ReviewChecklist.evaluateCheck()`에서 실제 파일 분석
- [ ] 브랜드 가이드라인 체크를 실제 텍스트 분석으로 교체
- [ ] 작업 디렉토리 생성 (`/workspace/tasks/${taskId}/`)
- [ ] 에러 핸들링 (서브에이전트 실패, 타임아웃 등)
- [ ] 통합 테스트 실행
- [ ] 실제 지시로 E2E 테스트

---

## 🚀 프로덕션 준비

### 1. 에러 복구

```javascript
async spawnTeamLeader(team, task, previousResults, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await this._spawnTeamLeader(team, task, previousResults);
    } catch (error) {
      console.error(`${team} 실패 (${i+1}/${retries}):`, error.message);
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 2000));  // 2초 대기
    }
  }
}
```

### 2. 타임아웃

```javascript
async spawnTeamLeader(team, task, previousResults) {
  const timeout = 300000;  // 5분
  
  const promise = this._spawnTeamLeader(team, task, previousResults);
  
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}
```

### 3. 상태 모니터링

```javascript
// 실시간 상태 업데이트
async execute(task) {
  this.emit('workflow:start', task.id);
  
  for (let phase of phases) {
    this.emit('phase:start', { phase: phase.phase, teams: phase.steps });
    const results = await this.executePhase(phase, task);
    this.emit('phase:complete', { phase: phase.phase, results });
  }
  
  this.emit('workflow:complete', executionLog);
}
```

---

## 🔍 디버깅 팁

### 서브에이전트 로그 확인

```javascript
// sessions_spawn 후
console.log('Spawned session:', sessionId);

// 중간 상태 확인
const status = await this.openclaw.sessions_status(sessionId);
console.log('Session status:', status);
```

### JSON 파싱 실패 시

```javascript
parseAgentOutput(message) {
  console.log('원본 메시지:', message);
  
  const jsonMatch = message.match(/```json\n([\s\S]*?)\n```/);
  console.log('JSON 매치:', jsonMatch);
  
  // ...
}
```

---

## 💡 다음 단계

1. ✅ 시뮬레이션 코드 교체
2. ⚙️ 실제 서브에이전트 테스트
3. 🔧 품질 평가 로직 정교화
4. 📊 대시보드/모니터링 추가
5. 🔄 CI/CD 파이프라인 구축

---

## 📞 문의

통합 중 문제가 생기면 로그와 함께 문의하세요!
