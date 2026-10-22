export interface PerspectiveItem {
  id: 'build' | 'teach' | 'connect';
  index: string;
  label: string;
  heroTitle: string;
  heroBody: string;
  heroLinkText: string;
  heroLinkHref: string;
  heroHint: string;
  impactTitle: string;
  impactBody: string;
  impactLinkText: string;
  impactLinkHref: string;
}

export interface DisciplineStep {
  num: string;
  label: string;
}

export interface DisciplineItem {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  tags: string[];
  linkText: string;
  linkHref: string;
  leftTitle: string;
  steps: DisciplineStep[];
}

export interface VideoItem {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  categoryLabel: string;
  source: 'channel' | 'sheryians';
  url: string;
  thumbnail?: string;
}

export interface ProjectCaseStudy {
  slug: string;
  index: string;
  category: string;
  title: string;
  shortTitle: string;
  summary: string;
  tags: string[];
  image?: string;
  liveUrl?: string;
  year: string;
  role: string;
  context: string;
  challenge: string;
  approach: string;
  outcome: string;
  metrics: { value: string; label: string }[];
}

export const PERSPECTIVES: PerspectiveItem[] = [
  {
    id: 'build',
    index: '01 / 03',
    label: 'Build',
    heroTitle: 'Ideas into code. Infrastructure into impact',
    heroBody: 'Projects and experiments exploring software development, Linux, Docker, and cloud technologies.',
    heroLinkText: 'Explore my projects',
    heroLinkHref: '#work',
    heroHint: 'Choose a project. Discover the process.',
    impactTitle: 'Turn a real need into working software.',
    impactBody: 'From learning platforms to internal tools, I build products that carry the teaching and business operations behind the scenes.',
    impactLinkText: 'See the products',
    impactLinkHref: '#work',
  },
  {
    id: 'teach',
    index: '02 / 03',
    label: 'Insight',
    heroTitle: 'Make technology practical.',
    heroBody: 'Hands-on learning, technical experiments, and real-world projects that turn concepts into skills to cloud infrastructure and automation.',
    heroLinkText: 'Explore my journey',
    heroLinkHref: '/education',
    heroHint: 'Learn by building. Grow by doing.',
    impactTitle: '50,000+ learners. One clear idea at a time.',
    impactBody: 'Across classrooms and online courses, I help people move from following code to understanding what they can build.',
    impactLinkText: 'See the learning experience',
    impactLinkHref: '/education',
  },
  {
    id: 'connect',
    index: '03 / 03',
    label: 'Connect',
    heroTitle: 'Let the learning speak.',
    heroBody: 'Technical insights, project stories, and lessons from my journey shared to connect with people, exchange ideas, and grow with community.',
    heroLinkText: 'See the public side',
    heroLinkHref: '#voice',
    heroHint: 'Build with curiosity. Share with purpose.',
    impactTitle: 'Ideas that travel beyond the classroom.',
    impactBody: 'Content, developer conversations, and public talks that help engineering and education reach a wider community.',
    impactLinkText: 'Explore the voice',
    impactLinkHref: '#voice',
  },
];

