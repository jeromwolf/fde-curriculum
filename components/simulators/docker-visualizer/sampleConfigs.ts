import { DockerComposeConfig } from './types'

// Web Application Stack (Next.js + PostgreSQL + Redis)
export const webAppStack: DockerComposeConfig = {
  id: 'webapp-stack',
  name: 'Web Application Stack',
  description: 'Next.js 앱 + PostgreSQL + Redis 캐시',
  category: 'web',
  version: '3.8',
  containers: [
    {
      id: 'webapp',
      name: 'webapp',
      image: 'node',
      tag: '18-alpine',
      state: 'running',
      ports: [{ host: 3000, container: 3000, protocol: 'tcp' }],
      volumes: [
        { type: 'bind', source: './src', target: '/app/src' },
        { type: 'volume', source: 'node_modules', target: '/app/node_modules' },
      ],
      environment: [
        { key: 'NODE_ENV', value: 'development' },
        { key: 'DATABASE_URL', value: 'postgresql://user:pass@db:5432/myapp', secret: true },
        { key: 'REDIS_URL', value: 'redis://cache:6379' },
      ],
      networks: ['frontend', 'backend'],
      dependsOn: ['db', 'cache'],
      command: 'npm run dev',
      restart: 'unless-stopped',
      healthCheck: {
        test: ['CMD', 'curl', '-f', 'http://localhost:3000/api/health'],
        interval: '30s',
        timeout: '10s',
        retries: 3,
      },
    },
    {
      id: 'db',
      name: 'db',
      image: 'postgres',
      tag: '15-alpine',
      state: 'running',
      ports: [{ host: 5432, container: 5432, protocol: 'tcp' }],
      volumes: [
        { type: 'volume', source: 'postgres_data', target: '/var/lib/postgresql/data' },
        { type: 'bind', source: './init.sql', target: '/docker-entrypoint-initdb.d/init.sql', readonly: true },
      ],
      environment: [
        { key: 'POSTGRES_USER', value: 'user' },
        { key: 'POSTGRES_PASSWORD', value: 'pass', secret: true },
        { key: 'POSTGRES_DB', value: 'myapp' },
      ],
      networks: ['backend'],
      restart: 'always',
      healthCheck: {
        test: ['CMD-SHELL', 'pg_isready -U user -d myapp'],
        interval: '10s',
        timeout: '5s',
        retries: 5,
      },
    },
    {
      id: 'cache',
      name: 'cache',
      image: 'redis',
      tag: '7-alpine',
      state: 'running',
      ports: [{ host: 6379, container: 6379, protocol: 'tcp' }],
      volumes: [
        { type: 'volume', source: 'redis_data', target: '/data' },
      ],
      environment: [],
      networks: ['backend'],
      command: 'redis-server --appendonly yes',
      restart: 'always',
    },
    {
      id: 'nginx',
      name: 'nginx',
      image: 'nginx',
      tag: 'alpine',
      state: 'running',
      ports: [
        { host: 80, container: 80, protocol: 'tcp' },
        { host: 443, container: 443, protocol: 'tcp' },
      ],
      volumes: [
        { type: 'bind', source: './nginx.conf', target: '/etc/nginx/nginx.conf', readonly: true },
        { type: 'bind', source: './ssl', target: '/etc/nginx/ssl', readonly: true },
      ],
      environment: [],
      networks: ['frontend'],
      dependsOn: ['webapp'],
      restart: 'always',
    },
  ],
  networks: [
    { id: 'frontend', name: 'frontend', driver: 'bridge', subnet: '172.20.0.0/16' },
    { id: 'backend', name: 'backend', driver: 'bridge', subnet: '172.21.0.0/16', internal: true },
  ],
  volumes: [
    { id: 'postgres_data', name: 'postgres_data', driver: 'local' },
    { id: 'redis_data', name: 'redis_data', driver: 'local' },
    { id: 'node_modules', name: 'node_modules', driver: 'local' },
  ],
  yaml: `version: '3.8'

services:
  webapp:
    image: node:18-alpine
    container_name: webapp
    ports:
      - "3000:3000"
    volumes:
      - ./src:/app/src
      - node_modules:/app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:pass@db:5432/myapp
      - REDIS_URL=redis://cache:6379
    networks:
      - frontend
      - backend
    depends_on:
      - db
      - cache
    command: npm run dev
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:15-alpine
    container_name: db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=myapp
    networks:
      - backend
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d myapp"]
      interval: 10s
      timeout: 5s
      retries: 5

  cache:
    image: redis:7-alpine
    container_name: cache
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - backend
    command: redis-server --appendonly yes
    restart: always

  nginx:
    image: nginx:alpine
    container_name: nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    networks:
      - frontend
    depends_on:
      - webapp
    restart: always

networks:
  frontend:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
  backend:
    driver: bridge
    internal: true
    ipam:
      config:
        - subnet: 172.21.0.0/16

volumes:
  postgres_data:
  redis_data:
  node_modules:
`,
}

