// ERD Designer 샘플 스키마

import { SampleSchema, ERDSchema } from './types'

// E-Commerce OLTP 스키마
const ecommerceSchema: ERDSchema = {
  id: 'ecommerce',
  name: 'E-Commerce OLTP',
  description: '전자상거래 운영 데이터베이스 (3NF)',
  tables: [
    {
      id: 'customers',
      name: 'customers',
      description: '고객 정보',
      columns: [
        { id: 'c1', name: 'customer_id', type: 'SERIAL', isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'c2', name: 'email', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'c3', name: 'name', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'c4', name: 'phone', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: true, isUnique: false },
        { id: 'c5', name: 'created_at', type: 'TIMESTAMP', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false, defaultValue: 'NOW()' },
      ],
    },
    {
      id: 'addresses',
      name: 'addresses',
      description: '고객 배송지',
      columns: [
        { id: 'a1', name: 'address_id', type: 'SERIAL', isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'a2', name: 'customer_id', type: 'INTEGER', isPrimaryKey: false, isForeignKey: true, isNullable: false, isUnique: false, references: { table: 'customers', column: 'customer_id' } },
        { id: 'a3', name: 'address_line', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'a4', name: 'city', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'a5', name: 'postal_code', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'a6', name: 'is_default', type: 'BOOLEAN', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false, defaultValue: 'false' },
      ],
    },
    {
      id: 'categories',
      name: 'categories',
      description: '상품 카테고리',
      columns: [
        { id: 'cat1', name: 'category_id', type: 'SERIAL', isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'cat2', name: 'name', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'cat3', name: 'parent_id', type: 'INTEGER', isPrimaryKey: false, isForeignKey: true, isNullable: true, isUnique: false, references: { table: 'categories', column: 'category_id' } },
      ],
    },
    {
      id: 'products',
      name: 'products',
      description: '상품 정보',
      columns: [
        { id: 'p1', name: 'product_id', type: 'SERIAL', isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'p2', name: 'name', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'p3', name: 'category_id', type: 'INTEGER', isPrimaryKey: false, isForeignKey: true, isNullable: false, isUnique: false, references: { table: 'categories', column: 'category_id' } },
        { id: 'p4', name: 'price', type: 'DECIMAL', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'p5', name: 'stock', type: 'INTEGER', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false, defaultValue: '0' },
        { id: 'p6', name: 'description', type: 'TEXT', isPrimaryKey: false, isForeignKey: false, isNullable: true, isUnique: false },
      ],
    },
    {
      id: 'orders',
      name: 'orders',
      description: '주문 정보',
      columns: [
        { id: 'o1', name: 'order_id', type: 'SERIAL', isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'o2', name: 'customer_id', type: 'INTEGER', isPrimaryKey: false, isForeignKey: true, isNullable: false, isUnique: false, references: { table: 'customers', column: 'customer_id' } },
        { id: 'o3', name: 'address_id', type: 'INTEGER', isPrimaryKey: false, isForeignKey: true, isNullable: false, isUnique: false, references: { table: 'addresses', column: 'address_id' } },
        { id: 'o4', name: 'order_date', type: 'TIMESTAMP', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false, defaultValue: 'NOW()' },
        { id: 'o5', name: 'status', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false, defaultValue: "'pending'" },
        { id: 'o6', name: 'total_amount', type: 'DECIMAL', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
      ],
    },
    {
      id: 'order_items',
      name: 'order_items',
      description: '주문 상세',
      columns: [
        { id: 'oi1', name: 'item_id', type: 'SERIAL', isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'oi2', name: 'order_id', type: 'INTEGER', isPrimaryKey: false, isForeignKey: true, isNullable: false, isUnique: false, references: { table: 'orders', column: 'order_id' } },
        { id: 'oi3', name: 'product_id', type: 'INTEGER', isPrimaryKey: false, isForeignKey: true, isNullable: false, isUnique: false, references: { table: 'products', column: 'product_id' } },
        { id: 'oi4', name: 'quantity', type: 'INTEGER', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'oi5', name: 'unit_price', type: 'DECIMAL', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
      ],
    },
  ],
  relationships: [
    { id: 'r1', sourceTable: 'customers', sourceColumn: 'customer_id', targetTable: 'addresses', targetColumn: 'customer_id', type: '1:N', onDelete: 'CASCADE' },
    { id: 'r2', sourceTable: 'categories', sourceColumn: 'category_id', targetTable: 'categories', targetColumn: 'parent_id', type: '1:N', onDelete: 'SET NULL' },
    { id: 'r3', sourceTable: 'categories', sourceColumn: 'category_id', targetTable: 'products', targetColumn: 'category_id', type: '1:N', onDelete: 'RESTRICT' },
    { id: 'r4', sourceTable: 'customers', sourceColumn: 'customer_id', targetTable: 'orders', targetColumn: 'customer_id', type: '1:N', onDelete: 'RESTRICT' },
    { id: 'r5', sourceTable: 'addresses', sourceColumn: 'address_id', targetTable: 'orders', targetColumn: 'address_id', type: '1:N', onDelete: 'RESTRICT' },
    { id: 'r6', sourceTable: 'orders', sourceColumn: 'order_id', targetTable: 'order_items', targetColumn: 'order_id', type: '1:N', onDelete: 'CASCADE' },
    { id: 'r7', sourceTable: 'products', sourceColumn: 'product_id', targetTable: 'order_items', targetColumn: 'product_id', type: '1:N', onDelete: 'RESTRICT' },
  ],
}

// Star Schema (매출 분석)
const starSchema: ERDSchema = {
  id: 'star-sales',
  name: 'Sales Star Schema',
  description: '매출 분석을 위한 Star Schema (OLAP)',
  tables: [
    {
      id: 'fact_sales',
      name: 'fact_sales',
      description: '매출 Fact 테이블',
      columns: [
        { id: 'fs1', name: 'sale_id', type: 'BIGINT', isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'fs2', name: 'date_key', type: 'INTEGER', isPrimaryKey: false, isForeignKey: true, isNullable: false, isUnique: false, references: { table: 'dim_date', column: 'date_key' } },
        { id: 'fs3', name: 'product_key', type: 'INTEGER', isPrimaryKey: false, isForeignKey: true, isNullable: false, isUnique: false, references: { table: 'dim_product', column: 'product_key' } },
        { id: 'fs4', name: 'customer_key', type: 'INTEGER', isPrimaryKey: false, isForeignKey: true, isNullable: false, isUnique: false, references: { table: 'dim_customer', column: 'customer_key' } },
        { id: 'fs5', name: 'store_key', type: 'INTEGER', isPrimaryKey: false, isForeignKey: true, isNullable: false, isUnique: false, references: { table: 'dim_store', column: 'store_key' } },
        { id: 'fs6', name: 'quantity', type: 'INTEGER', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'fs7', name: 'unit_price', type: 'DECIMAL', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'fs8', name: 'discount', type: 'DECIMAL', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false, defaultValue: '0' },
        { id: 'fs9', name: 'total_amount', type: 'DECIMAL', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
      ],
    },
    {
      id: 'dim_date',
      name: 'dim_date',
      description: '날짜 Dimension',
      columns: [
        { id: 'dd1', name: 'date_key', type: 'INTEGER', isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'dd2', name: 'date', type: 'DATE', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'dd3', name: 'year', type: 'INTEGER', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'dd4', name: 'quarter', type: 'INTEGER', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'dd5', name: 'month', type: 'INTEGER', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'dd6', name: 'week', type: 'INTEGER', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'dd7', name: 'day_of_week', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'dd8', name: 'is_weekend', type: 'BOOLEAN', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'dd9', name: 'is_holiday', type: 'BOOLEAN', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
      ],
    },
    {
      id: 'dim_product',
      name: 'dim_product',
      description: '상품 Dimension',
      columns: [
        { id: 'dp1', name: 'product_key', type: 'INTEGER', isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'dp2', name: 'product_id', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'dp3', name: 'product_name', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'dp4', name: 'category', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'dp5', name: 'subcategory', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: true, isUnique: false },
        { id: 'dp6', name: 'brand', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: true, isUnique: false },
        { id: 'dp7', name: 'unit_cost', type: 'DECIMAL', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
      ],
    },
    {
      id: 'dim_customer',
      name: 'dim_customer',
      description: '고객 Dimension',
      columns: [
        { id: 'dc1', name: 'customer_key', type: 'INTEGER', isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'dc2', name: 'customer_id', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'dc3', name: 'customer_name', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'dc4', name: 'segment', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'dc5', name: 'city', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: true, isUnique: false },
        { id: 'dc6', name: 'country', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: true, isUnique: false },
        { id: 'dc7', name: 'tier', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: true, isUnique: false },
      ],
    },
    {
      id: 'dim_store',
      name: 'dim_store',
      description: '매장 Dimension',
      columns: [
        { id: 'ds1', name: 'store_key', type: 'INTEGER', isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'ds2', name: 'store_id', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'ds3', name: 'store_name', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'ds4', name: 'store_type', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'ds5', name: 'city', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'ds6', name: 'region', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'ds7', name: 'manager', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: true, isUnique: false },
      ],
    },
  ],
  relationships: [
    { id: 'sr1', sourceTable: 'dim_date', sourceColumn: 'date_key', targetTable: 'fact_sales', targetColumn: 'date_key', type: '1:N' },
    { id: 'sr2', sourceTable: 'dim_product', sourceColumn: 'product_key', targetTable: 'fact_sales', targetColumn: 'product_key', type: '1:N' },
    { id: 'sr3', sourceTable: 'dim_customer', sourceColumn: 'customer_key', targetTable: 'fact_sales', targetColumn: 'customer_key', type: '1:N' },
    { id: 'sr4', sourceTable: 'dim_store', sourceColumn: 'store_key', targetTable: 'fact_sales', targetColumn: 'store_key', type: '1:N' },
  ],
}

// Snowflake Schema
const snowflakeSchema: ERDSchema = {
  id: 'snowflake',
  name: 'Inventory Snowflake',
  description: '재고 관리를 위한 Snowflake Schema',
  tables: [
    {
      id: 'fact_inventory',
      name: 'fact_inventory',
      description: '재고 Fact 테이블',
      columns: [
        { id: 'fi1', name: 'inventory_id', type: 'BIGINT', isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'fi2', name: 'date_key', type: 'INTEGER', isPrimaryKey: false, isForeignKey: true, isNullable: false, isUnique: false, references: { table: 'dim_date', column: 'date_key' } },
        { id: 'fi3', name: 'product_key', type: 'INTEGER', isPrimaryKey: false, isForeignKey: true, isNullable: false, isUnique: false, references: { table: 'dim_product', column: 'product_key' } },
        { id: 'fi4', name: 'warehouse_key', type: 'INTEGER', isPrimaryKey: false, isForeignKey: true, isNullable: false, isUnique: false, references: { table: 'dim_warehouse', column: 'warehouse_key' } },
        { id: 'fi5', name: 'quantity_on_hand', type: 'INTEGER', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'fi6', name: 'quantity_reserved', type: 'INTEGER', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false, defaultValue: '0' },
        { id: 'fi7', name: 'reorder_point', type: 'INTEGER', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
      ],
    },
    {
      id: 'dim_date_sf',
      name: 'dim_date',
      description: '날짜 Dimension',
      columns: [
        { id: 'ddsf1', name: 'date_key', type: 'INTEGER', isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'ddsf2', name: 'date', type: 'DATE', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'ddsf3', name: 'year', type: 'INTEGER', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'ddsf4', name: 'month', type: 'INTEGER', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'ddsf5', name: 'day', type: 'INTEGER', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
      ],
    },
    {
      id: 'dim_product_sf',
      name: 'dim_product',
      description: '상품 Dimension (정규화)',
      columns: [
        { id: 'dpsf1', name: 'product_key', type: 'INTEGER', isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'dpsf2', name: 'product_name', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'dpsf3', name: 'category_key', type: 'INTEGER', isPrimaryKey: false, isForeignKey: true, isNullable: false, isUnique: false, references: { table: 'dim_category', column: 'category_key' } },
        { id: 'dpsf4', name: 'supplier_key', type: 'INTEGER', isPrimaryKey: false, isForeignKey: true, isNullable: false, isUnique: false, references: { table: 'dim_supplier', column: 'supplier_key' } },
        { id: 'dpsf5', name: 'unit_cost', type: 'DECIMAL', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
      ],
    },
    {
      id: 'dim_category',
      name: 'dim_category',
      description: '카테고리 Dimension (Snowflake)',
      columns: [
        { id: 'dcat1', name: 'category_key', type: 'INTEGER', isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'dcat2', name: 'category_name', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'dcat3', name: 'department', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
      ],
    },
    {
      id: 'dim_supplier',
      name: 'dim_supplier',
      description: '공급업체 Dimension (Snowflake)',
      columns: [
        { id: 'dsup1', name: 'supplier_key', type: 'INTEGER', isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'dsup2', name: 'supplier_name', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'dsup3', name: 'country', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'dsup4', name: 'contact', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: true, isUnique: false },
      ],
    },
    {
      id: 'dim_warehouse',
      name: 'dim_warehouse',
      description: '창고 Dimension',
      columns: [
        { id: 'dwh1', name: 'warehouse_key', type: 'INTEGER', isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'dwh2', name: 'warehouse_name', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'dwh3', name: 'location_key', type: 'INTEGER', isPrimaryKey: false, isForeignKey: true, isNullable: false, isUnique: false, references: { table: 'dim_location', column: 'location_key' } },
        { id: 'dwh4', name: 'capacity', type: 'INTEGER', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
      ],
    },
    {
      id: 'dim_location',
      name: 'dim_location',
      description: '위치 Dimension (Snowflake)',
      columns: [
        { id: 'dloc1', name: 'location_key', type: 'INTEGER', isPrimaryKey: true, isForeignKey: false, isNullable: false, isUnique: true },
        { id: 'dloc2', name: 'city', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'dloc3', name: 'region', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
        { id: 'dloc4', name: 'country', type: 'VARCHAR', isPrimaryKey: false, isForeignKey: false, isNullable: false, isUnique: false },
      ],
    },
  ],
  relationships: [
    { id: 'sfr1', sourceTable: 'dim_date', sourceColumn: 'date_key', targetTable: 'fact_inventory', targetColumn: 'date_key', type: '1:N' },
    { id: 'sfr2', sourceTable: 'dim_product', sourceColumn: 'product_key', targetTable: 'fact_inventory', targetColumn: 'product_key', type: '1:N' },
    { id: 'sfr3', sourceTable: 'dim_warehouse', sourceColumn: 'warehouse_key', targetTable: 'fact_inventory', targetColumn: 'warehouse_key', type: '1:N' },
    { id: 'sfr4', sourceTable: 'dim_category', sourceColumn: 'category_key', targetTable: 'dim_product', targetColumn: 'category_key', type: '1:N' },
    { id: 'sfr5', sourceTable: 'dim_supplier', sourceColumn: 'supplier_key', targetTable: 'dim_product', targetColumn: 'supplier_key', type: '1:N' },
    { id: 'sfr6', sourceTable: 'dim_location', sourceColumn: 'location_key', targetTable: 'dim_warehouse', targetColumn: 'location_key', type: '1:N' },
  ],
}

// 빈 스키마 (새로 시작)
const emptySchema: ERDSchema = {
  id: 'empty',
  name: 'New Schema',
  description: '빈 스키마에서 시작',
  tables: [],
  relationships: [],
}

// 샘플 스키마 목록
export const sampleSchemas: SampleSchema[] = [
  {
    id: 'ecommerce',
    name: 'E-Commerce (OLTP)',
    description: '전자상거래 운영 DB - 3NF 정규화',
    category: 'oltp',
    schema: ecommerceSchema,
  },
  {
    id: 'star-sales',
    name: 'Sales Star Schema',
    description: '매출 분석용 Star Schema',
    category: 'star',
    schema: starSchema,
  },
  {
    id: 'snowflake',
    name: 'Inventory Snowflake',
    description: '재고 관리용 Snowflake Schema',
    category: 'snowflake',
    schema: snowflakeSchema,
  },
  {
    id: 'empty',
    name: '새 스키마',
    description: '빈 캔버스에서 직접 설계',
    category: 'oltp',
    schema: emptySchema,
  },
]

// DDL 생성 함수
export function generateDDL(schema: ERDSchema): string {
  const lines: string[] = []

  lines.push(`-- ${schema.name}`)
  lines.push(`-- ${schema.description}`)
  lines.push('')

  // 테이블 생성
  for (const table of schema.tables) {
    lines.push(`-- ${table.description || table.name}`)
    lines.push(`CREATE TABLE ${table.name} (`)

    const columnDefs: string[] = []
    const constraints: string[] = []

    for (const col of table.columns) {
      let colDef = `  ${col.name} ${col.type}`

      if (!col.isNullable) {
        colDef += ' NOT NULL'
      }

      if (col.isUnique && !col.isPrimaryKey) {
        colDef += ' UNIQUE'
      }

      if (col.defaultValue) {
        colDef += ` DEFAULT ${col.defaultValue}`
      }

      columnDefs.push(colDef)

      if (col.isPrimaryKey) {
        constraints.push(`  PRIMARY KEY (${col.name})`)
      }

      if (col.isForeignKey && col.references) {
        constraints.push(
          `  FOREIGN KEY (${col.name}) REFERENCES ${col.references.table}(${col.references.column})`
        )
      }
    }

    lines.push([...columnDefs, ...constraints].join(',\n'))
    lines.push(');')
    lines.push('')
  }

  // 인덱스 생성 (FK에 대해)
  lines.push('-- Indexes')
  for (const table of schema.tables) {
    for (const col of table.columns) {
      if (col.isForeignKey) {
        lines.push(`CREATE INDEX idx_${table.name}_${col.name} ON ${table.name}(${col.name});`)
      }
    }
  }

  return lines.join('\n')
}

// 데이터 타입 목록
export const dataTypes = [
  { value: 'INTEGER', label: 'INTEGER', description: '정수' },
  { value: 'BIGINT', label: 'BIGINT', description: '큰 정수' },
  { value: 'SERIAL', label: 'SERIAL', description: '자동 증가 정수' },
  { value: 'VARCHAR', label: 'VARCHAR', description: '가변 문자열' },
  { value: 'TEXT', label: 'TEXT', description: '긴 텍스트' },
  { value: 'BOOLEAN', label: 'BOOLEAN', description: '참/거짓' },
  { value: 'DATE', label: 'DATE', description: '날짜' },
  { value: 'TIMESTAMP', label: 'TIMESTAMP', description: '날짜+시간' },
  { value: 'DECIMAL', label: 'DECIMAL', description: '고정 소수점' },
  { value: 'FLOAT', label: 'FLOAT', description: '부동 소수점' },
  { value: 'JSON', label: 'JSON', description: 'JSON 데이터' },
  { value: 'UUID', label: 'UUID', description: 'UUID' },
]
