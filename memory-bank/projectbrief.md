# Project Brief: achievibit-v3
*Version: 1.0*
*Created: 2024-04-05*
*Last Updated: 2024-04-05*

## Project Overview
achievibit is a GitHub Gamification system that adds an achievement system to GitHub pull requests. It operates as a GitHub WebHook and provides achievements based on different characteristics of pull requests. The project aims to make the code review and pull request process more engaging and fun by adding game-like elements.

## Core Requirements
- GitHub WebHook integration for pull request monitoring
- Achievement system based on PR characteristics
- Chrome extension support for GitHub integration
- Multi-platform support (GitHub, GitLab, Bitbucket)
- OAuth integration with multiple Git platforms
- RESTful API with Swagger documentation
- User authentication and authorization
- Achievement tracking and management
- Real-time updates for achievements

## Success Criteria
- Successful integration with GitHub, GitLab, and Bitbucket
- Working achievement system with multiple achievements
- Functional Chrome extension
- Comprehensive API documentation
- High test coverage (unit, integration, E2E)
- Smooth user experience
- Reliable webhook processing
- Secure authentication system

## Scope
### In Scope
- WebHook server implementation
- Achievement system core functionality
- OAuth integration with Git platforms
- User management system
- API development and documentation
- Chrome extension integration
- Testing infrastructure
- CI/CD pipeline
- Development environment setup

### Out of Scope
- Mobile application
- Desktop application
- Non-Git platform integrations
- Real-time chat features
- Custom achievement creation by users (initial phase)

## Timeline
- Initial Development: In Progress
- Beta Testing: TBD
- Production Release: TBD

## Stakeholders
- Project Lead: Neil Kalman (@thatkookooguy)
- Core Contributors:
  - O T (@ortichon)
  - Michael Dunaevsky (@dunaevsky)
  - Andrea Rosales (@andrearosr)
  - Daniel Ruf (@DanielRuf)
- End Users: GitHub/GitLab/Bitbucket developers and teams

## Technical Constraints
- Node.js v20 required
- PostgreSQL database
- PNPM package manager
- Docker container support
- Environment-specific configuration requirements
- OAuth app requirements for each Git platform
- Webhook secret management
- JWT authentication

---

*This document serves as the foundation for the project and informs all other memory files.* 