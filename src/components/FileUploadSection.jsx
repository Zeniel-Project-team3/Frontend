import { Upload, Input, Button, Row, Col, Select } from 'antd';
import { Upload as UploadIcon, Search } from 'lucide-react';

const { Dragger } = Upload;

const GENDER_OPTIONS = [
  { value: 'male', label: '남' },
  { value: 'female', label: '여' },
  { value: 'other', label: '기타' },
];

function FileUploadSection({
  uploadedFiles,
  setUploadedFiles,
  searchName,
  setSearchName,
  searchBirthDate,
  onAnalysisTrigger,
}) {
  const handleFileChange = (info) => {
    const { fileList } = info;
    setUploadedFiles(fileList);
    if (fileList?.length > 0) onAnalysisTrigger?.();
  };

  const handleSearch = () => {
    if (onAnalysisTrigger) onAnalysisTrigger();
  };

  const beforeUpload = (file) => {
    const isValidType =
      file.type === 'application/pdf' ||
      file.type === 'text/csv' ||
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword';

    if (!isValidType) {
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  return (
    <div>
      <Dragger
        name="file"
        multiple
        fileList={uploadedFiles}
        onChange={handleFileChange}
        beforeUpload={beforeUpload}
        accept=".pdf,.csv,.xlsx,.xls,.docx,.doc"
        style={{ marginBottom: '24px' }}
      >
        <p className="ant-upload-drag-icon">
          <UploadIcon size={48} color="#1890ff" style={{ margin: '0 auto' }} />
        </p>
        <p className="ant-upload-text" style={{ fontSize: '16px', fontWeight: 500 }}>
          클릭하거나 파일을 드래그하여 업로드하세요
        </p>
        <p className="ant-upload-hint" style={{ color: '#8c8c8c' }}>
          PDF, CSV, Excel, Word(.docx) 파일을 지원합니다
        </p>
      </Dragger>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
        </label>
        <Row gutter={12} align="middle" style={{ marginBottom: 12 }}>
          <Col flex="1 1 120px">
            <Input
              placeholder="이름"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              allowClear
            />
          </Col>
          <Col flex="1 1 140px">
            <Input
              placeholder="주민등록번호"
              value={searchBirthDate}
              onChange={(e) => searchBirthDate(e.target.value)}
              allowClear
            />
          </Col>
          <Col>
            <Button type="primary" icon={<Search size={16} />} onClick={handleSearch}>
              검색
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default FileUploadSection;
