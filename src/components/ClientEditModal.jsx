import { useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Select, Tabs, DatePicker, Checkbox, Typography } from 'antd';
import dayjs from 'dayjs';

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

/**
 * @param {{ open: boolean; client: import('../types/client.types').Client | null; onSave: (values: import('../types/client.types').Client) => void; onCancel: () => void }} props
 */
function ClientEditModal({ open, client, onSave, onCancel }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (client) {
        form.setFieldsValue({
          name: client.name,
          age: client.age,
          gender: client.gender,
          contact: client.contact,
          school: client.school,
          major: client.major,
          finalEducation: client.finalEducation,
          desiredJob: client.desiredJob ?? '',
          businessType: client.businessType,
          participationType: client.participationType,
          currentStage: client.currentStage,
          lastCounselingDate: toDayJs(client.lastCounselingDate),
          recognitionNoticeDate: toDayJs(client.recognitionNoticeDate),
          initialCounselingDate: toDayJs(client.initialCounselingDate),
          iapEstablishmentDate: toDayJs(client.iapEstablishmentDate),
          trainingName: client.trainingName,
          trainingStartDate: toDayJs(client.startDate),
          trainingEndDate: toDayJs(client.endDate),
          trainingCompleted: client.trainingCompleted === true || client.trainingCompleted === 'Y' || client.trainingCompleted === '예',
          workExpType: client.type,
          participatingCompany: client.participatingCompany,
          workExpCompleted: client.workExpCompleted === true || client.workExpCompleted === 'Y' || client.workExpCompleted === '예',
          employer: client.employer,
          jobTitle: client.jobTitle,
          salary: client.salary,
          employmentDate: toDayJs(client.employmentDate),
          retentionMonths: client.retentionMonths ?? undefined,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, client, form]);

  const handleOk = async () => {
    try {
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
      // validation 실패 시 아무 동작 안 함
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const employer = Form.useWatch('employer', form);
  const employmentDate = Form.useWatch('employmentDate', form);
  const hasEmployment = !!(employer || employmentDate);

  const tabItems = [
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

  return (
    <Modal
      title={client ? '상세 수정' : '내담자 등록'}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={720}
      okText={client ? '저장' : '등록'}
      cancelText="취소"
      destroyOnClose
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Tabs defaultActiveKey="1" items={tabItems} />
      </Form>
    </Modal>
  );
}

export default ClientEditModal;