// Microservices Architecture
export const microservicesStack: DockerComposeConfig = {
  id: 'microservices',
  name: 'Microservices Architecture',
  description: 'API Gateway + 3개 마이크로서비스 + Message Queue',
  category: 'microservices',
  version: '3.8',
  containers: [
    {
      id: 'api-gateway',
      name: 'api-gateway',
      image: 'kong',
      tag: '3.4',
      state: 'running',
      ports: [
        { host: 8000, container: 8000, protocol: 'tcp' },
        { host: 8001, container: 8001, protocol: 'tcp' },
      ],
      volumes: [],
      environment: [
        { key: 'KONG_DATABASE', value: 'off' },
        { key: 'KONG_PROXY_ACCESS_LOG', value: '/dev/stdout' },
        { key: 'KONG_ADMIN_ACCESS_LOG', value: '/dev/stdout' },
      ],
      networks: ['public', 'internal'],
      restart: 'always',
    },
    {
      id: 'user-service',
      name: 'user-service',
      image: 'user-service',
      tag: 'latest',
      state: 'running',
      ports: [{ host: 3001, container: 3000, protocol: 'tcp' }],
      volumes: [],
      environment: [
        { key: 'SERVICE_NAME', value: 'user-service' },
        { key: 'RABBITMQ_URL', value: 'amqp://rabbitmq:5672' },
        { key: 'MONGO_URL', value: 'mongodb://mongo:27017/users' },
      ],
      networks: ['internal'],
      dependsOn: ['rabbitmq', 'mongo'],
      restart: 'always',
    },
    {
      id: 'order-service',
      name: 'order-service',
      image: 'order-service',
      tag: 'latest',
      state: 'running',
      ports: [{ host: 3002, container: 3000, protocol: 'tcp' }],
      volumes: [],
      environment: [
        { key: 'SERVICE_NAME', value: 'order-service' },
        { key: 'RABBITMQ_URL', value: 'amqp://rabbitmq:5672' },
        { key: 'MONGO_URL', value: 'mongodb://mongo:27017/orders' },
      ],
      networks: ['internal'],
      dependsOn: ['rabbitmq', 'mongo'],
      restart: 'always',
    },
    {
      id: 'notification-service',
      name: 'notification-service',
      image: 'notification-service',
      tag: 'latest',
      state: 'running',
      ports: [{ host: 3003, container: 3000, protocol: 'tcp' }],
      volumes: [],
      environment: [
        { key: 'SERVICE_NAME', value: 'notification-service' },
        { key: 'RABBITMQ_URL', value: 'amqp://rabbitmq:5672' },
        { key: 'SMTP_HOST', value: 'smtp.example.com' },
      ],
      networks: ['internal'],
      dependsOn: ['rabbitmq'],
      restart: 'always',
    },
    {
      id: 'rabbitmq',
      name: 'rabbitmq',
      image: 'rabbitmq',
      tag: '3-management-alpine',
      state: 'running',
      ports: [
        { host: 5672, container: 5672, protocol: 'tcp' },
        { host: 15672, container: 15672, protocol: 'tcp' },
      ],
      volumes: [
        { type: 'volume', source: 'rabbitmq_data', target: '/var/lib/rabbitmq' },
      ],
      environment: [
        { key: 'RABBITMQ_DEFAULT_USER', value: 'admin' },
        { key: 'RABBITMQ_DEFAULT_PASS', value: 'admin123', secret: true },
      ],
      networks: ['internal'],
      restart: 'always',
    },
    {
      id: 'mongo',
      name: 'mongo',
      image: 'mongo',
      tag: '6',
      state: 'running',
      ports: [{ host: 27017, container: 27017, protocol: 'tcp' }],
      volumes: [
        { type: 'volume', source: 'mongo_data', target: '/data/db' },
      ],
      environment: [],
      networks: ['internal'],
      restart: 'always',
    },
  ],
  networks: [
    { id: 'public', name: 'public', driver: 'bridge' },
    { id: 'internal', name: 'internal', driver: 'bridge', internal: true },
  ],
  volumes: [
    { id: 'rabbitmq_data', name: 'rabbitmq_data', driver: 'local' },
    { id: 'mongo_data', name: 'mongo_data', driver: 'local' },
  ],
  yaml: `version: '3.8'

services:
  api-gateway:
    image: kong:3.4
    container_name: api-gateway
    ports:
      - "8000:8000"  # Proxy
      - "8001:8001"  # Admin API
    environment:
      - KONG_DATABASE=off
      - KONG_PROXY_ACCESS_LOG=/dev/stdout
      - KONG_ADMIN_ACCESS_LOG=/dev/stdout
    networks:
      - public
      - internal
    restart: always

  user-service:
    image: user-service:latest
    container_name: user-service
    ports:
      - "3001:3000"
    environment:
      - SERVICE_NAME=user-service
      - RABBITMQ_URL=amqp://rabbitmq:5672
      - MONGO_URL=mongodb://mongo:27017/users
    networks:
      - internal
    depends_on:
      - rabbitmq
      - mongo
    restart: always

  order-service:
    image: order-service:latest
    container_name: order-service
    ports:
      - "3002:3000"
    environment:
      - SERVICE_NAME=order-service
      - RABBITMQ_URL=amqp://rabbitmq:5672
      - MONGO_URL=mongodb://mongo:27017/orders
    networks:
      - internal
    depends_on:
      - rabbitmq
      - mongo
    restart: always

  notification-service:
    image: notification-service:latest
    container_name: notification-service
    ports:
      - "3003:3000"
    environment:
      - SERVICE_NAME=notification-service
      - RABBITMQ_URL=amqp://rabbitmq:5672
      - SMTP_HOST=smtp.example.com
    networks:
      - internal
    depends_on:
      - rabbitmq
    restart: always

  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: rabbitmq
    ports:
      - "5672:5672"   # AMQP
      - "15672:15672" # Management UI
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    environment:
      - RABBITMQ_DEFAULT_USER=admin
      - RABBITMQ_DEFAULT_PASS=admin123
    networks:
      - internal
    restart: always

  mongo:
    image: mongo:6
    container_name: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    networks:
      - internal
    restart: always

networks:
  public:
    driver: bridge
  internal:
    driver: bridge
    internal: true

volumes:
  rabbitmq_data:
  mongo_data:
`,
}

