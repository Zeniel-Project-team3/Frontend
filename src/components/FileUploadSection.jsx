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
  // 선택한 파일은 로컬 state로 즉시 표시
  const [fileList, setFileList] = useState([]);

  const isAllowedByExt = (file) => {
    const name = (file?.name || '').toLowerCase().trim();
    const ext = name.includes('.') ? name.split('.').pop() : '';
    const allowed = new Set(['pdf', 'csv', 'xlsx', 'xls', 'docx', 'doc']);
    return allowed.has(ext);
  };

  const beforeUpload = (file) => {
    if (!isAllowedByExt(file)) {
      message.error('지원하지 않는 파일 형식입니다. (PDF/CSV/Excel/Word만 가능)');
      return Upload.LIST_IGNORE;
    }
    // 자동 업로드 막고, 버튼 눌렀을 때만 업로드
    return false;
  };

  const handleFileChange = (info) => {
    // antd가 넘겨주는 fileList를 신뢰하고, 마지막 1개만 유지
    const next = Array.isArray(info?.fileList) ? info.fileList.slice(-1) : [];
    setFileList(next);
    setUploadedFiles?.(next);
  };

  const handleClickUpload = async () => {
    if (!clientId) {
      message.warning('상담자료 조회 후 업로드할 수 있습니다.');
      return;
    }

    const latest = fileList.length > 0 ? fileList[fileList.length - 1] : null;
    const fileObj = latest?.originFileObj;

    if (!fileObj || !(fileObj instanceof File)) {
      message.warning('업로드할 파일을 선택해 주세요.');
      return;
    }

    // 여기서도 한 번 더 확장자 검증 (드물게 우회/꼬임 방지)
    if (!isAllowedByExt(fileObj)) {
      message.error('지원하지 않는 파일 형식입니다. (PDF/CSV/Excel/Word만 가능)');
      return;
    }

    setUploading(true);
    try {
      await uploadConsultationFile(clientId, fileObj);
      message.success('상담 자료가 업로드되었습니다.');
      onAnalysisTrigger?.();
      setFileList([]);
      setUploadedFiles?.([]);
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

  const hasFile = fileList.length > 0;
  const latestFile = hasFile ? fileList[fileList.length - 1] : null;

  const clearFile = () => {
    setFileList([]);
    setUploadedFiles?.([]);
  };

  return (
    <div>
      {!hasFile && (
        <Dragger
          name="file"
          multiple={false}
          fileList={fileList}
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
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span>
            선택된 파일: <strong>{latestFile?.name}</strong>
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              type="default"
              onClick={clearFile}
              disabled={uploading}
            >
              다른 파일 선택
            </Button>
            <Button
              type="primary"
              onClick={handleClickUpload}
              disabled={!clientId || uploading}
              loading={uploading}
            >
              {uploading ? '업로드 중...' : '파일 업로드'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploadSection;