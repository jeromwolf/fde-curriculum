// ERD Designer 타입 정의

export interface Column {
  id: string
  name: string
  type: DataType
  isPrimaryKey: boolean
  isForeignKey: boolean
  isNullable: boolean
  isUnique: boolean
  defaultValue?: string
  references?: {
    table: string
    column: string
  }
}

export type DataType =
  | 'INTEGER'
  | 'BIGINT'
  | 'SERIAL'
  | 'VARCHAR'
  | 'TEXT'
  | 'BOOLEAN'
  | 'DATE'
  | 'TIMESTAMP'
  | 'DECIMAL'
  | 'FLOAT'
  | 'JSON'
  | 'UUID'

export interface TableData {
  id: string
  name: string
  columns: Column[]
  description?: string
}

export type RelationType = '1:1' | '1:N' | 'N:M'

export interface Relationship {
  id: string
  sourceTable: string
  sourceColumn: string
  targetTable: string
  targetColumn: string
  type: RelationType
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION'
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION'
}

export interface ERDSchema {
  id: string
  name: string
  description: string
  tables: TableData[]
  relationships: Relationship[]
}

export interface SampleSchema {
  id: string
  name: string
  description: string
  category: 'oltp' | 'olap' | 'star' | 'snowflake'
  schema: ERDSchema
}

export interface ERDDesignerProps {
  showSamples?: boolean
  showDDL?: boolean
  defaultSchema?: string
}