// ML/Data Pipeline
export const mlPipelineStack: DockerComposeConfig = {
  id: 'ml-pipeline',
  name: 'ML Pipeline Stack',
  description: 'JupyterLab + MLflow + MinIO + PostgreSQL',
  category: 'ml',
  version: '3.8',
  containers: [
    {
      id: 'jupyter',
      name: 'jupyter',
      image: 'jupyter/scipy-notebook',
      tag: 'latest',
      state: 'running',
      ports: [{ host: 8888, container: 8888, protocol: 'tcp' }],
      volumes: [
        { type: 'bind', source: './notebooks', target: '/home/jovyan/work' },
        { type: 'volume', source: 'jupyter_data', target: '/home/jovyan/.local' },
      ],
      environment: [
        { key: 'JUPYTER_ENABLE_LAB', value: 'yes' },
        { key: 'MLFLOW_TRACKING_URI', value: 'http://mlflow:5000' },
        { key: 'AWS_ACCESS_KEY_ID', value: 'minioadmin' },
        { key: 'AWS_SECRET_ACCESS_KEY', value: 'minioadmin', secret: true },
      ],
      networks: ['ml-network'],
      restart: 'unless-stopped',
    },
    {
      id: 'mlflow',
      name: 'mlflow',
      image: 'ghcr.io/mlflow/mlflow',
      tag: '2.9.2',
      state: 'running',
      ports: [{ host: 5000, container: 5000, protocol: 'tcp' }],
      volumes: [],
      environment: [
        { key: 'MLFLOW_BACKEND_STORE_URI', value: 'postgresql://mlflow:mlflow@mlflow-db:5432/mlflow' },
        { key: 'MLFLOW_DEFAULT_ARTIFACT_ROOT', value: 's3://mlflow-artifacts' },
        { key: 'AWS_ACCESS_KEY_ID', value: 'minioadmin' },
        { key: 'AWS_SECRET_ACCESS_KEY', value: 'minioadmin', secret: true },
        { key: 'MLFLOW_S3_ENDPOINT_URL', value: 'http://minio:9000' },
      ],
      networks: ['ml-network'],
      dependsOn: ['mlflow-db', 'minio'],
      command: 'mlflow server --host 0.0.0.0 --port 5000',
      restart: 'always',
    },
    {
      id: 'mlflow-db',
      name: 'mlflow-db',
      image: 'postgres',
      tag: '15-alpine',
      state: 'running',
      ports: [],
      volumes: [
        { type: 'volume', source: 'mlflow_db_data', target: '/var/lib/postgresql/data' },
      ],
      environment: [
        { key: 'POSTGRES_USER', value: 'mlflow' },
        { key: 'POSTGRES_PASSWORD', value: 'mlflow', secret: true },
        { key: 'POSTGRES_DB', value: 'mlflow' },
      ],
      networks: ['ml-network'],
      restart: 'always',
    },
    {
      id: 'minio',
      name: 'minio',
      image: 'minio/minio',
      tag: 'latest',
      state: 'running',
      ports: [
        { host: 9000, container: 9000, protocol: 'tcp' },
        { host: 9001, container: 9001, protocol: 'tcp' },
      ],
      volumes: [
        { type: 'volume', source: 'minio_data', target: '/data' },
      ],
      environment: [
        { key: 'MINIO_ROOT_USER', value: 'minioadmin' },
        { key: 'MINIO_ROOT_PASSWORD', value: 'minioadmin', secret: true },
      ],
      networks: ['ml-network'],
      command: 'server /data --console-address ":9001"',
      restart: 'always',
    },
  ],
  networks: [
    { id: 'ml-network', name: 'ml-network', driver: 'bridge' },
  ],
  volumes: [
    { id: 'jupyter_data', name: 'jupyter_data', driver: 'local' },
    { id: 'mlflow_db_data', name: 'mlflow_db_data', driver: 'local' },
    { id: 'minio_data', name: 'minio_data', driver: 'local' },
  ],
  yaml: `version: '3.8'

services:
  jupyter:
    image: jupyter/scipy-notebook:latest
    container_name: jupyter
    ports:
      - "8888:8888"
    volumes:
      - ./notebooks:/home/jovyan/work
      - jupyter_data:/home/jovyan/.local
    environment:
      - JUPYTER_ENABLE_LAB=yes
      - MLFLOW_TRACKING_URI=http://mlflow:5000
      - AWS_ACCESS_KEY_ID=minioadmin
      - AWS_SECRET_ACCESS_KEY=minioadmin
    networks:
      - ml-network
    restart: unless-stopped

  mlflow:
    image: ghcr.io/mlflow/mlflow:2.9.2
    container_name: mlflow
    ports:
      - "5000:5000"
    environment:
      - MLFLOW_BACKEND_STORE_URI=postgresql://mlflow:mlflow@mlflow-db:5432/mlflow
      - MLFLOW_DEFAULT_ARTIFACT_ROOT=s3://mlflow-artifacts
      - AWS_ACCESS_KEY_ID=minioadmin
      - AWS_SECRET_ACCESS_KEY=minioadmin
      - MLFLOW_S3_ENDPOINT_URL=http://minio:9000
    networks:
      - ml-network
    depends_on:
      - mlflow-db
      - minio
    command: mlflow server --host 0.0.0.0 --port 5000
    restart: always

  mlflow-db:
    image: postgres:15-alpine
    container_name: mlflow-db
    volumes:
      - mlflow_db_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=mlflow
      - POSTGRES_PASSWORD=mlflow
      - POSTGRES_DB=mlflow
    networks:
      - ml-network
    restart: always

  minio:
    image: minio/minio:latest
    container_name: minio
    ports:
      - "9000:9000"  # API
      - "9001:9001"  # Console
    volumes:
      - minio_data:/data
    environment:
      - MINIO_ROOT_USER=minioadmin
      - MINIO_ROOT_PASSWORD=minioadmin
    networks:
      - ml-network
    command: server /data --console-address ":9001"
    restart: always

networks:
  ml-network:
    driver: bridge

volumes:
  jupyter_data:
  mlflow_db_data:
  minio_data:
`,
}

