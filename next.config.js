/** @type {import('next').NextConfig} */
const { execSync } = require('child_process')

// Git commit hash 가져오기 (빌드 시점)
let gitCommitHash = 'unknown'
try {
  gitCommitHash = execSync('git rev-parse --short HEAD').toString().trim()
} catch (e) {
  console.warn('Could not get git commit hash')
}

const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_APP_VERSION: require('./package.json').version,
    NEXT_PUBLIC_GIT_COMMIT: gitCommitHash,
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
  webpack: (config, { isServer }) => {
    // pdfjs-dist의 canvas 모듈 무시 (브라우저에서 불필요)
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
