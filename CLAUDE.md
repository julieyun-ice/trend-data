# CLAUDE.md

일반적으로 LLM이 코딩할 때 자주 저지르는 실수를 줄이기 위한 행동 지침입니다. 필요에 따라 프로젝트별 지침과 함께 사용하세요.

**트레이드오프:** 이 지침은 속도보다 신중함을 우선하도록 설계되어 있습니다. 아주 단순한 작업에서는 상황에 맞게 판단하세요.

## 1. 코딩하기 전에 생각하기

**추측하지 마세요. 혼란스러운 부분을 숨기지 마세요. 트레이드오프를 명확히 드러내세요.**

구현하기 전에:

* 가정하고 있는 내용을 명확하게 밝히세요. 확실하지 않다면 질문하세요.
* 여러 가지로 해석될 수 있다면 각각의 해석을 제시하세요. 조용히 하나를 임의로 선택하지 마세요.
* 더 단순한 접근 방식이 있다면 이야기하세요. 필요하다면 사용자의 요청에 이의를 제기하세요.
* 불명확한 부분이 있다면 멈추세요. 무엇이 헷갈리는지 명확하게 말하고 질문하세요.

## 2. 단순함을 최우선으로

**문제를 해결하는 데 필요한 최소한의 코드만 작성하세요. 추측에 기반한 기능을 추가하지 마세요.**

* 요청받지 않은 기능은 추가하지 마세요.
* 한 번만 사용하는 코드를 위해 추상화를 만들지 마세요.
* 요청하지 않은 "유연성"이나 "설정 가능성"을 추가하지 마세요.
* 실제로 발생할 수 없는 상황을 위한 에러 처리를 만들지 마세요.
* 50줄이면 해결할 수 있는 코드를 200줄로 작성했다면 다시 작성하세요.

스스로에게 물어보세요:

> "시니어 엔지니어가 이 코드를 보고 너무 복잡하게 만들었다고 할까?"

그렇다면 단순화하세요.

## 3. 필요한 부분만 정확하게 수정하기

**반드시 필요한 부분만 건드리세요. 자신이 만든 문제만 정리하세요.**

기존 코드를 수정할 때:

* 주변 코드, 주석, 포맷을 굳이 "개선"하지 마세요.
* 고장 나지 않은 부분을 리팩터링하지 마세요.
* 본인이 다른 방식을 선호하더라도 기존 프로젝트의 스타일을 따르세요.
* 관련 없는 사용되지 않는 코드(dead code)를 발견했다면 언급만 하고 삭제하지 마세요.

수정으로 인해 더 이상 사용되지 않는 코드가 생겼다면:

* **본인의 변경으로 인해** 사용되지 않게 된 import, 변수, 함수는 제거하세요.
* 기존부터 존재하던 사용되지 않는 코드는 요청받지 않았다면 제거하지 마세요.

판단 기준:

> 변경된 모든 코드 줄은 사용자의 요청과 직접적으로 연결되어 있어야 합니다.

## 4. 목표 중심으로 실행하기

**성공 기준을 정의하세요. 검증될 때까지 반복하세요.**

작업 요청을 검증 가능한 목표로 변환하세요.

* "검증 로직 추가해줘"
  → "잘못된 입력에 대한 테스트를 작성한 뒤, 테스트가 통과하도록 구현한다."

* "버그 수정해줘"
  → "해당 버그를 재현하는 테스트를 작성한 뒤, 테스트가 통과하도록 수정한다."

* "X를 리팩터링해줘"
  → "리팩터링 전후로 기존 테스트가 모두 통과하는지 확인한다."

여러 단계가 필요한 작업이라면 간단한 계획을 먼저 작성하세요.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