// Simple LAMP Stack
export const lampStack: DockerComposeConfig = {
  id: 'lamp-stack',
  name: 'LAMP Stack',
  description: 'Apache + MySQL + PHP (Classic)',
  category: 'web',
  version: '3.8',
  containers: [
    {
      id: 'apache',
      name: 'apache',
      image: 'php',
      tag: '8.2-apache',
      state: 'running',
      ports: [{ host: 80, container: 80, protocol: 'tcp' }],
      volumes: [
        { type: 'bind', source: './public', target: '/var/www/html' },
      ],
      environment: [],
      networks: ['lamp-network'],
      dependsOn: ['mysql'],
      restart: 'unless-stopped',
    },
    {
      id: 'mysql',
      name: 'mysql',
      image: 'mysql',
      tag: '8.0',
      state: 'running',
      ports: [{ host: 3306, container: 3306, protocol: 'tcp' }],
      volumes: [
        { type: 'volume', source: 'mysql_data', target: '/var/lib/mysql' },
      ],
      environment: [
        { key: 'MYSQL_ROOT_PASSWORD', value: 'rootpass', secret: true },
        { key: 'MYSQL_DATABASE', value: 'myapp' },
        { key: 'MYSQL_USER', value: 'user' },
        { key: 'MYSQL_PASSWORD', value: 'pass', secret: true },
      ],
      networks: ['lamp-network'],
      restart: 'always',
    },
    {
      id: 'phpmyadmin',
      name: 'phpmyadmin',
      image: 'phpmyadmin',
      tag: 'latest',
      state: 'running',
      ports: [{ host: 8080, container: 80, protocol: 'tcp' }],
      volumes: [],
      environment: [
        { key: 'PMA_HOST', value: 'mysql' },
        { key: 'PMA_USER', value: 'root' },
        { key: 'PMA_PASSWORD', value: 'rootpass', secret: true },
      ],
      networks: ['lamp-network'],
      dependsOn: ['mysql'],
      restart: 'unless-stopped',
    },
  ],
  networks: [
    { id: 'lamp-network', name: 'lamp-network', driver: 'bridge' },
  ],
  volumes: [
    { id: 'mysql_data', name: 'mysql_data', driver: 'local' },
  ],
  yaml: `version: '3.8'

services:
  apache:
    image: php:8.2-apache
    container_name: apache
    ports:
      - "80:80"
    volumes:
      - ./public:/var/www/html
    networks:
      - lamp-network
    depends_on:
      - mysql
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    container_name: mysql
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    environment:
      - MYSQL_ROOT_PASSWORD=rootpass
      - MYSQL_DATABASE=myapp
      - MYSQL_USER=user
      - MYSQL_PASSWORD=pass
    networks:
      - lamp-network
    restart: always

  phpmyadmin:
    image: phpmyadmin:latest
    container_name: phpmyadmin
    ports:
      - "8080:80"
    environment:
      - PMA_HOST=mysql
      - PMA_USER=root
      - PMA_PASSWORD=rootpass
    networks:
      - lamp-network
    depends_on:
      - mysql
    restart: unless-stopped

networks:
  lamp-network:
    driver: bridge

volumes:
  mysql_data:
`,
}