export const THINKING_DISCIPLINES: DisciplineItem[] = [
  {
    id: 'engineering',
    eyebrow: '01',
    title: 'Languages',
    summary: '',
    tags: ['Python (Primary)', 'C', 'CPP', 'Java'],
    linkText: 'Background & full capabilities',
    linkHref: '/about#capabilities',
    leftTitle: 'MY TECH STACK',
    steps: [
      { num: '01', label: 'Code with purpose' },
      { num: '02', label: 'Work with systems' },
      { num: '03', label: 'Explore the cloud' },
    ],
  },
  {
    id: 'teaching',
    eyebrow: '02',
    title: 'Cloud & DeveOps.',
    summary: '',
    tags: ['Linux', 'Bash', 'Git/Github', 'AWS', 'Docker', 'Kubernetes'],
    linkText: 'Explore teaching & education',
    linkHref: '/education',
    leftTitle: 'MY TECH STACK',
    steps: [
      { num: '01', label: 'Code with purpose' },
      { num: '02', label: 'Work with systems' },
      { num: '03', label: 'Explore the cloud' },
    ],
  },
  {
    id: 'leadership',
    eyebrow: '03',
    title: 'Core Concepts.',
    summary: '',
    tags: [
      'DSA',
      'OOP',
      'Cloud Architecture',
      'Networking',
      'AWS',
      'AI Prompting',
      'Google AI Essentials',
    ],
    linkText: 'See speaking & leadership',
    linkHref: '/speaking',
    leftTitle: 'MY TECH STACK',
    steps: [
      { num: '01', label: 'Code with purpose' },
      { num: '02', label: 'Work with systems' },
      { num: '03', label: 'Explore the cloud' },
    ],
  },
];

export const VIDEOS: VideoItem[] = [
  {
    id: 'EL4s3qLj3kw',
    title: 'JavaScript: God Mode',
    subtitle: 'Complete foundations. Deep understanding.',
    duration: '01 / DEEP LESSON',
    categoryLabel: 'YOUTUBE · @MITHILESHTAYADE · TEACHING · INDEPENDENT CHANNEL',
    source: 'channel',
    url: 'https://www.youtube.com/watch?v=EL4s3qLj3kw',
  },
  {
    id: '3LRZRSIh_KE',
    title: 'React, from the ground up.',
    subtitle: 'React JS Full Course — Learn Everything',
    duration: '02 / FULL COURSE',
    categoryLabel: 'SHERYIANS CODING SCHOOL · COURSE INSTRUCTION',
    source: 'sheryians',
    url: 'https://www.youtube.com/watch?v=3LRZRSIh_KE',
  },
  {
    id: 'zaKXS_qGj7E',
    title: 'Inside a software team.',
    subtitle: 'How Software Is Actually Built in Companies',
    duration: '03 / CONVERSATION',
    categoryLabel: 'SHERYIANS CODING SCHOOL · CONVERSATION · DEVELOPER ROLES',
    source: 'sheryians',
    url: 'https://www.youtube.com/watch?v=zaKXS_qGj7E',
  },
  {
    id: 'hfo45JLNOGs',
    title: 'Functions. Understood.',
    subtitle: 'JavaScript Functions — God Mode, Part 2',
    duration: '04 / DEEP LESSON',
    categoryLabel: 'YOUTUBE · @MITHILESHTAYADE · TEACHING · INDEPENDENT CHANNEL',
    source: 'channel',
    url: 'https://www.youtube.com/watch?v=hfo45JLNOGs',
  },
  {
    id: 'GL2XA90F8cc',
    title: 'Arrays, beyond the basics.',
    subtitle: 'Master Arrays in JS — God Mode, Part 3',
    duration: '05 / DEEP LESSON',
    categoryLabel: 'YOUTUBE · @MITHILESHTAYADE · TEACHING · INDEPENDENT CHANNEL',
    source: 'channel',
    url: 'https://www.youtube.com/watch?v=GL2XA90F8cc',
  },
  {
    id: 'E6tAtRi82QY',
    title: 'Build with React.',
    subtitle: 'Complete React JS Course: MERN Stack Development',
    duration: '06 / COURSE',
    categoryLabel: 'SHERYIANS CODING SCHOOL · COURSE INSTRUCTION',
    source: 'sheryians',
    url: 'https://www.youtube.com/watch?v=E6tAtRi82QY',
  },
];

