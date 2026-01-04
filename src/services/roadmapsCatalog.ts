export type RoadmapResource = {
  title: string
  type: 'docs' | 'article' | 'video' | 'tool'
  url: string
}

export type RoadmapStep = {
  id: string
  title: string
  description: string
  resources: RoadmapResource[]
}

export type RoadmapSection = {
  id: string
  title: string
  description: string
  steps: RoadmapStep[]
}

export type CareerRoadmap = {
  slug: string
  title: string
  description: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  tags: string[]
  sections: RoadmapSection[]
}

export const roadmapsCatalog: CareerRoadmap[] = [
  {
    slug: 'web-development',
    title: 'Web Development',
    description: 'From HTML/CSS foundations to frontend frameworks, APIs, and deployment.',
    level: 'Beginner',
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'APIs', 'Deployment'],
    sections: [
      {
        id: 'web-foundations',
        title: 'Foundations',
        description: 'Build strong fundamentals for the modern web.',
        steps: [
          {
            id: 'html-semantics',
            title: 'HTML & Semantics',
            description: 'Document structure, accessibility basics, forms, and semantic tags.',
            resources: [
              { title: 'MDN: HTML', type: 'docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
              { title: 'MDN: Accessibility', type: 'docs', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility' },
            ],
          },
          {
            id: 'css-layout',
            title: 'CSS Layout (Flexbox/Grid)',
            description: 'Responsive layout patterns and spacing systems.',
            resources: [
              { title: 'MDN: Flexbox', type: 'docs', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout' },
              { title: 'MDN: Grid', type: 'docs', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout' },
            ],
          },
          {
            id: 'js-basics',
            title: 'JavaScript Fundamentals',
            description: 'Variables, functions, arrays/objects, async basics, DOM.',
            resources: [
              { title: 'MDN: JavaScript Guide', type: 'docs', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' },
              { title: 'MDN: Promises', type: 'docs', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise' },
            ],
          },
        ],
      },
      {
        id: 'web-frontend',
        title: 'Frontend',
        description: 'Component-based UI, state, routing, and build tooling.',
        steps: [
          {
            id: 'react-basics',
            title: 'React Basics',
            description: 'Components, props/state, hooks, and composition.',
            resources: [
              { title: 'React Docs: Learn', type: 'docs', url: 'https://react.dev/learn' },
            ],
          },
          {
            id: 'state-management',
            title: 'State Management',
            description: 'Local state, server state, and patterns for complex apps.',
            resources: [
              { title: 'React Docs: Managing State', type: 'docs', url: 'https://react.dev/learn/managing-state' },
            ],
          },
          {
            id: 'frontend-testing',
            title: 'Testing Basics',
            description: 'Unit tests, component tests, and CI-friendly testing habits.',
            resources: [
              { title: 'Testing Library Docs', type: 'docs', url: 'https://testing-library.com/docs/' },
              { title: 'Vitest Docs', type: 'docs', url: 'https://vitest.dev/' },
            ],
          },
        ],
      },
      {
        id: 'web-backend',
        title: 'Backend & APIs',
        description: 'Build and consume APIs, authentication patterns, and databases.',
        steps: [
          {
            id: 'rest-apis',
            title: 'REST APIs',
            description: 'HTTP fundamentals, REST conventions, pagination, error handling.',
            resources: [
              { title: 'MDN: HTTP', type: 'docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP' },
              { title: 'REST API Tutorial', type: 'article', url: 'https://restfulapi.net/' },
            ],
          },
          {
            id: 'auth-basics',
            title: 'Auth (Sessions/JWT)',
            description: 'Common authentication methods and security fundamentals.',
            resources: [
              { title: 'OWASP Top 10', type: 'docs', url: 'https://owasp.org/www-project-top-ten/' },
            ],
          },
          {
            id: 'deployment',
            title: 'Deployment',
            description: 'Build, deploy, env configs, caching, and basic observability.',
            resources: [
              { title: 'Vite: Deploying', type: 'docs', url: 'https://vite.dev/guide/static-deploy.html' },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'ai-ml',
    title: 'AI / Machine Learning',
    description: 'Math + Python foundations, ML workflows, and practical model evaluation.',
    level: 'Beginner',
    tags: ['Python', 'Math', 'ML', 'Data', 'Evaluation', 'MLOps'],
    sections: [
      {
        id: 'ml-foundations',
        title: 'Foundations',
        description: 'Core skills required to understand ML concepts.',
        steps: [
          {
            id: 'python-data',
            title: 'Python for Data',
            description: 'Data structures, notebooks, and basic data manipulation.',
            resources: [
              { title: 'Python Docs', type: 'docs', url: 'https://docs.python.org/3/' },
              { title: 'NumPy Quickstart', type: 'docs', url: 'https://numpy.org/doc/stable/user/quickstart.html' },
            ],
          },
          {
            id: 'stats-basics',
            title: 'Statistics Basics',
            description: 'Distributions, mean/variance, confidence intervals, and correlation.',
            resources: [
              { title: 'Khan Academy: Statistics', type: 'video', url: 'https://www.khanacademy.org/math/statistics-probability' },
            ],
          },
        ],
      },
      {
        id: 'ml-core',
        title: 'Core ML',
        description: 'Training, validation, features, and model selection.',
        steps: [
          {
            id: 'supervised-learning',
            title: 'Supervised Learning',
            description: 'Regression/classification, loss functions, bias/variance.',
            resources: [
              { title: 'scikit-learn: Getting Started', type: 'docs', url: 'https://scikit-learn.org/stable/getting_started.html' },
            ],
          },
          {
            id: 'evaluation',
            title: 'Evaluation & Metrics',
            description: 'Train/val/test splits, cross validation, and metrics.',
            resources: [
              { title: 'scikit-learn: Model Evaluation', type: 'docs', url: 'https://scikit-learn.org/stable/modules/model_evaluation.html' },
            ],
          },
          {
            id: 'feature-engineering',
            title: 'Feature Engineering',
            description: 'Scaling, encoding, missing values, leakage avoidance.',
            resources: [
              { title: 'scikit-learn: Preprocessing', type: 'docs', url: 'https://scikit-learn.org/stable/modules/preprocessing.html' },
            ],
          },
        ],
      },
      {
        id: 'ml-production',
        title: 'Practical MLOps',
        description: 'Make models reproducible, testable, and deployable.',
        steps: [
          {
            id: 'experiment-tracking',
            title: 'Experiment Tracking',
            description: 'Reproducibility, datasets, and tracking runs.',
            resources: [
              { title: 'MLflow', type: 'docs', url: 'https://mlflow.org/docs/latest/index.html' },
            ],
          },
          {
            id: 'serving',
            title: 'Model Serving Basics',
            description: 'Simple APIs for models, monitoring, and drift awareness.',
            resources: [
              { title: 'FastAPI', type: 'docs', url: 'https://fastapi.tiangolo.com/' },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'devops',
    title: 'DevOps',
    description: 'Linux basics, CI/CD, containers, infrastructure, and observability.',
    level: 'Beginner',
    tags: ['Linux', 'Git', 'CI/CD', 'Docker', 'Kubernetes', 'Observability'],
    sections: [
      {
        id: 'devops-foundations',
        title: 'Foundations',
        description: 'The basics you need before automation.',
        steps: [
          {
            id: 'linux-cli',
            title: 'Linux & CLI',
            description: 'Navigation, permissions, processes, and networking basics.',
            resources: [
              { title: 'Linux Command Line Basics', type: 'article', url: 'https://ubuntu.com/tutorials/command-line-for-beginners' },
            ],
          },
          {
            id: 'git-workflows',
            title: 'Git Workflows',
            description: 'Branching strategies, PRs, and conflict resolution.',
            resources: [
              { title: 'Git Book', type: 'docs', url: 'https://git-scm.com/book/en/v2' },
            ],
          },
        ],
      },
      {
        id: 'devops-delivery',
        title: 'Delivery',
        description: 'Automate tests and deployments reliably.',
        steps: [
          {
            id: 'ci-cd',
            title: 'CI/CD Pipelines',
            description: 'Build, test, release pipelines and environment promotion.',
            resources: [
              { title: 'GitHub Actions', type: 'docs', url: 'https://docs.github.com/actions' },
            ],
          },
          {
            id: 'containers',
            title: 'Containers (Docker)',
            description: 'Images, containers, registries, and best practices.',
            resources: [
              { title: 'Docker Docs', type: 'docs', url: 'https://docs.docker.com/' },
            ],
          },
          {
            id: 'kubernetes',
            title: 'Kubernetes Basics',
            description: 'Pods, deployments, services, and basic ops.',
            resources: [
              { title: 'Kubernetes Docs', type: 'docs', url: 'https://kubernetes.io/docs/home/' },
            ],
          },
        ],
      },
      {
        id: 'devops-observability',
        title: 'Observability',
        description: 'Measure, debug, and improve reliability.',
        steps: [
          {
            id: 'logging-metrics',
            title: 'Logging & Metrics',
            description: 'What to log, basic metrics, and dashboards.',
            resources: [
              { title: 'Prometheus', type: 'docs', url: 'https://prometheus.io/docs/introduction/overview/' },
              { title: 'Grafana', type: 'docs', url: 'https://grafana.com/docs/' },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'cybersecurity',
    title: 'Cybersecurity',
    description: 'Security fundamentals, web security, networking, and defensive practices.',
    level: 'Beginner',
    tags: ['Networking', 'Web Security', 'OWASP', 'Threats', 'Defense'],
    sections: [
      {
        id: 'sec-basics',
        title: 'Fundamentals',
        description: 'Understand the threat landscape and basics.',
        steps: [
          {
            id: 'networking',
            title: 'Networking Basics',
            description: 'TCP/IP, DNS, HTTP, and common ports.',
            resources: [
              { title: 'MDN: HTTP', type: 'docs', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP' },
              { title: 'Cloudflare: What is DNS?', type: 'article', url: 'https://www.cloudflare.com/learning/dns/what-is-dns/' },
            ],
          },
          {
            id: 'security-basics',
            title: 'Security Basics',
            description: 'CIA triad, auth, encryption basics, and safe practices.',
            resources: [
              { title: 'OWASP Top 10', type: 'docs', url: 'https://owasp.org/www-project-top-ten/' },
            ],
          },
        ],
      },
      {
        id: 'sec-web',
        title: 'Web Security',
        description: 'Protect apps and understand common vulnerabilities.',
        steps: [
          {
            id: 'xss-csrf',
            title: 'XSS & CSRF',
            description: 'Understand and mitigate common web attacks.',
            resources: [
              { title: 'OWASP Cheat Sheet Series', type: 'docs', url: 'https://cheatsheetseries.owasp.org/' },
            ],
          },
          {
            id: 'authz',
            title: 'Authentication & Authorization',
            description: 'Sessions/JWT, role-based access, and secure flows.',
            resources: [
              { title: 'OAuth 2.0 (RFC 6749)', type: 'docs', url: 'https://www.rfc-editor.org/rfc/rfc6749' },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'data-science',
    title: 'Data Science',
    description: 'Data wrangling, visualization, statistics, and storytelling with data.',
    level: 'Beginner',
    tags: ['Python', 'Pandas', 'Visualization', 'Statistics', 'SQL'],
    sections: [
      {
        id: 'ds-foundations',
        title: 'Foundations',
        description: 'Core skills for exploring and communicating data.',
        steps: [
          {
            id: 'sql-basics',
            title: 'SQL Basics',
            description: 'Select, joins, grouping, and window functions (as you progress).',
            resources: [
              { title: 'PostgreSQL Tutorial', type: 'docs', url: 'https://www.postgresql.org/docs/current/tutorial.html' },
            ],
          },
          {
            id: 'pandas',
            title: 'Pandas',
            description: 'DataFrames, cleaning data, and transformations.',
            resources: [
              { title: 'Pandas: Getting Started', type: 'docs', url: 'https://pandas.pydata.org/docs/getting_started/index.html' },
            ],
          },
          {
            id: 'viz',
            title: 'Visualization',
            description: 'Charts that communicate: distributions, trends, comparisons.',
            resources: [
              { title: 'Matplotlib', type: 'docs', url: 'https://matplotlib.org/stable/index.html' },
              { title: 'Seaborn', type: 'docs', url: 'https://seaborn.pydata.org/' },
            ],
          },
        ],
      },
      {
        id: 'ds-analysis',
        title: 'Analysis',
        description: 'Statistics, experiments, and narrative.',
        steps: [
          {
            id: 'hypothesis-testing',
            title: 'Hypothesis Testing',
            description: 'A/B testing basics, p-values, and practical interpretation.',
            resources: [
              { title: 'Khan Academy: Statistics', type: 'video', url: 'https://www.khanacademy.org/math/statistics-probability' },
            ],
          },
          {
            id: 'storytelling',
            title: 'Storytelling',
            description: 'Turn analysis into a clear narrative and decisions.',
            resources: [
              { title: 'The Data Visualization Catalogue', type: 'tool', url: 'https://datavizcatalogue.com/' },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'mobile-development',
    title: 'Mobile Development',
    description: 'Build mobile apps with fundamentals, UI patterns, and deployment.',
    level: 'Beginner',
    tags: ['React Native', 'Android', 'iOS', 'UI', 'APIs'],
    sections: [
      {
        id: 'mobile-foundations',
        title: 'Foundations',
        description: 'App basics and platform concepts.',
        steps: [
          {
            id: 'mobile-ui',
            title: 'Mobile UI Patterns',
            description: 'Navigation, layouts, touch interactions, and accessibility.',
            resources: [
              { title: 'Material Design', type: 'docs', url: 'https://m3.material.io/' },
              { title: 'Apple HIG', type: 'docs', url: 'https://developer.apple.com/design/human-interface-guidelines/' },
            ],
          },
          {
            id: 'api-integration',
            title: 'API Integration',
            description: 'Networking, caching, offline basics, error handling.',
            resources: [
              { title: 'React Native Docs', type: 'docs', url: 'https://reactnative.dev/docs/getting-started' },
            ],
          },
        ],
      },
      {
        id: 'mobile-delivery',
        title: 'Delivery',
        description: 'Builds, releases, and store readiness.',
        steps: [
          {
            id: 'testing',
            title: 'Testing Basics',
            description: 'Unit/UI testing and stable release habits.',
            resources: [
              { title: 'Detox', type: 'docs', url: 'https://wix.github.io/Detox/' },
            ],
          },
          {
            id: 'release',
            title: 'Release & Distribution',
            description: 'Build signing, versioning, and app store submission flow.',
            resources: [
              { title: 'Google Play Console', type: 'docs', url: 'https://support.google.com/googleplay/android-developer/' },
              { title: 'App Store Connect Help', type: 'docs', url: 'https://developer.apple.com/help/app-store-connect/' },
            ],
          },
        ],
      },
    ],
  },
]

export const findRoadmapBySlug = (slug: string) => {
  return roadmapsCatalog.find(r => r.slug === slug) || null
}