export const sampleConfigs: DockerComposeConfig[] = [
  webAppStack,
  microservicesStack,
  mlPipelineStack,
  lampStack,
]

// Docker commands reference
export const dockerCommands = [
  { command: 'docker-compose up -d', description: '모든 서비스 백그라운드 실행' },
  { command: 'docker-compose down', description: '모든 서비스 중지 및 제거' },
  { command: 'docker-compose ps', description: '실행 중인 컨테이너 목록' },
  { command: 'docker-compose logs -f', description: '실시간 로그 확인' },
  { command: 'docker-compose exec <service> sh', description: '컨테이너 쉘 접속' },
  { command: 'docker-compose build', description: '이미지 빌드' },
  { command: 'docker-compose pull', description: '최신 이미지 풀' },
  { command: 'docker network ls', description: '네트워크 목록' },
  { command: 'docker volume ls', description: '볼륨 목록' },
]

// Container state descriptions
export const stateDescriptions = {
  running: '컨테이너가 정상적으로 실행 중입니다.',
  stopped: '컨테이너가 중지되었습니다.',
  paused: '컨테이너가 일시 중지되었습니다.',
  restarting: '컨테이너가 재시작 중입니다.',
  created: '컨테이너가 생성되었지만 아직 시작되지 않았습니다.',
}

// Network driver descriptions
export const networkDriverDescriptions = {
  bridge: '기본 네트워크 드라이버. 동일 호스트의 컨테이너 간 통신.',
  host: '호스트의 네트워크 스택 직접 사용. 포트 매핑 불필요.',
  overlay: '다중 Docker 호스트 간 네트워크 (Swarm 모드).',
  none: '네트워크 비활성화. 완전히 격리된 컨테이너.',
  macvlan: '컨테이너에 MAC 주소 할당. 물리 네트워크에 직접 연결.',
}
