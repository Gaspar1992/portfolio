# Lighthouse Quality Verification Setup

This project now includes Lighthouse for automated quality verification of the portfolio website.

## Available Scripts

### Local Development
- `npm run lighthouse:desktop` - Run Lighthouse analysis on desktop view
- `npm run lighthouse:mobile` - Run Lighthouse analysis on mobile view
- `npm run lighthouse` - Run Lighthouse CI analysis

### Quality Assurance
- `npm run quality:check` - Complete quality check (linting + tests + Lighthouse)

### CI/CD Integration
- `npm run lighthouse:ci` - Build and run Lighthouse in CI mode

## Configuration Files

### `lighthouse.config.js`
Custom Lighthouse configuration for manual testing:
- Focuses on Performance, Accessibility, Best Practices, and SEO
- Desktop-first approach
- Excludes PWA category (not relevant for portfolio)

### `lighthouserc.js`
Lighthouse CI configuration for automated testing:
- Tests against localhost:4200
- 3 runs for consistency
- Quality thresholds:
  - Performance: 80+ (warning)
  - Accessibility: 90+ (error)
  - Best Practices: 80+ (warning)
  - SEO: 80+ (warning)

## Usage Examples

### Quick Quality Check
```bash
npm run quality:check
```

### Manual Testing
```bash
# Start the dev server
npm run start

# In another terminal, run Lighthouse
npm run lighthouse:desktop
```

### View Results
Open `lighthouse-report.html` in your browser to view detailed Lighthouse results.

## CI/CD Integration

The GitHub Actions workflow now includes Lighthouse testing:
- Runs after successful unit and E2E tests
- Generates reports during deployment
- Won't fail the build but will log quality issues

## Quality Targets

- **Performance**: Aim for 80+ score
- **Accessibility**: Aim for 90+ score
- **Best Practices**: Aim for 80+ score
- **SEO**: Aim for 80+ score

## Troubleshooting

### Port Conflicts
If port 4200 is in use, the dev server will automatically use the next available port. Update the Lighthouse commands accordingly.

### Build Issues
Ensure the project builds successfully before running Lighthouse:
```bash
npm run build:prod
```

### Report Generation
Reports are saved as HTML files in the project root for easy viewing and sharing.
