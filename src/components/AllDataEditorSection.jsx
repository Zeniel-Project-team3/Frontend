import { useState, useCallback, useEffect } from 'react';
import { Card, Button, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, CheckOutlined, CloseOutlined, ReloadOutlined } from '@ant-design/icons';
import ClientTable from './ClientTable';
import ClientEditModal from './ClientEditModal';
import { getAllClients } from '../api/dataApi';

/**
 * 내담자 통합 관리 섹션 (계층형: 컨테이너)
 * - API 연동: GET /api/data (페이지네이션), 훈련/상담은 모달에서 내담자별 조회
 * - 오른쪽 상단: 내담자 등록, 수정, 완료, 새로고침
 */
function AllDataEditorSection({
  clientData: controlledClients,
  setClientData: setControlledClients,
}) {
  const [apiClients, setApiClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isTableEditMode, setIsTableEditMode] = useState(false);

  const useApi = controlledClients == null;

  const fetchClients = useCallback(async (page = 0, size = 20) => {
    if (!useApi) return;
    setLoading(true);
    try {
      const res = await getAllClients({ page, size });
      setApiClients(res.content ?? []);
      setPagination((prev) => ({
        ...prev,
        current: (res.number ?? page) + 1,
        pageSize: res.size ?? size,
        total: res.totalElements ?? 0,
      }));
    } catch (err) {
      message.error('내담자 목록을 불러오지 못했습니다.');
      setApiClients([]);
    } finally {
      setLoading(false);
    }
  }, [useApi]);

  useEffect(() => {
    if (useApi) {
      fetchClients(pagination.current - 1, pagination.pageSize);
    }
  }, [useApi, fetchClients]);

  const clients = useApi ? apiClients : (controlledClients ?? []);
  const setClients = setControlledClients ?? (() => {});

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
      if (!useApi && setControlledClients) {
        if (!selectedClient) {
          const newKey = String(Date.now());
          setControlledClients((prev) => [...(prev ?? []), { ...values, key: newKey }]);
        } else {
          setControlledClients((prev) =>
            (prev ?? []).map((row) => (String(row.key) === String(values.key) ? { ...row, ...values } : row))
          );
        }
      }
      closeModal();
      if (useApi) fetchClients(pagination.current - 1, pagination.pageSize);
    },
    [useApi, setControlledClients, selectedClient, closeModal, fetchClients, pagination.current, pagination.pageSize]
  );

  const handleDataChange = useCallback(
    (updated) => {
      if (!useApi && setControlledClients) {
        setControlledClients((prev) =>
          (prev ?? []).map((row) => (String(row.id) === String(updated.id) ? { ...row, ...updated } : row))
        );
      }
    },
    [useApi, setControlledClients]
  );

  const handleTablePageChange = useCallback(
    (page, pageSize) => {
      if (useApi) {
        setPagination((prev) => ({ ...prev, current: page, pageSize: pageSize || prev.pageSize }));
        fetchClients(page - 1, pageSize || pagination.pageSize);
      }
    },
    [useApi, fetchClients, pagination.pageSize]
  );

  const headerExtra = (
    <Space>
      <Button type="primary" icon={<PlusOutlined />} onClick={openRegister}>
        내담자 등록
      </Button>
      {!useApi && (
        <>
          {isTableEditMode ? (
            <Button icon={<CloseOutlined />} onClick={() => setIsTableEditMode(false)}>
              취소
            </Button>
          ) : (
            <Button icon={<EditOutlined />} onClick={() => setIsTableEditMode(true)}>
              수정
            </Button>
          )}
          <Button icon={<CheckOutlined />} onClick={() => setIsTableEditMode(false)}>
            완료
          </Button>
        </>
      )}
      {useApi && (
        <Button icon={<ReloadOutlined />} onClick={() => fetchClients(pagination.current - 1, pagination.pageSize)}>
          새로고침
        </Button>
      )}
    </Space>
  );

  return (
    <Card title="내담자 통합 관리" bordered={false} extra={headerExtra}>
      <ClientTable
        dataSource={clients}
        loading={loading}
        onEdit={openEdit}
        onDataChange={handleDataChange}
        editable={!useApi && isTableEditMode}
        useApiColumns={useApi}
        paginationConfig={useApi ? { ...pagination, onChange: handleTablePageChange } : undefined}
      />
      <ClientEditModal
        open={modalOpen}
        client={selectedClient}
        onSave={handleSave}
        onCancel={closeModal}
        useApiClient={useApi}
      />
    </Card>
  );
}

export default AllDataEditorSection;
