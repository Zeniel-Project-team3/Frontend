import AllDataEditorSection from '../components/AllDataEditorSection';

/**
 * 내담자 통합 관리 페이지 (국민취업지원제도 상담용)
 * - clientData, setClientData 를 넘기면 상위에서 데이터 제어 가능
 */
function AllDataPage({ clientData, setClientData, onOpenCounselingPrep }) {
  return (
    <AllDataEditorSection
      clientData={clientData}
      setClientData={setClientData}
      onOpenCounselingPrep={onOpenCounselingPrep}
    />
  );
}

export default AllDataPage;