export const PROJECTS: ProjectCaseStudy[] = [
  {
    slug: 'sheryians-lms',
    index: '01',
    category: 'PRODUCT · ENGINEERING',
    title: 'Sheryians Learning Management System',
    shortTitle: 'Sheryians LMS',
    summary: 'From discovering a course to building a skill. Connecting the entire student journey in one learning experience.',
    tags: ['Product architecture', 'Frontend systems', 'Classroom & online learning', 'Scale'],
    liveUrl: 'https://sheryians.com',
    year: '2021 — PRESENT',
    role: 'Product & Engineering Lead',
    context: 'Sheryians Coding School needed a unified platform that could support tens of thousands of learners across recorded courses, live cohorts, assignments, and community discussions.',
    challenge: 'Off-the-shelf LMS tools felt disconnected and transactional. Students needed a platform that felt like a real engineering workspace while keeping video delivery, progress tracking, and cohort management seamless.',
    approach: 'Designed and built the frontend architecture and student experience around clarity, speed, and progression—connecting course discovery, interactive lessons, code submissions, and mentor feedback.',
    outcome: 'Powered learning for 50,000+ students online and offline, supporting Sheryians through its growth into a multi-million-dollar EdTech startup.',
    metrics: [
      { value: '50,000+', label: 'Students taught online & offline' },
      { value: '2.5×', label: 'Offline revenue growth contributed' },
      { value: '99.9%', label: 'Core learning flow reliability' },
    ],
  },
  {
    slug: 'kodr',
    index: '02',
    category: 'EDUCATION · LEADERSHIP',
    title: 'KODR Coding Bootcamp',
    shortTitle: 'KODR Bootcamp',
    summary: 'An intensive learning experience. Bringing instructors, mentors, and students together to turn knowledge into capability.',
    tags: ['Program design', 'Offline & hybrid cohorts', 'Mentorship systems', 'Execution'],
    liveUrl: 'https://sheryians.com',
    year: '2023 — PRESENT',
    role: 'Program Architect & Lead Instructor',
    context: 'Many learners watch tutorials endlessly without ever crossing the gap into building real software under production constraints.',
    challenge: 'Create an intensive 100-day offline and hybrid bootcamp that transforms beginners into confident full-stack developers who can think, debug, and ship.',
    approach: 'Structured the daily rhythm around deep conceptual lectures, daily coding labs, peer code reviews, and milestone product builds led by instructors and mentors.',
    outcome: 'Became one of Sheryians’ flagship transformation programs, directly driving 2.5× offline revenue growth and hundreds of student placements.',
    metrics: [
      { value: '100 Days', label: 'Intensive full-stack curriculum' },
      { value: '300+', label: 'Hours of hands-on building' },
      { value: '2.5×', label: 'Offline program growth' },
    ],
  },
  {
    slug: 'javascript-god-mode',
    index: '03',
    category: 'TEACHING · CONTENT',
    title: 'JavaScript: God Mode',
    shortTitle: 'JavaScript: God Mode',
    summary: 'Making the invisible parts of JavaScript understandable. My independent YouTube series connects foundations to the language’s inner workings.',
    tags: ['Independent series', 'Deep JavaScript', 'Mental models', 'YouTube'],
    liveUrl: 'https://www.youtube.com/watch?v=EL4s3qLj3kw',
    year: '2024 — PRESENT',
    role: 'Creator & Educator',
    context: 'Developers often jump into frameworks without truly understanding execution contexts, closures, lexical scope, or how JavaScript actually runs.',
    challenge: 'Teach the deepest mechanics of JavaScript on YouTube in a way that feels visual, intuitive, and immediately applicable—without watering down the technical truth.',
    approach: 'Created multi-part long-form breakdowns ("God Mode") combining whiteboard mental models, live runtime tracing, and practical patterns.',
    outcome: 'Helped thousands of self-taught developers and CS students finally make sense of JavaScript fundamentals.',
    metrics: [
      { value: '3 Parts', label: 'Foundations, Functions & Arrays' },
      { value: '100%', label: 'First-principles mental models' },
      { value: 'Open', label: 'Free independent series' },
    ],
  },
  {
    slug: 'interview-platform',
    index: '04',
    category: 'ENGINEERING EXPLORATION',
    title: 'Interview Platform',
    shortTitle: 'Interview Platform',
    summary: 'A focused technical interview environment combining live collaborative code execution, structured evaluation rubrics, and candidate playback.',
    tags: ['WebRTC', 'Code execution', 'Real-time state', 'Product UI'],
    year: '2024 — 2026',
    role: 'Product Engineer',
    context: 'Technical interviews often suffer from fragmented tools—switching between video calls, shared docs, and disconnected grading notes.',
    challenge: 'Unify live coding, prompt progression, and interviewer notes into a calm, zero-latency browser workspace.',
    approach: 'Built a real-time interview workbench with synchronized editor state, test-runner output, and structured assessment timelines.',
    outcome: 'Streamlined mock and placement interviews for engineering cohorts and partner hiring teams.',
    metrics: [
      { value: '<50ms', label: 'Editor sync latency' },
      { value: 'Unified', label: 'Code + rubric workspace' },
      { value: 'WIP', label: 'Ongoing product exploration' },
    ],
  },
  {
    slug: 'employee-management-system',
    index: '05',
    category: 'APPLICATION DEVELOPMENT',
    title: 'Employee Management System',
    shortTitle: 'Employee Management System',
    summary: 'Role-based task orchestration, status workflows, and team visibility built as a clean reference architecture for modern React applications.',
    tags: ['React', 'State architecture', 'Role-based workflows', 'Dashboard UI'],
    year: '2023 — 2024',
    role: 'Lead Developer & Instructor',
    context: 'Students and teams needed a real-world reference application showing how authentication, role separation (admin vs employee), and task lifecycles work together.',
    challenge: 'Design an application that is both production-clean in its state transitions and clear enough to serve as an architectural teaching benchmark.',
    approach: 'Implemented deterministic task state machines, clean dark-mode operational dashboards, and modular component boundaries.',
    outcome: 'Adopted as a flagship full-stack/frontend project reference across cohorts and YouTube lessons.',
    metrics: [
      { value: 'RBAC', label: 'Admin & Employee workflows' },
      { value: 'Zero-Fluff', label: 'Pure state architecture' },
      { value: 'Reference', label: 'Used by thousands of learners' },
    ],
  },
];

