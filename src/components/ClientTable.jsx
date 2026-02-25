import { useState, useCallback } from 'react';
import { Table, Input, InputNumber, Select, DatePicker, Checkbox } from 'antd';
import dayjs from 'dayjs';

const PAGE_SIZE = 10;

const GENDER_OPTIONS = [
  { value: '남', label: '남' },
  { value: '여', label: '여' },
];

const STAGE_OPTIONS = [
  { value: '인정대기', label: '인정대기' },
  { value: 'IAP수립', label: 'IAP 수립' },
  { value: '직업훈련', label: '직업훈련' },
  { value: '일경험', label: '일경험' },
  { value: '취업알선', label: '취업알선' },
  { value: '사후관리', label: '사후관리' },
];

const EDUCATION_OPTIONS = [
  { value: '중졸 이하', label: '중졸 이하' },
  { value: '고등학교 졸업', label: '고등학교 졸업' },
  { value: '2·3년제 대학 졸업', label: '2·3년제 대학 졸업' },
  { value: '4년제 대학 졸업', label: '4년제 대학 졸업' },
  { value: '대학원 이상', label: '대학원 이상' },
];

const BUSINESS_TYPE_OPTIONS = [
  { value: '1유형', label: '1유형' },
  { value: '2유형', label: '2유형' },
];

const PARTICIPATION_TYPE_OPTIONS = [
  { value: '취업성공패키지', label: '취업성공패키지' },
  { value: '일자리안정자금', label: '일자리안정자금' },
];

const WORK_EXP_TYPE_OPTIONS = [
  { value: '일경험', label: '일경험' },
  { value: '인턴', label: '인턴' },
  { value: '기타', label: '기타' },
];

const RETENTION_OPTIONS = [
  { value: 1, label: '1개월' },
  { value: 6, label: '6개월' },
  { value: 12, label: '12개월' },
  { value: 18, label: '18개월' },
];

function toDayJs(str) {
  if (!str || typeof str !== 'string') return null;
  const d = dayjs(str, ['YYYY-MM-DD', 'YYYY-M-D'], true);
  return d.isValid() ? d : null;
}

function formatDate(val) {
  if (!val) return '';
  if (dayjs.isDayjs(val)) return val.format('YYYY-MM-DD');
  return String(val);
}

function boolToDisplay(v) {
  if (v === true || v === 'Y' || v === '예') return '예';
  return '-';
}

/**
 * @param {{ dataSource: import('../types/client.types').Client[]; onEdit: (record: import('../types/client.types').Client) => void; onDataChange: (updated: import('../types/client.types').Client) => void; editable?: boolean }} props
 */
function ClientTable({ dataSource, onEdit, onDataChange, editable = false }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCell, setEditingCell] = useState(null); // { key, dataIndex }

  const isEditing = useCallback(
    (key, dataIndex) => editingCell?.key === key && editingCell?.dataIndex === dataIndex,
    [editingCell]
  );

  const saveCell = useCallback(
    (record, dataIndex, value, closeAfter = false) => {
      if (!onDataChange) return;
      let out = value;
      if (dayjs.isDayjs(value)) out = value.format('YYYY-MM-DD');
      if (dataIndex === 'age' && typeof out === 'string') out = out === '' ? '' : Number(out);
      if (dataIndex === 'retentionMonths' && (out === undefined || out === '')) out = null;
      onDataChange({ ...record, [dataIndex]: out });
      if (closeAfter) setEditingCell(null);
    },
    [onDataChange]
  );

  const renderCell = useCallback(
    (record, dataIndex, config) => {
      const { type = 'text', options, min, max } = config || {};
      const key = record.key;
      const editing = isEditing(key, dataIndex);
      const value = record[dataIndex];
      const display =
        dataIndex === 'trainingCompleted' || dataIndex === 'workExpCompleted'
          ? boolToDisplay(value)
          : dataIndex === 'retentionMonths' && value != null
            ? `${value}개월`
            : dataIndex === 'lastCounselingDate' || dataIndex === 'iapEstablishmentDate' || dataIndex === 'initialCounselingDate' || dataIndex === 'recognitionNoticeDate' || dataIndex === 'startDate' || dataIndex === 'endDate' || dataIndex === 'employmentDate'
              ? value || '-'
              : value ?? '-';

      const commonProps = {
        autoFocus: true,
        onBlur: () => setEditingCell(null),
        style: { width: '100%', minWidth: 60 },
      };

      if (editing) {
        if (type === 'number') {
          return (
            <InputNumber
              {...commonProps}
              min={min ?? 15}
              max={max ?? 100}
              value={value === '' || value == null ? undefined : Number(value)}
              onChange={(v) => saveCell(record, dataIndex, v ?? '')}
              onPressEnter={() => setEditingCell(null)}
            />
          );
        }
        if (type === 'select') {
          return (
            <Select
              {...commonProps}
              options={options}
              value={value === '' || value == null ? undefined : value}
              onChange={(v) => saveCell(record, dataIndex, v ?? '', true)}
              onBlur={() => setEditingCell(null)}
              allowClear
              style={{ minWidth: 80 }}
            />
          );
        }
        if (type === 'date') {
          return (
            <DatePicker
              {...commonProps}
              format="YYYY-MM-DD"
              value={toDayJs(value) || null}
              onChange={(d) => { (d ? saveCell(record, dataIndex, d, true) : saveCell(record, dataIndex, '', true)); }}
              onBlur={() => setEditingCell(null)}
            />
          );
        }
        if (type === 'checkbox') {
          return (
            <Checkbox
              checked={value === true || value === 'Y' || value === '예'}
              onChange={(e) => saveCell(record, dataIndex, e.target.checked, true)}
              onClick={(e) => e.stopPropagation()}
            />
          );
        }
        return (
          <Input
            {...commonProps}
            value={value ?? ''}
            onChange={(e) => saveCell(record, dataIndex, e.target.value)}
            onPressEnter={() => setEditingCell(null)}
          />
        );
      }

      const canEdit = editable && onDataChange;
      return (
        <span
          role={canEdit ? 'button' : undefined}
          tabIndex={canEdit ? 0 : undefined}
          onClick={(e) => { e.stopPropagation(); if (canEdit) setEditingCell({ key, dataIndex }); }}
          onKeyDown={(e) => { if (canEdit && e.key === 'Enter') setEditingCell({ key, dataIndex }); }}
          style={{ display: 'block', minHeight: 22, cursor: canEdit ? 'cell' : 'default' }}
        >
          {display}
        </span>
      );
    },
    [isEditing, saveCell, onDataChange, editable]
  );

  const col = (title, dataIndex, config = {}, extra = {}) => ({
    title,
    dataIndex,
    key: dataIndex,
    width: extra.width ?? 100,
    align: extra.align,
    render: (_, record) => renderCell(record, dataIndex, config),
    ...extra,
  });

  const columns = [
    {
      title: 'No',
      key: 'index',
      width: 48,
      align: 'center',
      fixed: 'left',
      render: (_, __, index) => (currentPage - 1) * PAGE_SIZE + index + 1,
    },
    col('이름', 'name', { type: 'text' }, { width: 90, fixed: 'left' }),
    col('연령', 'age', { type: 'number', min: 15, max: 100 }, { width: 70 }),
    col('성별', 'gender', { type: 'select', options: GENDER_OPTIONS }, { width: 70 }),
    col('연락처', 'contact', { type: 'text' }, { width: 110 }),
    col('학교', 'school', { type: 'text' }, { width: 100 }),
    col('전공', 'major', { type: 'text' }, { width: 90 }),
    col('최종학력', 'finalEducation', { type: 'select', options: EDUCATION_OPTIONS }, { width: 120 }),
    col('희망직종', 'desiredJob', { type: 'text' }, { width: 100 }),
    col('사업유형', 'businessType', { type: 'select', options: BUSINESS_TYPE_OPTIONS }, { width: 80 }),
    col('참여유형', 'participationType', { type: 'select', options: PARTICIPATION_TYPE_OPTIONS }, { width: 120 }),
    col('참여단계', 'currentStage', { type: 'select', options: STAGE_OPTIONS }, { width: 90 }),
    col('마지막상담일', 'lastCounselingDate', { type: 'date' }, { width: 110 }),
    col('IAP수립일', 'iapEstablishmentDate', { type: 'date' }, { width: 100 }),
    col('초기상담일', 'initialCounselingDate', { type: 'date' }, { width: 100 }),
    col('인정통지일', 'recognitionNoticeDate', { type: 'date' }, { width: 100 }),
    col('훈련과정명', 'trainingName', { type: 'text' }, { width: 120 }),
    col('개강일', 'startDate', { type: 'date' }, { width: 95 }),
    col('종료일', 'endDate', { type: 'date' }, { width: 95 }),
    col('훈련수료', 'trainingCompleted', { type: 'checkbox' }, { width: 75, align: 'center' }),
    col('일경험유형', 'type', { type: 'select', options: WORK_EXP_TYPE_OPTIONS }, { width: 85 }),
    col('참여기업', 'participatingCompany', { type: 'text' }, { width: 100 }),
    col('일경험수료', 'workExpCompleted', { type: 'checkbox' }, { width: 85, align: 'center' }),
    col('취업처', 'employer', { type: 'text' }, { width: 100 }),
    col('직무', 'jobTitle', { type: 'text' }, { width: 100 }),
    col('급여', 'salary', { type: 'text' }, { width: 95 }),
    col('취업일자', 'employmentDate', { type: 'date' }, { width: 95 }),
    col('근속여부', 'retentionMonths', { type: 'select', options: RETENTION_OPTIONS }, { width: 80 }),
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey="key"
      pagination={{
        current: currentPage,
        pageSize: PAGE_SIZE,
        onChange: setCurrentPage,
        showSizeChanger: false,
      }}
      size="small"
      scroll={{ x: 2800 }}
      onRow={(record) => ({
        onClick: (e) => {
          if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select') || e.target.closest('.ant-picker') || e.target.closest('.ant-select-selector')) return;
          if (editable && e.target.closest('[role="button"]')) return;
          if (!editable) onEdit(record);
        },
        style: { cursor: editable ? 'default' : 'pointer' },
      })}
    />
  );
}

export default ClientTable;
