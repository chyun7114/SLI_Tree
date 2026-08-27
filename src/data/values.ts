import type { GrowthValue } from '../types/growth'

export const growthValues: GrowthValue[] = [
  {
    id: 'ai',
    title: 'AI',
    subtitle: 'Curiosity made tangible',
    description:
      '새로운 도구를 배우고 서로의 관점을 확장했던 순간들을 모았습니다. 질문이 가능성이 되고, 가능성이 실행으로 이어졌던 시간입니다.',
    sphereOffset: { x: -18, y: -8 },
    photos: [
      {
        id: 'ai-01',
        src: '/images/ai/01.jpg',
        alt: 'AI 입문 과정에서 화면을 함께 바라보는 장면',
        caption: '처음 만난 도구 앞에서 각자의 질문이 모이던 시간',
      },
      {
        id: 'ai-02',
        src: '/images/ai/02.jpg',
        alt: 'AI 실습 결과를 리뷰하는 장면',
        caption: '작은 프롬프트가 팀의 대화로 자라난 순간',
      },
      {
        id: 'ai-03',
        src: '/images/ai/03.jpg',
        alt: 'AI 워크숍 중 메모와 노트북이 놓인 테이블',
        caption: '낯선 기술을 우리 방식으로 이해해 간 기록',
      },
    ],
  },
  {
    id: 'integrity',
    title: 'Integrity',
    subtitle: 'Trust in every detail',
    description:
      '정직한 판단과 책임 있는 선택이 팀의 기반이 되었던 순간들입니다. 작은 약속을 지키는 태도가 성장의 토양이 되었습니다.',
    sphereOffset: { x: 18, y: 4 },
    photos: [
      {
        id: 'integrity-01',
        src: '/images/integrity/01.jpg',
        alt: 'Integrity 세션에서 의견을 나누는 구성원들',
        caption: '기준을 세우고 서로의 신뢰를 확인한 대화',
      },
      {
        id: 'integrity-02',
        src: '/images/integrity/02.jpg',
        alt: '워크숍 메모와 체크리스트',
        caption: '선택의 이유를 투명하게 남겼던 장면',
      },
      {
        id: 'integrity-03',
        src: '/images/integrity/03.jpg',
        alt: '팀 활동 후 정리된 테이블',
        caption: '좋은 결과보다 바른 과정이 먼저였던 시간',
      },
    ],
  },
  {
    id: 'professionalism',
    title: 'Professionalism',
    subtitle: 'Craft in practice',
    description:
      '몰입과 기준, 피드백을 통해 전문가다운 태도를 익힌 기록입니다. 각자의 역할을 더 선명하게 만들어 준 장면들을 담았습니다.',
    sphereOffset: { x: -10, y: 10 },
    photos: [
      {
        id: 'professionalism-01',
        src: '/images/professionalism/01.jpg',
        alt: 'Professionalism 실습 중 발표를 준비하는 장면',
        caption: '완성도를 위해 한 번 더 다듬었던 손길',
      },
      {
        id: 'professionalism-02',
        src: '/images/professionalism/02.jpg',
        alt: '팀원이 자료를 검토하는 모습',
        caption: '동료의 관점으로 기준을 높였던 리뷰',
      },
      {
        id: 'professionalism-03',
        src: '/images/professionalism/03.jpg',
        alt: '입문 과정 발표 공간',
        caption: '준비한 만큼 또렷해진 우리의 목소리',
      },
    ],
  },
  {
    id: 'value',
    title: 'Value',
    subtitle: 'Meaning beyond output',
    description:
      '우리가 만드는 일이 누구에게 어떤 의미가 되는지 함께 고민했던 순간입니다. 결과물 너머의 가치를 발견한 기억입니다.',
    sphereOffset: { x: 16, y: -4 },
    photos: [
      {
        id: 'value-01',
        src: '/images/value/01.jpg',
        alt: 'Value 세션에서 아이디어를 정리하는 장면',
        caption: '무엇을 남길 것인지 함께 묻던 시간',
      },
      {
        id: 'value-02',
        src: '/images/value/02.jpg',
        alt: '팀 보드에 붙은 메모들',
        caption: '작은 메모들이 하나의 방향으로 이어진 순간',
      },
      {
        id: 'value-03',
        src: '/images/value/03.jpg',
        alt: '입문 과정 마지막 회고 장면',
        caption: '경험이 가치가 되어 오래 남는 자리',
      },
    ],
  },
]