export function getPerspectiveById(id: string): PerspectiveItem {
  return PERSPECTIVES.find((p) => p.id === id) ?? PERSPECTIVES[0];
}

export function getDisciplineById(id: string): DisciplineItem {
  return THINKING_DISCIPLINES.find((d) => d.id === id) ?? THINKING_DISCIPLINES[0];
}

export function filterVideosBySource(
  videos: VideoItem[],
  source: 'all' | 'channel' | 'sheryians'
): VideoItem[] {
  if (source === 'all') return videos;
  return videos.filter((v) => v.source === source);
}

export function getProjectBySlug(slug: string): ProjectCaseStudy | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export interface ContactValidationResult {
  valid: boolean;
  error?: string;
}

export function validateContactMessage(input: {
  name: string;
  email: string;
  message: string;
}): ContactValidationResult {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  if (!name) {
    return { valid: false, error: 'Please enter your name.' };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }
  if (!message || message.length < 10) {
    return { valid: false, error: 'Please share a brief message (at least 10 characters).' };
  }
  return { valid: true };
}

const SIGNAL_GLYPHS = '01/+*#:%@=-~';

export function decodeSignalText(target: string, progress: number): string {
  const clamped = Math.max(0, Math.min(1, progress));
  if (clamped >= 1) return target;
  const revealCount = Math.floor(target.length * clamped);
  let out = '';
  for (let i = 0; i < target.length; i++) {
    const ch = target[i];
    if (ch === ' ' || i < revealCount) {
      out += ch;
    } else {
      const glyphIdx = (i * 7 + Math.floor(clamped * 23)) % SIGNAL_GLYPHS.length;
      out += SIGNAL_GLYPHS[glyphIdx];
    }
  }
  return out;
}
