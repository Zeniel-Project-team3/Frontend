import { useState } from 'react';
import { Upload, message, Button } from 'antd';
import { Upload as UploadIcon } from 'lucide-react';
import { uploadConsultationFile } from '../api/dataApi';

const { Dragger } = Upload;

function FileUploadSection({
  uploadedFiles,
  setUploadedFiles,
  onAnalysisTrigger,
  clientId,
}) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (info) => {
    const { fileList } = info;
    // 항상 마지막 하나만 유지 (단일 파일 업로드)
    const latestOnly = fileList.slice(-1);
    setUploadedFiles(latestOnly);
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

  const handleClickUpload = async () => {
    if (!clientId) {
      message.warning('상담자료 조회 후 업로드할 수 있습니다.');
      return;
    }

    const fileItem = uploadedFiles && uploadedFiles[uploadedFiles.length - 1];
    const fileObj = fileItem?.originFileObj;

    if (!fileObj) {
      message.warning('업로드할 파일을 선택해 주세요.');
      return;
    }

    setUploading(true);
    try {
      await uploadConsultationFile(clientId, fileObj);
      message.success('상담 자료가 업로드되었습니다.');
      onAnalysisTrigger?.();
      setUploadedFiles([]);
    } catch (e) {
      const resData = e?.response?.data;
      let msg;

      if (typeof resData === 'string') {
        msg = resData;
      } else if (resData && typeof resData.message === 'string') {
        msg = resData.message;
      } else {
        msg = e?.message ?? '상담 자료 업로드에 실패했습니다.';
      }

      message.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const hasFile = !!(uploadedFiles && uploadedFiles.length > 0);
  const latestFile = hasFile ? uploadedFiles[uploadedFiles.length - 1] : null;

  return (
    <div>
      {!hasFile && (
        <Dragger
          name="file"
          multiple={false}
          fileList={uploadedFiles}
          onChange={handleFileChange}
          beforeUpload={beforeUpload}
          accept=".pdf,.csv,.xlsx,.xls,.docx,.doc"
          disabled={!clientId}
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
      )}

      {hasFile && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <span>
            선택된 파일: <strong>{latestFile?.name}</strong>
          </span>
          <Button
            type="primary"
            onClick={handleClickUpload}
            disabled={!clientId || uploading}
            loading={uploading}
          >
            {uploading ? '업로드 중...' : '파일 업로드'}
          </Button>
        </div>
      )}
    </div>
  );
}

export default FileUploadSection;
