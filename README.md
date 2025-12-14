<<<<<<< HEAD
# Learning Path Generator

An AI-powered personalized learning path generator that creates customized learning roadmaps based on individual user profiles, goals, and constraints.

## Features

- **Profile-Based Customization**: Input your skill level, background knowledge, learning goals, and preferences
- **Intelligent Path Generation**: AI-powered algorithm creates structured learning phases with topics, resources, and assessments
- **Skill Gap Analysis**: Identifies what you need to learn to reach your goals
- **Resource Recommendations**: Suggests learning materials that match your preferred learning style
- **Progress Tracking**: Monitor your advancement through milestones and phases
- **Adaptive Recommendations**: Dynamic adjustments based on your progress and challenges

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **Property-Based Testing**: fast-check
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd learning-path-generator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI

## Usage

### 1. Profile Setup
- Select your current skill level (beginner, intermediate, advanced)
- Add your background knowledge and experience
- Define your learning goal and target competencies
- Choose your preferred learning style and pace
- Set time constraints and optional deadline

### 2. Learning Path Generation
- The system analyzes your profile and generates a personalized learning path
- View skill gap analysis to understand what you need to learn
- Explore structured phases with topics, resources, and milestones
- Access recommended learning materials based on your preferences

### 3. Progress Tracking
- Monitor your advancement through the learning path
- Track completed milestones and time invested
- View upcoming phases and adjust your schedule as needed
- Get adaptive recommendations based on your progress

## Architecture

The application follows a modular architecture with clear separation of concerns:

- **Components**: Reusable UI components for different features
- **Services**: Business logic for validation, path generation, and data processing
- **Types**: TypeScript interfaces for type safety
- **Testing**: Comprehensive test coverage with unit and property-based tests

### Key Components

- `ProfileForm`: User input form for creating learning profiles
- `LearningPathView`: Display generated learning paths with phases and resources
- `ProgressDashboard`: Track learning progress and milestones
- `SkillGapAnalysis`: Visualize skill gaps and learning priorities
- `ResourceList`: Browse and filter learning resources

### Services

- `validation.ts`: Profile and input validation logic
- `pathGenerator.ts`: Learning path generation algorithms

## Testing

The project includes comprehensive testing with both unit tests and property-based tests:

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test -- --coverage

# Run tests in watch mode
npm run test -- --watch
```

### Property-Based Testing

The application uses fast-check for property-based testing to ensure correctness across a wide range of inputs. Each correctness property from the design document is implemented as a property-based test.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built following spec-driven development methodology
- Implements correctness properties for reliable software
- Uses property-based testing for comprehensive validation
=======
# AI-powered-personalized-learning-path-generator
An AI-powered personalized learning path generator designed to recommend adaptive learning journeys based on individual learner goals and skill gaps.
>>>>>>> 320492e3e266298afad2f87e779105f72c8c3ffa
