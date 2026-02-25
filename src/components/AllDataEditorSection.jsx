import { useState, useCallback } from 'react';
import { Card, Button, Space } from 'antd';
import { PlusOutlined, EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import ClientTable from './ClientTable';
import ClientEditModal from './ClientEditModal';
import { defaultClientData } from '../data/defaultClientData';

/**
 * 내담자 통합 관리 섹션 (계층형: 컨테이너)
 * - 오른쪽 상단: 내담자 등록, 수정, 완료
 * - 수정 클릭 시 표 셀 인라인 편집 가능, 완료 시 편집 종료
 * - 내담자 등록 시 수정 폼(모달)과 동일한 폼 표시
 */
function AllDataEditorSection({
  clientData: controlledClients,
  setClientData: setControlledClients,
}) {
  const [internalClients, setInternalClients] = useState(defaultClientData);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isTableEditMode, setIsTableEditMode] = useState(false);

  const clients = controlledClients ?? internalClients;
  const setClients = setControlledClients ?? setInternalClients;

  const openEdit = useCallback((record) => {
    setSelectedClient(record);
    setModalOpen(true);
  }, []);

  const openRegister = useCallback(() => {
    setSelectedClient(null);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedClient(null);
  }, []);

  const handleSave = useCallback(
    (values) => {
      if (!selectedClient) {
        // 내담자 등록: 새 key 부여 후 추가
        const newKey = String(Date.now());
        setClients((prev) => [...prev, { ...values, key: newKey }]);
      } else {
        setClients((prev) =>
          prev.map((row) => (row.key === values.key ? { ...row, ...values } : row))
        );
      }
      closeModal();
    },
    [setClients, closeModal, selectedClient]
  );

  const handleDataChange = useCallback(
    (updated) => {
      setClients((prev) =>
        prev.map((row) => (row.key === updated.key ? { ...row, ...updated } : row))
      );
    },
    [setClients]
  );

  const headerExtra = (
    <Space>
      <Button type="primary" icon={<PlusOutlined />} onClick={openRegister}>
        내담자 등록
      </Button>
      {isTableEditMode ? (
        <Button
          icon={<CloseOutlined />}
          onClick={() => setIsTableEditMode(false)}
        >
          취소
        </Button>
      ) : (
        <Button
          icon={<EditOutlined />}
          onClick={() => setIsTableEditMode(true)}
        >
          수정
        </Button>
      )}
      <Button
        type="default"
        icon={<CheckOutlined />}
        onClick={() => setIsTableEditMode(false)}
      >
        완료
      </Button>
    </Space>
  );

  return (
    <Card title="내담자 통합 관리" bordered={false} extra={headerExtra}>
      <ClientTable
        dataSource={clients}
        onEdit={openEdit}
        onDataChange={handleDataChange}
        editable={isTableEditMode}
      />
      <ClientEditModal
        open={modalOpen}
        client={selectedClient}
        onSave={handleSave}
        onCancel={closeModal}
      />
    </Card>
  );
}

export default AllDataEditorSection;
