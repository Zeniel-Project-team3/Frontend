import { useEffect, useState, useCallback } from 'react';
import { Form, Input, InputNumber, Modal, Select, Tabs, DatePicker, Checkbox, Typography, Table, Descriptions, Spin, Button, message } from 'antd';
import dayjs from 'dayjs';
import { getTrainings, getConsultations, registerClient, updateClientData, addTrainings } from '../api/dataApi';
import { Allowance, Education } from '../api/dataApi.types';

const { Text } = Typography;

const RETENTION_OPTIONS = [
  { value: 1, label: '1개월' },
  { value: 6, label: '6개월' },
  { value: 12, label: '12개월' },
  { value: 18, label: '18개월' },
];

const GENDER_OPTIONS = [
  { value: '남', label: '남' },
  { value: '여', label: '여' },
];

/** API 등록용 성별 (백엔드 MALE/FEMALE) */
const GENDER_API_OPTIONS = [
  { value: 'MALE', label: '남' },
  { value: 'FEMALE', label: '여' },
];

/** API 등록용 역량 등급 */
const COMPETENCY_OPTIONS = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
];

/** API 등록용 최종학력 (백엔드 Education enum) */
const EDUCATION_API_OPTIONS = [
  { value: Education.MIDDLE_SCHOOL_OR_LESS, label: '중졸 이하' },
  { value: Education.HIGH_SCHOOL, label: '고등학교 졸업' },
  { value: Education.COLLEGE_2_3, label: '2·3년제 대학 졸업' },
  { value: Education.BACHELOR, label: '4년제 대학 졸업' },
  { value: Education.GRADUATE_OR_ABOVE, label: '대학원 이상' },
];

const STAGE_OPTIONS = [
  { value: '인정대기', label: '인정대기' },
  { value: 'IAP수립', label: 'IAP수립' },
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

const WORK_EXPERIENCE_TYPE_OPTIONS = [
  { value: '일경험', label: '일경험' },
  { value: '인턴', label: '인턴' },
  { value: '기타', label: '기타' },
];

/** 훈련 등록용 수당 옵션 (백엔드 Allowance enum) */
const TRAINING_ALLOWANCE_OPTIONS = [
  { value: Allowance.PAID, label: '지급완료' },
  { value: Allowance.UNPAID, label: '미지급' },
  { value: Allowance.NONE, label: '없음' },
];

function toDayJs(str) {
  if (!str || typeof str !== 'string') return null;
  const d = dayjs(str, ['YYYY-MM-DD', 'YYYY-M-D'], true);
  return d.isValid() ? d : null;
}

function formatDate(value) {
  if (!value) return '';
  if (dayjs.isDayjs(value)) return value.format('YYYY-MM-DD');
  return String(value);
}

function allowanceLabel(a) {
  if (a === Allowance.PAID) return '지급완료';
  if (a === Allowance.UNPAID) return '미지급';
  if (a === Allowance.NONE) return '없음';
  return a ?? '-';
}

function genderLabel(g) {
  if (g === 'MALE') return '남';
  if (g === 'FEMALE') return '여';
  return g ?? '-';
}

/** 상세조회 client에서 값 추출 (camelCase / snake_case 둘 다 지원) */
function getClientField(client, camelKey) {
  if (!client) return undefined;
  const camel = client[camelKey];
  if (camel !== undefined && camel !== null) return camel;
  const snake = camelKey.replace(/[A-Z]/g, (ch) => `_${ch.toLowerCase()}`);
  return client[snake];
}

/** 주민번호 13자리에서 생년월일로 만 나이 계산 (YYMMDD + 7번째 자리 1,2=19xx / 3,4=20xx) */
function ageFromResidentId(residentId) {
  const s = String(residentId ?? '').replace(/\D/g, '');
  if (s.length !== 13) return null;
  const yy = parseInt(s.slice(0, 2), 10);
  const mm = parseInt(s.slice(2, 4), 10);
  const dd = parseInt(s.slice(4, 6), 10);
  const seventh = parseInt(s.slice(6, 7), 10);
  const birthYear = seventh <= 2 ? 1900 + yy : 2000 + yy;
  const today = dayjs();
  let age = today.year() - birthYear;
  const birthDate = dayjs(`${birthYear}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`);
  if (today.isBefore(birthDate, 'day')) age -= 1;
  return age >= 0 && age <= 150 ? age : null;
}

/**
 * @param {{ open: boolean; client: any; onSave: (values: any) => void; onCancel: () => void; useApiClient?: boolean; onOpenCounselingPrep?: (name: string, phone: string) => void }} props
 */
function ClientEditModal({ open, client, onSave, onCancel, useApiClient = false, onOpenCounselingPrep }) {
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [trainingAddForm] = Form.useForm();
  const [trainings, setTrainings] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loadingExtra, setLoadingExtra] = useState(false);
  const [isEditingInViewMode, setIsEditingInViewMode] = useState(false);
  const [viewActiveTabKey, setViewActiveTabKey] = useState('1');
  const [expandedConsultationRow, setExpandedConsultationRow] = useState(null);
  const [trainingAddModalOpen, setTrainingAddModalOpen] = useState(false);
  const [trainingAddSubmitting, setTrainingAddSubmitting] = useState(false);

  const isViewMode = useApiClient && client && client.id != null;

  const fetchExtra = useCallback(async (clientId) => {
    if (!clientId) return;
    setLoadingExtra(true);
    try {
      const [trainList, consultList] = await Promise.all([
        getTrainings(clientId),
        getConsultations(clientId),
      ]);
      setTrainings(Array.isArray(trainList) ? trainList : []);
      setConsultations(Array.isArray(consultList) ? consultList : []);
    } catch {
      setTrainings([]);
      setConsultations([]);
    } finally {
      setLoadingExtra(false);
    }
  }, []);

  useEffect(() => {
    if (open && isViewMode && client?.id) {
      fetchExtra(client.id);
    } else if (!open) {
      setTrainings([]);
      setConsultations([]);
      setIsEditingInViewMode(false);
      setViewActiveTabKey('1');
      setTrainingAddModalOpen(false);
      trainingAddForm.resetFields();
    }
  }, [open, isViewMode, client?.id, fetchExtra, trainingAddForm]);

  const getUpdateFormValuesFromClient = useCallback((c) => {
    if (!c) return {};
    return {
      address: getClientField(c, 'address') ?? '',
      education: getClientField(c, 'education') ?? undefined,
      university: getClientField(c, 'university') ?? '',
      major: getClientField(c, 'major') ?? '',
      businessType: getClientField(c, 'businessType') ?? undefined,
      joinType: getClientField(c, 'joinType') ?? undefined,
      joinStage: getClientField(c, 'joinStage') ?? undefined,
      competency: getClientField(c, 'competency') ?? undefined,
      desiredJob: getClientField(c, 'desiredJob') ?? '',
    };
  }, []);

  // 수정 모드 진입 시 상세조회(client) 데이터로 인풋 초기화 (camel/snake 필드명 모두 대응)
  useEffect(() => {
    if (open && isViewMode && isEditingInViewMode && client) {
      updateForm.setFieldsValue(getUpdateFormValuesFromClient(client));
    }
  }, [open, isViewMode, isEditingInViewMode, client, updateForm, getUpdateFormValuesFromClient]);

  useEffect(() => {
    if (open && !isViewMode) {
      if (client) {
        const c = client;
        form.setFieldsValue({
          name: c.name,
          age: c.age,
          gender: c.gender === 'MALE' ? '남' : c.gender === 'FEMALE' ? '여' : c.gender,
          contact: c.phone ?? c.contact,
          school: c.university ?? c.school,
          major: c.major,
          finalEducation: c.finalEducation,
          desiredJob: c.desiredJob ?? '',
          businessType: c.businessType,
          participationType: c.joinType ?? c.participationType,
          currentStage: c.joinStage ?? c.currentStage,
          lastCounselingDate: toDayJs(c.lastCounselingDate),
          recognitionNoticeDate: toDayJs(c.recognitionNoticeDate),
          initialCounselingDate: toDayJs(c.initialCounselingDate),
          iapEstablishmentDate: toDayJs(c.iapEstablishmentDate),
          trainingName: c.trainingName,
          trainingStartDate: toDayJs(c.startDate),
          trainingEndDate: toDayJs(c.endDate),
          trainingCompleted: c.trainingCompleted === true || c.trainingCompleted === 'Y' || c.trainingCompleted === '예',
          workExpType: c.type,
          participatingCompany: c.participatingCompany,
          workExpCompleted: c.workExpCompleted === true || c.workExpCompleted === 'Y' || c.workExpCompleted === '예',
          employer: c.companyName ?? c.employer,
          jobTitle: c.jobTitle,
          salary: c.salary != null ? String(c.salary) : c.salary,
          employmentDate: toDayJs(c.employDate ?? c.employmentDate),
          retentionMonths: c.retentionMonths ?? undefined,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, client, form, isViewMode]);

  const handleOk = async () => {
    try {
      if (useApiClient && !client) {
        const values = await form.validateFields([
          'name', 'residentId', 'phone', 'gender', 'competency', 'desiredJob', 'address', 'university', 'major', 'education',
        ]);
        const residentIdStr = values.residentId?.replace(/\D/g, '') ?? '';
        const computedAge = ageFromResidentId(residentIdStr);
        const request = {
          name: values.name?.trim(),
          residentId: residentIdStr,
          phone: values.phone?.trim() ?? '',
          age: computedAge ?? undefined,
          gender: values.gender || undefined,
          competency: values.competency || undefined,
          desiredJob: values.desiredJob?.trim() || undefined,
          address: values.address?.trim() || undefined,
          university: values.university?.trim() || undefined,
          major: values.major?.trim() || undefined,
          education: values.education || undefined,
        };
        await registerClient(request);
        message.success('내담자가 등록되었습니다.');
        onSave();
        form.resetFields();
        onCancel();
        return;
      }

      const values = await form.validateFields();
      const payload = {
        ...(client || {}),
        key: client?.key ?? '',
        name: values.name,
        age: values.age,
        gender: values.gender,
        contact: values.contact,
        school: values.school,
        major: values.major,
        finalEducation: values.finalEducation,
        desiredJob: values.desiredJob ?? '',
        businessType: values.businessType,
        participationType: values.participationType,
        currentStage: values.currentStage,
        lastCounselingDate: formatDate(values.lastCounselingDate),
        recognitionNoticeDate: formatDate(values.recognitionNoticeDate),
        initialCounselingDate: formatDate(values.initialCounselingDate),
        iapEstablishmentDate: formatDate(values.iapEstablishmentDate),
        trainingName: values.trainingName,
        startDate: formatDate(values.trainingStartDate),
        endDate: formatDate(values.trainingEndDate),
        trainingCompleted: values.trainingCompleted ?? false,
        type: values.workExpType ?? '',
        participatingCompany: values.participatingCompany ?? '',
        workExpCompleted: values.workExpCompleted ?? false,
        employer: values.employer ?? '',
        jobTitle: values.jobTitle ?? '',
        salary: values.salary ?? '',
        employmentDate: formatDate(values.employmentDate),
        retentionMonths: values.retentionMonths ?? null,
      };
      onSave(payload);
      form.resetFields();
      onCancel();
    } catch (err) {
      if (useApiClient && !client && err?.response?.data) {
        message.error(err.response.data?.message || '등록에 실패했습니다.');
      }
      // validation 실패 시 아무 동작 안 함
    }
  };

  const handleCancel = () => {
    form.resetFields();
    updateForm.resetFields();
    setIsEditingInViewMode(false);
    onCancel();
  };

  const handleEditInViewClick = () => {
    if (!client) return;
    const values = getUpdateFormValuesFromClient(client);
    updateForm.setFieldsValue(values);
    setIsEditingInViewMode(true);
  };

  /** 수정 폼에 넣을 상세조회 기준 초기값 (같은 필드 유지) */
  const updateFormInitialValues =
    isViewMode && isEditingInViewMode && client ? getUpdateFormValuesFromClient(client) : undefined;

  const handleTrainingAddOk = async () => {
    if (!client?.id) return;
    try {
      const values = await trainingAddForm.validateFields();
      const request = {
        title: values.title?.trim() || undefined,
        startDate: values.startDate ? formatDate(values.startDate) : undefined,
        endDate: values.endDate ? formatDate(values.endDate) : undefined,
        allowance: values.allowance ?? undefined,
        complete: values.complete ?? false,
      };
      setTrainingAddSubmitting(true);
      await addTrainings(client.id, request);
      message.success('훈련이 등록되었습니다.');
      setTrainingAddModalOpen(false);
      trainingAddForm.resetFields();
      fetchExtra(client.id);
      onSave?.();
    } catch (e) {
      if (e?.errorFields) return; // validation
      message.error(e?.response?.data?.message ?? e?.message ?? '훈련 등록에 실패했습니다.');
    } finally {
      setTrainingAddSubmitting(false);
    }
  };

  const handleUpdateSave = async () => {
    if (!client?.id) return;
    try {
      const values = await updateForm.validateFields();
      await updateClientData({
        id: client.id,
        address: values.address?.trim() || undefined,
        education: values.education || undefined,
        university: values.university?.trim() || undefined,
        major: values.major?.trim() || undefined,
        businessType: values.businessType || undefined,
        joinType: values.joinType || undefined,
        joinStage: values.joinStage || undefined,
        competency: values.competency || undefined,
        desiredJob: values.desiredJob?.trim() || undefined,
      });
      message.success('수정되었습니다.');
      setIsEditingInViewMode(false);
      onSave();
    } catch (err) {
      if (err?.response?.data?.message) {
        message.error(err.response.data.message);
      }
    }
  };

  const employer = Form.useWatch('employer', form);
  const employmentDate = Form.useWatch('employmentDate', form);
  const hasEmployment = !!(employer || employmentDate);

  const trainingColumns = [
    { title: '과정명', dataIndex: 'courseName', key: 'courseName', render: (v) => v ?? '-' },
    { title: '시작일', dataIndex: 'startDate', key: 'startDate', width: 110, render: (v) => v ?? '-' },
    { title: '종료일', dataIndex: 'endDate', key: 'endDate', width: 110, render: (v) => v ?? '-' },
    { title: '수당', dataIndex: 'allowance', key: 'allowance', width: 90, render: allowanceLabel },
    { title: '수료', dataIndex: 'completed', key: 'completed', width: 70, render: (v) => (v ? '예' : '-') },
  ];

  const consultationColumns = [
    { title: '상담일', dataIndex: 'consultDate', key: 'consultDate', width: 110, render: (v) => v ?? '-' },
    {
      title: '요약',
      dataIndex: 'summary',
      key: 'summary',
      ellipsis: false,
      render: (text) => {
        const raw = (text ?? '').trim();
        if (!raw) return '-';
        const lines = raw.split(/\s*-\s*/).map((s) => s.trim()).filter(Boolean);
        const withBreaks = lines.join('\n');
        return <div style={{ whiteSpace: 'pre-line', lineHeight: 1.5 }}>{withBreaks}</div>;
      },
    },
    {
      title: '상담내용(원문)',
      dataIndex: 'detail',
      key: 'detail',
      ellipsis: false,
      render: (text, record) => {
        const raw = text ?? '';
        const isExpanded = expandedConsultationRow === record.consultationId;
        return (
          <div
            style={{
              cursor: 'pointer',
              backgroundColor: isExpanded ? '#fffbe6' : 'transparent',
              padding: '4px 8px',
              borderRadius: 4,
              minHeight: 24,
            }}
          >
            {isExpanded ? (
              <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{raw || '-'}</div>
            ) : (
              <span style={{ color: '#8c8c8c' }}>행을 클릭하면 원문 보기</span>
            )}
          </div>
        );
      },
    },
    { title: 'IAP 수립일', dataIndex: 'iapDate', key: 'iapDate', width: 110, render: (v) => v ?? '-' },
    { title: 'IAP 기간(일)', dataIndex: 'iapPeriod', key: 'iapPeriod', width: 90, render: (v) => (v != null ? v : '-') },
  ];

  const isRegisterMode = useApiClient && !client;

  const registerFormTabItems = [
    {
      key: '1',
      label: '등록 정보',
      children: (
        <>
          <Form.Item name="name" label="이름" rules={[{ required: true, message: '이름을 입력하세요.' }]}>
            <Input placeholder="이름" />
          </Form.Item>
          <Form.Item
            name="residentId"
            label="주민번호"
            normalize={(v) => (v ? String(v).replace(/\D/g, '').slice(0, 13) : v)}
            rules={[
              { required: true, message: '주민번호를 입력하세요.' },
              { pattern: /^\d{13}$/, message: '주민번호는 13자리 숫자만 입력하세요.' },
            ]}
          >
            <Input placeholder="13자리 숫자" maxLength={13} inputMode="numeric" />
          </Form.Item>
          <Form.Item name="phone" label="연락처" rules={[{ required: true, message: '연락처를 입력하세요.' }]}>
            <Input placeholder="연락처" />
          </Form.Item>
          <Form.Item noStyle shouldUpdate={(prev, curr) => prev.residentId !== curr.residentId}>
            {({ getFieldValue }) => {
              const rid = (getFieldValue('residentId') ?? '').replace(/\D/g, '');
              const age = rid.length === 13 ? ageFromResidentId(rid) : null;
              return (
                <Form.Item label="연령 (계산)">
                  <Input value={age != null ? `${age}세` : '-'} disabled />
                </Form.Item>
              );
            }}
          </Form.Item>
          <Form.Item name="gender" label="성별" rules={[{ required: true, message: '성별을 선택하세요.' }]}>
            <Select placeholder="성별" options={GENDER_API_OPTIONS} allowClear />
          </Form.Item>
          <Form.Item name="competency" label="역량 등급">
            <Select placeholder="역량 등급 선택" options={COMPETENCY_OPTIONS} allowClear />
          </Form.Item>
          <Form.Item name="desiredJob" label="희망 직종">
            <Input placeholder="희망 직종" />
          </Form.Item>
          <Form.Item name="address" label="주소">
            <Input placeholder="주소" />
          </Form.Item>
          <Form.Item name="university" label="학교">
            <Input placeholder="학교" />
          </Form.Item>
          <Form.Item name="major" label="전공">
            <Input placeholder="전공" />
          </Form.Item>
          <Form.Item name="education" label="최종학력">
            <Select placeholder="최종학력" options={EDUCATION_API_OPTIONS} allowClear />
          </Form.Item>
        </>
      ),
    },
  ];

  const viewModeTabItems = isViewMode && client
    ? [
        {
          key: '1',
          label: '기본 정보',
          children: (
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="이름">{getClientField(client, 'name') ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="연락처">{getClientField(client, 'phone') ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="연령">{getClientField(client, 'age') ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="성별">{genderLabel(getClientField(client, 'gender'))}</Descriptions.Item>
              <Descriptions.Item label="사업유형">{getClientField(client, 'businessType') ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="참여유형">{getClientField(client, 'joinType') ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="참여단계">{getClientField(client, 'joinStage') ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="역량등급">{getClientField(client, 'competency') ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="희망직종">{getClientField(client, 'desiredJob') ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="학교">{getClientField(client, 'university') ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="전공">{getClientField(client, 'major') ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="주소">{getClientField(client, 'address') ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="취업처">{getClientField(client, 'companyName') ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="직무">{getClientField(client, 'jobTitle') ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="급여">{getClientField(client, 'salary') != null ? getClientField(client, 'salary') : '-'}</Descriptions.Item>
              <Descriptions.Item label="입사일">{getClientField(client, 'employDate') ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="퇴사일">{getClientField(client, 'resignDate') ?? '-'}</Descriptions.Item>
            </Descriptions>
          ),
        },
        {
          key: '2',
          label: '훈련 내역',
          children: loadingExtra ? (
            <Spin tip="불러오는 중..." />
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                <Button type="primary" size="small" onClick={() => setTrainingAddModalOpen(true)}>
                  훈련 등록
                </Button>
              </div>
              <Table
                size="small"
                dataSource={trainings}
                rowKey="trainingId"
                columns={trainingColumns}
                pagination={false}
              />
            </>
          ),
        },
        {
          key: '3',
          label: '상담 내역',
          children: loadingExtra ? (
            <Spin tip="불러오는 중..." />
          ) : (
            <>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                행을 클릭하면 해당 상담의 원문이 보입니다. 다시 클릭하면 접힙니다.
              </Text>
              <Table
                size="small"
                dataSource={consultations}
                rowKey="consultationId"
                columns={consultationColumns}
                pagination={false}
                onRow={(record) => ({
                  onClick: () => {
                    setExpandedConsultationRow((prev) =>
                      prev === record.consultationId ? null : record.consultationId
                    );
                  },
                  style: { cursor: 'pointer' },
                })}
              />
            </>
          ),
        },
      ]
    : null;

  const updateFormTabItems = [
    {
      key: '1',
      label: '수정 정보',
      children: (
        <>
          <Form.Item name="address" label="주소">
            <Input placeholder="주소" />
          </Form.Item>
          <Form.Item name="education" label="최종학력">
            <Select placeholder="최종학력" options={EDUCATION_API_OPTIONS} allowClear />
          </Form.Item>
          <Form.Item name="university" label="학교">
            <Input placeholder="학교" />
          </Form.Item>
          <Form.Item name="major" label="전공">
            <Input placeholder="전공" />
          </Form.Item>
          <Form.Item name="businessType" label="사업 유형">
            <Select placeholder="사업 유형" options={BUSINESS_TYPE_OPTIONS} allowClear />
          </Form.Item>
          <Form.Item name="joinType" label="참여 유형">
            <Select placeholder="참여 유형" options={PARTICIPATION_TYPE_OPTIONS} allowClear />
          </Form.Item>
          <Form.Item name="joinStage" label="참여 단계">
            <Select placeholder="참여 단계" options={STAGE_OPTIONS} allowClear />
          </Form.Item>
          <Form.Item name="competency" label="역량 등급">
            <Select placeholder="역량 등급" options={COMPETENCY_OPTIONS} allowClear />
          </Form.Item>
          <Form.Item name="desiredJob" label="희망 직종">
            <Input placeholder="희망 직종" />
          </Form.Item>
        </>
      ),
    },
  ];

  const formTabItems = [
    {
      key: '1',
      label: '기본 정보',
      children: (
        <>
          <Form.Item name="name" label="이름" rules={[{ required: true, message: '이름을 입력하세요.' }]}>
            <Input placeholder="이름 (내담자 식별용)" />
          </Form.Item>
          <Form.Item name="age" label="연령" rules={[{ required: true, message: '연령을 입력하세요.' }]} extra="참여 유형 판별의 기본">
            <InputNumber min={15} max={100} style={{ width: '100%' }} placeholder="연령" />
          </Form.Item>
          <Form.Item name="gender" label="성별" rules={[{ required: true }]}>
            <Select placeholder="성별" options={GENDER_OPTIONS} allowClear />
          </Form.Item>
          <Form.Item name="contact" label="연락처" extra="즉각적인 소통을 위해 필요">
            <Input placeholder="연락처" />
          </Form.Item>
          <Text type="secondary" strong style={{ display: 'block', marginBottom: 8 }}>학력 정보 (구직 방향 설정의 기초)</Text>
          <Form.Item name="school" label="학교">
            <Input placeholder="학교" />
          </Form.Item>
          <Form.Item name="major" label="전공">
            <Input placeholder="전공" />
          </Form.Item>
          <Form.Item name="finalEducation" label="최종학력">
            <Select placeholder="최종학력" options={EDUCATION_OPTIONS} allowClear />
          </Form.Item>
          <Form.Item name="desiredJob" label="희망직종" extra="내담자의 목표 직무">
            <Input placeholder="희망직종" />
          </Form.Item>
          <Text type="secondary" strong style={{ display: 'block', marginBottom: 8 }}>사업/참여 유형 (1유형, 2유형 등 제도 구분)</Text>
          <Form.Item name="businessType" label="사업 유형">
            <Select placeholder="사업 유형" options={BUSINESS_TYPE_OPTIONS} allowClear />
          </Form.Item>
          <Form.Item name="participationType" label="참여 유형">
            <Select placeholder="참여 유형" options={PARTICIPATION_TYPE_OPTIONS} allowClear />
          </Form.Item>
        </>
      ),
    },
    {
      key: '2',
      label: '상담·훈련·일경험',
      children: (
        <>
          <Text type="secondary" strong style={{ display: 'block', marginBottom: 8 }}>상담 프로세스 (IAP 수립일, 초기상담일, 인정통지일)</Text>
          <Form.Item name="iapEstablishmentDate" label="IAP 수립일">
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="initialCounselingDate" label="초기상담일">
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="recognitionNoticeDate" label="인정통지일">
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="currentStage" label="참여 단계" extra="IAP 수립, 직업훈련, 취업알선 등 현재 위치">
            <Select placeholder="참여 단계" options={STAGE_OPTIONS} allowClear />
          </Form.Item>
          <Form.Item name="lastCounselingDate" label="마지막 상담일" extra="상담 누락 방지를 위한 핵심 지표">
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Text type="secondary" strong style={{ display: 'block', marginBottom: 8 }}>직업훈련 (훈련 과정명, 개강/종료일, 수료 여부)</Text>
          <Form.Item name="trainingName" label="훈련 과정명">
            <Input placeholder="훈련 과정명" />
          </Form.Item>
          <Form.Item name="trainingStartDate" label="개강일">
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="trainingEndDate" label="종료일">
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="trainingCompleted" label="수료 여부" valuePropName="checked">
            <Checkbox>수료</Checkbox>
          </Form.Item>
          <Text type="secondary" strong style={{ display: 'block', marginBottom: 8 }}>일경험 (유형, 참여 기업, 수료 여부)</Text>
          <Form.Item name="workExpType" label="유형">
            <Select placeholder="유형" options={WORK_EXPERIENCE_TYPE_OPTIONS} allowClear />
          </Form.Item>
          <Form.Item name="participatingCompany" label="참여 기업">
            <Input placeholder="참여 기업" />
          </Form.Item>
          <Form.Item name="workExpCompleted" label="수료 여부" valuePropName="checked">
            <Checkbox>수료</Checkbox>
          </Form.Item>
        </>
      ),
    },
    {
      key: '3',
      label: '취업·근속',
      children: (
        <>
          <Text type="secondary" strong style={{ display: 'block', marginBottom: 8 }}>취업처/직무/급여 (취업 성공 데이터)</Text>
          <Form.Item name="employer" label="취업처">
            <Input placeholder="취업처" />
          </Form.Item>
          <Form.Item name="jobTitle" label="직무">
            <Input placeholder="직무" />
          </Form.Item>
          <Form.Item name="salary" label="급여">
            <Input placeholder="예: 3,200만원" />
          </Form.Item>
          <Form.Item name="employmentDate" label="취업일자">
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="retentionMonths"
            label="근속 여부"
            extra={hasEmployment ? '1/6/12/18개월 근속 기록 (사후관리 수당 지급용)' : '취업일자 입력 후 근속 여부를 선택할 수 있습니다.'}
          >
            <Select
              placeholder="1/6/12/18개월"
              options={RETENTION_OPTIONS}
              allowClear
              disabled={!hasEmployment}
            />
          </Form.Item>
        </>
      ),
    },
  ];

  const baseTitle = isViewMode && !isEditingInViewMode
    ? '상세 보기'
    : isViewMode && isEditingInViewMode
      ? '상세 수정'
      : client
        ? '상세 수정'
        : '내담자 등록';

  const handleOpenCounselingPrepClick = () => {
    if (!client || !onOpenCounselingPrep) return;
    const name = getClientField(client, 'name') ?? '';
    const phone = getClientField(client, 'phone') ?? getClientField(client, 'contact') ?? '';
    onOpenCounselingPrep(name, phone);
    handleCancel();
  };

  const modalTitle = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
      <span>{baseTitle}</span>
      {isViewMode && !isEditingInViewMode && client && onOpenCounselingPrep && (
        <Button size="small" type="primary" onClick={handleOpenCounselingPrepClick}>
          상담 자료 준비
        </Button>
      )}
    </div>
  );

  const viewModeFooter =
    isViewMode && !isEditingInViewMode ? (
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button onClick={handleCancel}>닫기</Button>
        {viewActiveTabKey === '1' && (
          <Button type="primary" onClick={handleEditInViewClick}>
            수정
          </Button>
        )}
      </div>
    ) : isViewMode && isEditingInViewMode ? (
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button onClick={() => setIsEditingInViewMode(false)}>취소</Button>
        <Button type="primary" onClick={handleUpdateSave}>
          저장
        </Button>
      </div>
    ) : undefined;

  return (
    <Modal
      title={modalTitle}
      open={open}
      onOk={isViewMode ? undefined : handleOk}
      onCancel={handleCancel}
      width={isViewMode ? (viewActiveTabKey === '3' ? 1400 : 1100) : 720}
      styles={isViewMode ? { wrapper: { transition: 'width 0.28s ease-out' } } : undefined}
      closable={false}
      okText={client ? '저장' : '등록'}
      cancelText={isViewMode && !isEditingInViewMode ? '닫기' : '취소'}
      destroyOnClose
      footer={isViewMode ? viewModeFooter : undefined}
    >
      {isViewMode && isEditingInViewMode ? (
        <Form
          form={updateForm}
          layout="vertical"
          preserve={false}
          initialValues={updateFormInitialValues}
        >
          <Tabs defaultActiveKey="1" items={updateFormTabItems} />
        </Form>
      ) : isViewMode ? (
        <Tabs
          activeKey={viewActiveTabKey}
          onChange={setViewActiveTabKey}
          items={viewModeTabItems}
        />
      ) : isRegisterMode ? (
        <Form form={form} layout="vertical" preserve={false}>
          <Tabs defaultActiveKey="1" items={registerFormTabItems} />
        </Form>
      ) : (
        <Form form={form} layout="vertical" preserve={false}>
          <Tabs defaultActiveKey="1" items={formTabItems} />
        </Form>
      )}

      <Modal
        title="훈련 등록"
        open={trainingAddModalOpen}
        onOk={handleTrainingAddOk}
        onCancel={() => { setTrainingAddModalOpen(false); trainingAddForm.resetFields(); }}
        confirmLoading={trainingAddSubmitting}
        okText="등록"
        cancelText="취소"
        destroyOnClose
      >
        <Form form={trainingAddForm} layout="vertical" preserve={false}>
          <Form.Item name="title" label="과정명" rules={[{ required: true, message: '과정명을 입력하세요.' }]}>
            <Input placeholder="과정명" />
          </Form.Item>
          <Form.Item name="startDate" label="시작일">
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="endDate" label="종료일">
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="allowance" label="수당">
            <Select placeholder="수당" options={TRAINING_ALLOWANCE_OPTIONS} allowClear />
          </Form.Item>
          <Form.Item name="complete" label="수료" valuePropName="checked" initialValue={false}>
            <Checkbox>수료</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </Modal>
  );
}

export default ClientEditModal;
