import { Task } from '../../types'

export const day2Tasks: Task[] = [
  {
    id: 'w8d2t1',
    title: '데이터 소스별 Extractor 설계',
    type: 'video',
    duration: 25,
    content: {
      videoUrl: '',
      transcript: `# 데이터 소스별 Extractor 설계

## 🎯 오늘의 목표

다양한 데이터 소스에서 데이터를 추출하는 Extractor를 구현합니다.

### 데이터 소스 목록

| 소스 | 유형 | 데이터 | 추출 방식 |
|------|------|--------|----------|
| PostgreSQL | RDBMS | users, subscriptions | Full/Incremental |
| S3 | Object Storage | event logs (JSON) | Partition Scan |
| REST API | HTTP | payments | Pagination |

## 🏗️ Extractor 아키텍처

\`\`\`
┌─────────────────────────────────────────────────────┐
│                 BaseExtractor (ABC)                  │
│  ┌─────────────────────────────────────────────────┐│
│  │  + extract() -> DataFrame                        ││
│  │  + validate() -> bool                            ││
│  │  + get_watermark() -> datetime                   ││
│  │  + save_to_raw() -> str                          ││
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
           │                │                 │
           ▼                ▼                 ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │PostgresSQL   │ │   S3Json     │ │  RestAPI     │
    │  Extractor   │ │  Extractor   │ │  Extractor   │
    │              │ │              │ │              │
    │ + query      │ │ + prefix     │ │ + endpoint   │
    │ + batch_size │ │ + pattern    │ │ + auth       │
    └──────────────┘ └──────────────┘ └──────────────┘
\`\`\`

## 📊 추출 전략

### 1. Full Extract (전체 추출)
- 작은 Dimension 테이블에 적합
- 매번 전체 데이터 교체
- 예: dim_plan, dim_event_type

### 2. Incremental Extract (증분 추출)
- 대용량 Fact 테이블에 필수
- Watermark 기반으로 변경분만 추출
- 예: fact_events, fact_payments

### 3. CDC (Change Data Capture)
- 실시간에 가까운 데이터 동기화
- Debezium, AWS DMS 등 활용
- 이번 프로젝트에서는 배치 증분으로 대체

## 🔧 핵심 패턴

### Watermark 관리

\`\`\`python
class WatermarkManager:
    def __init__(self, state_store: str):
        self.state_store = state_store

    def get_last_watermark(self, source: str) -> datetime:
        # 마지막 성공 추출 시점 조회
        pass

    def update_watermark(self, source: str, watermark: datetime):
        # 추출 완료 후 워터마크 업데이트
        pass
\`\`\`

### 재시도 및 에러 핸들링

\`\`\`python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=4, max=60)
)
def extract_with_retry(extractor):
    return extractor.extract()
\`\`\`

## 📁 오늘 구현할 파일

\`\`\`
src/e2e_pipeline/extractors/
├── __init__.py
├── base.py           # BaseExtractor ABC
├── postgres.py       # PostgreSQL Extractor
├── s3_json.py        # S3 JSON Extractor
├── rest_api.py       # REST API Extractor
└── watermark.py      # Watermark Manager
\`\`\`

자, 이제 구현을 시작합시다! 💻
`,
      objectives: [
        '다양한 데이터 소스에서 데이터를 추출하는 패턴을 익힌다',
        '증분 추출과 Watermark 관리 방법을 이해한다',
        '재시도 및 에러 핸들링 패턴을 적용한다'
      ],
      keyPoints: [
        'BaseExtractor 추상 클래스로 공통 인터페이스 정의',
        'Watermark를 통해 증분 추출의 시작점 관리',
        '각 소스별 특성에 맞는 추출 전략 선택'
      ]
    }
  },
  {
    id: 'w8d2t2',
    title: 'BaseExtractor & PostgreSQL Extractor 구현',
    type: 'code',
    duration: 45,
    content: {
      instructions: `## BaseExtractor & PostgreSQL Extractor 구현

추상 베이스 클래스와 PostgreSQL 데이터 추출기를 구현합니다.

### 구현 요구사항

1. **BaseExtractor (ABC)**
   - extract(), validate(), save_to_raw() 추상 메서드
   - 공통 로깅 및 메트릭 수집

2. **PostgreSQLExtractor**
   - 전체 추출 / 증분 추출 지원
   - 배치 사이즈 기반 청크 처리
   - 연결 풀 관리

3. **테스트**
   - 단위 테스트 작성
   - Mock을 활용한 DB 연결 테스트
`,
      starterCode: `# src/e2e_pipeline/extractors/base.py

from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any, Dict, Optional
import pandas as pd

class BaseExtractor(ABC):
    """Base class for all data extractors."""

    def __init__(self, source_name: str, config: Dict[str, Any]):
        self.source_name = source_name
        self.config = config
        # TODO: 로거 초기화

    @abstractmethod
    def extract(self, **kwargs) -> pd.DataFrame:
        """Extract data from source."""
        pass

    @abstractmethod
    def validate(self, df: pd.DataFrame) -> bool:
        """Validate extracted data."""
        pass

    def save_to_raw(self, df: pd.DataFrame, path: str) -> str:
        """Save DataFrame to raw layer."""
        # TODO: S3에 Parquet으로 저장
        pass


# src/e2e_pipeline/extractors/postgres.py

class PostgreSQLExtractor(BaseExtractor):
    """Extract data from PostgreSQL database."""

    def __init__(
        self,
        source_name: str,
        connection_string: str,
        table_name: str,
        # TODO: 추가 파라미터
    ):
        # TODO: 초기화 구현
        pass

    def extract(
        self,
        incremental: bool = False,
        watermark_column: str = None,
        last_watermark: datetime = None,
    ) -> pd.DataFrame:
        """Extract data from PostgreSQL."""
        # TODO: 구현
        pass

    def validate(self, df: pd.DataFrame) -> bool:
        """Validate extracted data."""
        # TODO: 구현
        pass
`,
      solutionCode: `# src/e2e_pipeline/extractors/base.py

from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any, Dict, List, Optional
import pandas as pd
from pathlib import Path

from e2e_pipeline.utils.logger import get_logger
from e2e_pipeline.utils.exceptions import ExtractionError, ValidationError


class BaseExtractor(ABC):
    """Base class for all data extractors."""

    def __init__(self, source_name: str, config: Dict[str, Any]):
        self.source_name = source_name
        self.config = config
        self.logger = get_logger(f"extractor.{source_name}")
        self._extraction_stats = {
            "rows_extracted": 0,
            "extraction_time_seconds": 0,
            "errors": [],
        }

    @abstractmethod
    def extract(self, **kwargs) -> pd.DataFrame:
        """Extract data from source.

        Returns:
            pd.DataFrame: Extracted data
        """
        pass

    @abstractmethod
    def validate(self, df: pd.DataFrame) -> bool:
        """Validate extracted data.

        Args:
            df: DataFrame to validate

        Returns:
            bool: True if valid
        """
        pass

    def save_to_raw(
        self,
        df: pd.DataFrame,
        bucket: str,
        prefix: str,
        partition_cols: Optional[List[str]] = None,
    ) -> str:
        """Save DataFrame to raw layer in S3.

        Args:
            df: DataFrame to save
            bucket: S3 bucket name
            prefix: S3 key prefix
            partition_cols: Columns to partition by

        Returns:
            str: S3 path where data was saved
        """
        import boto3
        from io import BytesIO
        import pyarrow as pa
        import pyarrow.parquet as pq

        self.logger.info(
            "Saving to raw layer",
            bucket=bucket,
            prefix=prefix,
            rows=len(df),
        )

        # Generate path with timestamp
        timestamp = datetime.utcnow().strftime("%Y-%m-%dT%H-%M-%S")
        s3_key = f"{prefix}/{timestamp}/data.parquet"

        # Convert to Parquet
        table = pa.Table.from_pandas(df)
        buffer = BytesIO()
        pq.write_table(table, buffer)
        buffer.seek(0)

        # Upload to S3
        s3_client = boto3.client("s3")
        s3_client.upload_fileobj(buffer, bucket, s3_key)

        full_path = f"s3://{bucket}/{s3_key}"
        self.logger.info("Saved to S3", path=full_path)

        return full_path

    def get_stats(self) -> Dict[str, Any]:
        """Get extraction statistics."""
        return self._extraction_stats


# src/e2e_pipeline/extractors/postgres.py

from datetime import datetime
from typing import Any, Dict, List, Optional
import pandas as pd
from contextlib import contextmanager
import time

from sqlalchemy import create_engine, text
from sqlalchemy.pool import QueuePool

from e2e_pipeline.extractors.base import BaseExtractor
from e2e_pipeline.utils.exceptions import ExtractionError, ValidationError
from e2e_pipeline.utils.logger import get_logger


class PostgreSQLExtractor(BaseExtractor):
    """Extract data from PostgreSQL database."""

    def __init__(
        self,
        source_name: str,
        connection_string: str,
        table_name: str,
        schema: str = "public",
        batch_size: int = 10000,
        required_columns: Optional[List[str]] = None,
    ):
        """Initialize PostgreSQL extractor.

        Args:
            source_name: Unique identifier for this source
            connection_string: PostgreSQL connection URL
            table_name: Table to extract from
            schema: Database schema
            batch_size: Number of rows per batch
            required_columns: Columns that must exist
        """
        super().__init__(source_name, {"table": table_name, "schema": schema})

        self.connection_string = connection_string
        self.table_name = table_name
        self.schema = schema
        self.batch_size = batch_size
        self.required_columns = required_columns or []

        # Create connection pool
        self.engine = create_engine(
            connection_string,
            poolclass=QueuePool,
            pool_size=5,
            max_overflow=10,
            pool_pre_ping=True,  # Test connection health
        )

        self.logger = get_logger(f"extractor.postgres.{source_name}")

    @contextmanager
    def get_connection(self):
        """Get database connection from pool."""
        conn = self.engine.connect()
        try:
            yield conn
        finally:
            conn.close()

    def extract(
        self,
        incremental: bool = False,
        watermark_column: Optional[str] = None,
        last_watermark: Optional[datetime] = None,
        columns: Optional[List[str]] = None,
        where_clause: Optional[str] = None,
    ) -> pd.DataFrame:
        """Extract data from PostgreSQL.

        Args:
            incremental: If True, extract only new/updated rows
            watermark_column: Column to use for incremental extraction
            last_watermark: Last extraction timestamp
            columns: Specific columns to extract (default: all)
            where_clause: Additional WHERE conditions

        Returns:
            pd.DataFrame: Extracted data
        """
        start_time = time.time()
        self.logger.info(
            "Starting extraction",
            table=self.table_name,
            incremental=incremental,
            last_watermark=last_watermark,
        )

        try:
            # Build query
            select_cols = ", ".join(columns) if columns else "*"
            query = f"SELECT {select_cols} FROM {self.schema}.{self.table_name}"

            conditions = []

            # Add incremental condition
            if incremental and watermark_column and last_watermark:
                conditions.append(
                    f"{watermark_column} > :last_watermark"
                )

            # Add custom where clause
            if where_clause:
                conditions.append(f"({where_clause})")

            if conditions:
                query += " WHERE " + " AND ".join(conditions)

            query += f" ORDER BY {watermark_column}" if watermark_column else ""

            self.logger.debug("Executing query", query=query)

            # Execute with batching for large tables
            all_data = []

            with self.get_connection() as conn:
                # Get total count first
                count_query = f"SELECT COUNT(*) FROM ({query}) AS subquery"
                params = {"last_watermark": last_watermark} if last_watermark else {}
                result = conn.execute(text(count_query), params)
                total_rows = result.scalar()

                self.logger.info(f"Total rows to extract: {total_rows}")

                # Batch extraction
                offset = 0
                while offset < total_rows:
                    batch_query = f"{query} LIMIT {self.batch_size} OFFSET {offset}"
                    df_batch = pd.read_sql(
                        text(batch_query),
                        conn,
                        params=params,
                    )
                    all_data.append(df_batch)
                    offset += self.batch_size

                    self.logger.debug(
                        f"Extracted batch",
                        offset=offset,
                        batch_size=len(df_batch),
                    )

            # Combine all batches
            df = pd.concat(all_data, ignore_index=True) if all_data else pd.DataFrame()

            # Update stats
            extraction_time = time.time() - start_time
            self._extraction_stats = {
                "rows_extracted": len(df),
                "extraction_time_seconds": round(extraction_time, 2),
                "errors": [],
            }

            self.logger.info(
                "Extraction completed",
                rows=len(df),
                duration_seconds=round(extraction_time, 2),
            )

            return df

        except Exception as e:
            self.logger.error(f"Extraction failed: {e}")
            self._extraction_stats["errors"].append(str(e))
            raise ExtractionError(f"Failed to extract from {self.table_name}: {e}")

    def validate(self, df: pd.DataFrame) -> bool:
        """Validate extracted data.

        Checks:
        - Not empty (warning, not error)
        - Required columns exist
        - No duplicate primary keys (if specified)

        Args:
            df: DataFrame to validate

        Returns:
            bool: True if valid

        Raises:
            ValidationError: If critical validation fails
        """
        self.logger.info("Validating extracted data", rows=len(df))

        # Check if empty
        if df.empty:
            self.logger.warning("Extracted DataFrame is empty")
            return True  # Empty is valid, just a warning

        # Check required columns
        missing_cols = set(self.required_columns) - set(df.columns)
        if missing_cols:
            raise ValidationError(
                f"Missing required columns: {missing_cols}"
            )

        # Check for nulls in critical columns
        for col in self.required_columns:
            null_count = df[col].isnull().sum()
            if null_count > 0:
                self.logger.warning(
                    f"Column {col} has {null_count} null values"
                )

        self.logger.info("Validation passed")
        return True

    def get_current_watermark(self, watermark_column: str) -> Optional[datetime]:
        """Get the maximum value of watermark column.

        Args:
            watermark_column: Column name for watermark

        Returns:
            datetime: Maximum watermark value
        """
        query = f"SELECT MAX({watermark_column}) FROM {self.schema}.{self.table_name}"

        with self.get_connection() as conn:
            result = conn.execute(text(query))
            max_value = result.scalar()

        return max_value

    def close(self):
        """Close database connection pool."""
        self.engine.dispose()
        self.logger.info("Connection pool closed")


# tests/unit/extractors/test_postgres.py

import pytest
from unittest.mock import Mock, patch, MagicMock
import pandas as pd
from datetime import datetime


class TestPostgreSQLExtractor:
    """Tests for PostgreSQLExtractor."""

    @pytest.fixture
    def mock_engine(self):
        """Create mock SQLAlchemy engine."""
        with patch("e2e_pipeline.extractors.postgres.create_engine") as mock:
            yield mock

    @pytest.fixture
    def extractor(self, mock_engine):
        """Create extractor instance with mocked engine."""
        from e2e_pipeline.extractors.postgres import PostgreSQLExtractor

        return PostgreSQLExtractor(
            source_name="test_users",
            connection_string="postgresql://test:test@localhost/test",
            table_name="users",
            required_columns=["user_id", "email"],
        )

    def test_validate_with_required_columns(self, extractor):
        """Test validation passes with required columns."""
        df = pd.DataFrame({
            "user_id": [1, 2, 3],
            "email": ["a@test.com", "b@test.com", "c@test.com"],
            "name": ["A", "B", "C"],
        })

        assert extractor.validate(df) is True

    def test_validate_missing_required_columns(self, extractor):
        """Test validation fails when required columns missing."""
        from e2e_pipeline.utils.exceptions import ValidationError

        df = pd.DataFrame({
            "user_id": [1, 2, 3],
            "name": ["A", "B", "C"],
            # Missing 'email' column
        })

        with pytest.raises(ValidationError) as exc_info:
            extractor.validate(df)

        assert "email" in str(exc_info.value)

    def test_validate_empty_dataframe(self, extractor):
        """Test validation passes for empty DataFrame."""
        df = pd.DataFrame()

        # Empty is valid (warning, not error)
        assert extractor.validate(df) is True

    def test_get_stats(self, extractor):
        """Test extraction statistics."""
        stats = extractor.get_stats()

        assert "rows_extracted" in stats
        assert "extraction_time_seconds" in stats
        assert "errors" in stats
`,
      hints: [
        "SQLAlchemy의 QueuePool을 사용하면 연결을 재사용할 수 있습니다",
        "contextmanager를 사용하면 연결을 안전하게 관리할 수 있습니다",
        "pd.read_sql에 text()를 사용하면 parameterized query가 가능합니다",
        "배치 처리로 메모리 사용량을 제어할 수 있습니다"
      ]
    }
  },
  {
    id: 'w8d2t3',
    title: 'S3 JSON & REST API Extractor 구현',
    type: 'code',
    duration: 40,
    content: {
      instructions: `## S3 JSON & REST API Extractor 구현

S3에서 JSON 로그를 읽고, REST API에서 데이터를 페이징으로 추출하는 Extractor를 구현합니다.

### 구현 요구사항

1. **S3JSONExtractor**
   - 날짜 파티션 기반 파일 스캔
   - JSON Lines 형식 지원
   - 병렬 파일 처리

2. **RESTAPIExtractor**
   - 페이징 처리 (cursor / offset)
   - Rate limiting
   - 인증 (API Key / OAuth)
`,
      starterCode: `# src/e2e_pipeline/extractors/s3_json.py

from datetime import datetime, date
from typing import List, Optional
import pandas as pd

from e2e_pipeline.extractors.base import BaseExtractor


class S3JSONExtractor(BaseExtractor):
    """Extract JSON data from S3."""

    def __init__(
        self,
        source_name: str,
        bucket: str,
        prefix: str,
        # TODO: 추가 파라미터
    ):
        # TODO: 초기화
        pass

    def extract(
        self,
        start_date: date,
        end_date: date,
    ) -> pd.DataFrame:
        """Extract JSON files for date range."""
        # TODO: 구현
        pass


# src/e2e_pipeline/extractors/rest_api.py

class RESTAPIExtractor(BaseExtractor):
    """Extract data from REST API with pagination."""

    def __init__(
        self,
        source_name: str,
        base_url: str,
        endpoint: str,
        # TODO: 추가 파라미터
    ):
        # TODO: 초기화
        pass

    def extract(
        self,
        params: dict = None,
    ) -> pd.DataFrame:
        """Extract all pages from API."""
        # TODO: 구현
        pass
`,
      solutionCode: `# src/e2e_pipeline/extractors/s3_json.py

from datetime import datetime, date, timedelta
from typing import Any, Dict, List, Optional
import pandas as pd
from concurrent.futures import ThreadPoolExecutor, as_completed
import json
from io import BytesIO
import time

import boto3
from botocore.config import Config

from e2e_pipeline.extractors.base import BaseExtractor
from e2e_pipeline.utils.exceptions import ExtractionError
from e2e_pipeline.utils.logger import get_logger


class S3JSONExtractor(BaseExtractor):
    """Extract JSON data from S3 with date partitioning."""

    def __init__(
        self,
        source_name: str,
        bucket: str,
        prefix: str,
        file_pattern: str = "*.json",
        partition_format: str = "dt=%Y-%m-%d",
        max_workers: int = 4,
        endpoint_url: Optional[str] = None,
    ):
        """Initialize S3 JSON extractor.

        Args:
            source_name: Unique identifier for this source
            bucket: S3 bucket name
            prefix: Base prefix for files
            file_pattern: Glob pattern for files
            partition_format: Date partition format string
            max_workers: Number of parallel file readers
            endpoint_url: Custom S3 endpoint (for MinIO)
        """
        super().__init__(source_name, {"bucket": bucket, "prefix": prefix})

        self.bucket = bucket
        self.prefix = prefix
        self.file_pattern = file_pattern
        self.partition_format = partition_format
        self.max_workers = max_workers

        # Configure S3 client with retries
        config = Config(
            retries={"max_attempts": 3, "mode": "adaptive"},
            max_pool_connections=max_workers * 2,
        )

        self.s3_client = boto3.client(
            "s3",
            endpoint_url=endpoint_url,
            config=config,
        )

        self.logger = get_logger(f"extractor.s3.{source_name}")

    def _list_files(self, start_date: date, end_date: date) -> List[str]:
        """List all files in date range.

        Args:
            start_date: Start date (inclusive)
            end_date: End date (inclusive)

        Returns:
            List of S3 keys
        """
        files = []
        current_date = start_date

        while current_date <= end_date:
            partition = current_date.strftime(self.partition_format)
            full_prefix = f"{self.prefix}/{partition}/"

            self.logger.debug(f"Listing files in {full_prefix}")

            paginator = self.s3_client.get_paginator("list_objects_v2")
            for page in paginator.paginate(Bucket=self.bucket, Prefix=full_prefix):
                for obj in page.get("Contents", []):
                    key = obj["Key"]
                    if key.endswith(".json") or key.endswith(".jsonl"):
                        files.append(key)

            current_date += timedelta(days=1)

        self.logger.info(f"Found {len(files)} files to process")
        return files

    def _read_json_file(self, key: str) -> List[Dict[str, Any]]:
        """Read a single JSON/JSONL file from S3.

        Args:
            key: S3 object key

        Returns:
            List of records
        """
        try:
            response = self.s3_client.get_object(Bucket=self.bucket, Key=key)
            content = response["Body"].read().decode("utf-8")

            # Handle both JSON array and JSON Lines
            if key.endswith(".jsonl"):
                records = [json.loads(line) for line in content.strip().split("\\n") if line]
            else:
                data = json.loads(content)
                records = data if isinstance(data, list) else [data]

            self.logger.debug(f"Read {len(records)} records from {key}")
            return records

        except Exception as e:
            self.logger.error(f"Failed to read {key}: {e}")
            return []

    def extract(
        self,
        start_date: date,
        end_date: date,
        flatten_nested: bool = True,
    ) -> pd.DataFrame:
        """Extract JSON files for date range.

        Args:
            start_date: Start date (inclusive)
            end_date: End date (inclusive)
            flatten_nested: If True, flatten nested JSON structures

        Returns:
            pd.DataFrame: Combined data from all files
        """
        start_time = time.time()
        self.logger.info(
            "Starting S3 extraction",
            start_date=str(start_date),
            end_date=str(end_date),
        )

        try:
            # List all files
            files = self._list_files(start_date, end_date)

            if not files:
                self.logger.warning("No files found for date range")
                return pd.DataFrame()

            # Read files in parallel
            all_records = []

            with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
                future_to_key = {
                    executor.submit(self._read_json_file, key): key
                    for key in files
                }

                for future in as_completed(future_to_key):
                    key = future_to_key[future]
                    try:
                        records = future.result()
                        all_records.extend(records)
                    except Exception as e:
                        self.logger.error(f"Error processing {key}: {e}")

            # Convert to DataFrame
            df = pd.DataFrame(all_records)

            # Flatten nested structures if requested
            if flatten_nested and not df.empty:
                df = pd.json_normalize(all_records, sep="_")

            # Update stats
            extraction_time = time.time() - start_time
            self._extraction_stats = {
                "rows_extracted": len(df),
                "files_processed": len(files),
                "extraction_time_seconds": round(extraction_time, 2),
                "errors": [],
            }

            self.logger.info(
                "Extraction completed",
                rows=len(df),
                files=len(files),
                duration_seconds=round(extraction_time, 2),
            )

            return df

        except Exception as e:
            self.logger.error(f"Extraction failed: {e}")
            raise ExtractionError(f"Failed to extract from S3: {e}")

    def validate(self, df: pd.DataFrame) -> bool:
        """Validate extracted JSON data."""
        if df.empty:
            self.logger.warning("Extracted DataFrame is empty")
            return True

        # Check for required event fields
        required_fields = ["event_id", "user_id", "event_type", "timestamp"]
        missing = set(required_fields) - set(df.columns)

        if missing:
            self.logger.warning(f"Missing expected fields: {missing}")

        return True


# src/e2e_pipeline/extractors/rest_api.py

from datetime import datetime
from typing import Any, Dict, List, Optional, Callable
import pandas as pd
import time

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from e2e_pipeline.extractors.base import BaseExtractor
from e2e_pipeline.utils.exceptions import ExtractionError
from e2e_pipeline.utils.logger import get_logger


class RESTAPIExtractor(BaseExtractor):
    """Extract data from REST API with pagination and rate limiting."""

    def __init__(
        self,
        source_name: str,
        base_url: str,
        endpoint: str,
        auth_type: str = "api_key",
        api_key: Optional[str] = None,
        api_key_header: str = "X-API-Key",
        page_size: int = 100,
        max_pages: Optional[int] = None,
        rate_limit_per_second: float = 10.0,
        pagination_type: str = "offset",  # 'offset' or 'cursor'
    ):
        """Initialize REST API extractor.

        Args:
            source_name: Unique identifier for this source
            base_url: API base URL
            endpoint: API endpoint path
            auth_type: Authentication type ('api_key', 'bearer', 'basic')
            api_key: API key or token
            api_key_header: Header name for API key
            page_size: Number of records per page
            max_pages: Maximum pages to fetch (None for all)
            rate_limit_per_second: Maximum requests per second
            pagination_type: 'offset' or 'cursor'
        """
        super().__init__(source_name, {"base_url": base_url, "endpoint": endpoint})

        self.base_url = base_url.rstrip("/")
        self.endpoint = endpoint
        self.page_size = page_size
        self.max_pages = max_pages
        self.rate_limit_per_second = rate_limit_per_second
        self.pagination_type = pagination_type

        # Setup session with retries
        self.session = requests.Session()
        retries = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
        )
        self.session.mount("https://", HTTPAdapter(max_retries=retries))
        self.session.mount("http://", HTTPAdapter(max_retries=retries))

        # Setup authentication
        if auth_type == "api_key" and api_key:
            self.session.headers[api_key_header] = api_key
        elif auth_type == "bearer" and api_key:
            self.session.headers["Authorization"] = f"Bearer {api_key}"

        self.logger = get_logger(f"extractor.api.{source_name}")
        self._last_request_time = 0

    def _rate_limit(self):
        """Apply rate limiting between requests."""
        min_interval = 1.0 / self.rate_limit_per_second
        elapsed = time.time() - self._last_request_time

        if elapsed < min_interval:
            sleep_time = min_interval - elapsed
            time.sleep(sleep_time)

        self._last_request_time = time.time()

    def _fetch_page(
        self,
        params: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Fetch a single page from API.

        Args:
            params: Query parameters

        Returns:
            API response as dict
        """
        self._rate_limit()

        url = f"{self.base_url}{self.endpoint}"

        try:
            response = self.session.get(url, params=params, timeout=30)
            response.raise_for_status()
            return response.json()

        except requests.exceptions.RequestException as e:
            self.logger.error(f"API request failed: {e}")
            raise ExtractionError(f"API request failed: {e}")

    def extract(
        self,
        params: Optional[Dict[str, Any]] = None,
        data_key: str = "data",
        cursor_key: str = "next_cursor",
        total_key: str = "total",
    ) -> pd.DataFrame:
        """Extract all pages from API.

        Args:
            params: Additional query parameters
            data_key: Key in response containing data array
            cursor_key: Key for cursor pagination
            total_key: Key for total count

        Returns:
            pd.DataFrame: Combined data from all pages
        """
        start_time = time.time()
        self.logger.info("Starting API extraction", endpoint=self.endpoint)

        try:
            all_records = []
            page = 0
            cursor = None
            total_fetched = 0

            while True:
                # Build request params
                request_params = {"limit": self.page_size}

                if params:
                    request_params.update(params)

                if self.pagination_type == "offset":
                    request_params["offset"] = page * self.page_size
                elif self.pagination_type == "cursor" and cursor:
                    request_params["cursor"] = cursor

                # Fetch page
                self.logger.debug(f"Fetching page {page + 1}")
                response = self._fetch_page(request_params)

                # Extract data
                data = response.get(data_key, [])
                if not data:
                    self.logger.info("No more data, stopping pagination")
                    break

                all_records.extend(data)
                total_fetched += len(data)
                page += 1

                self.logger.debug(
                    f"Page {page}: fetched {len(data)} records, total: {total_fetched}"
                )

                # Check cursor for next page
                if self.pagination_type == "cursor":
                    cursor = response.get(cursor_key)
                    if not cursor:
                        break

                # Check if we've fetched all
                if len(data) < self.page_size:
                    break

                # Check max pages limit
                if self.max_pages and page >= self.max_pages:
                    self.logger.info(f"Reached max pages limit: {self.max_pages}")
                    break

            # Convert to DataFrame
            df = pd.DataFrame(all_records)

            # Update stats
            extraction_time = time.time() - start_time
            self._extraction_stats = {
                "rows_extracted": len(df),
                "pages_fetched": page,
                "extraction_time_seconds": round(extraction_time, 2),
                "errors": [],
            }

            self.logger.info(
                "Extraction completed",
                rows=len(df),
                pages=page,
                duration_seconds=round(extraction_time, 2),
            )

            return df

        except Exception as e:
            self.logger.error(f"Extraction failed: {e}")
            raise ExtractionError(f"Failed to extract from API: {e}")

    def validate(self, df: pd.DataFrame) -> bool:
        """Validate extracted API data."""
        if df.empty:
            self.logger.warning("Extracted DataFrame is empty")

        return True

    def close(self):
        """Close the session."""
        self.session.close()


# src/e2e_pipeline/extractors/watermark.py

from datetime import datetime
from typing import Optional, Dict, Any
import json
from pathlib import Path

import boto3

from e2e_pipeline.utils.logger import get_logger


class WatermarkManager:
    """Manage extraction watermarks for incremental processing."""

    def __init__(
        self,
        storage_type: str = "s3",
        bucket: Optional[str] = None,
        prefix: str = "watermarks",
        local_path: Optional[str] = None,
    ):
        """Initialize watermark manager.

        Args:
            storage_type: 's3' or 'local'
            bucket: S3 bucket for watermarks
            prefix: S3 prefix or local directory
            local_path: Path for local storage
        """
        self.storage_type = storage_type
        self.bucket = bucket
        self.prefix = prefix
        self.local_path = Path(local_path) if local_path else Path("./watermarks")
        self.logger = get_logger("watermark_manager")

        if storage_type == "local":
            self.local_path.mkdir(parents=True, exist_ok=True)

    def _get_key(self, source: str) -> str:
        """Generate storage key for source."""
        return f"{self.prefix}/{source}.json"

    def get_watermark(self, source: str) -> Optional[datetime]:
        """Get last successful watermark for source.

        Args:
            source: Source identifier

        Returns:
            Last watermark datetime or None
        """
        try:
            if self.storage_type == "s3":
                s3 = boto3.client("s3")
                response = s3.get_object(
                    Bucket=self.bucket,
                    Key=self._get_key(source),
                )
                data = json.loads(response["Body"].read())

            else:  # local
                file_path = self.local_path / f"{source}.json"
                if not file_path.exists():
                    return None
                data = json.loads(file_path.read_text())

            watermark_str = data.get("last_watermark")
            if watermark_str:
                return datetime.fromisoformat(watermark_str)

            return None

        except Exception as e:
            self.logger.warning(f"Could not get watermark for {source}: {e}")
            return None

    def update_watermark(
        self,
        source: str,
        watermark: datetime,
        metadata: Optional[Dict[str, Any]] = None,
    ):
        """Update watermark for source.

        Args:
            source: Source identifier
            watermark: New watermark value
            metadata: Additional metadata to store
        """
        data = {
            "source": source,
            "last_watermark": watermark.isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
            "metadata": metadata or {},
        }

        try:
            if self.storage_type == "s3":
                s3 = boto3.client("s3")
                s3.put_object(
                    Bucket=self.bucket,
                    Key=self._get_key(source),
                    Body=json.dumps(data),
                    ContentType="application/json",
                )

            else:  # local
                file_path = self.local_path / f"{source}.json"
                file_path.write_text(json.dumps(data, indent=2))

            self.logger.info(
                f"Updated watermark for {source}",
                watermark=watermark.isoformat(),
            )

        except Exception as e:
            self.logger.error(f"Failed to update watermark for {source}: {e}")
            raise
`,
      hints: [
        "ThreadPoolExecutor를 사용하면 S3 파일을 병렬로 읽을 수 있습니다",
        "requests.Session의 Retry를 설정하면 일시적 오류에 자동 재시도됩니다",
        "Rate limiting은 time.sleep()으로 간단히 구현할 수 있습니다",
        "Watermark는 S3나 로컬 파일에 JSON으로 저장하면 됩니다"
      ]
    }
  },
  {
    id: 'w8d2t4',
    title: 'Extraction DAG 구현',
    type: 'code',
    duration: 35,
    content: {
      instructions: `## Airflow Extraction DAG 구현

3개의 데이터 소스에서 데이터를 추출하는 Airflow DAG를 구현합니다.

### 구현 요구사항

1. **dag_extract_all.py**
   - 3개 추출 Task를 병렬 실행
   - TaskFlow API 사용
   - 에러 시 Slack 알림

2. **의존성 관리**
   - Extract 완료 후 Raw Layer 저장
   - Watermark 업데이트
`,
      starterCode: `# dags/dag_extract_all.py

from datetime import datetime, timedelta
from airflow.decorators import dag, task, task_group

default_args = {
    'owner': 'data-team',
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
}


@dag(
    dag_id='extract_all_sources',
    description='Extract data from all sources',
    schedule='0 2 * * *',  # 매일 02:00 UTC
    start_date=datetime(2024, 1, 1),
    catchup=False,
    default_args=default_args,
    tags=['extract', 'e2e-pipeline'],
)
def extract_all_sources():
    """Extract data from PostgreSQL, S3, and REST API."""

    # TODO: Task 구현
    pass


dag = extract_all_sources()
`,
      solutionCode: `# dags/dag_extract_all.py

from datetime import datetime, timedelta
from typing import Dict, Any

from airflow.decorators import dag, task, task_group
from airflow.providers.slack.hooks.slack_webhook import SlackWebhookHook
from airflow.models import Variable

default_args = {
    'owner': 'data-team',
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
    'retry_exponential_backoff': True,
}


def slack_failure_callback(context):
    """Send Slack notification on failure."""
    task_instance = context['task_instance']
    dag_id = context['dag'].dag_id
    exception = context.get('exception', 'Unknown error')

    message = f"""
:red_circle: *Extraction Failed*
• DAG: {dag_id}
• Task: {task_instance.task_id}
• Error: {str(exception)[:200]}
    """

    try:
        hook = SlackWebhookHook(slack_webhook_conn_id='slack_webhook')
        hook.send(text=message)
    except Exception:
        pass


@dag(
    dag_id='extract_all_sources',
    description='Extract data from all sources to raw layer',
    schedule='0 2 * * *',  # 매일 02:00 UTC
    start_date=datetime(2024, 1, 1),
    catchup=False,
    default_args=default_args,
    on_failure_callback=slack_failure_callback,
    tags=['extract', 'e2e-pipeline'],
    dagrun_timeout=timedelta(hours=2),
)
def extract_all_sources():
    """Extract data from PostgreSQL, S3, and REST API."""

    @task_group(group_id='extract_sources')
    def extract_all():
        """Extract from all sources in parallel."""

        @task(
            retries=3,
            retry_delay=timedelta(minutes=5),
        )
        def extract_users(**context) -> Dict[str, Any]:
            """Extract users and subscriptions from PostgreSQL."""
            import sys
            sys.path.insert(0, '/opt/airflow/src')

            from e2e_pipeline.extractors.postgres import PostgreSQLExtractor
            from e2e_pipeline.extractors.watermark import WatermarkManager
            from e2e_pipeline.config import settings

            execution_date = context['logical_date']
            target_date = (execution_date - timedelta(days=1)).strftime('%Y-%m-%d')

            # Initialize extractor
            extractor = PostgreSQLExtractor(
                source_name='users',
                connection_string=settings.postgres_url,
                table_name='users',
                required_columns=['user_id', 'email', 'created_at'],
            )

            # Get watermark
            watermark_mgr = WatermarkManager(
                storage_type='s3',
                bucket=settings.s3_bucket,
                prefix='watermarks',
            )
            last_watermark = watermark_mgr.get_watermark('users')

            # Extract
            df = extractor.extract(
                incremental=True,
                watermark_column='updated_at',
                last_watermark=last_watermark,
            )

            # Validate
            extractor.validate(df)

            # Save to raw layer
            if not df.empty:
                path = extractor.save_to_raw(
                    df,
                    bucket=settings.s3_bucket,
                    prefix=f'raw/users/dt={target_date}',
                )

                # Update watermark
                new_watermark = df['updated_at'].max()
                watermark_mgr.update_watermark(
                    'users',
                    new_watermark,
                    metadata={'rows': len(df), 'path': path},
                )
            else:
                path = None

            extractor.close()

            return {
                'source': 'users',
                'rows': len(df),
                'path': path,
                'target_date': target_date,
            }

        @task(
            retries=3,
            retry_delay=timedelta(minutes=5),
        )
        def extract_events(**context) -> Dict[str, Any]:
            """Extract event logs from S3."""
            import sys
            sys.path.insert(0, '/opt/airflow/src')

            from datetime import date
            from e2e_pipeline.extractors.s3_json import S3JSONExtractor
            from e2e_pipeline.config import settings

            execution_date = context['logical_date']
            target_date = (execution_date - timedelta(days=1)).date()

            # Initialize extractor
            extractor = S3JSONExtractor(
                source_name='events',
                bucket='source-logs',  # Source bucket
                prefix='event-logs',
                partition_format='dt=%Y-%m-%d',
                max_workers=4,
            )

            # Extract yesterday's events
            df = extractor.extract(
                start_date=target_date,
                end_date=target_date,
                flatten_nested=True,
            )

            # Validate
            extractor.validate(df)

            # Save to raw layer (our data lake)
            if not df.empty:
                path = extractor.save_to_raw(
                    df,
                    bucket=settings.s3_bucket,
                    prefix=f'raw/events/dt={target_date}',
                )
            else:
                path = None

            return {
                'source': 'events',
                'rows': len(df),
                'files_processed': extractor.get_stats().get('files_processed', 0),
                'path': path,
                'target_date': str(target_date),
            }

        @task(
            retries=3,
            retry_delay=timedelta(minutes=5),
        )
        def extract_payments(**context) -> Dict[str, Any]:
            """Extract payments from REST API."""
            import sys
            sys.path.insert(0, '/opt/airflow/src')

            from e2e_pipeline.extractors.rest_api import RESTAPIExtractor
            from e2e_pipeline.config import settings

            execution_date = context['logical_date']
            target_date = (execution_date - timedelta(days=1)).strftime('%Y-%m-%d')

            # Initialize extractor
            extractor = RESTAPIExtractor(
                source_name='payments',
                base_url=settings.payment_api_url,
                endpoint='/v1/payments',
                auth_type='api_key',
                api_key=settings.payment_api_key,
                page_size=100,
                rate_limit_per_second=5.0,
                pagination_type='cursor',
            )

            # Extract with date filter
            df = extractor.extract(
                params={
                    'created_after': f'{target_date}T00:00:00Z',
                    'created_before': f'{target_date}T23:59:59Z',
                },
                data_key='payments',
                cursor_key='next_cursor',
            )

            # Validate
            extractor.validate(df)

            # Save to raw layer
            if not df.empty:
                path = extractor.save_to_raw(
                    df,
                    bucket=settings.s3_bucket,
                    prefix=f'raw/payments/dt={target_date}',
                )
            else:
                path = None

            extractor.close()

            return {
                'source': 'payments',
                'rows': len(df),
                'pages_fetched': extractor.get_stats().get('pages_fetched', 0),
                'path': path,
                'target_date': target_date,
            }

        # Return all extraction results
        return [extract_users(), extract_events(), extract_payments()]

    @task
    def validate_extractions(results: list) -> Dict[str, Any]:
        """Validate all extraction results."""
        import logging
        logger = logging.getLogger(__name__)

        total_rows = 0
        sources_status = {}
        warnings = []

        for result in results:
            source = result['source']
            rows = result['rows']
            total_rows += rows
            sources_status[source] = {
                'rows': rows,
                'path': result.get('path'),
                'status': 'success' if rows > 0 else 'empty',
            }

            if rows == 0:
                warnings.append(f"{source}: No data extracted")

        logger.info(f"Extraction summary: {total_rows} total rows")

        return {
            'status': 'warning' if warnings else 'success',
            'total_rows': total_rows,
            'sources': sources_status,
            'warnings': warnings,
        }

    @task
    def send_summary(validation_result: Dict[str, Any], **context):
        """Send extraction summary to Slack."""
        execution_date = context['logical_date']

        status_emoji = ':white_check_mark:' if validation_result['status'] == 'success' else ':warning:'

        sources_summary = '\\n'.join([
            f"• {source}: {info['rows']:,} rows"
            for source, info in validation_result['sources'].items()
        ])

        message = f"""
{status_emoji} *Daily Extraction Complete*
:calendar: Date: {execution_date.strftime('%Y-%m-%d')}

*Sources:*
{sources_summary}

*Total:* {validation_result['total_rows']:,} rows
        """

        if validation_result['warnings']:
            message += f"\\n*Warnings:* {', '.join(validation_result['warnings'])}"

        try:
            hook = SlackWebhookHook(slack_webhook_conn_id='slack_webhook')
            hook.send(text=message)
        except Exception as e:
            print(f"Failed to send Slack message: {e}")

    # DAG flow
    extraction_results = extract_all()
    validation = validate_extractions(extraction_results)
    send_summary(validation)


dag = extract_all_sources()
`,
      hints: [
        "task_group을 사용하면 관련 Task를 그룹으로 묶을 수 있습니다",
        "sys.path.insert로 src 디렉토리를 임포트 경로에 추가합니다",
        "logical_date는 실행 대상 날짜, execution_date와 동일합니다",
        "리스트를 반환하면 다음 Task에서 배열로 받을 수 있습니다"
      ]
    }
  },
  {
    id: 'w8d2t5',
    title: 'Day 2 데이터 수집 퀴즈',
    type: 'quiz',
    duration: 10,
    content: {
      questions: [
        {
          question: '증분 추출(Incremental Extract)에서 Watermark의 역할은?',
          options: [
            '데이터 품질을 검증한다',
            '마지막 추출 시점을 기록하여 변경분만 추출한다',
            '데이터를 압축한다',
            '중복 데이터를 제거한다'
          ],
          answer: 1,
          explanation: 'Watermark는 마지막 성공 추출 시점을 저장하여, 다음 추출 시 그 이후 변경된 데이터만 가져올 수 있게 합니다. 이를 통해 전체 추출 대비 시간과 리소스를 절약합니다.'
        },
        {
          question: 'REST API 추출에서 Rate Limiting이 필요한 이유는?',
          options: [
            '데이터 품질을 높이기 위해',
            'API 서버의 429 에러를 방지하기 위해',
            '데이터 압축률을 높이기 위해',
            '네트워크 대역폭을 절약하기 위해'
          ],
          answer: 1,
          explanation: 'API 서버는 과도한 요청을 방지하기 위해 Rate Limit을 설정합니다. 이를 초과하면 429 Too Many Requests 에러가 발생합니다. 클라이언트에서 Rate Limiting을 적용하면 이를 방지할 수 있습니다.'
        },
        {
          question: 'SQLAlchemy QueuePool의 장점은?',
          options: [
            '쿼리 결과를 캐싱한다',
            '데이터베이스 연결을 재사용하여 오버헤드를 줄인다',
            '쿼리를 병렬로 실행한다',
            '트랜잭션을 자동으로 롤백한다'
          ],
          answer: 1,
          explanation: 'Connection Pool은 데이터베이스 연결을 미리 생성해두고 재사용합니다. 매번 연결을 새로 만드는 오버헤드를 줄여 성능을 향상시킵니다.'
        },
        {
          question: 'ThreadPoolExecutor를 사용한 S3 파일 병렬 읽기의 장점은?',
          options: [
            '메모리 사용량을 줄인다',
            'I/O 대기 시간을 겹쳐서 전체 시간을 단축한다',
            'CPU 사용률을 높인다',
            '파일 압축률을 높인다'
          ],
          answer: 1,
          explanation: 'S3 파일 읽기는 I/O 바운드 작업입니다. 여러 파일을 병렬로 읽으면 네트워크 대기 시간이 겹쳐 전체 처리 시간이 크게 단축됩니다.'
        }
      ]
    }
  }
]
